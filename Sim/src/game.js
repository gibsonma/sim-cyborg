// Game object structs defined in state.js

//A function that takes a scenario and displays
//a vex dialog box containing the details of said scenario
function displayScenarioValues(scenNum)
{
	if(isNaN(scenNum))return -1;
	var game = GAME_DATA.gs, sites = '', modules = '', tasks = '', workers = '', capital = game.capital;
	for(var i = 0; i < game.sites.length; i++)
	{
		sites += '<br>' + game.sites[i].name;
		workers += '<br>' + game.sites[i].name + ' : ' + getSiteWorkers(game.sites[i]) + ' Developers';
		modules += '<br>' + game.sites[i].name + ' : ';
		for(var j = 0; j < game.sites[i].working_on.length; j++)
		{
			modules += game.sites[i].working_on[j].name;
			tasks += '<br>' + game.sites[i].working_on[j].name + ' : ' + getEffortForModule(game.sites[i].working_on[j]) + ' Developer Hours';
		}
	}
	GAME_DATA.ticker.pause();//Pause the game
	vex.dialog.confirm({
	  message: '<p>You have picked Scenario '+scenNum + '</p>' + 
	           '<p>Sites:' + sites + '</p>' + 
			   '<p>Number of Developers:' + workers + '</p>' +
			   '<p>Modules:' + modules + '</p>' +
			   '<p>Expected Effort:' + tasks + '</p>' +
			   '<p>Expected Annual Revenue: $' + game.revenue + '</p>' +
			   '<p>Starting Capital: $'+capital+'</p>',
	  callback: function(value) {
		GAME_DATA.ticker.resume();
		return value;
	  }
	});
}

//Ask user which scenario they want
//Load details of chosen scenario
//Call setupGame with chosen scenario

function setupGame(scene, setting)
{
	GAME_DATA.scene = scene;
    GAME_DATA.state_dialog = null;
    GAME_DATA.gs = new GameState(setting);
    load_globals(GAME_DATA.gs);
    GAME_DATA.ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_FRAME });
    GAME_DATA.ticker.run();
    displayScenarioValues(setting);
}

function simpleTick(ticker)
{
    // Ticker only allows for calling afunction taking just the ticker as an argument so need a getGameState() function to allow us access to the game state object.
    // Not sure how to structure this, maybe use a class?
    // Increment current time
    // Todo: Decide how to represent time
    TICKS_PASSED += ticker.lastTicksElapsed;

    if (GAME_DATA.state_dialog !== null) {
        updateGameStateDialog(GAME_DATA.gs);
    }

    if (TICKS_PASSED >= TICKS_PER_UNIT_TIME) {
        incrementTime();
        display_game_time();
        TICKS_PASSED = 0;

        if (GAME_DATA.gs.current_time % 24 == 0){
            daily_transactions();
        }
        if (check_if_completed(GAME_DATA.gs)){
            if (GAME_DATA.gs.current_time < 24) daily_transactions();
            GAME_DATA.ticker.pause();
            display_final_score(gs);
        };
    }
    update(GAME_DATA.gs);
}

function incrementTime(){
    GAME_DATA.gs.current_time ++;
    GAME_DATA.gs.time["Current Hour"]++;
    if (GAME_DATA.gs.time["Current Hour"] >= 24)GAME_DATA.gs.time["Current Hour"] = 0;
}

function display_final_score(gs){
    var stats = new report(gs);
    var html = "<h2>End of Game Report</h2>";
    html += "<h3>Final score: " + Math.round(stats.final_score) +" points</p>";
    html += "<p>You have $" + Math.round(gs.capital*10)/10 + " left</p>";
    html += "<p>You started the game with: $" + gs.starting_capital + "</p>";
    html += "<p>You have " + number_assigned_workers() + " workers</p>";
    html += "<br>";
    html += "<p>Expected effort: " + stats.expected_effort+" developer hours</p>";
    html += "<p>Actual effort: " + stats.actual_effort+" developer hours</p>";
    html += "<p>Expected expenditure: $" + stats.expected_expenditure+"</p>";
    html += "<p>Actual expenditure: $" + stats.actual_expenditure+"</p>";
    html += "<p>Expected revenue: $" + stats.expected_revenue+"</p>";
    html += "<p>Actual revenue: $" + stats.actual_revenue+"</p>";
    html += "<br>";
    vex.dialog.alert(html);
    GAME_DATA.state_dialog.html(html);
}
function updateGameStateDialog(gs) {

    if (tileView) {
        tileView.update('state');    
    }
}

function display_game_time(){
    if(GAME_DATA.gs.current_time % 24 == 0)GAME_DATA.gs.time["Days Passed"]++;
    $("#time").html("<h3>Days Passed: "+GAME_DATA.gs.time["Days Passed"]+ " Current Time "+GAME_DATA.gs.time["Current Hour"]+":00"+"</h3>");
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(gs)
{
    intervention(gs);
    problemSim(gs);
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        /* waterfall needs to be done in stages, so each module can only go onto the next task
         * once every other module is on the same level (has the same number of tasks done) */
        var lowest_lifecycle = module_lifecycle_stage(site); 
        if (should_be_working(site,gs) && lowest_lifecycle != -1){
            for (var j=0; j < site.working_on.length; j++){
                var module = site.working_on[j];
                switch (site.development_type) {
                    case "Waterfall":
                        if (lowest_lifecycle < module.tasks.length){
                            var task = module.tasks[lowest_lifecycle];
                            if (task.completed < task.actual_total){
                                task.completed += task.assigned * gs.waterfall_speedup_modifier * gs.developer_effort/TICKS_PER_UNIT_TIME;
                                if (task.completed > task.actual_total) task.completed = task.actual_total;
                            }
                        }
                        break;
                    case "Agile":
                        for (var k=0; k < module.tasks.length; k++){
                            var task = module.tasks[k];
                            task.completed += task.assigned*gs.developer_effort/TICKS_PER_UNIT_TIME;
                            if(task.completed > task.actual_total) task.completed = task.actual_total;
                        }
                        break;
                }
            }
        }
    }
}

