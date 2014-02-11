//constructor
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
 
 //Change so that game_state takes no paramters and instead sets all attributes to a default value
 //Attributes can then be set using functions
function game_state()
{
	this.sites = 0;
	this.current_time = 0;
	this.tasks = 0;
	this.real_task_effort = 0;
	this.development_type = 0;
	this.problems = 0;
	this.finance = 0;
	this.modules = 0;
	this.subsystems = 0;

	function change_sites(val){this.sites = val;}
	function change_time(val){this.current_time = val;}
	function change_tasks(val){this.tasks = val;}
	function change_real_task_effort(val){this.real_task_effort = val;}
	function change_development_type(val){this.development_type = val;}
	function change_problems(val){this.problems = val;}
	function change_finance(val){this.finance = val;}
	function change_modules(val){this.modules = val;}
	function change_subsystems(val){this.subsystems = val;}
}

//A quick function to initialise the game state with some ints and strings and print them
//to the console
function init_game_state()
{
	var gs = new game_state([["India", 10, "Okay", 0],["San Francisco", 20, "Excellent", 1],["France", 5, "Behind", 0]], "02/04/2015 - 14:23", [["Assign work to Europe"],["Deal with strike in San Fran"],["Fundraise money"]], [4,5,8,2], "agile", ["Earthquake in Japan"], [10000, 1000], ["Frontend", "Backend"], ["Database"]);
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
      console.log("Key: " + key + " Values: " + obj[key]);
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