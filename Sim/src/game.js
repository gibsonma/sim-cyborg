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
