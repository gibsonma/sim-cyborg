describe("Estimation: Agile, site:1, module:1", function()
{
    it("Check sum tasks", function()
    {
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
        setupGame(sjs.Scene({w:1, h:1}), sites );
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(52);
    });
    it("Check getting task completion", function()
    {
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
        setupGame(sjs.Scene({w:1, h:1}), sites );
        for (var i=0; i< 24; i++){
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
            GAME_DATA.ticker.lastTicksElapsed ++;
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(32);
    });
});

describe("Estimation: Waterfall, site:1, module:1", function()
{
    it("Check sum tasks", function()
    {
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
        setupGame(sjs.Scene({w:1, h:1}), sites );
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(52);
    });
    it("Check getting task completion", function()
    {
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
        setupGame(sjs.Scene({w:1, h:1}), sites );
        for (var i=0; i< 24; i++){
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
            GAME_DATA.ticker.lastTicksElapsed ++;
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(32);
    });
});
