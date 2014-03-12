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
	var task = game.sites[0].working_on[0].tasks[0];
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



