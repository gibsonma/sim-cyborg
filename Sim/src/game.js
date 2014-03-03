// Game object structs defined in state.js

function setupGame(scene, setting)
{
    GAME_DATA.scene = scene;
    GAME_DATA.state_dialog = null;
    GAME_DATA.gs = new GameState(setting);
    GAME_DATA.ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_FRAME });
    GAME_DATA.ticker.run();
    list_sites_as_options();
}

function list_sites_as_options() {
    $("#site_select").html("");
    for (var i = 0; i < GAME_DATA.gs.sites.length; i++) {
        $("#site_select").append("<option value=\"" + i + "\">" + GAME_DATA.gs.sites[i].name + "</option>");
    }
}

function scheduleCalculator(gs)
{  
    return sum_tasks(gs)/2;
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
    var failC = fail*PROBLEM_CONSTANT;

    console.log(failC);
    var failure_seed = Math.random();
    if(failure_seed < failC)
    {
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
                var prob = new Problem("Module failed to integrate",10, problemModule.tasks[1].actual_total,1);
                problemTask.actual_total += problemTask.actual_total/10; //add a 10% overhead
                console.log(problemTask.actual_total);
                gs.sites[seed].problems.push(prob);
                break;

            case 2:
                var problemTask = problemModule.tasks[2]; 
                console.log("Module failed System tests");
                var prob = new Problem("Module failed System tests",15, problemModule.tasks[2].actual_total,2);
                problemTask.actual_total += problemTask.actual_total/15;
                console.log(problemTask.actual_total);
                gs.sites[seed].problems.push(prob);
                break;

            case 3:
                var problemTask = problemModule.tasks[1]; 
                console.log("Module deployment failed");
                var prob = new Problem("Module deployment failed", 5, problemModule.tasks[1].actual_total,1);
                problemTask.actual_total += problemTask.actual_total/5;
                console.log(problemTask.actual_total);
                gs.sites[seed].problems.push(prob);
                break;

            default:
                console.log("What's yer prob");
        }
    }
    //do something to site with result
}

//Problem simulator that occasionally selects a site or module to experience a problem, with probability determined by game parameters. Problems affect the status of one or more modules or tasks allocated to the site.
function problemSimulator(listOfSites, listOfModules)
{
    var chosen = chooseArray(listOfSites, listOfModules);//Select a site or module [index, array]
    var flag = false;
    if(chosen[1] == listOfSites)
    {
        for(var i = 0; i < listOfSites[chosen[0]].working_on.length; i++)//Cycle through tasks
        {
            if(Math.random() <= PROBLEM_PROBABILITY)
            {
                listOfSites[chosen[0]].working_on[i].status= "Problem Encountered";//Apply problem randomly
                flag = true;
            }
        }
        if(flag == false && listOfSites[chosen[0]].working_on.length > 0)
        {
            var randIndex = Math.floor((Math.random()*listOfSites[chosen[0]].working_on.length));
            listOfSites[chosen[0]].working_on[randIndex].status = "Problem Encountered";
        }
        //  return listOfSites;
    }
    else
    {
        for(var i = 0; i < listOfModules[chosen[0]].tasks.length; i++)
        {
            if(Math.random() <= PROBLEM_PROBABILITY)listOfModules[chosen[0]].tasks[i].status= "Problem Encountered";
        }
        if(flag == false && listOfModules[chosen[0]].tasks.length > 0)
        {
            var randIndex = Math.floor((Math.random()*listOfModules[chosen[0]].tasks.length));
            listOfModules[chosen[0]].tasks[randIndex].status = "Problem Encountered";
        }
        //  return listOfModules;
    }
}

//A function that takes two arrays, returns one of the arrays along with an index
function chooseArray(sites, modules)
{
    var chosenIndex, chosenArray;
    var siteIndex = Math.floor((Math.random()*sites.length));//Select item from site array
    var moduleIndex = Math.floor((Math.random()*modules.length));//Select item from module array
    if(Math.round(Math.random()) == 0)//Pick one to experience problem
    {
        chosenIndex = siteIndex;
        chosenArray = sites;
    }
    else 
    {
        chosenIndex = moduleIndex;
        chosenArray = modules;
    }
    return [chosenIndex, chosenArray];
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
            for (var k=0; k < module.tasks.length; k++){
                var task = module.tasks[k];
                total_assigned = total_assigned + task.assigned;
            }
        }
    }
    return total_assigned;
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
    html += "<h3>Final score: " + Math.round(stats.final_score) +"</p>";
    html += "<p>You have $" + Math.round(gs.capital*10)/10 + " left</p>";
    html += "<p>You started the game with: $" + gs.starting_capital + "</p>";
    html += "<p>You have " + number_assigned_workers() + " workers</p>";
    html += "<br>";
    html += "<p>Expected effort: " + stats.expected_effort+"</p>";
    html += "<p>Actual effort: " + stats.actual_effort+"</p>";
    html += "<p>Expected expenditure: " + stats.expected_expenditure+"</p>";
    html += "<p>Actual expenditure: " + stats.actual_expenditure+"</p>";
    html += "<p>Expected revenue: " + stats.expected_revenue+"</p>";
    html += "<p>Actual revenue: " + stats.actual_revenue+"</p>";
    html += "<br>";
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
    var html = "<h2>Game State</h2>";
    var home_site = "No";
    var site_index = $('#site_select').val();
    var site = gs.sites[site_index];
    if (site == gs.home_site) home_site = "Yes";
    html = html + "<p>Site: " + site.name + " (" + site.development_type + ")" + " Home Site: " + home_site + "</p>";
    for (var j=0; j < site.working_on.length; j++){
        var module = site.working_on[j];
        html = html + "<p>Module: " + module.name + "</p>";
        for (var k=0; k < module.tasks.length; k++){
            var task = module.tasks[k];
            var completion = (task.completed / task.total) * 100;
            html = html + "<p>Task: " + task.name + " | Completion: " + Math.round(completion) + "% ";
            if (task.completed >= task.actual_total) html = html + " - completed";
            html = html + "</p>"
        }
    }
    GAME_DATA.state_dialog.html(html);
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
    var time = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	var current_hour = gs.time["Current Hour"];
	var time_range = time.slice(site.timezone[0], site.timezone[1]);//Extract timezone from time array
	if(time_range.length < 8)//If full array not retrieved then timezone must span midnight ex(18-2)
	{
		time_range = time.slice(0, site.timezone[1]);//Get partial timezone from midnight
		time_range.push(time.slice(site.timezone[0]));//Add on rest from before midnight
	}
	if(time_range.indexOf(current_hour) == -1)return false;//Check if current hour is within timezone
	return true;
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(gs)
{
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        if(should_be_working(site, gs)) //Checks if site should be working based on current time and the timezone that the site is in
        {
            /* waterfall needs to be done in stages, so each module can only go onto the next task
             * once every other module is on the same level (has the same number of tasks done) */
            var lowest_lifecycle = module_lifecycle_stage(site); 
            if (lowest_lifecycle != -1){
                for (var j=0; j < site.working_on.length; j++){
                    var module = site.working_on[j];
                    switch (site.development_type) {
                        case "Waterfall":
                            if (lowest_lifecycle < module.tasks.length){
                                var task = module.tasks[lowest_lifecycle];
                            //    console.log(lowest_lifecycle + ", completed: " + task.completed + " out of actual " + task.actual_total);
                                if (task.completed < task.actual_total){
                                    task.completed += task.assigned/TICKS_PER_UNIT_TIME;
                                    if (task.completed > task.actual_total) task.completed = task.actual_total;
                                }
                            }
                        case "Agile":
                            for (var k=0; k < module.tasks.length; k++){
                                var task = module.tasks[k];
                                task.completed += task.assigned/TICKS_PER_UNIT_TIME;
                                if(task.completed > task.actual_total) task.completed = task.actual_total;
                            }
                    }
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
