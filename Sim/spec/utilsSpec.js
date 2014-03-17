describe("Sites working during their timezone", function()
{
	var gs = new GameState(1);
	load_globals(gs);
	gs.time["Current Hour"] = 10;
	it("checks to see if a site is working when it is supposed to", function()
	{
		expect(should_be_working(gs.sites[0], gs)).toBeFalsy();//New York
		expect(should_be_working(gs.sites[1], gs)).toBeFalsy();//Shanghai
		expect(should_be_working(gs.sites[2], gs)).toBeTruthy();//Dublin
		gs.time["Current Hour"] = 0;
		expect(should_be_working(gs.sites[0], gs)).toBeFalsy();
		expect(should_be_working(gs.sites[1], gs)).toBeTruthy();
		expect(should_be_working(gs.sites[2], gs)).toBeFalsy();
		gs.time["Current Hour"] = 9;
		expect(should_be_working(gs.sites[0], gs)).toBeTruthy();
		expect(should_be_working(gs.sites[1], gs)).toBeFalsy();
		expect(should_be_working(gs.sites[2], gs)).toBeTruthy();
		gs.time["Current Hour"] = 23;
		expect(should_be_working(gs.sites[1], gs)).toBeTruthy();//Shanghai
	});
});

describe("Nominal Schedule Calculator", function()
{
    var game = new GameState(1);
	
	var total = 0
    for (var k=0; k <game.sites.length; k++){
        var site = game.sites[k];
        for(var i = 0; i < site.modules.length; i++){
            var taskList = site.modules[i].tasks;
            for(var j = 0; j < taskList.length; j++) total += taskList[j].total;
        }
    }
	it("Sums all the tasks' effort correctly", function()
	{
		expect(sum_tasks(game)).toEqual(total);
	});
	it("Takes into account the work load modifier", function()
	{
		expect(scheduleCalculator(game)).toEqual(40000);
	});
});

describe("check_if_completed", function()
{
	var game = new GameState(1);
	it("Returns false if all the tasks in a game are not completed", function()
	{
		expect(check_if_completed(game)).toBeFalsy();
	});
});

describe("getSiteByName", function()
{
	var game = new GameState(1);
	var name = "New York";
	it("Returns the correct index for a given site name", function()
	{
		expect(getSiteByName(name, game)).toBeDefined;
	});
});

describe("get_home_site", function()
{
	var game = new GameState(1);
	var sites = game.sites;
	var fake_sites = [];
	game.home_site = sites[2];
	it("Returns the home site when given an array of sites", function()
	{
		expect(get_home_site(sites)).toEqual(game.home_site);
	});
	it("Doesn't return anything of site not found", function()
	{
		expect(get_home_site(fake_sites)).not.toBeDefined();
	});
});

//NOTE result is passed to the expect as calling the function
//or assigning result inside the it block causes it to return undefined...
describe("getEffortForModule", function()
{
	var game = new GameState(1);
	var mod = module_builder("Test", 10, 1200);
	var result = getEffortForModule(mod);
	it("Returns the total effort of the module", function()
	{
		expect(result).toEqual(1200);
	});
});

describe("getSiteWorkers", function()
{
	var site = site_builder("New York", "Agile", false, [
                        module_builder("Backend", 6, 10000),
                        module_builder("Database", 2, 3000)]);
	var result = getSiteWorkers(site);
	it("Returns the correct number of workers", function()
	{
		expect(result).toEqual(8);
	});
});

describe("number_assigned_workers", function()
{
	var game = new GameState(1);
	GAME_DATA.gs = game;
	var result = number_assigned_workers();
	var num_workers = 0
	for (var i=0; i < GAME_DATA.gs.sites.length; i++){
        var site = GAME_DATA.gs.sites[i];
		num_workers += getSiteWorkers(site);
    }
	it("Gets the total number of assigned workers in the game", function()
	{
		expect(GAME_DATA.gs).toBeDefined();
		expect(result).toEqual(num_workers);
	});
});

describe("report", function()
{
	var game = new GameState(1);
	var obj = new report(game);
	it("Creates the report object correctly", function()
	{
		expect(obj).toBeDefined();
		expect(obj.months_str).toBeDefined();
		expect(obj.actual_effort).toBeDefined();
		expect(obj.expected_effort).toBeDefined();
		expect(obj.actual_expenditure).toBeDefined();
		expect(obj.expected_expenditure).toBeDefined();
		expect(obj.actual_revenue).toBeDefined();
		expect(obj.expected_revenue).toBeDefined();
		expect(obj.expected_months).toBeDefined();
		expect(obj.final_score).toBeDefined();
		expect(obj.expected_months_str).toBeDefined();
	});
});

describe("get_total_expenditure", function()
{
	var game = new GameState(1);
	GAME_DATA.gs = game;
	
	it("Returns the expenses", function()
	{
		GAME_DATA.gs.financial_log.push({
			"time":GAME_DATA.gs.current_time, 
			"amount":1000
		});
		GAME_DATA.gs.financial_log.push({
			"time":GAME_DATA.gs.current_time, 
			"amount":-100
		});
		expect(GAME_DATA.gs.financial_log).toBeDefined();
		expect(get_total_expenditure()).toEqual(1100);
	});
});

describe("module_lifecycle_stage", function()
{
	var game = new GameState(1);
	var site = game.sites[0];
	it("Return the lowest cycle", function()
	{
		expect(site).toBeDefined();
		expect(module_lifecycle_stage(site)).toEqual(0);
	});
});


