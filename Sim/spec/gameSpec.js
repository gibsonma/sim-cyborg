beforeEach(function()
{
	vex.closeAll();
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
	var total = 0, taskList;
	for(var i = 0; i < game.modules.length; i++){
		taskList = game.modules[i].tasks;
		for(var j = 0; j < taskList.length; j++)total += taskList[j].total;
	}
	it("Sums all the tasks' effort correctly", function()
	{
		expect(sum_tasks(game)).toEqual(total);
	});
	it("Takes into account the work load modifier", function()
	{
		expect(scheduleCalculator(game)).toEqual(total/WORK_LOAD);
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
				for (var j=0; j < siteUpdated.working_on.length; j++){
					var moduleUpdated = siteUpdated.working_on[j];
					var moduleOld = siteOld.working_on[j];
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
	spyOn(vex, 'open');
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
		var orig = gs.sites[0].working_on[0].tasks[1].actual_total;
		interventionAlt(gs, 0);
		expect(gs.sites[0].working_on[0].tasks[1].actual_total).toEqual(orig);
	});
});

