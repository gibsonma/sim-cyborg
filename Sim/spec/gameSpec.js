beforeEach(function()
{
	vex.closeAll();
	spyOn(vex, 'dialog');
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
		expect(scheduleCalculator(game)).toEqual(37000);
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

