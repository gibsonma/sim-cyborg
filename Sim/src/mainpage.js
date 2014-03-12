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

    $(document).ready(function() {
        $.getJSON('data/config_file.json', function(data) {
            $.each(data, append_config);
        });
        $('#site_select').change(function() {
            chosen_site_index = $('#site_select').val();
            office = background.Sprite(site_images[chosen_site_index]);
            office.transformOrigin(0, 0);
            office.scale(office.scene.w / office.imgNaturalWidth, office.scene.h / office.imgNaturalHeight);            
            office.update();
        });
        $('#toggle_debug_btn').click(function() {
            $('#center_content, #toggle_dialog_btn').toggle();
        });
        $('#toggle_dialog_btn').click(function() {
            $('#main_content,#game_state_box').toggle();
        });
        $('#scenario_1').click(function() {
            setupGame(scene,1);
            GAME_DATA.state_dialog = $('#game_state_dump');
            renderTileview();
        });
        $('#scenario_2').click(function() {
            setupGame(scene,2);
            GAME_DATA.state_dialog = $('#game_state_dump');
            renderTileview();
        });
        $('#scenario_3').click(function() {
            setupGame(scene,3);
            GAME_DATA.state_dialog = $('#game_state_dump');
            renderTileview();
        });
        setupGame(scene,1);
        GAME_DATA.state_dialog = $('#game_state_dump');
        $.get('src/templates/tileview.html', function(template) {
            TEMPLATES['tileview'] = template;
            renderTileview();
        });
        $.get('src/templates/popupView.html', function(template) {
            TEMPLATES['popupView'] = template;
        });
        $('#main_content,#game_state_box').toggle();

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
                console.log("ok");
            } 
            else if(siteStatus == 'site_tile schedule-ok')
            {
                console.log("ok");

            }
            else if(siteStatus == 'site_tile schedule-behind')
            {
                console.log("behind");
            }
            else
            {
                console.log("very behind");

            }
        });
    }
};


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

function append_config(key, val){
    if (val !== null && typeof val === "object") {
        $("#main_content").append("<p>" + key + " {</p>");
        $.each(val, append_config);
        $("#main_content").append("<p>}</p>");
    }
    else {
        $("#main_content").append("<p>" + key + " - " + val + "</p>");
    }
};

