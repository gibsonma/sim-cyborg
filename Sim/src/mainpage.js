var TEMPLATES = {};
var scene, background, site_images, office;
window.onload = function() {
    

    var game_height = window.innerHeight - 5;
    var game_width = window.innerWidth;
    scene = sjs.Scene({
        w: game_width,
          h: game_height
    });
    site_images = ['img/EmptyOffice.jpeg', 'img/Office2.jpg', 'img/Office3.jpg'];
    // var exec_list = document.getElementById('exec_list');
    background = scene.Layer('background');
    scene.loadImages(site_images, function() {
        office = background.Sprite('img/EmptyOffice.jpeg');
        office.position(0, 0);
        office.transformOrigin(0, 0);
        office.scale(office.scene.w / office.imgNaturalWidth, office.scene.h / office.imgNaturalHeight);            
        office.update();
    });
    GAME_DATA.gs = new GameState(1);
    load_globals(GAME_DATA.gs);
    vex.dialog.alert("Select a scenario to start the simulation!");
    $(document).ready(function() {
        $('#scenario_1').click(function() {
            setupGame(scene,1);
            renderTileview();
        });
        $('#scenario_2').click(function() {
            setupGame(scene,2);
            renderTileview();
        });
        $('#scenario_3').click(function() {
            setupGame(scene,3);
            renderTileview();
        });
		$('#options').click(function() {
			if(GAME_DATA.ticker)displayInterventions(GAME_DATA.gs);
		});
        $.get('src/templates/tileview.html', function(template) {
            TEMPLATES['tileview'] = template;
            renderTileview();
        });
        $.get('src/templates/popupView.html', function(template) {
            TEMPLATES['popupView'] = template;
        });
        $('.site_tile').hide();
        if (TICKS_PER_UNIT_TIME <= 2) {
            $('#time_faster').prop('disabled', true);
        };
        updateSpeedLabel();
        $('#time_slower').click(function() {
            TICKS_PER_UNIT_TIME += 1;
            $('#time_faster').prop('disabled', false);
            updateSpeedLabel();
        });
        $('#time_faster').click(function() {
            if (TICKS_PER_UNIT_TIME === 3) {
                $('#time_faster').prop('disabled', true);
            };
            TICKS_PER_UNIT_TIME -= 1;
            updateSpeedLabel();
        });
		
    });
};

//Tracks when the player selects an intervention
$('body').on('click', '#intervention', function(){ 
	var tmp = $(this).context.innerHTML;
	console.log(tmp);
	implementChosenIntervention(GAME_DATA.gs, tmp);
} );
//Tracks when the player selects an intervention
$('body').on('click', '#intervention-sell', function(){ 
	var tmp = $(this).context.innerHTML;
	console.log(tmp);
	disregardChosenIntervention(GAME_DATA.gs, tmp);
} );


function updateSpeedLabel() {
    var speed = 1 / (TICKS_PER_UNIT_TIME);
    speed *= 100;
    speed = Math.floor(speed);
    $('#time_speed_label').text(speed);
} 

var tileView;
//Iterate through sites and create an array which corresponds to each site's local time
//Pass that in and have it displayed
function renderTileview() {

    if (TEMPLATES['tileview']) {
        tileView = new Ractive({
            el: 'tiled_view',
            template: TEMPLATES['tileview'],
            data: {
                state: GAME_DATA.gs,
            statusClass: statusClass,
            currentTask: currently_doing_which_task,
            progress: progress_on_current_task,
            current_total: total_of_current_task
            }
        });
        var home = get_home_site(GAME_DATA.gs.sites);
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup').hide();
        $('.site_tile').find('.info-popup-nonhome.name').hide();
        $('.site_tile').find('.info-popup-email').hide();
        $('.site_tile').find('.info-popup-status').hide();
        $('.site_tile').find('.info-popup-tasks').hide();                  
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup-nonhome.name').toggle();
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup-email').toggle();
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup-status').toggle();     
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup-tasks').toggle();      
        $('.site_tile>.info-popup').click(function() {
            update_actual_total(home);
            showHomeSitePopup();
        });
        $('.site_tile>.info-popup-nonhome').click(function() {
            var siteName = $(this).parent().attr('data-name');
            var site = getSiteByName(siteName, GAME_DATA.gs);
            update_actual_total(site);
            showSpecificSitePopup(site,1000);
        });
        $('.site_tile>.info-popup-email').click(function() {
            var siteName = $(this).parent().attr('data-name');
            var siteStatus = $(this).parent().attr('class');
            var site = getSiteByName(siteName, GAME_DATA.gs);
            if(site.culture.influence == "asian" || site.culture.influence == "russian")
			{
				showEmailResponsePositive();
			} 
				else if(siteStatus == 'site_tile schedule-ok')
			{
				showEmailResponsePositive();

			}
				else if(siteStatus == 'site_tile schedule-behind')
			{
				showEmailResponseNegative();
			}
				else
			{
				showEmailResponseCritical();

			}
        });
        $('.site_tile>.info-popup-status').click(function() {
            var siteName = $(this).parent().attr('data-name');
            var site = getSiteByName(siteName, GAME_DATA.gs);
            if(site.culture.influence == "asian" || site.culture.influence == "russian")
        {
            inquireCultural(site);//function for all ok
        }
            else
        {
            inquireAccurate(site);//function for accurate
        }
        });
        $('.site_tile>.info-popup-tasks').click(function() {
            console.log("Clicked");
			var siteName = $(this).parent().attr('data-name');
            var site = getSiteByName(siteName, GAME_DATA.gs);
            completedTasksEmail(site);
        });
		
        $('.site_tile').each(function(i) {
            var $el = $(this);
            $el.find('button').click(function() {
                office = background.Sprite(site_images[i] || site_images[0]);
                office.transformOrigin(0, 0);
                office.scale(office.scene.w / office.imgNaturalWidth, office.scene.h / office.imgNaturalHeight);            
                office.update();
            });
        });
		
		
    }
};

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
        for(var j = 0; j < tasks.length; j++)
        {
            if(tasks[j].completed >= tasks[j].actual_total) result += '<br>' + tasks[j].name;
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
    var modules = site.modules;
    for(var i = 0; i < modules.length; i++)
    {
        if(statusClassModules(modules[i]) == 'on-schedule') status = 'On Schedule';
        else status = 'Behind Schedule';
        result += '<br> ' + modules[i].name + ' : ' + status;
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
    GAME_DATA.ticker.pause();
    var popupView;
    vex.open({
        content: '<div id="info-popup"></div>',
        afterOpen: function($vexContent) {
            popupView = new Ractive({
                el: 'info-popup',
            template: TEMPLATES['popupView'],
            data: {
                site: get_home_site(GAME_DATA.gs.sites) //Object passed into popUpView
            }
            });
        },
        afterClose: function() {
            GAME_DATA.ticker.resume();
        }
    });

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
                          site: site
                      }
            });
        },
        afterClose: function() {
            GAME_DATA.ticker.resume();
        }
    });

}

function update_actual_total(site){
    for (var i=0; i < site.modules.length; i++){
        var module = site.modules[i]
        for (var j=0; j < module.tasks.length; j++){
            var task = module.tasks[j];
            task.total = task.actual_total;
        }
    }
}

function statusClass(site) {
    var gs = GAME_DATA.gs;
    if (site.culture.influence === "asian" || site.culture.influence === "russian") {
        return "schedule-ok";
    };
    if(site.critical_problem === true) {
        return "schedule-very-behind";
    }        
    if (gs.current_time % 24 == 0){
        var actually_completed = actual_effort_completed(site);

        var effort_per_day = gs.developer_effort * gs.developer_working_hours * getSiteWorkers(site);
        var expected_completed = effort_per_day * gs.current_time/24;
        //console.log("actually: " + actually_completed);
        //console.log("expected: " + expected_completed);

        if (actually_completed >= expected_completed) site.state = "schedule-ok"
        else site.state = "schedule-behind";
    }
    return site.state;
}

function statusClassModules(m){
    var averageCompletion = 0;
    for (var i = m.length - 1; i >= 0; i--) {
        var module = m[i];
        var moduleCompletionAvg = 0;
        for (var i = module.tasks.length - 1; i >= 0; i--) {
            var task = module.tasks[i];
            if (task.completed <= 0) {
                continue;
            }
            var actual_completion = task.completed / task.actual_total;
            var expected_completion = task.completed / task.total;
            var completion_difference = actual_completion / expected_completion;
            moduleCompletionAvg += completion_difference;
        };
        moduleCompletionAvg = moduleCompletionAvg / module.tasks.length;
        averageCompletion += moduleCompletionAvg;
    };
    averageCompletion = averageCompletion / m.length;

    // averageCompletion of 1.0 means we are dead on target. <1.0 means behind, >1.0 we're ahead of schedule.
    if(averageCompletion == 0) return "schedule-ok"; //temp fix for initial completion bug
    if (averageCompletion >= 1.0) {
        return "schedule-ok";
    } 
    else {
        return "schedule-behind"
    }
}
