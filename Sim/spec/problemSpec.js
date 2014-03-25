var game = new GameState(1);
describe("The Intervention Interface", function()
{
	describe("purchase_intervention", function()
	{
		var intervention = new Intervention("Test", 100, 10, false, [1,1,1,1,1,1,1]);
		new_transaction = jasmine.createSpy();
		purchase_intervention(intervention);
		it("Modifies the intervention to reflect that it has been purchased", function()
		{
			expect(intervention.is_implemented).toBeTruthy();
		});
		it("Records the cost of the intervention", function()
		{
			expect(new_transaction).toHaveBeenCalled();
		});
	});
	describe("disregard_intervention", function()
	{
		var intervention = new Intervention("Test", 100, 10, true, [1,1,1,1,1,1,1]);
		disregard_intervention(intervention);
		it("Correctly modifies the intervention to reflect that it is no longer used", function()
		{
			expect(intervention.is_implemented).toBeFalsy();
		});
	});
	describe("implementChosenIntervention", function()
	{
		it("Returns -1 if what's passed in is not an intervention", function()
		{
			expect(implementChosenIntervention(game, "Test")).toEqual(-1);
		});
		it("Purchases the valid intervention", function()
		{
			purchase_intervention = jasmine.createSpy();
			implementChosenIntervention(game, "Cultural Ambassador");
			expect(purchase_intervention).toHaveBeenCalled();
		});	
		it("Calls reduce_percentage for a valid intervention", function()
		{
			reduce_percentages = jasmine.createSpy();
			implementChosenIntervention(game, "Cultural Ambassador");
			expect(reduce_percentages).toHaveBeenCalled();
		});	
	});
	describe("disregardChosenInterventions", function()
	{
		load_globals(game);
		
		it("Finds the intervention", function()
		{	
			getChosenIntervention = jasmine.createSpy();
			disregard_intervention = jasmine.createSpy();
			disregardChosenIntervention(game, "Face to face meetings");
			expect(getChosenIntervention).toHaveBeenCalled();
			expect(disregard_intervention).toHaveBeenCalled();
		});
	});
	describe("getChosenIntervention", function()
	{
		load_globals(game);
		var result = getChosenIntervention(game, "Face to face meetings");
		it("Returns the intervention if the name passed in matches", function()
		{
			expect(game.interventions).toBeDefined();
			expect(result).toEqual(game.interventions[0]);
		});
		var result_fake = getChosenIntervention(game, "Test");
		it("Returns -1 if the intervention name doesn't match any interventions", function()
		{
			expect(result_fake).toEqual(-1);
		});
	});
	describe("reduce_percentages", function()
	{	
		var changes = [0.1,0.2,0.4,0.6,0.5,0,0];
		it("Never reduces a percent's value to < 0.25", function()
		{
			reduce_percentages(changes);
			var percents = percentages;
			for(var i = 0; i < percents.length; i++)
			{
				expect(percents[i]).not.toBeLessThan(0.25);
			}
		});
	});
	describe("get_applicable_interventions", function()
	{
		load_globals(game);
		var problem = new Problem("Module failed to integrate",10, 20,0,1);
		var intervention = { name : 'Face to face meetings', init_cost : 5000, daily_cost : 150, is_implemented : false, affects : [ 1, 1, 1, 1, 1, 1, 1 ] };
		it("Returns a list of applicable interventions", function()
		{
			expect(get_applicable_interventions(game, problem)[0]).toEqual(intervention);
		});
	});

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
});
describe("Problem Simulator", function()
{
	it("checks to make sure the fail value used to calculate problems is valid", function()
	{
			for(var i = 0; i < 10; i++)
			{
				var fail = problemSim(game);
			}
		expect(fail).toBeLessThan(1);
		expect(fail).toBeGreaterThan(-0.1);

	});

});

describe("Problem Percentage Generator", function()
{
	it("checks to make sure the function generates appropriate percentages in the range we want", function()
	{
		var percentagesToTest = generateProblemPercentages();
		for(var i = 0; i < percentagesToTest.length; i++)
		{
			expect(percentagesToTest[i]).toBeLessThan(0.71);
			expect(percentagesToTest[i]).toBeGreaterThan(-0.1);
		}

	});

});

describe("encounteredProblems", function()
{
	//TODO
});

describe("Moral Interventions", function()
{
	describe("get_moral_impact", function()
	{
		var game = new GameState(1);
		load_globals(game);
		var m = new MoralIntervention("Test", 1000, 30);
		m.sites_implemented = {"New York":0, "Shanghai":3};
		var result = get_moral_impact(m, "New York");
		var result2 = get_moral_impact(m, "Shanghai");
		it("Leaves the original impact as is, if site hasn't implemented it at all", function()
		{
			expect(result).toEqual(m.init_impact);
		});
		it("Reduces the impact of an intervention is it has been implemented by a site before", function()
		{
			expect(result2).toEqual(15);
		});
	});
	describe("update_moral_dictionary", function()
	{
		var m = new MoralIntervention("Test", 1000, 10);
		m.sites_implemented = {};
		update_moral_dictionary(m, "New York");
		update_moral_dictionary(m, "Shanghai");
		update_moral_dictionary(m, "Shanghai");
		it("Sets a site's value to 0 if they are not yet added", function()
		{
			expect(m.sites_implemented["New York"]).toEqual(1);
		});
		it("Increments the site's value correctly", function()
		{
			expect(m.sites_implemented["Shanghai"]).toEqual(2);
		});
		
	});
	describe("purchaseMoralIntervention", function()
	{
		//TODO
	});
	describe("set_moral", function()
	{
		//TODO
	});
	describe("showMoralInterventions", function()
	{
		//TODO
	});
	describe("implementChosenMoralIntervention", function()
	{
		//TODO
	});
	describe("parseDetails", function()
	{
		//TODO
	});
});
