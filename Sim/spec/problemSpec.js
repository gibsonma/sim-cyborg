describe("Intervention Interface", function()
{
	var gs = new GameState(1);
	var val = 100000;
	load_globals(gs);
	gs.sites[0].problems[0] = new Problem("Module failed to integrate",10, 20,0,1);
	gs.capital = val;

	it("Always removes a problem if one is present", function()
	{
		expect(gs.sites[0].problems.length).toEqual(1);
		interventionAlt(gs, 1);
		expect(gs.sites[0].problems.length).toEqual(0);
		gs.sites[0].problems[0] = new Problem("Module failed to integrate",10, 20,0,1);
		interventionAlt(gs, 0);
		expect(gs.sites[0].problems.length).toEqual(0);
	});
	it("Only removes the problem if it isn't fixed, nothing else", function()
	{
		var orig = gs.sites[0].modules[0].tasks[1].actual_total;
		interventionAlt(gs, 0);
		expect(gs.sites[0].modules[0].tasks[1].actual_total).toEqual(orig);
	});
});

describe("Problem Simulator", function()
{
	it("checks to make sure the fail value used to calculate problems is valid", function()
	{
		var gs = new GameState(1);
			for(int i = 0; i < 10; i++)
			{
				var fail = problemSim(gs);
			}
		expect(fail).toBeLessThan(1);
		expect(fail).toBeGreaterThan(0);

	});

});