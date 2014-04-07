// Variables to do with time
var DESIRED_FPS = 30;
var MILLIS_PER_FRAME = 1000 / DESIRED_FPS;
var TIME_CLOCK = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];//Represents the 24 hour clock used to track the progress of days

var TICKS_PER_UNIT_TIME = 1;       // Assuming we don't want the game's time to update every tick (if game time == days), 
// only update game time every X ticks
var TICKS_PASSED = 0;               // Keep track of how many ticks we've seen since last time increment


// Blop to store the global game data/objects such as game state, the scene, the ticker
var GAME_DATA = {};
GAME_DATA.current_site = 0;
GAME_DATA.player = new Player();
var PROBLEM_CONSTANT; //constant value for problem simulator, used to tweak difficulty, decrease to reduce problems
var PROBLEM_COOLDOWN = 0.0025;
var MORALE_MOD;//Represents how quickly a morale interventions impact errodes each time its used, the closer to 0, the quicker it erodes
var MIN_MORALE;//Lowest morale a site can have
var MAX_MORALE;//Highest morale a site can have
var days_since_morale_warning = 14;//Tracks how many days have passed since the user was last warned about a site's low morale to prevent spamming the user with warnings. Starts at 7 to allow for low morale to be reported during the simulation's first week
var chance_to_decrease_morale = 0.0;//Chance that morale will decrease, value rises when problems are ignored
var WORK_LOAD = 2; //Sum of effort of all tasks is divided by this to represent accurate effort estimates
var G_EVENT_CHANCE;
var B_EVENT_CHANCE;
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
            site_builder("New York", "Waterfall", false, [
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
            site_builder("Poland", "Waterfall", false, [
                module_builder("Backend", 3, 1000),
                module_builder("Database", 3, 5000),
            ]), 
            site_builder("Dublin", "Waterfall", true, [
                module_builder("Middle End", 2, 1000),
                module_builder("Mobile Client", 4, 5000),
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
    default:
        this.sites = setting;
    }
    this.global_distances = 0;
    this.temporal_distances = 0;
    this.cultural_distances = 0;
    this.revenue = 0;
    this.starting_capital = 0;
    this.developer_effort = 0;
    this.developer_rate = 0;
    this.developer_working_hours = 0;
    this.capital = 0;
    this.problems = [];
    this.time = {"Current Hour":0, "Days Passed":0}
    this.current_time = 0;
    this.financial_log = []; //log of finances to type for graphing
    this.interventions = [];
    this.morale_interventions = [];
    this.days_per_month = 30;
    this.player = GAME_DATA.player;
}

function load_globals(gs){
    $.ajaxSetup( { "async": false } );
    $.getJSON('data/config_file.json', function(obj){
        gs.global_distances = obj.global_distances;
        gs.temporal_distances = obj.temporal_distances;
        gs.cultural_distances = obj.cultural_distances;
        gs.revenue = obj.revenue *gs.player.intelligence_mod; //change revenue based on how intelligent the manager is
        gs.starting_capital = obj.starting_capital;
        gs.developer_effort = obj.developer_effort*gs.player.assertiveness_mod;
        gs.developer_rate = obj.developer_rate*gs.player.charisma_mod; //more charismatic  managers will improve how workers see you, and therefore how hard they work
        gs.developer_working_hours = obj.developer_working_hours;
        gs.capital = gs.starting_capital;
        gs.interventions = obj.interventions;	
        gs.morale_interventions = obj.morale_interventions;
		gs.good_events = obj.good_special_events;
		gs.bad_events = obj.bad_special_events;
        PROBLEM_CONSTANT = obj.problem_constant;
        MORALE_MOD = obj.morale_modifier*(1/gs.player.empathy_mod);
		MIN_MORALE = obj.min_morale;
		MAX_MORALE = obj.max_morale;
        PROBLEM_COOLDOWN = obj.problem_site_cooldown;
		G_EVENT_CHANCE = obj.special_g_event_constant;
		B_EVENT_CHANCE = obj.special_b_event_constant;
    });
}
function Player(){
    this.sensitivity   = 0; //for noticing workplace issues etc
    this.perception    = 0; //for figuring out potential problems before they happen
    this.empathy       = 0; //for knowing in advance when your morale is dropping, also gives a bonus to morale --DECREASE THIS MODIFIER AT HIGHER LEVELS
    this.charisma      = 0; //for interacting with your workers to improve their productivity --INCREASE THIS MODIFIER AT HIGHER LEVELS
    this.intelligence  = 0; //for making better business decisions, impacts revenue --INCREASE THIS MODIFIER AT HIGHER LEVELS
    this.assertiveness = 0; //for increasing productivity/developer effort --INCREASE THIS MODIFIER AT HIGHER LEVELS
    this.luck          = 0; //sometimes, something nice will happen... or sometimes, something bad.

    this.sensitivity_mod = 1 + (this.sensitivity/10);
    this.perception_mod  = 1 + (this.perception/10);
    this.empathy_mod = 1 + (this.empathy/10);
    this.charisma_mod = 1 + (this.charisma/20);
    this.intelligence_mod = 1 + (this.intelligence/20);
    this.assertiveness_mod = 1 +  (this.assertiveness/20);
    this.luck_mod = this.luck*10;
}

function Site(name, culture_modifier, dev, timezone, home){
    this.name = name;
    this.culture = culture_modifier; //obj
    this.modules = []; //List of modules
    this.development_type = dev;
    this.problems = [];
    this.past_problems = [];
    this.critical_problem = false;
    this.timezone = timezone;
    this.problemCooldown = PROBLEM_COOLDOWN;
    this.home = home;
    this.local_time = 0;
    this.morale = set_morale(home);
    this.schedule = 0; // how far or behind a site is from the schedule
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
    this.completion_log = [];
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

//Represents a morale intervention
function MoralIntervention(name, cost, init_impact)
{
    this.name = name;
    this.cost = cost;//Cost of buying
    this.init_impact = init_impact;//Initial impact on site morale
    this.sites_implemented = {};//A dictionary linking the sites that have purchased the intervention and how many times
}

function Event(name, message)
{
	this.name = name;
	this.message = message;
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
