//constructor
/*
  sites - Details of each site involved with location, size, status, home site etc
  time - The current time & date in the game
  tasks - The tasks present in game, both planned, completed and underway
  real_task_effort - The results of the Module-task completion calculator (25% variation)
  development_type - The type of development method being used (agile, waterfall etc)
  problems - Gives details of past and present problems along with the sites affected
  finance - Amount of money remaining in budget, amount spent etc
  modules - Details the modules involved in the manager's project
  subsystems - Details the subsystems involved in the manager's project
 */
function game_state(sites, current_time, tasks, real_task_effort, development_type, problems,
					finance, modules, subsystems)
{
	this.sites = sites;
	this.current_time = current_time;
	this.tasks = tasks;
	this.real_task_effort = real_task_effort;
	this.development_type = development_type;
	this.problems = problems;
	this.finance = finance;
	this.modules = modules;
	this.subsystems = subsystems;

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