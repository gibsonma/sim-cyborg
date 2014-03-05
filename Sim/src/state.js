// Variables to do with time
var DESIRED_FPS = 30;
var MILLIS_PER_FRAME = 1000 / DESIRED_FPS;
var TIME_CLOCK = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];//Represents the 24 hour clock used to track the progress of days

var TICKS_PER_UNIT_TIME = 10;       // Assuming we don't want the game's time to update every tick (if game time == days), 
// only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment

// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};
var PROBLEM_PROBABILITY = 0.1//% chance that a task will experience a problem if its site/module is selected
var PROBLEM_CONSTANT = 0.005; //constant value for problem simulator, used to tweak difficulty

//Timezones - dictate when sites work. First index is start of work day, second index is end
var TIMEZONE_EUROPE = [9,17];
var TIMEZONE_AMERICA = [2,10];
var TIMEZONE_ASIA = [18,2];
var TIMEZONE_EASTERN_EUROPE = [10,18];

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
            site = new Site("New York", (121,43), new Culture(), "Agile", TIMEZONE_AMERICA);
            site2 = new Site("Shanghai", (43,43), new Culture(), "Waterfall", TIMEZONE_ASIA);
            site3 = new Site("Dublin", (111,18), new Culture(), "Agile", TIMEZONE_EUROPE);
            this.sites = [site, site2, site3];
            this.home_site = site3;
            main_module = new Module("Backend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
            main_module.tasks[0].assigned = 3; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 5;
            main_module.tasks[2].assigned = 3;  
            second_module = new Module("Frontend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
            second_module.tasks[0].assigned = 3; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 4;
            second_module.tasks[2].assigned = 2; 
            third_module = new Module("Frontend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
            third_module.tasks[0].assigned = 4; // NB will need to have proper methods to change who's assigned to what
            third_module.tasks[1].assigned = 4;
            third_module.tasks[2].assigned = 3; 
            this.modules = [main_module, second_module, third_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            this.sites[2].working_on.push(third_module);
            break;

        case 2:
            site = new Site("Dublin", (111,18), new Culture(), "Waterfall", TIMEZONE_EUROPE);
            site2 = new Site("Poland", (53,53), new Culture(), "Waterfall", TIMEZONE_EASTERN_EUROPE);
            this.sites = [site, site2];
            this.home_site = site;
            main_module = new Module("Backend", [new Task("Design",4000), new Task("Implement", 1500), new Task("Test", 5000)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 1;
            main_module.tasks[2].assigned = 1;
            second_module = new Module("Frontend", [new Task("Design",4000), new Task("Implement", 2500), new Task("Test", 5500)]);
            second_module.tasks[0].assigned = 1; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 2;
            second_module.tasks[2].assigned = 3; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            break;

        case 3:
            site = new Site("Dublin", (111,18), new Culture(), "Waterfall", TIMEZONE_EUROPE);
            site2 = new Site("San Francisco", (43,43), new Culture(), "Waterfall", TIMEZONE_AMERICA);
            site3 = new Site("Bangalore", (90,70), new Culture(), "Waterfall", TIMEZONE_ASIA);
            this.sites = [site, site2, site3];
            this.home_site = site;
            main_module = new Module("Backend", [new Task("Design",250), new Task("Implement", 200), new Task("Test", 100)]);
            main_module.tasks[0].assigned = 5; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 6;
            main_module.tasks[2].assigned = 7;
            second_module = new Module("Frontend", [new Task("Design",120), new Task("Implement", 200), new Task("Test", 50)]);
            second_module.tasks[0].assigned = 6; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 6;
            second_module.tasks[2].assigned = 8; 
            third_module = new Module("Support System", [new Task("Design",320), new Task("Implement", 200), new Task("Test", 50)]);
            third_module.tasks[0].assigned = 7; // NB will need to have proper methods to change who's assigned to what
            third_module.tasks[1].assigned = 6;
            third_module.tasks[2].assigned = 7; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[1].working_on.push(second_module);
            this.sites[2].working_on.push(third_module);
            break;

        default:
            site = new Site("Default", (0,0), new Culture(), 5, 2, "Agile", TIMEZONE_EUROPE);
            this.sites = [site];
            this.home_site = site;
            main_module = new Module("Backend", [new Task("Design",100), new Task("Implement", 350), new Task("Test", 200)]);
            main_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            main_module.tasks[1].assigned = 2;
            main_module.tasks[2].assigned = 1;
            second_module = new Module("Frontend", [new Task("Design",250), new Task("Implement", 100), new Task("Test", 200)]);
            second_module.tasks[0].assigned = 2; // NB will need to have proper methods to change who's assigned to what
            second_module.tasks[1].assigned = 3;
            second_module.tasks[2].assigned = 1; 
            this.modules = [main_module, second_module];
            this.sites[0].working_on.push(main_module);
            this.sites[0].working_on.push(second_module);
            break;
    }
    this.global_distances = 0;
    this.temporal_distances = 0;
    this.cultural_distances = 0;
    this.revenue = 0;
    this.starting_capital = 0;
    this.days_per_release = 0;
    this.developer_effort = 0;
    this.developer_rate = 0;
    this.developer_working_hours = 0;
    this.waterfall_speedup_modifier = 0;
    this.capital = 0;
    this.problems = [];
    this.time = {"Current Hour":0, "Days Passed":0}
    this.current_time = 0;
    this.financial_log = []; //log of finances to type for graphing
}

function load_globals(gs){
    $.getJSON('data/config_file.json', function(obj){
        gs.global_distances = obj.global_distances;
        gs.temporal_distances = obj.temporal_distances;
        gs.cultural_distances = obj.cultural_distances;
        gs.revenue = obj.revenue;
        gs.starting_capital = obj.starting_capital;
        gs.days_per_release = obj.days_per_release;
        gs.developer_effort = obj.developer_effort;
        gs.developer_rate = obj.developer_rate;
        gs.developer_working_hours = obj.developer_working_hours;
        gs.waterfall_speedup_modifier = obj.waterfall_speedup_modifier;
        gs.capital = gs.starting_capital;
    });
}

function Site(name, coordinates, culture_modifier, dev, timezone){
    this.name = name;
    this.coordinates = coordinates;
    this.culture = culture_modifier; //obj
    this.working_on = []; //List of modules
    this.development_type = dev;
    this.problems = [];
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
function Problem(name,impact, currentProgress, module, taskNum){
    this.impact = impact; //a percentage of productivity reduction
    this.name = name;
    this.currentProgress = currentProgress; //snapshot the progress of the task at the time of problem to allow for restoration later
    this.reduction_in_total = currentProgress/impact; //just sub this to the actual_total when resolving a problem
    this.module = module;//Which module has been affected
    this.taskNum = taskNum;//Which task has experienced the problem
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

