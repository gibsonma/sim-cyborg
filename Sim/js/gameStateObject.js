/*
  sites - Details of each site involved with location, size, status, home site etc
  time - The current time & date in the game
  tasks - The tasks present in game, both completed, underway and planned
  real_task_effort - The results of the Module-task completion calculator (25% variation)
  development_type - The type of development method being used (agile, waterfall etc)
  problems - Gives details of past and present problems along with the sites affected
  finance - Amount of money remaining in budget, amount spent etc
  modules - Details the modules involved in the manager's project
  subsystems - Details the subsystems involved in the manager's project
 */
 
function GameState()
{

	this.sites = [];
	this.current_time = "";
	this.tasks = [];
	this.real_task_effort = [];
	this.development_type = "";
	this.problems = [];
	this.finance = [];

    main_module = new Module("write backend", [new Subsystem("write model",30), new Subsystem("write view", 25), new Subsystem("write controller", 35)]);
	this.modules = [main_module];
}

GameState.prototype.add_sites = function(site){this.sites.push(site);}
GameState.prototype.change_time = function(val){this.current_time = val;}
GameState.prototype.change_tasks = function(val){this.tasks = val;}
GameState.prototype.change_real_task_effort = function(val){this.real_task_effort = val;}
GameState.prototype.change_development_type = function(val){this.development_type = val;}
GameState.prototype.change_problems = function(val){this.problems = val;}
GameState.prototype.change_finance = function(val){this.finance = val;}
GameState.prototype.add_modules = function(module){this.modules.push(module);}

function Site(name, coordinates, culture_modifier){
    this.name = name;
    this.coordinates = coordinates;
    this.culture = culture_modifier; //obj
}

function Module(name, subsystems){
    this.name = name;
    this.subsystems = subsystems; //obj list
}

function Subsystem(name, total){
    this.name = name;
    this.completed = 0;
    this.total = total;
}

//A quick function to initialise the game state with some ints and strings and print them
//to the console
function init_GameState()
{
	var gs = new GameState();
	iterate(gs);
	return gs;
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
function simpleTick(GameState)
{
	var gs = GameState;
	// Increment current time
	// Todo: Decide how to represent time
	gs.current_time++;

	// Iterate over modules and get them to update
	for (var m in gs.modules) {
		m.update(gs);
	}

	// Todo: Simulate problems occurring etc here
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(GameState)
{
	// Do different stuff depening on what development method
	// E.G increment current task progress, check if we can move to next task etc
	switch (GameState.development_type) {
		case "Waterfall":
			console.log("Updating in a waterfall fashion!");
			break;
		case "Agile":
			console.log("Look at me, aren't I agile?");
			break;
		case "Reddit":
			console.log("Will update gamestate after reddit");
			break;
		default:
			console.log("What even IS this development methodology?");
	}
}

if (require.main === module){ 
    console.log("Node method for debugging");
    var gs = new GameState();
    console.log(gs);
    for (var i=0;i < gs.modules.length; i++){
        console.log(gs.modules[i]);
    }
    console.log (GameState_to_json(gs));
}
