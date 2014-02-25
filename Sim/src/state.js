// Variables to do with time
var DESIRED_FPS = 30;
var MILLIS_PER_FRAME = 1000 / DESIRED_FPS;

var TICKS_PER_UNIT_TIME = 10;       // Assuming we don't want the game's time to update every tick (if game time == days), 
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
    var site3;
    var main_module;
    var second_module;
    switch(setting)
    {
        case 1:
            site = new Site("New York", (121,43), new Culture(), 18, 5, "Agile");
            site2 = new Site("Shanghai", (43,43), new Culture(), 28, 7, "Agile");
            site3 = new Site("Dublin", (111,18), new Culture(), 8, 6, "Agile");
            this.sites = [site, site2, site3];
            this.home_site = site3;
            main_module = new Module("write backend", [new Task("write model",3000), new Task("write view", 2500), new Task("write controller", 3500)]);
            main_module.tasks[0].assigned = 6; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 6;
            main_module.tasks[2].assigned = 6;  
            second_module = new Module("design Frontend", [new Task("create Sprites",3000), new Task("link with backend", 2500), new Task("Choose Font", 3500)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 1;
            second_module.tasks[2].assigned = 1; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            this.sites[2].working_on.push(second_module);
            break;

        case 2:
            site = new Site("Dublin", (111,18), new Culture(), 2, 10, "Waterfall");
            site2 = new Site("Poland", (53,53), new Culture(), 18, 5, "Waterfall");
            this.sites = [site, site2];
            this.home_site = site;
            main_module = new Module("write backend", [new Task("write model",4000), new Task("write view", 1500), new Task("write controller", 5000)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 1;
            main_module.tasks[2].assigned = 1;
            second_module = new Module("design Frontend", [new Task("create Sprites",4000), new Task("link with backend", 2500), new Task("Choose Font", 5500)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 2;
            second_module.tasks[2].assigned = 3; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            break;

        case 3:
            site = new Site("Dublin", (111,18), new Culture(), 25, 1, "Agile");
            site2 = new Site("San Francisco", (43,43), new Culture(), 18, 5, "Agile");
            site3 = new Site("Bangalore", (90,70), new Culture(), 8, 6, "Agile");
            this.sites = [site, site2, site3];
            this.home_site = site;
            main_module = new Module("write backend", [new Task("write model",2000), new Task("write view", 500), new Task("write controller", 1000)]);
            main_module.tasks[0].assigned = 100; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 100;
            main_module.tasks[2].assigned = 50;
            second_module = new Module("design Frontend", [new Task("create Sprites",1000), new Task("link with backend", 1500), new Task("Choose Font", 500)]);
            second_module.tasks[0].assigned = 40; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 20;
            second_module.tasks[2].assigned = 60; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            this.sites[2].working_on.push(second_module);
            break;

        default:
            site = new Site("Default", (0,0), new Culture(), 5, 2, "Agile");
            this.sites = [site];
            this.home_site = site;
            main_module = new Module("write backend", [new Task("write model",100), new Task("write view", 350), new Task("write controller", 200)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 2;
            main_module.tasks[2].assigned = 1;
            second_module = new Module("design Frontend", [new Task("create Sprites",250), new Task("link with backend", 100), new Task("Choose Font", 200)]);
            second_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 3;
            second_module.tasks[2].assigned = 1; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[0].working_on.push(second_module);
            break;
    }

    this.global_distances = {"Shanghai":4, "Poland":2, "New York":4, "Bangalore":4};
    this.temporal_distances = {"Shanghai":3, "Poland":1, "New York":2, "Bangalore":2};
    this.cultural_distances = {"Shanghai":3, "Poland":2, "New York":2, "Bangalore":3};
    this.current_time = 0;
    this.problems = [];
    this.revenue = 10000;
    this.capital = 50000;
    this.starting_capital = this.capital;
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
