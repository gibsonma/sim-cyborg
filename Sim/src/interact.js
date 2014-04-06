//Passed in a number, +/- add that onto TICKS_PER_UNIT_TIME
//Recalculate speed and enable/disable any necessary buttons
function updateSpeedLabel(number_change) {
	TICKS_PER_UNIT_TIME += number_change;
	if(TICKS_PER_UNIT_TIME <= 0)TICKS_PER_UNIT_TIME = 1;	
	if(TICKS_PER_UNIT_TIME >= 20)
	{
		$('#time_slower').prop('disabled', true);
		TICKS_PER_UNIT_TIME = 20;
	}
	else $('#time_slower').prop('disabled', false);
    var speed = 1 / (TICKS_PER_UNIT_TIME);
    speed *= 100;
    speed = Math.floor(speed);
	if (speed >= 100)$('#time_faster').prop('disabled', true);
	else $('#time_faster').prop('disabled', false);
    $('#time_speed_label').text(speed);
} 

function implementChosenManagementStyle(gs, tmp)
{
	var chosen_m_style = '';
	if(tmp.indexOf("Laissez Faire") != -1)chosen_m_style = "Laissez Faire";
	else if(tmp.indexOf("Authoritarian") != -1)chosen_m_style = "Authoritarian";
	else if(tmp.indexOf("How Did I get this job?") != -1)chosen_m_style = "How Did I get this job?";
	else chosen_m_style = "No Style";
	switch(chosen_m_style)
	{
		case 'Laissez Faire':
				gs.player.sensitivity = 5; 
				gs.player.perception = 2;
				gs.player.empathy = 5;
				gs.player.charisma = 5;
				gs.player.intelligence = 2; 
				gs.player.assertiveness = 0;
				gs.player.luck = 1;
				gs.player = update_modifiers(gs.player);
				break;
		case 'Authoritarian':
				gs.player.sensitivity = 0; 
				gs.player.perception = 5;
				gs.player.empathy = 0;
				gs.player.charisma = 5;
				gs.player.intelligence = 5;
				gs.player.assertiveness = 5;
				gs.player.luck = 0;
				gs.player = update_modifiers(gs.player);
				break;
		case 'How Did I get this job?':
				gs.player.sensitivity = 5; 
				gs.player.perception = 0;
				gs.player.empathy = 5;
				gs.player.charisma = 5;
				gs.player.intelligence = 0; 
				gs.player.assertiveness = 0;
				gs.player.luck = 5;
				gs.player = update_modifiers(gs.player);
				break;
		case 'No Style':
				
				break;
		default:
			console.log("Invalid Style Passed in");
			break;
	}
	vex.dialog.alert("Select a scenario to start the simulation! <br> Adjust the speed using the Faster & Slower buttons!");
}

function displayManagementOptions(gs)
{
	var options = '<h3> Here Are some Management Styles you can choose from. Each one, bar the last one, impacts how the simulation will turn out, changing things like how lucky you are or how charismatic you are</h3>'; 
	options += '<table class="itable"><tr class="itr"><td class="itd">Name</td><td = class="itd">Description</td><td class ="itd">Select</td></tr>';
	
	options += '<tr class="itr"><td class="itd">Laissez Faire</td><td class="itd">You take a pretty relaxed approach to management, making friends with your employees and having fun. Morale is always high and you understand what is going on in the workplace, so there is no nasty surprises when problems arise!</td><td class="itd"><button id="management-buy">Select Laissez Faire</button></td></tr>'
	
	options += '<tr class="itr"><td class="itd">Authoritarian</td><td class="itd">You Will be Assimilated. Resistance is Futile. An Authoritarian management style with guarantee results, although your employees may resent the attitude you take towards them - morale management will be a high priority. Due to your cold. unfeeling robot heart, you are unable to empathise with your employees, so you may be unaware of brewing trouble in the workplace!</td><td class="itd"><button id="management-buy">Select Authoritarian</button></td></tr>'
	
	options += '<tr class="itr"><td class="itd">How Did I get this job?</td><td class="itd">You seem to have just stumbled into the job, without any real idea of how to manage a project. Thankfully, you have always had good luck, and things seem to always go your way.</td><td class="itd"><button id="management-buy">Select How Did I get this job?</button></td></tr>'
	
	options += '<tr class="itr"><td class="itd">No Management Style</td><td class="itd">You do not wish to adopt a management style, no bonuses or penalties will be applied to the simulation</td><td class="itd"><button id="management-buy">Select No Management Style</button></td></tr>'
	
	options += '</table>';
	
	vex.dialog.confirm({
	  css: {'width':'100%'},
      message: '<p>' + options + '</p>', 
	  buttons: [],
      callback: function(value) {
        return options;
      }
    });
}

function displayCharSheet(gs)
{
        GAME_DATA.ticker.pause();
        var result = 'Character Info: '
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Sensitivity: " + gs.player.sensitivity;
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Perception: " + gs.player.perception;
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Empathy: " + gs.player.empathy;
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Charisma: " + gs.player.charisma;
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Intelligence: " + gs.player.intelligence;
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Assertiveness: " + gs.player.assertiveness;
        result += '<br>&nbsp&nbsp&nbsp&nbsp' + "Luck: " + gs.player.luck;
        vex.dialog.confirm({
        message: '<p>' + result + '</p>' 
        ,
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return result;
        }
    });
}

function completedTasksEmail(site)
{
    GAME_DATA.ticker.pause();
    new_transaction(-500);
    var result = 'Completed Tasks: ';
    var tasks = [];
    var modules = site.modules;
    for(var i = 0; i < modules.length; i++)
    {
        tasks = modules[i].tasks;
        result += '<br><b>' + modules[i].name + '</b> : ';
        for(var j = 0; j < tasks.length; j++)
        {
            if(tasks[j].completed >= tasks[j].actual_total) result += '<br>&nbsp&nbsp&nbsp&nbsp' + tasks[j].name;
        }
    }
    vex.dialog.confirm({
        message: '<p>' + result + '</p>' 
        ,
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}

function inquireAccurate(site)
{
    GAME_DATA.ticker.pause();
    new_transaction(-100);
    var result = [];
    var status = '';

    for(var i = 0; i < site.modules.length; i++){
        var module = site.modules[i];
        var completed = completed_hours_for_module(module);
        var out_of = hours_for_module(module);
        result += '<br> ' + module.name + ' : completed ' + completed + "/" + out_of + " hours";
    }
    vex.dialog.confirm({
        message: '<p>' + result + '</p>',
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}

function inquireCultural(site)
{
    GAME_DATA.ticker.pause();
    new_transaction(-100);
    var result = '';
    var status = 'On Schedule';
    var modules = site.modules;
    for(var i = 0; i < modules.length; i++)
    {
        result += '<br> ' + modules[i].name + ' : ' + status;
    }
    vex.dialog.confirm({
        message: '<p>' + result + '</p>'
        ,
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}

function showEmailResponsePositive()
{
    GAME_DATA.ticker.pause();//Pause the game
    vex.dialog.confirm({
        message: '<p>Everything is on schedule at this site.</p>',
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}

function showEmailResponseNegative()
{
    GAME_DATA.ticker.pause();//Pause the game
    vex.dialog.confirm({
        message: '<p>We are behind at this site.</p>',
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}

function showEmailResponseCritical()
{
    GAME_DATA.ticker.pause();//Pause the game
    vex.dialog.confirm({
        message: '<p>We have a critical problem at this site.</p>',
        callback: function(value) {
            GAME_DATA.ticker.resume();
            return value;
        }
    });
}


function showHomeSitePopup() {
    var home = get_home_site(GAME_DATA.gs.sites);
    showSpecificSitePopup(site, 0);
}

//Takes a site and updates it displayed total after player inspects it
function update_actual_total(site){
    for (var i=0; i < site.modules.length; i++){
        var module = site.modules[i]
        for (var j=0; j < module.tasks.length; j++){
            var task = module.tasks[j];
            task.total = task.actual_total;
        }
    }
}

//Takes a site and returns a string based on its schedule to render the site tile colour
function statusClass(site) {
    var gs = GAME_DATA.gs;
    if (site.culture.influence === "asian" || site.culture.influence === "russian") {
        return "schedule-ok";
    };
    if(site.critical_problem === true) {
        return "schedule-very-behind";
    }        
    if (site_complete(site)) return;
    if (gs.current_time % 24 == 0 && gs.current_time > 0){
        var actually_completed = actual_effort_completed(site);

        var effort_per_day = gs.developer_effort * gs.developer_working_hours * getSiteWorkers(site);
        var expected_completed = effort_per_day/24 * gs.current_time;
        //console.log("actually: " + actually_completed);
        //console.log("expected: " + expected_completed);
        if (actually_completed != expected_completed){
    //        console.log(JSON.stringify(gs.sites, null, 3));
     //       GAME_DATA.ticker.pause();//Pause the game
        }
        var difference = Math.round(actually_completed - expected_completed);
        site.schedule = difference
    }
    if (site.schedule >= 0) return "schedule-ok"
    else return "schedule-behind";
}

//Takes a site and returns a string representing how the site is on schedule
function on_schedule_str(site){
    if (site_complete(site)) return site.name + " is finished";
    var gs = GAME_DATA.gs;
    var effort_per_day = gs.developer_effort * gs.developer_working_hours * getSiteWorkers(site);
    var weeks = Math.round(Math.abs(site.schedule/(7*effort_per_day)));
    if (site.schedule > 0) return site.name + " is " + weeks + " weeks ahead of schedule";
    else if (site.schedule < 0) return site.name + " is " + weeks + " weeks behind schedule";
    else return site.name + " is dead on schedule";
}

function showSpecificSitePopup(site, cost) {
    GAME_DATA.ticker.pause();
    var popupView;
    vex.open({
        content: '<div id="info-popup"></div>',
        afterOpen: function($vexContent) {
            new_transaction(-cost);//Deduct cost of viewing site
            popupView = new Ractive({
                el: 'info-popup',
                template: TEMPLATES['popupView'],
                data: {
                    site: site,
                    normaliser: normalise_module_name
                }
            });
            for (var i=0; i < site.modules.length; i++){
                var module = site.modules[i];

                var mod_graph_data = {
                    labels: largest_history_labels(module),
                    datasets : task_datasets(module)
                }
                var ctx = $("#"+normalise_module_name(module)).get(0).getContext("2d");
                new Chart(ctx).Line(mod_graph_data,{
                    bezierCurve:false,
                    pointDot:false,
                    scaleOverride:false,
                    scaleSteps:10,
                    scaleStepWidth: 10,
                    scaleStartValue: 0
                });
                legend(document.getElementById("legend"), mod_graph_data);
            }
        },
        afterClose: function() {
            GAME_DATA.ticker.resume();
        }
    });
}

function task_datasets(module){
    var datasets = [];
    for (var i=0; i < module.tasks.length; i++){
        var task = module.tasks[i];
        var task_data = [];
        for (var j=0; j < task.completion_log.length; j++){
            task_data.push(task.completion_log[j]);
        }
        var color = "hsl(" + i*50 + ", 50%, 50%)";
        datasets.push({
            fillColor : "rgba(151,187,205,0.0)",
            strokeColor : color,
            pointColor : color,
            pointStrokeColor : "#fff",
            data : task_data,
            title: task.name
        });
    }
    return datasets;
}

function largest_history_labels(module){
    longest = 0;
    for (var i=0; i< module.tasks.length; i++){
        var task = module.tasks[i];
        if (task.completion_log.length > longest) longest = task.completion_log.length;
    }
    labels = []
    for (var cnt=0; cnt < longest+1; cnt++){
        labels.push('');
    }
    return labels;
}

function normalise_module_name(module){
    return (module.name).replace(' ','');
}
