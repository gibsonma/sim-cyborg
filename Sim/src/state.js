// Variables to do with time
var DESIRED_FPS = 30;
var MILLIS_PER_FRAME = 1000 / DESIRED_FPS;

var TICKS_PER_UNIT_TIME = 30;       // Assuming we don't want the game's time to update every tick (if game time == days), 
                                    // only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment

// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};
var PROBLEM_PROBABILITY = 0.1//% chance that a task will experience a problem if its site/module is selected
var PROBLEM_CONSTANT = 1; //constant value for problem simulator, used to tweak difficulty

function GameState(setting)
{
    var site;
    var site2;
    var main_module;
    var second_module;
    switch(setting)
    {
        case 1:
            site = new Site("Site Google", (121,43), new Culture(), 18, 5, "Agile");
            site2 = new Site("Site Yahoo", (43,43), new Culture(), 18, 5, "Agile");
            main_module = new Module("write backend", [new Task("write model",300), new Task("write view", 250), new Task("write controller", 350)]);
            main_module.tasks[0].assigned = 6; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 6;
            main_module.tasks[2].assigned = 6;  
			second_module = new Module("design Frontend", [new Task("create Sprites",300), new Task("link with backend", 250), new Task("Choose Font", 350)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 1;
            second_module.tasks[2].assigned = 1; 
            break;

        case 2:
            site = new Site("Site 2", (111,18), new Culture(), 2, 10, "Waterfall");
            site2 = new Site("Site 2a", (43,43), new Culture(), 18, 5, "Waterfall");
            main_module = new Module("write backend", [new Task("write model",400), new Task("write view", 150), new Task("write controller", 500)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 1;
            main_module.tasks[2].assigned = 1;
			second_module = new Module("design Frontend", [new Task("create Sprites",400), new Task("link with backend", 250), new Task("Choose Font", 550)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 2;
            second_module.tasks[2].assigned = 3; 
            break;

        case 3:
            site = new Site("Site 3", (9,5), new Culture(), 25, 1, "Agile");
            site2 = new Site("Site 3a", (43,43), new Culture(), 18, 5, "Agile");
            main_module = new Module("write backend", [new Task("write model",200), new Task("write view", 50), new Task("write controller", 100)]);
            main_module.tasks[0].assigned = 10; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 10;
            main_module.tasks[2].assigned = 5;
			second_module = new Module("design Frontend", [new Task("create Sprites",100), new Task("link with backend", 150), new Task("Choose Font", 50)]);
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
    this.sites = [site, site2];
    this.global_distances = {"Shanghai":3, "Poland":2, "New York":3};
    this.current_time = 0;
    this.problems = [];
    this.finance = 10000;
    this.modules = [main_module, second_module];
    this.sites[0].working_on.push(main_module);
    this.sites[1].working_on.push(second_module);
}


function Site(name, coordinates, culture_modifier, num_staff, effort, dev){
    this.name = name;
    this.coordinates = coordinates;
    this.culture = culture_modifier; //obj
    this.num_staff = num_staff;
    this.effort = effort; // home much gets completed each turn
    this.working_on = []; //List of tasks
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
    this.actual_total = vary(total);
    console.log("Total: " + this.total);
    console.log("Actual Total: " + this.actual_total)
}

function vary(total){
    var seed = Math.random();
    var actual_total = total;
    if(seed > 0.50 && seed < 0.75){
        actual_total += total/4;
    
    }
    if(seed > 0.75){
        actual_total -= total/4;
    }
    
    return actual_total;

}
