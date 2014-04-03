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

describe("Estimation: Waterfall, site:1, module:1, extra workers", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 3, 100),
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
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(156);
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 3, 100),
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
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(96);
    });
});

describe("Estimation: Agile, site:1, module:1, extra workers", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Agile", true, [
                module_builder("Middle End", 3, 100),
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
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(156);
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Poland", "Agile", true, [
                module_builder("Middle End", 3, 100),
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
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(96);
    });
});

describe("Estimation: Waterfall, site:1, module:2, equal workers", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 1, 100),
                module_builder("Lol End", 1, 100),
            ]), 
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
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(216)
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 1, 100),
                module_builder("Lol End", 1, 100),
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
        for (var i=0; i< 24; i++){
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
            GAME_DATA.ticker.lastTicksElapsed ++;
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toBeDefined();
    });
});

describe("Estimation: Waterfall, site:1, module:2, unequal work amount", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 1, 100),
                module_builder("Lol End", 1, 240),
            ]),
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
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(480);
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 1, 100),
                module_builder("Lol End", 1, 240),
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
        for (var i=0; i< 48; i++){
        GAME_DATA.gs.sites[0].morale = 100;
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
            GAME_DATA.ticker.lastTicksElapsed ++;
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(128);
    });
});

describe("Estimation: Agile, site:1, module:2, equal workers", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 1, 100),
                module_builder("Lol End", 1, 100),
            ]), 
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
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(216)
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 1, 100),
                module_builder("Lol End", 1, 100),
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
        for (var i=0; i< 24; i++){
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
            GAME_DATA.ticker.lastTicksElapsed ++;
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(128);
    });
});

describe("Estimation: Waterfall, site:1, module:2, unequal workers", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 3, 50),
                module_builder("Lol End", 2, 200),
            ]), 
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
        setupGame(sjs.Scene({w:1, h:1}), sites);
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(540)
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Poland", "Waterfall", true, [
                module_builder("Middle End", 3, 50),
                module_builder("Lol End", 2, 200),
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
        for (var i=0; i< 24; i++){
            simpleTick(GAME_DATA.ticker); //call updated ticker each time
            GAME_DATA.ticker.lastTicksElapsed ++;
        }
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(320);
    });
});
describe("Estimation: Agile, site:1, module:2, unequal workers", function()
{
    it("Check sum tasks", function()
    {
        sites = [
            site_builder("Dublin", "Agile", true, [
                module_builder("Middle End", 3, 50),
                module_builder("Lol End", 2, 200),
            ]), 
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
        setupGame(sjs.Scene({w:1, h:1}), sites);
        expect(Math.round(sum_tasks(GAME_DATA.gs.sites[0]))).toEqual(540)
    });
    it("Check getting task completion", function()
    {
        sites = [
            site_builder("Dublin", "Agile", true, [
                module_builder("Middle End", 3, 50),
                module_builder("Lol End", 2, 200),
            ]),
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
        expect(Math.round(actual_effort_completed(GAME_DATA.gs.sites[0]))).toEqual(160);
    });
});


describe("Check schedule calculators ", function()
{
    it("Schedulecalculator", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(scheduleCalculator(gs)).toEqual(42640);
    });
    it("Sum tasks", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(sum_tasks(gs.sites[0])).toEqual(13440);
    });
    it("Actual effort completed in the game state", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(actual_effort_completed_gs()).toBeDefined();
    });
    it("Actual effort completed in site", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(actual_effort_completed(gs.sites[1])).toBeDefined();
    });
});

describe("Private util funcs to estimation ", function()
{
    it("Remainder", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(remainder(15, 4)).toEqual(1);
    });
    it("Credited completed", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(credited_completed(gs.sites[0].modules[0].tasks[0])).toEqual(0);
    });
    it("Longest task", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect((longest_task(gs.sites[0].modules, 1)).task.name).toEqual("Implementation");
    });
    it("Longest module", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect((longest_module(gs.sites[0])).name).toEqual("Backend");
    });
    it("Hours for longest module", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(hours_for_longest_module(gs.sites[0])).toEqual(1260);
    });
    it("Hours for module", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(hours_for_module(gs.sites[0].modules[0])).toEqual(1260);
    });
    it("Completed hours for module", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(completed_hours_for_module(gs.sites[0].modules[0])).toEqual(0);
    });
    it("Hours for task", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(hours_for_task(gs.sites[0].modules[0], gs.sites[0].modules[0].tasks[0])).toEqual(189);
    });
    it("Hours for longest task", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(hours_for_longest_task(gs.sites[0].modules, 2)).toEqual(126);
    });
    it("Completed hours for task", function()
    {
        setupGame(sjs.Scene({w:1, h:1}), 1 );
        var gs = GAME_DATA.gs;
        expect(completed_hours_for_task(gs.sites[0].modules[0], gs.sites[0].modules[0].tasks[0])).toEqual(0);
    });
});
