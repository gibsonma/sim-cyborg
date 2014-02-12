/*
  sites - Details of each site involved with location, size, status, home site etc
  time - The current time & date in the game
  tasks - The tasks present in game, both completed, underway and planned
  real_task_effort - The results of the Module-task completion calculator (25% variation)
  development_type - The type of development method being used (agile, waterfall etc)
  problems - Gives details of past and present problems along with the sites affected
  finance - Amount of money remaining in budget, amount spent etc
  modules - Details the modules involved in the manager's project
  tasks - Details the tasks involved in the manager's project
 */
 
function GameState()
{
    var site1 = new Site("Site 1", (0,0), new Culture(), 5, 2, "Agile");
    this.sites = [site1];
    this.current_time = 0;
    this.problems = [];
    this.finance = 0;

    var main_module = new Module("write backend", [new Task("write model",30), new Task("write view", 25), new Task("write controller", 35)]);
    main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
    main_module.tasks[1].assigned = 2;
    main_module.tasks[2].assigned = 1;

    this.modules = [main_module];
    this.sites[0].working_on.push(main_module);
}

GameState.prototype.add_sites = function(site){this.sites.push(site);}
GameState.prototype.change_time = function(val){this.current_time = val;}
GameState.prototype.change_real_task_effort = function(val){this.real_task_effort = val;}
GameState.prototype.change_development_type = function(val){this.development_type = val;}
GameState.prototype.change_problems = function(val){this.problems = val;}
GameState.prototype.change_finance = function(val){this.finance = val;}
GameState.prototype.add_modules = function(module){this.modules.push(module);}

function Site(name, coordinates, culture_modifier, num_staff, effort, dev){
    this.name = name;
    this.coordinates = coordinates;
    this.culture = culture_modifier; //obj
    this.num_staff = num_staff;
    this.effort = effort; // home much gets completed each turn
    this.working_on = [];
    this.development_type = dev;
}

function Culture(){}

function Module(name, tasks){
    this.name = name;
    this.tasks = tasks; //obj list
}

function Task(name, total){
    this.name = name;
    this.assigned = 0;
    this.completed = 0;
    this.total = total;
}

function update_modules(gs) {
}

// Variables to do with time
var MILLIS_PER_TICK = 1000 / 30;    // 1000ms per second, 30FPS
var TICKS_PER_UNIT_TIME = 30;       // Assuming we don't want the game's time to update every tick (if game time == days), only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment

// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};

function setupGame()
{
    var gameObj = {};
    var gs = init_GameState();
    var scene = getScene();
    var ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_TICK }); ticker.run();
    GAME_DATA.ticker = ticker;
}

//A quick function to initialise the game state with some ints and strings and print them
//to the console
function init_GameState()
{
    var gs = new GameState();
    iterate(gs);
    GAME_DATA.gs = gs;
    return gs;
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
    var gs = GAME_DATA.gs;
    // Increment current time
    // Todo: Decide how to represent time
    TICKS_PASSED += ticker.lastTicksElapsed;
    if (TICKS_PASSED >= TICKS_PER_UNIT_TIME) {
        gs.current_time += 1;   // Increment game time by 1 'unit' (day?)
        TICKS_PASSED = 0;
    }

    update(gs);
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(gs)
{
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

// for debugging

if (require.main === module){ 
    console.log("Node method for debugging");
    var gs = new GameState();
    console.log(gs);
    for (var i=0;i < gs.modules.length; i++){
        console.log(gs.modules[i]);
    }
    //console.log (GameState_to_json(gs));
    update(gs);
    console.log("updated gs");
    console.log(gs);
    for (var i=0;i < gs.modules.length; i++){
        console.log(gs.modules[i]);
    }
}