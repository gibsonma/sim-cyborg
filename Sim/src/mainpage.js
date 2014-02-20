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
            chosen_site_index = $('#site_select').val()
            office = background.Sprite(site_images[chosen_site_index]);
            office.transformOrigin(0, 0);
            office.scale(office.scene.w / office.imgNaturalWidth, office.scene.h / office.imgNaturalHeight);            
            office.update();
        });
        $('#toggle_dialog_btn').click(function() {
            $('#main_content,#game_state_box').toggle();
        });
        $('#scenario_1').click(function() {
            setupGame(scene,1);
            GAME_DATA.state_dialog = $('#game_state_dump');
        });
        $('#scenario_2').click(function() {
            setupGame(scene,2);
            GAME_DATA.state_dialog = $('#game_state_dump');
        });
        $('#scenario_3').click(function() {
            setupGame(scene,3);
            GAME_DATA.state_dialog = $('#game_state_dump');
        });
        setupGame(scene,1);
        GAME_DATA.state_dialog = $('#game_state_dump');
    });
}; 

function append_config(key, val){
    if (val !== null && typeof val === "object") {
        $("#main_content").append("<p>" + key + " {</p>");
        $.each(val, append_config);
        $("#main_content").append("<p>}</p>");
    }
    else {
        $("#main_content").append("<p>" + key + " - " + val + "</p>");
    }
}
