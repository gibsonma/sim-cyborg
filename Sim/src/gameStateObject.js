// Variables to do with time
var MILLIS_PER_TICK = 1000 / 30;    // 1000ms per second, 30FPS
var TICKS_PER_UNIT_TIME = 30;       // Assuming we don't want the game's time to update every tick (if game time == days), 
                                    // only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment

// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};
var PROBLEM_PROBABILITY = 0.1//% chance that a task will experience a problem if its site/module is selected

function GameStatePreDefined(setting)
{
    var site;
    var main_module;
    switch(setting)
    {
        case 1:
            site = new Site("Site 1", (121,43), new Culture(), 18, 5, "Agile");
            main_module = new Module("write backend", [new Task("write model",30), new Task("write view", 25), new Task("write controller", 35)]);
            main_module.tasks[0].assigned = 6; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 6;
            main_module.tasks[2].assigned = 6;  
			second_module = new Module("design Frontend", [new Task("create Sprites",30), new Task("link with backend", 25), new Task("Choose Font", 35)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 1;
            second_module.tasks[2].assigned = 1; 
            break;

        case 2:
            site = new Site("Site 2", (111,18), new Culture(), 2, 10, "Waterfall");
            main_module = new Module("write backend", [new Task("write model",40), new Task("write view", 15), new Task("write controller", 50)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 1;
            main_module.tasks[2].assigned = 1;
			second_module = new Module("design Frontend", [new Task("create Sprites",40), new Task("link with backend", 25), new Task("Choose Font", 55)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 2;
            second_module.tasks[2].assigned = 3; 
            break;

        case 3:
            site = new Site("Site 3", (9,5), new Culture(), 25, 1, "Agile");
            main_module = new Module("write backend", [new Task("write model",20), new Task("write view", 5), new Task("write controller", 10)]);
            main_module.tasks[0].assigned = 10; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 10;
            main_module.tasks[2].assigned = 5;
			second_module = new Module("design Frontend", [new Task("create Sprites",10), new Task("link with backend", 15), new Task("Choose Font", 5)]);
            second_module.tasks[0].assigned = 4; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 2;
            second_module.tasks[2].assigned = 6; 
            break;

        default:
            site = new Site("Site 0", (0,0), new Culture(), 5, 2, "Agile");
            main_module = new Module("write backend", [new Task("write model",10), new Task("write view", 35), new Task("write controller", 20)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 2;
            main_module.tasks[2].assigned = 1;
			second_module = new Module("design Frontend", [new Task("create Sprites",25), new Task("link with backend", 10), new Task("Choose Font", 20)]);
            second_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 3;
            second_module.tasks[2].assigned = 1; 
            break;
    }
    this.sites = [site];
    this.current_time = 0;
    this.problems = [];
    this.finance = 0;
    this.modules = [main_module, second_module];
    this.sites[0].working_on.push(main_module);
}

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

function Site(name, coordinates, culture_modifier, num_staff, effort, dev){
    this.name = name;
    this.coordinates = coordinates;
    this.culture = culture_modifier; //obj
    this.num_staff = num_staff;
    this.effort = effort; // home much gets completed each turn
    this.working_on = [];//List of tasks
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
    this.total = total;//Represents total effort required to complete task
	this.status = "Normal";
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

function setupGame(scene)
{
    GAME_DATA.scene = scene;
    var gs = init_GameState();
    GAME_DATA.ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_TICK }); 
    GAME_DATA.ticker.run();
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

function init_GameStatePreDefined(setting)
{
    var gs = new GameStatePreDefined(setting);
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
    // Increment current time
    // Todo: Decide how to represent time
    TICKS_PASSED += ticker.lastTicksElapsed;
    if (TICKS_PASSED >= TICKS_PER_UNIT_TIME) {
        GAME_DATA.gs.current_time += 1;   // Increment game time by 1 'unit' (day?)
        TICKS_PASSED = 0;
    }

    update(GAME_DATA.gs);
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
