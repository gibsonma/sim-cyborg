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

//A quick function to initialise the game state with some ints and strings and print them
//to the console

function scheduleCalculator(gs)
{  
    var listOfModules = gs.modules;
    var sumTasks = 0;
    for(var i = 0; i < listOfModules.length; i++){
        var modTasks = listOfModules[i].tasks;
        for(var j = 0; j < modTasks.length; j++)
        {
            sumTasks += modTasks[j].total;
            console.log(sumTasks);
        }
    }
    return sumTasks/2;
}
function problemSim(gs)
{
    var dTemporal = 1; //temporary value until time difference is set up in default scenarios
    var dCulture = 1; //temporary value until culture is set up in default scenarios
    var numSites = gs.sites.length;
    var seed = Math.floor(Math.random() * numSites); //get a random number between 0 and number of sites
    var site = "Shanghai" //when scenarios are set up, get this from sites[seed].name, setting it to a random site in the dict for the moment
    var dGeo = gs.global_distances[site];
    var dGlobal = dTemporal + dCulture + dGeo;

    var fail = dGlobal/(1+dGlobal);
    var fail = fail*PROBLEM_CONSTANT;

    console.log(fail);
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
    if (TICKS_PASSED >= TICKS_PER_UNIT_TIME) {
        incrementTime();
        display_game_time();
        TICKS_PASSED = 0;
        update(GAME_DATA.gs);
        check_if_completed(GAME_DATA.gs);
    }

    if (GAME_DATA.state_dialog !== null) {
        updateGameStateDialog(GAME_DATA.gs);
    }
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
                if(task.completed < task.total) finished = false;
            }
        }
    }
    if (finished) {
        //GAME_DATA.scene.reset();
        GAME_DATA.ticker.pause();
        display_final_score(gs);
    }
}

function display_final_score(gs){
    alert("Final score:\n "+ gs.finance + " dollars left");
    /*$("#center_content, #score_board").toggle();
    console.log("Gratz, you have " + gs.finance + " gold.");
    var html = "<h1>FINAL SCORE</h1>\n";
    html = html + "<p>" + gs.finance + "</p>";*/
}

function updateGameStateDialog(gs) {
    var html = "";
	var home_site = "No";
    var site_index = $('#site_select').val();
  //  console.log("site index is " + site_index);
    var site = gs.sites[site_index];
	if(site == gs.home_site)home_site = "Yes";
    html = html + "<p>Site: " + site.name + " (" + site.development_type + ")" + " Home Site: " + home_site + "</p>";
    for (var j=0; j < site.working_on.length; j++){
        var module = site.working_on[j];
        html = html + "<p>Module: " + module.name + "</p>";
        for (var k=0; k < module.tasks.length; k++){
            var task = module.tasks[k];
            var completion = (task.completed / task.total) * 100;
            html = html + "<p>Task: " + task.name + " | Completion: " + Math.round(completion) + "%</p>";
        }
    }
    GAME_DATA.state_dialog.html(html);
}

function display_game_time(){
    $("#time").html("<h3>Current Time: "+GAME_DATA.gs.current_time+"</h3>");
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
                        task.completed = task.completed + (task.assigned * site.effort * 1);
                        if(task.completed > task.total)
                        {
                            task.completed = task.total;
                        }
                        console.log("Updating in a waterfall fashion!");
                        break;
                    case "Agile":
                        task.completed = task.completed + (task.assigned * site.effort * 1.5);
                        if(task.completed > task.total)
                        {
                            task.completed = task.total;
                        }
                        console.log("Look at me, aren't I agile?");
                        break;
                    default:
                        console.log("What even IS this development methodology?");
                }
            }
        }
    }
}

