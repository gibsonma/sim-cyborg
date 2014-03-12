// Game object structs defined in state.js

//A function that takes a scenario and displays
//a vex dialog box containing the details of said scenario
function displayScenarioValues(scenNum)
{
	if(isNaN(scenNum))return -1;
	var game = GAME_DATA.gs, sites = '', modules = '', tasks = '', workers = '', capital = game.capital;
	for(var i = 0; i < game.sites.length; i++)
	{
		sites += '<br>' + game.sites[i].name;
		workers += '<br>' + game.sites[i].name + ' : ' + getSiteWorkers(game.sites[i]) + ' Developers';
		modules += '<br>' + game.sites[i].name + ' : ';
		for(var j = 0; j < game.sites[i].working_on.length; j++)
		{
			modules += game.sites[i].working_on[j].name;
			tasks += '<br>' + game.sites[i].working_on[j].name + ' : ' + getEffortForModule(game.sites[i].working_on[j]) + ' Developer Hours';
		}
	}
	GAME_DATA.ticker.pause();//Pause the game
	vex.dialog.confirm({
	  message: '<p>You have picked Scenario '+scenNum + '</p>' + 
	           '<p>Sites:' + sites + '</p>' + 
			   '<p>Number of Developers:' + workers + '</p>' +
			   '<p>Modules:' + modules + '</p>' +
			   '<p>Expected Effort:' + tasks + '</p>' +
			   '<p>Expected Annual Revenue: $' + game.revenue + '</p>' +
			   '<p>Starting Capital: $'+capital+'</p>',
	  callback: function(value) {
		GAME_DATA.ticker.resume();
		return value;
	  }
	});
}

//Given a module, this function will calculate how much effort will be required to complete it
//by summing up the expected total of its tasks and returning it
function getEffortForModule(module)
{
	if(!module.tasks)return -1;
	var result = 0;
	for(var i = 0; i < module.tasks.length; i++)
	{
		result += module.tasks[i].total;
	}
	return result;
}
//Given a site, this function goes through all the tasks being worked on and returns how many workers that are working at the site
function getSiteWorkers(site)
{
	var result = 0, modules = site.working_on;
	for(var i = 0; i < modules.length; i++)
	{
		for(var j = 0; j < modules[i].tasks.length; j++)result += modules[i].tasks[j].assigned;	
	}
	return result;
}

//Ask user which scenario they want
//Load details of chosen scenario
//Call setupGame with chosen scenario

function setupGame(scene, setting)
{
	GAME_DATA.scene = scene;
    GAME_DATA.state_dialog = null;
    GAME_DATA.gs = new GameState(setting);
    load_globals(GAME_DATA.gs);
    GAME_DATA.ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_FRAME });
    GAME_DATA.ticker.run();
    displayScenarioValues(setting);
	setLocalTime(GAME_DATA.gs.sites, GAME_DATA.gs.home_site);
}

//The home site's start time is known to be 0:00 at the start of the simulation. Then, going through each site and comparing their timezone to the home sites, each site's local time can be found and assigned
function setLocalTime(sites, homeSite)
{
	var homeZone = homeSite.timezone, difference = 0;
	for(var i = 0; i < sites.length; i++)
	{
		site = sites[i];
		if(site != homeSite)
		{
			difference = homeZone[0] - site.timezone[0];
			if(difference > 0)site.local_time = TIME_CLOCK[TIME_CLOCK.length - difference];
			else if(difference < 0)site.local_time = TIME_CLOCK[-difference];
		}
	}
}

function scheduleCalculator(gs)
{  
    return sum_tasks(gs)/WORK_LOAD;
}

function sum_tasks(gs){
    var listOfModules = gs.modules;
    var sumTasks = 0;
    for(var i = 0; i < listOfModules.length; i++){
        var modTasks = listOfModules[i].tasks;
        for(var j = 0; j < modTasks.length; j++)
        {
            sumTasks += modTasks[j].total;
        }
    }
    return sumTasks;
}

function intervention(gs)
{
    sites = gs.sites;			
    for(var i = 0; i < sites.length; i++)
    {
        if(sites[i].problems.length > 0)
        {
            var index = i;//Need to record index for use in callback
            var problem = sites[i].problems[0];
            GAME_DATA.ticker.pause();//Pause the game
            vex.dialog.confirm({
                message: ''+problem.name+' has occured in site '+sites[i].name+'. It will cost $' + problem.cost + ' to correct, what do you do?',
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, {
                      text: 'Fix'
                    }), $.extend({}, vex.dialog.buttons.NO, {
                      text: 'Ignore'
                    })
                  ],
                callback: function(value) {
                    if(!value)//If problem ignored
                    {
                        sites[index].problems.pop();//Pop the problem
                        GAME_DATA.ticker.resume();//Resume game
                        return console.log("Problem not fixed");
                    }
                    gs.sites[index].working_on[problem.module].tasks[problem.taskNum].actual_total -= problem.reduction_in_total;//Undo the changes that the problem did on the task
					var cost = problem.cost;
                    new_transaction(-cost);//Deduct cost of fixing problem
					sites[index].problems.pop();
                    GAME_DATA.ticker.resume();
                    return console.log("Problem has been fixed for $"+problem.cost+"!");
                }
            });
        }
    }
}

//Added because vex is being really annoying, so this is called in gameSpec instead of intervention
//It has the same functionality, but gets passed an extra parameter to tell it whether or not it
//should fix the problem
function interventionAlt(gs, val)
{
    sites = gs.sites;			
    for(var i = 0; i < sites.length; i++)
    {
        if(sites[i].problems.length > 0)
        {
			var index = i;//Need to record index for use in callback
            var problem = sites[i].problems[0];
            if(!val)//If problem ignored
            {
				sites[index].problems.pop();//Pop the problem
				GAME_DATA.ticker.resume();//Resume game		
				return console.log("Problem not fixed");
            }
			console.log(gs.sites[index].working_on[problem.module].tasks[problem.taskNum].actual_total);
			gs.sites[index].working_on[problem.module].tasks[problem.taskNum].actual_total -= problem.reduction_in_total;//Undo the changes that the problem did on the task
			console.log(gs.sites[index].working_on[problem.module].tasks[problem.taskNum].actual_total);
			var cost = problem.cost;
			new_transaction(-cost);//Deduct cost of fixing problemnew_transaction(-1000);//Deduct cost of fixing problem
			sites[index].problems.pop();
			return console.log("Problem has been fixed!");
        }
    }
}

function problemSim(gs)
{
    var numSites = gs.sites.length;
    var seed = Math.floor(Math.random() * numSites); //get a random number between 0 and number of sites
    var site = gs.sites[seed].name;
    var dGeo = gs.global_distances[site];
    var dTemporal = gs.temporal_distances[site]; 
    var dCulture = gs.cultural_distances[site];
    var dGlobal = dTemporal + dCulture + dGeo;

    var fail = dGlobal/(1+dGlobal);

    var probCD = gs.sites[seed].problemCooldown;
    var failC = fail*PROBLEM_CONSTANT*probCD;
    gs.sites[seed].problemCooldown += 0.0005;


    var failure_seed = Math.random();
       // console.log(failC +" vs " + failure_seed);
    if(failure_seed < failC)
    {
        gs.sites[seed].problemCooldown = 0.0025;
        console.log("A problem has been encountered in the "+ site + " office.")

            var problemSeed = Math.floor(Math.random() * 3)+1; //choose one of 3 problems
        var workingOnSeed = Math.floor(Math.random() * gs.sites[seed].working_on.length); //choose one module being worked on
        var problemSite = gs.sites[seed];
        var problemModule = problemSite.working_on[workingOnSeed];


        switch(problemSeed)
        {
            case 1: 
                var problemTask = problemModule.tasks[1];  //this is an implementation problem so always affects the 2nd task in a module
                console.log("A module failed to integrate");
                var prob = new Problem("Module failed to integrate",10, problemModule.tasks[1].actual_total,workingOnSeed,1);
                problemTask.actual_total += problemTask.actual_total/10; //add a 10% overhead
                console.log(problemTask.actual_total);
                gs.sites[seed].problems.push(prob);
                break;

            case 2:
                var problemTask = problemModule.tasks[2]; 
                console.log("Module failed System tests");
                var prob = new Problem("Module failed System tests",15, problemModule.tasks[2].actual_total,workingOnSeed,2);
                problemTask.actual_total += problemTask.actual_total/15;
                console.log(problemTask.actual_total);
                gs.sites[seed].problems.push(prob);
                break;

            case 3:
                var problemTask = problemModule.tasks[1]; 
                console.log("Module deployment failed");
                var prob = new Problem("Module deployment failed", 5, problemModule.tasks[1].actual_total,workingOnSeed,1);
                problemTask.actual_total += problemTask.actual_total/5;
                console.log(problemTask.actual_total);
                gs.sites[seed].problems.push(prob);
                gs.sites[seed].critical_problem = true;
                break;

            default:
                console.log("What's yer prob");
        }
    }
    //do something to site with result
}

function GameState_to_json(gs)
{
    return JSON.stringify(gs);
}

function simpleTick(ticker)
{
    // Ticker only allows for calling afunction taking just the ticker as an argument so need a getGameState() function to allow us access to the game state object.
    // Not sure how to structure this, maybe use a class?
    // Increment current time
    // Todo: Decide how to represent time
    TICKS_PASSED += ticker.lastTicksElapsed;

    if (GAME_DATA.state_dialog !== null) {
        updateGameStateDialog(GAME_DATA.gs);
    }

    if (TICKS_PASSED >= TICKS_PER_UNIT_TIME) {
        incrementTime();
        display_game_time();
        TICKS_PASSED = 0;

        if (GAME_DATA.gs.current_time % 24 == 0){
            daily_transactions();
        }
        check_if_completed(GAME_DATA.gs);
    }
    update(GAME_DATA.gs);
}

function daily_transactions(){
    deduct_daily_expenses();
    add_daily_revenue();
}

function deduct_daily_expenses(){
    var days_per_release = GAME_DATA.gs.days_per_release;
    var daily_operating_cost = Math.round((1/days_per_release)*GAME_DATA.gs.revenue);
    var daily_developer_cost = number_assigned_workers() * GAME_DATA.gs.developer_rate * GAME_DATA.gs.developer_working_hours;
    var total = daily_operating_cost + daily_developer_cost;
    new_transaction(-total);
}

function add_daily_revenue(){
    var days_per_release = GAME_DATA.gs.days_per_release;
    var daily_revenue = GAME_DATA.gs.revenue/days_per_release
    new_transaction(daily_revenue);
}

function number_assigned_workers(){
    var gs = GAME_DATA.gs;
    var total_assigned = 0;
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];

        for (var j=0; j < site.working_on.length; j++){
            var module = site.working_on[j];
            switch (site.development_type) {
                case "Waterfall":
                        total_assigned += most_assigned_task(module);
                    break;
                case "Agile":
                    for (var k=0; k < module.tasks.length; k++){
                        var task = module.tasks[k];
                        total_assigned += task.assigned;
                    }
                    break;
            }
        }
    }
    return total_assigned;
}

function most_assigned_task(module){
    var most_assigned = 0;
    for (var k=0; k < module.tasks.length; k++){
        var task = module.tasks[k];
        if (task.assigned > most_assigned) most_assigned = task.assigned;
    }
    return most_assigned;
}

function incrementTime(){
    GAME_DATA.gs.current_time ++;
    GAME_DATA.gs.time["Current Hour"]++;
    if (GAME_DATA.gs.time["Current Hour"] >= 24)GAME_DATA.gs.time["Current Hour"] = 0;
	incrementLocalTimes();
}
//Goes through each site and updates its local time
function incrementLocalTimes()
{
	var game = GAME_DATA.gs;
	for(var i = 0; i < game.sites.length; i++)
	{
		site = game.sites[i];
		site.local_time++;
		if (site.local_time >= 24)site.local_time = 0;
	}
}

function check_if_completed(gs) {
    var finished = true;
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        for (var j=0; j < site.working_on.length; j++){
            var module = site.working_on[j];
            for (var k=0; k < module.tasks.length; k++){
                var task = module.tasks[k];
                if(task.completed < task.actual_total) finished = false;
            }
        }
    }
    if (finished) {
        //GAME_DATA.scene.reset();
        if (GAME_DATA.gs.current_time < 24) daily_transactions();
        GAME_DATA.ticker.pause();
        display_final_score(gs);
    }
}

function display_final_score(gs){
    var stats = new report(gs);
    var html = "<h2>End of Game Report</h2>";
    html += "<h3>Final score: " + Math.round(stats.final_score) +" points</p>";
    html += "<p>You have $" + Math.round(gs.capital*10)/10 + " left</p>";
    html += "<p>You started the game with: $" + gs.starting_capital + "</p>";
    html += "<p>You have " + number_assigned_workers() + " workers</p>";
    html += "<br>";
    html += "<p>Expected effort: " + stats.expected_effort+" developer hours</p>";
    html += "<p>Actual effort: " + stats.actual_effort+" developer hours</p>";
    html += "<p>Expected expenditure: $" + stats.expected_expenditure+"</p>";
    html += "<p>Actual expenditure: $" + stats.actual_expenditure+"</p>";
    html += "<p>Expected revenue: $" + stats.expected_revenue+"</p>";
    html += "<p>Actual revenue: $" + stats.actual_revenue+"</p>";
    html += "<br>";
    vex.dialog.alert(html);
    GAME_DATA.state_dialog.html(html);
}

function report(gs){
    this.expected_effort = Math.round(scheduleCalculator(gs));
    this.actual_effort = Math.round(gs.current_time/24*gs.developer_effort*number_assigned_workers());
    this.expected_expenditure = Math.round(sum_tasks(gs)/gs.developer_effort*number_assigned_workers() * 1.24); // see email for explanation
    this.actual_expenditure = get_total_expenditure();
    var month = gs.current_time/24/gs.days_per_release;
    this.expected_revenue = Math.round(gs.revenue*month);
    this.actual_revenue = Math.round(get_total_revenue());
    this.expected_time = scheduleCalculator(gs)/gs.developer_effort;
    var expected_months = this.expected_time/24/gs.days_per_release;
    this.final_score = Math.round(gs.capital + (expected_months-month)*gs.revenue);
}

function get_total_expenditure(){ // work out the amount of expenditure based on financial log
    var log = GAME_DATA.gs.financial_log;
    if (log.length == 0) return 0;
    var expenses = 0;
    for (var i=0; i< log.length; i++){
        var amount = log[i].amount;
        if (amount < 0) expenses = expenses + Math.abs(amount);
    }
    return expenses;
}

function get_total_revenue(){
    var log = GAME_DATA.gs.financial_log;
    if (log.length == 0) return 0;
    var income = 0;
    for (var i=0; i< log.length; i++){
        var amount = log[i].amount;
        if (amount > 0) income += Math.abs(amount);
    }   
    return income;
}

function new_transaction(amount){
    GAME_DATA.gs.capital = GAME_DATA.gs.capital + amount;
    GAME_DATA.gs.financial_log.push({
        "time":GAME_DATA.gs.current_time, 
        "amount":amount
    });
}

function updateGameStateDialog(gs) {
    if (tileView) {
        tileView.update('state');    
    }

}

function display_game_time(){
    if(GAME_DATA.gs.current_time % 24 == 0)GAME_DATA.gs.time["Days Passed"]++;
    $("#time").html("<h3>Days Passed: "+GAME_DATA.gs.time["Days Passed"]+ " Current Time "+GAME_DATA.gs.time["Current Hour"]+":00"+"</h3>");
}

//Function which takes a site and determines if it should be working based on the timezone it is in
//It does this by getting the times that the site should be working based on its timezone and checking if the current hour is within this range
function should_be_working(site, gs)
{
    var current_hour = gs.time["Current Hour"];
    var tmp;
    var time_range = TIME_CLOCK.slice(site.timezone[0], site.timezone[1]);//Extract timezone from time array
    if(time_range.length < 8)//If full array not retrieved then timezone must span midnight ex(18-2)
    {
        time_range = TIME_CLOCK.slice(0, site.timezone[1]);//Get partial timezone from midnight
        tmp = TIME_CLOCK.slice(site.timezone[0]);//Get second partial from before midnight
        time_range = time_range.concat(tmp);//Concatenate the two
    }
    if(time_range.indexOf(current_hour) == -1) return false;//Check if current hour is within timezone
    return true;
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(gs)
{
    intervention(gs);
    problemSim(gs);
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        /* waterfall needs to be done in stages, so each module can only go onto the next task
         * once every other module is on the same level (has the same number of tasks done) */
        var lowest_lifecycle = module_lifecycle_stage(site); 
        if (should_be_working(site,gs) && lowest_lifecycle != -1){
            for (var j=0; j < site.working_on.length; j++){
                var module = site.working_on[j];
                switch (site.development_type) {
                    case "Waterfall":
                        if (lowest_lifecycle < module.tasks.length){
                            var task = module.tasks[lowest_lifecycle];
                            if (task.completed < task.actual_total){
                                task.completed += task.assigned * gs.waterfall_speedup_modifier * gs.developer_effort/TICKS_PER_UNIT_TIME;
                                if (task.completed > task.actual_total) task.completed = task.actual_total;
                            }
                        }
                        break;
                    case "Agile":
                        for (var k=0; k < module.tasks.length; k++){
                            var task = module.tasks[k];
                            task.completed += task.assigned*gs.developer_effort/TICKS_PER_UNIT_TIME;
                            if(task.completed > task.actual_total) task.completed = task.actual_total;
                        }
                        break;
                }
            }
        }
    }
}

function module_lifecycle_stage(site) {
    var lowest_cycle = -1;
    for (var j=0; j < site.working_on.length; j++){
        var module = site.working_on[j];
        for (var i=0; i < module.tasks.length; i++){
            var task = module.tasks[i];
            if (task.completed < task.actual_total) {
                if (i < lowest_cycle || lowest_cycle == -1) {
                    lowest_cycle = i;
                }
            }
        }
    }
    return lowest_cycle;
}

function getIndexOfSiteByName(name, gs) {
    for(var i = 0; i < gs.sites.length; i++){
        if(name == gs.sites[i].name)
        {
            return i;
        }

    }
    return -1;
}