describe("game object", function() {
	var game = new GameState();
    it("checks if sites are properly set", function() {
        expect(game.sites).not.toBeNull();
    });
     it("checks if time is properly set", function() {
        expect(game.current_time).not.toBeNull();
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
    var initGame = init_GameState();
    	it("checks if the init returns a properly defined object", function() {
    	expect(initGame).toBeDefined();
    });
      var updatedGame = new GameState();
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
        GAME_DATA.scene = sjs.Scene({w:1, h:1}); //make this invisible
        setupGame();
        var oldTime = GAME_DATA.gs.current_time;
        for(var i = 0; i < 31; i++){
          GAME_DATA.ticker.lastTicksElapsed = 1; //simulate 30 ticks in realtime
          simpleTick(GAME_DATA.ticker); //call updated ticker each time
        }
        var newTime = GAME_DATA.gs.current_time;
        expect(oldTime).toBeLessThan(newTime);
      });

});
describe("Problem Simulator", function()
{
	var a = new Task("Task A", 10);
	var b = new Task("Task B", 5);
	var c = new Task("Task C", 2);
	var d = new Task("Task D", 2);
	var e = new Task("Task E", 2);
	var f = new Task("Task F", 2);
	var taskListA = [a,b,c];
	var taskListB = [d,e,f];
	var siteA = new Site("Site A", 0, 0, 0, 0, 0);
	var siteB = new Site("Site B", 0, 0, 0, 0, 0);
	siteA.working_on = taskListA;
	siteB.working_on = taskListB;
	var modA = new Module("Mod A", taskListB);
	var modB = new Module("Mod B", taskListB);
	var siteList = [siteA, siteB];
	var moduleList = [modA, modB];
	
	it("Calls the chooseArray helper function", function()
	{
		expect(chooseArray(siteList, moduleList)).toBeDefined();
	});
	it("Doesn't return a value", function()
	{
		expect(problemSimulator(siteList, moduleList)).not.toBeDefined();
	});
});

describe("game object with predefined scenario", function() {
  var predef = new GameStatePreDefined(1);
    it("checks if sites are properly set", function() {
        expect(predef.sites).not.toBeNull();
    });
     it("checks if time is properly set", function() {
        expect(predef.current_time).not.toBeNull();
    });
      it("checks if tasks are properly set", function() {
        expect(predef.tasks).not.toBeNull();
    });
      it("checks if real task effort is properly set", function() {
        expect(predef.real_task_effort).not.toBeNull();
    });
       it("checks if development type is properly set", function() {
        expect(predef.development_type).not.toBeNull();
    });
       it("checks if problems are properly set", function() {
        expect(predef.problems).not.toBeNull();
    });
       it("checks if finance is non negative", function() {
        expect(predef.finance).not.toBeLessThan(0);
    });
        it("checks if modules are properly set", function() {
        expect(predef.modules).not.toBeNull();
    });
    var predefInit = init_GameStatePreDefined(1);
      it("checks if the init returns a properly defined object", function() {
      expect(predefInit).toBeDefined();
    });
      var updatedGame = new GameStatePreDefined(1);
      update(updatedGame);
      console.log(GameState_to_json(predefInit));
      console.log(GameState_to_json(updatedGame));
      it("checks if the object updates correctly", function() {
      expect(updatedGame).toBeDefined();
      for (var i=0; i < updatedGame.sites.length; i++){
          var siteUpdated = updatedGame.sites[i];
          var siteOld = predefInit.sites[i];
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

});