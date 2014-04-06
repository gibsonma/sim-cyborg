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

    it("Sums all the tasks' effort correctly", function()
    {
        expect(sum_tasks(Math.round(game.sites[0]))).toEqual(0);
    });
    it("Takes remainder into account", function()
    {
        expect(remainder(150, 40)).toEqual(10);
    });
});

describe("Completion calculator ", function()
{
    var game = new GameState(1);

    it("Takes into account the work load modifier", function()
    {
        expect(actual_effort_completed(game.sites[0])).toEqual(0);
    });
    it("Amount of effort points per time of the longest length module on a site", function()
    {
        for (var i=0; i< game.sites.length; i++){
            var site = game.sites[i];
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];
                for (var k=0; k < module.tasks.length; k++){
                    var task = module.tasks[k];
                    task.actual_total = task.total;
                }
            }
        }
        expect(hours_for_longest_module(game.sites[0])).toEqual(1260);
    });
    it("the amount of effort done in the gs taking waterfall and idleness into account", function()
    {
        expect(actual_effort_completed_gs()).toBeDefined();// only checking is defined as val returned changes with very gs
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
        expect(get_total_expenditure()).toEqual(jasmine.any(Number));
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

describe("Pretty print", function()
{
    it("Add commas to thousands", function()
    {
        expect(numberWithCommas(3000000)).toEqual("3,000,000");
    });
    it("Format tables", function()
    {
        expect(tabled("hi","bye")).toEqual("<tr><td>hi</td><td>bye</td></tr>");
    });
});
describe("currently_doing_which_task", function()
{
	taskA = task_builder("TestA", 100);
	taskB = task_builder("TestB", 100);
	taskC = task_builder("TestC", 100);
	taskD = task_builder("TestD", 100);
	taskA.completed = 10;taskA.actual_total = 20;
	taskB.completed = 20;taskB.actual_total = 10;
	taskC.completed = 0;taskC.actual_total = 10;
	taskD.completed = 0;taskD.actual_total = 15;
	
	it("Return a task if actual_total is larger than completed and completed is not zero", function()
	{
		var tasks = [taskA, taskB];
		expect(currently_doing_which_task(tasks)).toEqual(taskA);
	});
	it("Return a list of tasks iterated through before current task if actual total is larger and completed is zero", function()
	{
		var tasks = [taskC, taskD, taskA, taskB];
		expect(currently_doing_which_task(tasks)).toEqual(taskC);
	});
});
describe("progress_on_current_task", function()
{
	it("Returns the progress of the module", function()
	{
		var mod = module_builder("TestA", 5, 100);
		expect(progress_on_current_task(mod)).toEqual(0);
	});
});
describe("site_complete", function()
{
	var game = new GameState(1);
	var site = game.sites[0];
	it("Returns false if the site is not finished", function()
	{
		expect(site_complete(site)).toBeFalsy();
	});
});
describe("total_of_current_task", function()
{
	var mod = module_builder("TestA", 5, 100);
	it("Returns the total correctly", function()
	{
		expect(total_of_current_task(mod)).toEqual(0.09375);
	});
});
