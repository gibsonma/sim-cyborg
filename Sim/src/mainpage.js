var TEMPLATES = {};
window.onload = function() {
    var scene, background, site_images, office;

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
    //    setupGame(scene,1);
        $.get('src/templates/tileview.html', function(template) {
            TEMPLATES['tileview'] = template;
            renderTileview();
        });
        $.get('src/templates/popupView.html', function(template) {
            TEMPLATES['popupView'] = template;
        });
	$('.site_tile').hide();
    });
}; 

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
                statusClass: statusClass
            }
        });
        $('.site_tile').not('[data-name="' + GAME_DATA.gs.home_site.name + '"]').find('.info-popup').hide();
        $('.site_tile').find('.info-popup-nonhome').hide();
        $('.site_tile').find('.info-popup-email').hide();
        $('.site_tile').not('[data-name="' + GAME_DATA.gs.home_site.name + '"]').find('.info-popup-nonhome').toggle();
        $('.site_tile').not('[data-name="' + GAME_DATA.gs.home_site.name + '"]').find('.info-popup-email').toggle();
        $('.site_tile>.info-popup').click(function() {
            showHomeSitePopup();
        });
        $('.site_tile>.info-popup-nonhome').click(function() {
            var siteName = $(this).parent().attr('data-name');
            var siteIndex = getIndexOfSiteByName(siteName, GAME_DATA.gs);
            showSpecificSitePopup(siteIndex,1000);
        });
        $('.site_tile>.info-popup-email').click(function() {
            var siteName = $(this).parent().attr('data-name');
            var siteStatus = $(this).parent().attr('class');
            var siteIndex = getIndexOfSiteByName(siteName, GAME_DATA.gs);
            if(GAME_DATA.gs.sites[siteIndex].culture.influence == "asian" || GAME_DATA.gs.sites[siteIndex].culture.influence == "russian")
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
    }
};

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
                    site: GAME_DATA.gs.home_site//Object passed into popUpView
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
                    site: GAME_DATA.gs.sites[site]
                }
            });
        },
        afterClose: function() {
            GAME_DATA.ticker.resume();
        }
    });
    
}

function statusClass(m) {                    
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
