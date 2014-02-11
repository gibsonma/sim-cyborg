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
 
function game_state()
{
	this.sites = [];
	this.current_time = "";
	this.tasks = [];
	this.real_task_effort = [];
	this.development_type = "";
	this.problems = [];
	this.finance = [];
	this.modules = [];
	this.subsystems = [];	
}
game_state.prototype.change_sites = function(val){this.sites = val;}
game_state.prototype.change_time = function(val){this.current_time = val;}
game_state.prototype.change_tasks = function(val){this.tasks = val;}
game_state.prototype.change_real_task_effort = function(val){this.real_task_effort = val;}
game_state.prototype.change_development_type = function(val){this.development_type = val;}
game_state.prototype.change_problems = function(val){this.problems = val;}
game_state.prototype.change_finance = function(val){this.finance = val;}
game_state.prototype.change_modules = function(val){this.modules = val;}
game_state.prototype.change_subsystems = function(val){this.subsystems = val;}

//A quick function to initialise the game state with some ints and strings and print them
//to the console
function init_game_state()
{
	var gs = new game_state();
	iterate(gs);
	return gs;
}

function game_state_to_json(obj)
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
function simpleTick(game_state)
{
	var gs = game_state;
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
function update(game_state)
{
	// Do different stuff depening on what development method
	// E.G increment current task progress, check if we can move to next task etc
	switch (game_state.development_type) {
		case "Waterfall":
			console.log("Updating in a waterfall fashion!");
			break;
		case "Agile":
			console.log("Look at me, aren't I agile?");
			break;
		default:
			console.log("What even IS this development methodology?");
	}
}