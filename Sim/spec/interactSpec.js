var game = new GameState(1);
describe("on_schedule_str", function()
{
	var site = game.sites[0];
	it("Returns the correct string if the site is ahead of schedule", function()
	{
		site.schedule = 1;
		expect(on_schedule_str(site)).toEqual('New York is NaN weeks ahead of schedule');
	});
	it("Returns the correct string if the site is behind of schedule", function()
	{
		site.schedule = -1;
		expect(on_schedule_str(site)).toEqual('New York is NaN weeks behind schedule');
	});
	it("Returns the correct string if the site is on schedule", function()
	{
		site.schedule = 0;
		expect(on_schedule_str(site)).toEqual('New York is dead on schedule');
	});
});
describe("statusClass", function()
{
	var site = game.sites[0];
	it("Returns that the schedule is ok if the culture is asian", function()
	{
		site.culture.influence = "asian";
		expect(statusClass(site)).toEqual('schedule-ok');
	});
	it("Returns that the site is very behind if a critical problem is present", function()
	{
		site.culture.influence = "";
		site.critical_problem = true;
		expect(statusClass(site)).toEqual('schedule-very-behind');
	});
	it("Returns that the schedule is ok if the schedule is on time", function()
	{
		site.schedule = 2;
		site.critical_problem = false;
		expect(statusClass(site)).toEqual('schedule-ok');
	});
	it("Returns that the schedule is behind by default", function()
	{
		site.schedule = -1;
		expect(statusClass(site)).toEqual('schedule-behind');
	});
});
describe("update_actual_total", function()
{
	var site = game.sites[0];
	it("Updates the task totals with the actual totals", function()
	{
		site.modules[0].tasks[0].total = 50;
		site.modules[0].tasks[0].actual_total = 70;
		update_actual_total(site);
		expect(site.modules[0].tasks[0].total).toEqual(site.modules[0].tasks[0].actual_total);
	});
});
describe("updateSpeedLabel", function()
{
	it("Modifies TICKS correctly", function()
	{
		TICKS_PER_UNIT_TIME = 2;
		updateSpeedLabel(2);
		expect(TICKS_PER_UNIT_TIME).toEqual(4);
	});
	it("Enforces the maximum value of 20 && minimum of 1", function()
	{
		TICKS_PER_UNIT_TIME = 20;
		updateSpeedLabel(4);
		expect(TICKS_PER_UNIT_TIME).toEqual(20);
		TICKS_PER_UNIT_TIME = 1;
		updateSpeedLabel(-4);
		expect(TICKS_PER_UNIT_TIME).toEqual(1);
	});
});
describe("implementChosenManagementStyle", function()
{
	it("Chooses the correct style based on input and changes the player correctly", function()
	{
		implementChosenManagementStyle(game, 'Laissez Faire');
		expect(game.player.perception).toEqual(2);
	});
});
describe("completedTasksEmail", function()
{
	it("Calls the transaction function", function()
	{
		new_transaction = jasmine.createSpy();
		completedTasksEmail(game.sites[0]);
		expect(new_transaction).toHaveBeenCalled();
		expect(new_transaction).toHaveBeenCalledWith(-500);
	});
});	
describe("inquireAccurate", function()
{
	it("Calls the transaction function", function()
	{
		new_transaction = jasmine.createSpy();
		inquireAccurate(game.sites[0]);
		expect(new_transaction).toHaveBeenCalled();
		expect(new_transaction).toHaveBeenCalledWith(-100);
	});
});	
describe("inquireCultural", function()
{
	it("Calls the transaction function", function()
	{
		new_transaction = jasmine.createSpy();
		inquireCultural(game.sites[0]);
		expect(new_transaction).toHaveBeenCalled();
		expect(new_transaction).toHaveBeenCalledWith(-100);
	});
});

describe("task datasets", function()
{
	it("get datasets for graph", function()
	{
        expect((task_datasets(game.sites[0].modules[0]))[0].title).toEqual("Design");
	});
});

describe("largest_history_labels", function()
{
	it("how wide should the graph be", function()
	{
        expect(largest_history_labels(game.sites[0].modules[0])).toEqual(['']); 
	});
});

describe("normalise module name", function()
{
	it("remove spaces", function()
	{
        expect(normalise_module_name(game.sites[1].modules[1])).toEqual("CommunicationsSoftware"); 
	});
});
