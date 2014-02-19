
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

describe("Update game state", function (){
    var initGame = init_GameState(1);
    var updatedGame = new GameState(1);
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
        setupGame(sjs.Scene({w:1, h:1}) );
        var oldTime = GAME_DATA.gs.current_time;
        for(var i = 0; i < 31; i++){
            GAME_DATA.ticker.lastTicksElapsed = 1; //simulate 30 ticks in realtime
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
        }
        var newTime = GAME_DATA.gs.current_time;
        expect(oldTime).toBeLessThan(newTime);
    });
});

