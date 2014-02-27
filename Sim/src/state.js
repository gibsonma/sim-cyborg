// Variables to do with time
var DESIRED_FPS = 30;
var MILLIS_PER_FRAME = 1000 / DESIRED_FPS;

var TICKS_PER_UNIT_TIME = 1;       // Assuming we don't want the game's time to update every tick (if game time == days), 
// only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment

// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};
var PROBLEM_PROBABILITY = 0.1//% chance that a task will experience a problem if its site/module is selected
var PROBLEM_CONSTANT = 0.4; //constant value for problem simulator, used to tweak difficulty

//Timezones - dictate when sites work. First index is start of work day, second index is end
var TIMEZONE_EUROPE = [9,17]
var TIMEZONE_AMERICA = [2,10]
var TIMEZONE_ASIA = [18,2]
var TIMEZONE_EASTERN_EUROPE = [10,18]

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
            site = new Site("New York", (121,43), new Culture(), 18, 5, "Agile", TIMEZONE_AMERICA);
            site2 = new Site("Shanghai", (43,43), new Culture(), 28, 7, "Agile", TIMEZONE_ASIA);
            site3 = new Site("Dublin", (111,18), new Culture(), 8, 6, "Agile", TIMEZONE_EUROPE);
            this.sites = [site, site2, site3];
            this.home_site = site3;
            main_module = new Module("write backend", [new Task("write model",3000), new Task("write view", 2500), new Task("write controller", 3500)]);
            main_module.tasks[0].assigned = 3; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 5;
            main_module.tasks[2].assigned = 3;  
            second_module = new Module("design Frontend", [new Task("create Sprites",3000), new Task("link with backend", 2500), new Task("Choose Font", 3500)]);
            second_module.tasks[0].assigned = 3; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 1;
            second_module.tasks[2].assigned = 2; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            this.sites[2].working_on.push(second_module);
            break;

        case 2:
            site = new Site("Dublin", (111,18), new Culture(), 2, 10, "Waterfall", TIMEZONE_EUROPE);
            site2 = new Site("Poland", (53,53), new Culture(), 18, 5, "Waterfall", TIMEZONE_EASTERN_EUROPE);
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
            site = new Site("Dublin", (111,18), new Culture(), 25, 1, "Agile", TIMEZONE_EUROPE);
            site2 = new Site("San Francisco", (43,43), new Culture(), 18, 5, "Agile", TIMEZONE_AMERICA);
            site3 = new Site("Bangalore", (90,70), new Culture(), 8, 6, "Agile", TIMEZONE_ASIA);
            this.sites = [site, site2, site3];
            this.home_site = site;
            main_module = new Module("write backend", [new Task("write model",150), new Task("write view", 350), new Task("write controller", 100)]);
            main_module.tasks[0].assigned = 10; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 10;
            main_module.tasks[2].assigned = 5;
            second_module = new Module("design Frontend", [new Task("create Sprites",100), new Task("link with backend", 120), new Task("Choose Font", 50)]);
            second_module.tasks[0].assigned = 4; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 2;
            second_module.tasks[2].assigned = 6; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            break;

        default:
            site = new Site("Default", (0,0), new Culture(), 5, 2, "Agile", TIMEZONE_EUROPE);
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

    this.global_distances = {"Shanghai":4, "Poland":2, "New York":4, "Bangalore":4, "Dublin":0};
    this.temporal_distances = {"Shanghai":3, "Poland":1, "New York":2, "Bangalore":2, "Dublin":0};
    this.cultural_distances = {"Shanghai":3, "Poland":2, "New York":2, "Bangalore":3, "Dublin":0};
    this.current_time = 0;
	this.time = {"Current Hour":0, "Days Passed":0}
    this.problems = [];
    this.revenue = 10000; // Amount made per release (see: this.days_per_release)
    this.capital = 50000; // Current working capital
    this.starting_capital = this.capital;
    this.financial_log = []; //log of finances to type for graphing
    this.days_per_release = 30; 
    this.developer_effort = 4; //average developer effort per day
    this.developer_rate = 30; // how much per dev per hour
    this.developer_working_hours = 9; // how many hours worked per dayA
}


function Site(name, coordinates, culture_modifier, num_staff, effort, dev, timezone){
    this.name = name;
    this.coordinates = coordinates;
    this.culture = culture_modifier; //obj
    this.num_staff = num_staff;
    this.working_on = []; //List of tasks
    this.development_type = dev;
    this.problems = 0;
	this.timezone = timezone;
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
}

function vary(total){
    var seed = Math.random();
    var actual_total = total;
    if(seed > 0.50 ){
        actual_total += Math.round(seed*total/4);
    }
    else{
        actual_total -= Math.round(seed*total/4);
    }
    return actual_total;
}

