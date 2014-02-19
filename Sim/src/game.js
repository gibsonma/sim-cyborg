// Game object structs defined in state.js

function setupGame(scene)
{
    GAME_DATA.scene = scene;
    GAME_DATA.state_dialog = null;
    var gs = init_GameState();
    GAME_DATA.ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_TICK }); 
    GAME_DATA.ticker.run();
}

//A quick function to initialise the game state with some ints and strings and print them
//to the console


function init_GameState(setting)
{
    var gs = new GameState(setting);
    iterate(gs);
    GAME_DATA.gs = gs;
    return gs;
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
            console.log(sumTasks);
        }
    }
    return sumTasks/2;
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
        if(flag == false)
        {
            var randIndex = Math.floor((Math.random()*listOfSites[chosen[0]].working_on.length));
            listOfSites[chosen[0]].working_on[randIndex].status = "Problem Encountered";
        }
        //	return listOfSites;
    }
    else
    {
        for(var i = 0; i < listOfModules[chosen[0]].tasks.length; i++)
        {
            if(Math.random() <= PROBLEM_PROBABILITY)listOfModules[chosen[0]].tasks[i].status= "Problem Encountered";
        }
        if(flag == false)
        {
            var randIndex = Math.floor((Math.random()*listOfModules[chosen[0]].tasks.length));
            listOfModules[chosen[0]].tasks[randIndex].status = "Problem Encountered";
        }
        //	return listOfModules;
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
function getScene()
{
    return GAME_DATA.scene;
}

function GameState_to_json(obj)
{
    var result = JSON.stringify(obj);
    return result;
}

//A function to iterate through a nested object
function iterate(obj)
{
    for (var key in obj) {
        if(obj.hasOwnProperty(key))
        {
            console.log("Key: " + key + " Values: " + obj[key]);
        }
    }
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
        GAME_DATA.gs.current_time += 1;   // Increment game time by 1 'unit' (day?)
        display_game_time(GAME_DATA.gs.current_time);
        TICKS_PASSED = 0;
    }
    update(GAME_DATA.gs);
    if (GAME_DATA.state_dialog !== null) {
        updateGameStateDialog(GAME_DATA.gs);
    }
}

function updateGameStateDialog(gs) {
    var html = "";
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        html = html + "<p>Site: " + site.name + "</p>";
        for (var j=0; j < site.working_on.length; j++){
            var module = site.working_on[j];
            html = html + "<p>Module: " + module.name + "</p>";
            for (var k=0; k < module.tasks.length; k++){
                var task = module.tasks[k];
                var completion = (task.completed / task.total) * 100;
                html = html + "<p>Task: " + task.name + " | Completion: " + completion + "%</p>";
                switch (site.development_type) {
                    case "Waterfall":
                        task.completed = task.completed + (task.assigned * site.effort * 1);
                        console.log("Updating in a waterfall fashion!");
                        break;
                    case "Agile":
                        task.completed = task.completed + (task.assigned * site.effort * 1.5);
                        console.log("Look at me, aren't I agile?");
                        break;
                    default:
                        console.log("What even IS this development methodology?");
                }
            }
        }
    }
    GAME_DATA.state_dialog.html(html);
}

function display_game_time(time){
    $("#time").html("<h3>Current Time: "+time+"</h3>");
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
                        console.log("Updating in a waterfall fashion!");
                        break;
                    case "Agile":
                        task.completed = task.completed + (task.assigned * site.effort * 1.5);
                        console.log("Look at me, aren't I agile?");
                        break;
                    default:
                        console.log("What even IS this development methodology?");
                }
            }
        }
    }
}
