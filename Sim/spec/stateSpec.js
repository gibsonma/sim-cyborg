describe("game object", function() {
    var game = new GameState(1);
    it("checks if sites are properly set", function() {
        expect(game.sites).not.toBeNull();
    });
    it("checks if time is properly set", function() {
        expect(game.current_time).not.toBeNull();
		expect(game.days_passed).not.toBeNull();
    });
    it("checks if tasks are properly set", function() {
        expect(game.tasks).not.toBeNull();
    });
    it("checks if real task effort is properly set", function() {
        expect(game.real_task_effort).not.toBeNull();
    });
    it("checks if development type is properly set", function() {
        expect(game.development_type).not.toBeNull();
    });
    it("checks if problems are properly set", function() {
        expect(game.problems).not.toBeNull();
    });
    it("checks if finance is non negative", function() {
        expect(game.finance).not.toBeLessThan(0);
    });
    it("checks if modules are properly set", function() {
        expect(game.modules).not.toBeNull();
    });
	it("checks if home site is set", function() {
		expect(game.home_site).not.toBeNull();
	});
	it("checks if a timezone has been assigned to each site", function() {
		expect(game.sites[0].timezone).toEqual(TIMEZONE_AMERICA);
		expect(game.sites[1].timezone).toEqual(TIMEZONE_ASIA);
		expect(game.sites[2].timezone).toEqual(TIMEZONE_EUROPE);
	});
});

describe("Module Completion Calculator", function()
{
	var game = new GameState(1);
	var task = game.sites[0].modules[0].tasks[0];
	task.total = 100;
	var maxVal = 126;
	var minVal = 74;
	it("Can implement a 25% variance", function()
	{
		expect(vary(task.total)).toBeLessThan(maxVal);
		task.total = 100;
		expect(vary(task.total)).toBeGreaterThan(minVal);
	});
});
describe("Updating local timezones", function()
{
	var game = new GameState(1);
	setLocalTime(game.sites, get_home_site(game.sites));
	it("Updated local times correctly", function()
	{
		expect(game.sites[0].local_time).toEqual(17);
		incrementTime(game);
		expect(game.sites[0].local_time).toEqual(18);
	});
});
describe("GameState_to_json", function()
{
	var game = new GameState(1);
	it("turns gamestate into json", function()
	{
		expect(GameState_to_json(game)).not.toBeNull();


	});
});
describe("Problem", function()
{
	it("checks if problem is defined", function()
	{
		var p = new Problem("test problem", 100, 0, 0, 1);
		expect(p).toBeDefined();

	});
});

describe("Site", function()
{
	it("checks if site is defined", function()
	{
		var s = new Site("Test Site", "asian", "Agile", TIMEZONE_EUROPE, false);
		var s2 = new Site("Test Site", "asian", "Agile", TIMEZONE_EUROPE, true);
		expect(s).toBeDefined();
		expect(s2.moral).toEqual(100);
		

	});
});

describe("Culture", function()
{
	it("checks if culture is defined", function()
	{
		var c = new Culture("asian");
		expect(c).toBeDefined();

	});
});

describe("Module", function()
{
	it("checks if module is defined", function()
	{
		var m = new Module("test module", 6, []);
		expect(m).toBeDefined();

	});
});

describe("Task", function()
{
	it("checks if task is defined", function()
	{
		var t = new Task("Test Task", 100);
		expect(t).toBeDefined();

	});
});

describe("Player", function()
{
	it("checks if player object is defined", function()
	{
		var p = new Player();
		expect(p).toBeDefined();

	});
});

describe("Intervention", function()
{
	it("Checks that Interventions are initialised properly", function()
	{
		var p = new Problem("test problem", 100, 0, 0, 1);
		var i = new Intervention("Implement Face to Face Meetings", 2000, 100, false, [1,1,1,1,1,0,0]);
		expect(i).toBeDefined();
		expect(i.name).toEqual(jasmine.any(String));
		expect(i.init_cost).toEqual(jasmine.any(Number));
		expect(i.daily_cost).toEqual(jasmine.any(Number));
		expect(i.is_implemented).toEqual(jasmine.any(Boolean));
	});
});

describe("MoralIntervention", function()
{
	it("Checks if moral interventions are defined properly", function()
	{
		var m = new MoralIntervention("Test", 1000, 50);
		expect(m).toBeDefined();
		expect(m.name).toEqual(jasmine.any(String));
		expect(m.cost).toBeGreaterThan(-1);
		expect(m.cost).toEqual(1000);
		expect(m.init_impact).toBeGreaterThan(-1);
		expect(m.init_impact).toEqual(50);
		expect(m.sites_implemented).toEqual({});
	});
});