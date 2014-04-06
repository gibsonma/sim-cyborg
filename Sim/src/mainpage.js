var TEMPLATES = {};
var scene, background, site_images, office;
window.onload = function() {
    var game_height = window.innerHeight - 5;
    var game_width = window.innerWidth;
    scene = sjs.Scene({
        w: game_width,
        h: game_height,
        autoPause: false
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
	displayManagementOptions(GAME_DATA.gs);
    load_globals(GAME_DATA.gs);
    $('#char-Sheet').hide();
    $('#options').hide();
    $(document).ready(function() {
        $('#scenario_1').click(function() {
            setupGame(scene,1);
            renderTileview();
            $('#char-Sheet').show();
            $('#options').show();
        });
        $('#scenario_2').click(function() {
            setupGame(scene,2);
            renderTileview();
            $('#char-Sheet').show();
            $('#options').show();
        });
        $('#scenario_3').click(function() {
            setupGame(scene,3);
            renderTileview();
            $('#char-Sheet').show();
            $('#options').show();
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
        updateSpeedLabel(-1);
        $('#time_slower').click(function() {
            updateSpeedLabel(1);
        });
        $('#time_faster').click(function() {
            updateSpeedLabel(-1);
        });
        $('#char-Sheet').click(function(){
            displayCharSheet(GAME_DATA.gs);
            });
    });
};


//Tracks when the player selects an intervention to buy
$('body').on('click', '#intervention', function(){ 
    var tmp = $(this).context.innerHTML;
    implementChosenIntervention(GAME_DATA.gs, tmp);
} );
//Tracks when the player selects an intervention to sell
$('body').on('click', '#intervention-sell', function(){ 
    var tmp = $(this).context.innerHTML;
    disregardChosenIntervention(GAME_DATA.gs, tmp);
} );
//Tracks when the player selects a morale intervention to buy
$('body').on('click', '#m_intervention', function(){ 
    var tmp = $(this).context.innerHTML;
    implementChosenMoraleIntervention(GAME_DATA.gs, tmp);
} );
//Tracks what management style the player chooses
$('body').on('click', '#management-buy', function(){ 
    var tmp = $(this).context.innerHTML;
    implementChosenManagementStyle(GAME_DATA.gs, tmp);
} );





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
                current_total: total_of_current_task,
                schedule_str: on_schedule_str
            }
        });
        var home = get_home_site(GAME_DATA.gs.sites);
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup').hide();
        $('.site_tile').find('.info-popup-nonhome').hide();
        $('.site_tile').find('.info-popup-email').hide();
        $('.site_tile').find('.info-popup-status').hide();
        $('.site_tile').find('.info-popup-tasks').hide();                  
        $('.site_tile').not('[data-name="' + home.name + '"]').find('.info-popup-nonhome').toggle();
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
        $('.site_tile>.info-popup-problems').click(function() {
            console.log("Clicked");
            var siteName = $(this).parent().attr('data-name');
            var site = getSiteByName(siteName, GAME_DATA.gs);
            encounteredProblems(site);
        });
		$('.site_tile>.info-popup-morale').click(function() {
            console.log("Clicked");
            var siteName = $(this).parent().attr('data-name');
            var site = getSiteByName(siteName, GAME_DATA.gs);
            showMoraleInterventions(GAME_DATA.gs, site);
        });

        $('.site_tile').each(function(i) {
            var $el = $(this);
            $el.find('button').click(function() {
                office = background.Sprite(site_images[i] || site_images[0]);
                office.transformOrigin(0, 0);
                office.scale(office.scene.w / office.imgNaturalWidth, office.scene.h / office.imgNaturalHeight);            
                office.update();
                GAME_DATA.current_site = i;
            });
        });


    }
};
