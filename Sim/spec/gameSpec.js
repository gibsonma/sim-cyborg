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

describe("scheduleCalculator", function()
{
    var setting = 1;
    var game = new GameState(setting);

	it("Should be passed a defined game state", function()
	{
		expect(game).toBeDefined();
	});
	it("Returns a number greater than 0 for the total effort", function()
	{
		expect(scheduleCalculator(game)).toBeGreaterThan(0);
	});
});

describe("problemSimulator", function()
{
    var setting = 1;
    var game = new GameState(setting);

    it("Calls the chooseArray helper function", function()
    {
        expect(chooseArray(game.sites, game.modules)).toBeDefined();
    });
    it("Doesn't return a value", function()
    {
		expect(problemSimulator(game.sites, game.modules)).not.toBeDefined();
    });
});

describe("chooseArray", function()
{
    var setting = 1;
    var game = new GameState(setting);

	it("Returns a number as the index", function()
	{
		expect(chooseArray(game.sites, game.modules)[0]).toEqual(jasmine.any(Number));
	});
	it("Returns one of the arrays passed to it", function()
	{
		expect(chooseArray(game.sites, game.modules)[1].length).toEqual(jasmine.any(Number));
	});
});

describe("Update game state", function (){
    var setting = 1;
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
            for (var j=0; j < siteUpdated.working_on.length; j++){
                var moduleUpdated = siteUpdated.working_on[j];
                var moduleOld = siteOld.working_on[j];
                for (var k=0; k < moduleUpdated.tasks.length; k++){
                    var taskUpdated = moduleUpdated.tasks[k];
                    var taskOld = moduleOld.tasks[k];
                    expect(taskOld.completed).toBeLessThan(taskUpdated.completed);
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

