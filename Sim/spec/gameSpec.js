beforeEach(function()
{
	vex.closeAll();
	spyOn(vex, 'dialog');
	spyOn(vex.dialog, 'confirm');
	spyOn(vex.dialog, 'alert');
	spyOn(vex.dialog, 'open');
});
afterEach(function()
{
	GAME_DATA.ticker.pause();
});

describe("setupGame", function()
{
	var setting = 1;

	it("Assigns the new game state to GAME_DATA", function()
	{
        setupGame(sjs.Scene({w:1, h:1}), setting );
		expect(GAME_DATA.gs).toBeDefined();
	});
	it("Return a valid game state", function()
	{
        setupGame(sjs.Scene({w:1, h:1}), setting );
		expect(GAME_DATA.gs.sites).toBeDefined();
	});
});

describe("incrementTime", function()
{
	var game = new GameState(1);
	it("Increments the current time", function()
	{
		expect(game.time["Current Hour"]).toEqual(0);
		incrementTime(game);
		expect(game.time["Current Hour"]).toEqual(1);
	});
	it("Resets the time back to 0 when its >= 24", function()
	{
		game.time["Current Hour"] = 24;
		incrementTime(game);
		expect(game.time["Current Hour"]).toEqual(0);
	});
});

describe("display_final_score", function()
{
	var game = new GameState(1);
	it("Calls its helper functions", function()
	{
		number_assigned_workers = jasmine.createSpy();
		display_final_score(game);
		expect(number_assigned_workers).toHaveBeenCalled();
	});
});

describe("display_game_time", function()
{
	var game = new GameState(1);
	game.time["Current Hour"] = 23;
	game.time["Days Passed"] = 10;
	it("Updates the number of days passed correctly", function()
	{
		incrementTime(game);
		display_game_time(game);
		expect(game.time["Current Hour"]).toEqual(0);
		expect(game.time["Days Passed"]).toEqual(11);
	});
});

describe("Update game state", function (){
	
    var setting = 2;
    var initGame = new GameState(setting);
    var updatedGame = new GameState(setting);
    update(updatedGame);
    console.log(GameState_to_json(initGame));
    console.log(GameState_to_json(updatedGame));
    it("checks if the object updates correctly", function() {
        expect(updatedGame).toBeDefined();
        for (var i=0; i < updatedGame.sites.length; i++){
            var siteUpdated = updatedGame.sites[i];
            var siteOld = initGame.sites[i];
			if(should_be_working(siteOld, initGame) && should_be_working(siteUpdated, updatedGame))
			{
				for (var j=0; j < siteUpdated.modules.length; j++){
					var moduleUpdated = siteUpdated.modules[j];
					var moduleOld = siteOld.modules[j];
					for (var k=0; k < moduleUpdated.tasks.length; k++){
						var taskUpdated = moduleUpdated.tasks[k];
						var taskOld = moduleOld.tasks[k];
                        // TODO account for waterfall
						//expect(taskOld.completed).toBeLessThan(taskUpdated.completed);
					}
				}
			}
        }
    });
	
   it("checks if time has advanced properly",function(){
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var oldTime = GAME_DATA.gs.current_time;
        for(var i = 0; i < 31; i++){
            GAME_DATA.ticker.lastTicksElapsed = 1; //simulate 30 ticks in realtime
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
        }
        var newTime = GAME_DATA.gs.current_time;
        expect(oldTime).toBeLessThan(newTime);
    });
});

describe("Displaying Scenario Values", function()
{
	describe("Calculating Effort for each Module", function()
	{
		expModule = new Module("Backend", [new Task("Design",1000), new Task("Implement", 2500), new Task("Test", 3500)]);
		it("Calculates the total effort required to complete a module correctly", function()
		{
			expect(getEffortForModule(expModule)).toEqual(7000);
		});
		it("Returns -1 when an invalid object is passed in", function()
		{
			expect(getEffortForModule("Fake Module")).toEqual(-1);
		});
	});
	/*describe("Get the number of workers per site", function()
	{
		testSite = new Site("New York", (121,43), new Culture("western"), "Agile", TIMEZONE_AMERICA, false);
		testModule = new Module("Backend", [new Task("Design",3000), new Task("Implement", 2500), new Task("Test", 3500)]);
        testModule.tasks[0].assigned = 3;
        testModule.tasks[1].assigned = 5;
        testModule.tasks[2].assigned = 3; 
		testSite.modules[0] = testModule;
		it("Given a site, it returns the correct number of workers", function()
		{
			expect(getSiteWorkers(testSite)).toEqual(11);
		});
	});*/
	it("Returns -1 if not passed a number & Calls the helper functions", function()
	{
		getEffortForModule = jasmine.createSpy();
		getSiteWorkers = jasmine.createSpy();
		displayScenarioValues(1)
		expect(displayScenarioValues("Not a Number")).toEqual(-1);
		expect(getEffortForModule).toHaveBeenCalled();
		expect(getSiteWorkers).toHaveBeenCalled();
	});
});
describe("Checking sprites update properly", function()
{
	var game = new GameState(1);
	load_globals(game);
	it("checks if a sprite morale check return proper morale",function()
	{
		var sprite = update_worker_images(game, 1);
		expect(sprite).not.toBe(null);
	});

});

describe("Checking player updates properly", function()
{
	var player = new Player();
	it("checks if modifers update on stat change",function()
	{
		var p = update_modifiers(player);
		expect(p).not.toBe(null);
	});

});
describe("Setting the local times", function()
{
	var game = new GameState(1);
	beforeEach(function()
	{
		for(var i = 0; i < game.sites.length; i++){
            game.sites[i].local_time = 0;
        }
        get_home_site(game.sites).local_time = 0;
	});
	it("Sets local times correctly when Dublin is the home site", function()
	{
		game.home_site = game.sites[2];
		setLocalTime(game.sites, game.home_site);
		expect(game.home_site.name).toEqual("Dublin");
		expect(game.home_site.local_time).toEqual(0);
		expect(game.sites[0].name).toEqual("New York");
		expect(game.sites[0].local_time).toEqual(17);
		expect(game.sites[1].name).toEqual("Shanghai");
		expect(game.sites[1].local_time).toEqual(9);
	});
	it("Sets local times correctly when New York is the home site", function()
	{
		game.home_site = game.sites[0];
		setLocalTime(game.sites, game.home_site);
		expect(game.home_site.name).toEqual("New York");
		expect(game.home_site.local_time).toEqual(0);
		expect(game.sites[2].name).toEqual("Dublin");
		expect(game.sites[2].local_time).toEqual(7);
		expect(game.sites[1].name).toEqual("Shanghai");
		expect(game.sites[1].local_time).toEqual(16);
	});
	it("Sets local times correctly when Shanghai is the home site", function()
	{
		game.home_site = game.sites[1];
		setLocalTime(game.sites, game.home_site);
		expect(game.home_site.name).toEqual("Shanghai");
		expect(game.home_site.local_time).toEqual(0);
		expect(game.sites[2].name).toEqual("Dublin");
		expect(game.sites[2].local_time).toEqual(15);
		expect(game.sites[0].name).toEqual("New York");
		expect(game.sites[0].local_time).toEqual(8);
	});
});
describe("incrementingLocalTimes", function()
{
	var game = new GameState(1);
	it("Increments time by 1 for each iteration", function()
	{
			game.sites[0].local_time = 10;
			incrementLocalTimes(game);
			expect(game.sites[0].local_time).toEqual(11);
	});
	it("Sets the value back to 0 at 24 to simulate a clock", function()
	{
		game.sites[0].local_time = 26;
		incrementLocalTimes(game);
		expect(game.sites[0].local_time).toEqual(0);
	});
});
describe("calculate_days_remaining", function()
{
	var game = new GameState(1);
	it("Creates a new report to use for its estimation", function()
	{
		report = jasmine.createSpy();
		calculate_days_remaining(game);
		expect(report).toHaveBeenCalled();
	});
});

