
window.onload = function() {
    var game_height = window.innerHeight - 5;
    var game_width = window.innerWidth;
    var scene = sjs.Scene({
        w: game_width,
        h: game_height
    });
    // var exec_list = document.getElementById('exec_list');
    var background = scene.Layer('background');
    scene.loadImages(['img/EmptyOffice.jpeg'], function() {
        var office = background.Sprite('img/EmptyOffice.jpeg');
        office.position(0, 0);
        office.transformOrigin(0, 0);
        office.scale(office.scene.w / office.imgNaturalWidth, office.scene.h / office.imgNaturalHeight);            
        office.update();
    });

    $(document).ready(function() {
        $.getJSON('data/config_file.json', function(data) {
            $.each(data, parse_deep);
        });
    });
}; 

function parse_deep(key, val){
    if (val !== null && typeof val === "object") {
        $.each(val, parse_deep);
    }
    else {
        $("#dialog_box").append("<p>" + key + " - " + val + "</p>");
    }
}
