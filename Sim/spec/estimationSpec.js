describe("Agile - 1 site - 1 module", function()
{
   /* it("Check sum tasks", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 2 );
        GAME_DATA.ticker.pause();
        sites = [
            site_builder("Poland", "Agile", true, [
                module_builder("Middle End", 1, 32),
            ])
        ];
        for (var i=0; i< sites.length; i++){
            var site = sites[i];
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];
                for (var k=0; k < module.tasks.length; k++){
                    var task = module.tasks[k];
                    task.actual_total = task.total;
                }
            }
        }
        gs = new GameState(sites);
        GAME_DATA.gs.sites = sites;
        expect(Math.round(sum_tasks(gs.sites[0]))).toEqual(52);
    });
    it("Check getting task completion", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 2 );
        GAME_DATA.ticker.pause();
        sites = [
            site_builder("Poland", "Agile", true, [
                module_builder("Middle End", 1, 32),
            ])
        ];
        for (var i=0; i< sites.length; i++){
            var site = sites[i];
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];
                for (var k=0; k < module.tasks.length; k++){
                    var task = module.tasks[k];
                    task.actual_total = task.total;
                }
            }
        }
        GAME_DATA.gs.sites = sites;
        for (var i=0; i< 24; i++){
            update (GAME_DATA.gs);
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(32);
    });*/
});
