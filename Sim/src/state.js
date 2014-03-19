// Variables to do with time
var DESIRED_FPS = 30;
var MILLIS_PER_FRAME = 1000 / DESIRED_FPS;
var TIME_CLOCK = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];//Represents the 24 hour clock used to track the progress of days

var TICKS_PER_UNIT_TIME = 1;       // Assuming we don't want the game's time to update every tick (if game time == days), 
// only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment

// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};
var PROBLEM_CONSTANT = 0.9; //constant value for problem simulator, used to tweak difficulty, decrease to reduce problems
var WORK_LOAD = 2; //Sum of effort of all tasks is divided by this to represent accurate effort estimates

//Timezones - dictate when sites work. First index is start of work day, second index is end
var TIMEZONE_EUROPE = [9,17];
var TIMEZONE_AMERICA = [2,10];
var TIMEZONE_ASIA = [18,2];
var TIMEZONE_EASTERN_EUROPE = [10,18];

//mitigation minimum cap to prevent abuse
var percentages = []

function GameState(setting)
{
    switch(setting)
    {
        /*
         * headers:
         * site_builder(name, dev_type, home, module);
         * module_builder(name, assigned, effort_points);
         */
        case 1:
            this.sites = [
                site_builder("New York", "Agile", false, [
                        module_builder("Backend", 6, 10000),
                        module_builder("Database", 2, 3000)
                        ]),
                site_builder("Shanghai", "Waterfall", false, [
                        module_builder("Middle End", 6, 10000),
                        module_builder("Communications Software", 2, 3000)
                        ]),
                site_builder("Dublin", "Agile", true, [
                        module_builder("Front End", 7, 11000),
                        module_builder("Mobile Client", 3, 3000)
                        ])
                    ];
            break;
        case 2:
            this.sites = [
                site_builder("Dublin", "Waterfall", true, [
                        module_builder("Backend", 6, 10000),
                        module_builder("Database", 2, 1000)
                        ]),
                site_builder("Poland", "Waterfall", false, [
                        module_builder("Middle End", 6, 9000),
                        module_builder("Backend", 6, 5000)
                        ]),
                    ];
            break;

        case 3:
            this.sites = [
                site_builder("New York", "Agile", false, [
                        module_builder("Backend", 10, 1000),
                        module_builder("Database", 8, 100)
                        ]),
                site_builder("Shanghai", "Agile", false, [
                        module_builder("Middle End", 12, 900),
                        module_builder("Communications Software", 9, 300)
                        ]),
                site_builder("Dublin", "Agile", true, [
                        module_builder("Front End", 15, 1100),
                        module_builder("Mobile Client", 11, 300)
                        ])
                    ];
            break;
    }
    this.global_distances = 0;
    this.temporal_distances = 0;
    this.cultural_distances = 0;
    this.revenue = 0;
    this.starting_capital = 0;
    this.days_per_month = 0;
    this.developer_effort = 0;
    this.developer_rate = 0;
    this.developer_working_hours = 0;
    this.capital = 0;
    this.problems = [];
    this.time = {"Current Hour":0, "Days Passed":0}
    this.current_time = 0;
    this.financial_log = []; //log of finances to type for graphing
	this.interventions = [];
}

function load_globals(gs){
    $.ajaxSetup( { "async": false } );
    $.getJSON('data/config_file.json', function(obj){
        gs.global_distances = obj.global_distances;
        gs.temporal_distances = obj.temporal_distances;
        gs.cultural_distances = obj.cultural_distances;
        gs.revenue = obj.revenue;
        gs.starting_capital = obj.starting_capital;
        gs.days_per_month = obj.days_per_month;
        gs.developer_effort = obj.developer_effort;
        gs.developer_rate = obj.developer_rate;
        gs.developer_working_hours = obj.developer_working_hours;
        gs.capital = gs.starting_capital;
		gs.interventions = obj.interventions;	
    });
}

function Site(name, culture_modifier, dev, timezone, home){
    this.name = name;
    this.culture = culture_modifier; //obj
    this.modules = []; //List of modules
    this.development_type = dev;
    this.problems = [];
    this.critical_problem = false;
    this.timezone = timezone;
    this.problemCooldown = 0.005;
    this.home = home;
    this.local_time = 0;
}

function Culture(influence){
    this.influence = influence;
}

function Module(name, tasks, assigned){
    this.name = name;
    this.assigned = assigned;
    this.tasks = tasks; //obj list
}

function Task(name, total){
    this.name = name;
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
    this.cost = impact*100;
}

//A class that represents an intervention in the game
function Intervention(name, init_cost, daily_cost, is_implemented, affects)
{
	this.name = name;//Name of the intervention
	this.init_cost = init_cost;//How much it costs to buy initially
	this.daily_cost = daily_cost;//How much it costs to keep per day
	this.is_implemented = is_implemented;//Is it currently implemented?
	this.affects = affects//Array of bools corresponding to which tasks are affected by the intervention
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

function GameState_to_json(gs)
{
    return JSON.stringify(gs);
}
