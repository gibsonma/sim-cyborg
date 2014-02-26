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
    var listOfModules = gs.modules;
    var sumTasks = 0;
    for(var i = 0; i < listOfModules.length; i++){
        var modTasks = listOfModules[i].tasks;
        for(var j = 0; j < modTasks.length; j++)
        {
            sumTasks += modTasks[j].total;
        }
    }
    return sumTasks/2;
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
        console.log("A problem has been encountered in the "+ site + " office.");
        gs.sites[seed].problems++;
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

// Barebones game state update loop
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
    GAME_DATA.gs.current_time += 1;
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
    var html = "<h2>FINAL SCORE:</h2>";
    html = html + "<p>You started the game with: $" + gs.starting_capital + "</p>";
    html = html + "<p>You have $" + Math.round(gs.capital*10)/10 + " left</p>";
    html = html + "<p>You have " + number_assigned_workers() + " workers</p>";
    html = html + "<br>"
        html = html + "<p>Expected game time: " + Math.round(scheduleCalculator(gs)/number_assigned_workers()) + " hours</p>";
    html = html + "<p>Actual game time: " + gs.current_time + " hours</p>";
    html = html + "<br>"
        html = html + "<p>Expected expenditure: $" + Math.round(scheduleCalculator(gs)*gs.developer_rate) + "</p>";
    html = html + "<p>Actual expenditure: $" + Math.round(get_total_expenditure()) + "</p>";
    html = html + "<br>"
        GAME_DATA.state_dialog.html(html);
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
	if(GAME_DATA.gs.current_time % 24 == 0)GAME_DATA.gs.days_passed++;
	$("#time").html("<h3>Hours Passed: "+GAME_DATA.gs.current_time+" Days Passed: "+GAME_DATA.gs.days_passed+"</h3>");
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(gs)
{
    problemSimulator(gs.sites, gs.modules);
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        for (var j=0; j < site.working_on.length; j++){
            var module = site.working_on[j];
            for (var k=0; k < module.tasks.length; k++){
                var task = module.tasks[k];
                switch (site.development_type) {
                    case "Waterfall":
                        task.completed = task.completed + ((task.assigned * site.effort * 1)/TICKS_PER_UNIT_TIME);
                        if(task.completed > task.actual_total) task.completed = task.actual_total;
                        break;
                    case "Agile":
                        task.completed = task.completed + ((task.assigned * site.effort * 1.5)/TICKS_PER_UNIT_TIME);
                        if(task.completed > task.actual_total) task.completed = task.actual_total;
                        break;
                    default:
                        console.log("What even IS this development methodology?");
                }
            }
        }
    }
}

