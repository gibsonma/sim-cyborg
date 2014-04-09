// Game object structs defined in state.js

//A function that takes a scenario and displays
//a vex dialog box containing the details of said scenario
function displayScenarioValues(scenNum)
{
    if(isNaN(scenNum))return -1;
    var game = GAME_DATA.gs, items = [], result = '', module, site;
    for(var i = 0; i < game.sites.length; i++)
    {
        site = game.sites[i];
        items[i] = '<br>' + site.name + ' : ' + getSiteWorkers(site) + ' Developers';
        items[i] += '<br>Development Method: ' + site.development_type;
		items[i] += '<br> Modules: ';
        for(var j = 0; j < site.modules.length; j++)
        {
            module = site.modules[j];
            items[i] += '<br>' + module.name + ' : ' + getEffortForModule(module) + ' effort points';	
        }
        items[i] += '<br>';
        result += items[i];
    }	
    GAME_DATA.ticker.pause();//Pause the game
    vex.dialog.confirm({
        message: '<p>You have picked Scenario '+scenNum + '</p>' + 
        '<p>Sites:' + result + '</p>' + 
        '<p>Expected Annual Revenue: $' + game.revenue + '</p>' +
        '<p>Starting Capital: $'+ game.capital+'</p>',
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}

//Given a module, player function will calculate how much effort will be required to complete it
//by summing up the expected total of its tasks and returning it
//Ask user which scenario they want
//Load details of chosen scenario
//Call setupGame with chosen scenario

function setupGame(scene, setting)
{
    GAME_DATA.scene = scene;
    GAME_DATA.gs = new GameState(setting);
    load_globals(GAME_DATA.gs);
    generateProblemPercentages()
    GAME_DATA.ticker = scene.Ticker(simpleTick, { tickDuration: MILLIS_PER_FRAME });
    GAME_DATA.ticker.run();
    displayScenarioValues(setting);
    setLocalTime(GAME_DATA.gs.sites, get_home_site(GAME_DATA.gs.sites));
    if ($("#report").length != 0)$("#report").remove();
}

//The home site's time is known to be 0:00 at the start of the simulation. Then, going through each site and comparing their timezone to the home sites, each site's local time can be found and set
function setLocalTime(sites, homeSite)
{

	var homeZone = homeSite.timezone, difference = 0;
    for(var i = 0; i < sites.length; i++)
    {
        site = sites[i];
        if(site != homeSite)
        {
            difference = homeZone[0] - site.timezone[0];
            if(difference > 0)site.local_time = TIME_CLOCK[TIME_CLOCK.length - difference]; 
            else if(difference < 0)site.local_time = TIME_CLOCK[-difference];   
        }

    }
}

function simpleTick(ticker)
{
    // Ticker only allows for calling afunction taking just the ticker as an argument so need a getGameState() function to allow us access to the game state object.
    // Not sure how to structure player, maybe use a class?
    // Increment current time
    // Todo: Decide how to represent time
    TICKS_PASSED += ticker.lastTicksElapsed;

    update_tileview(GAME_DATA.gs);

    if (TICKS_PASSED >= TICKS_PER_UNIT_TIME) {
        incrementTime(GAME_DATA.gs);
        display_game_time(GAME_DATA.gs);
        display_gold(GAME_DATA.gs);
        update_worker_images(GAME_DATA.gs, GAME_DATA.current_site);
        TICKS_PASSED = 0;

        if (GAME_DATA.gs.current_time % 24 == 0){
            daily_transactions();
        }
        if (check_if_completed(GAME_DATA.gs)){
            if (GAME_DATA.gs.current_time < 24) daily_transactions();
            GAME_DATA.ticker.pause();
            display_final_score(GAME_DATA.gs);
        }
    }
    update(GAME_DATA.gs);
}
function update_modifiers(player)
{
    player.sensitivity_mod = 1 + (player.sensitivity/10);
    player.perception_mod  = 1 + (player.perception/10);
    player.empathy_mod = 1 + (player.empathy/10);
    player.charisma_mod = 1 + (player.charisma/20);
    player.intelligence_mod = 1 + (player.intelligence/20);
    player.assertiveness_mod = 1 +  (player.assertiveness/20);
    player.luck_mod = player.luck*10;

    return player;
}

function update_worker_images(gs, current_site)
{
    var morale_level = retrieve_current_morale(gs.sites[current_site])
    var morale_class = "neutral"
    switch (morale_level) {
        case "Great":
            morale_class = "happy";
            break;
        case "Good":
            morale_class = "neutral";
            break;
        case "Okay":
            morale_class = "worried";
            break;
        case "Bad":
            morale_class = "sad";
            break;
        case "Terrible":
            morale_class = "angry";
            break;
    }

    if ($('.workerImages>img.' + morale_class).is(':hidden')) {
        $('.workerImages>img:not(.' + morale_class + ')').hide();
        $('.workerImages>img.' + morale_class).show();
    };
    
    return morale_class;
}

function display_gold(gs){
    $("#gold").html("<h3>&#36;"+Math.round(gs.capital*100)/100+"</h3>");
}

function incrementTime(gs){
    gs.current_time ++;
    gs.time["Current Hour"]++;
    if (gs.time["Current Hour"] >= 24)
	{
		gs.time["Current Hour"] = 0;
		days_since_morale_warning++;
		varySiteMorale(gs);
	}
    incrementLocalTimes(gs);
}
//Goes through each site and updates its local time
function incrementLocalTimes(gs)
{
    for(var i = 0; i < gs.sites.length; i++)
    {
        gs.sites[i].local_time++;
        if (gs.sites[i].local_time >= 24)gs.sites[i].local_time = 0;
        if (gs.sites[i].local_time < 10) {
            gs.sites[i].time_padder = "0";
        } else {
            gs.sites[i].time_padder = "";
        }
    }
}

function display_final_score(gs){
    var stats = new report(gs);
    var html = "<h2>End of Game Report</h2>";
    html += '<canvas id="finance_graph" width="520" height="300"></canvas>';
    html += "<table id=\"end_of_game_table\">";
    html += '<div id="finance_legend"></div>';
    html += tabled("Final score: ", Math.round(stats.final_score));
    html += tabled("Expected project length: ",  stats.expected_months_str);
    html += tabled("Actual project length: ",  stats.months_str);
    html += tabled("Starting capital: ", "$" + gs.starting_capital);
    html += tabled("Capital reamining: ",  "$" + Math.round(gs.capital*10)/10);
    html += tabled("Total workers: ", number_assigned_workers());
    html += "<br>";
    html += tabled("Expected expenditure: ", "$" + stats.expected_expenditure);
    html += tabled("Actual expenditure: ", "$" + stats.actual_expenditure);
    html += tabled("Expected revenue: ", "$" + stats.expected_revenue);
    html += tabled("Actual revenue: ", "$" + stats.actual_revenue);
    html += "</table>";
    vex.defaultOptions.overlayClosesOnClick = false;

    vex.open({
        content: html,
        afterOpen: function($vexContent){
            graph_financial_log();
            if ($("#report").length == 0){
                $("#dialog_box_controls").append("<button id=\"report\">End of game report</button>");
                $('#report').click(function() {
                    display_final_score(GAME_DATA.gs);
                });
            }
        }
    });

}

function graph_financial_log(){
    var gs =GAME_DATA.gs;
    time = []
    capital = []
    for (var i=0; i < gs.financial_log.length ; i++){
        time.push(gs.financial_log[i].time);
        capital.push(gs.financial_log[i].capital);
    }
    var data = {
        labels : time,
        datasets : [
            {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : capital,
            title: 'Capital'
        },
        ]
    }
    var ctx = $("#finance_graph").get(0).getContext("2d");
    new Chart(ctx).Line(data,{
        bezierCurve:false,
        pointDot:false,
        scaleOverride:false,
        scaleSteps:10,
        scaleStepWidth: 10,
        scaleStartValue: 0,
        datasetStrokeWidth : 4
    });
    legend(document.getElementById("finance_legend"), data);
}

var tileView;

function update_tileview(gs) {
    if (tileView) {
        tileView.update();
        $('.current-site').removeClass('current-site');
        $('.site_tile').eq(GAME_DATA.current_site).addClass('current-site');    
    }
}

function display_game_time(gs){
    var daysRemaining = calculate_days_remaining(gs);
    if (daysRemaining < 0) {
        daysRemaining = "0 (Overdue!)";
    }
    if(gs.time["Current Hour"] % 24 == 0)
        {
            gs.time["Days Passed"]++;
        }
        var curHour = gs.time["Current Hour"];
        if (curHour < 10) {
            curHour = "0" + curHour;
        }
        $("#time").html("<h3>Days Passed: "+gs.time["Days Passed"]+ " Current Time "+ curHour +":00"+"</h3>");
        $("#time").append("<h3>Estimated days remaining: " + daysRemaining + "</h3>");
}

function calculate_days_remaining(gs) {
    var stats = new report(gs);
    var effort_per_day = gs.developer_effort * gs.developer_working_hours * number_assigned_workers();
    var remainingEffort = stats.expected_effort - stats.actual_effort;
    return Math.floor(remainingEffort / effort_per_day);
}

// Example 'module.update()' function
// Having each module implement its own update() allows for modular behaviour
function update(gs)
{
    problemSim(gs);
    intervention(gs);
    for (var i=0; i < gs.sites.length; i++){
        var site = gs.sites[i];
        /* waterfall needs to be done in stages, so each module can only go onto the next task
         * * once every other module is on the same level (has the same number of tasks done) */
        var lowest_lifecycle = module_lifecycle_stage(site);
        if (should_be_working(site, gs) && lowest_lifecycle != -1){
            for (var j=0; j < site.modules.length; j++){
                var module = site.modules[j];
                switch (site.development_type) {
                    case "Waterfall":
                        if (lowest_lifecycle < module.tasks.length){
                        var task = module.tasks[lowest_lifecycle];
                        if (task.completed < task.actual_total){
                            work_on_task(site, module, task);
                        }
                    }
                    break;
                    case "Agile":
                        var worked_on_module = false;
                    for (var k=0; k < module.tasks.length; k++){
                        var task = module.tasks[k];
                        if (task.completed < task.actual_total && worked_on_module == false){
                            work_on_task(site, module, task);
                            worked_on_module = true;
                        }
                    }
                    break;
                }
            }
        }
    }
}

function work_on_task(site, module, task){
    var gs = GAME_DATA.gs;
    var work_done = module.assigned*(gs.developer_effort*(site.morale/100))/TICKS_PER_UNIT_TIME;
    task.completed += work_done;
    if (task.completed > task.actual_total) task.completed = task.actual_total;
    task.completion_log.push(100*completed_hours_for_task(module, task)/hours_for_task(module, task));
}
