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
        setupSim(scene);
    });
}; 

function append_config(key, val){
    if (val !== null && typeof val === "object") {
        $("#dialog_box").append("<p>" + key + " {</p>");
        $.each(val, append_config);
        $("#dialog_box").append("<p>}</p>");
    }
    else {
        $("#dialog_box").append("<p>" + key + " - " + val + "</p>");
    }
}

function setupSim(scene){
    setupGame(scene);
}
