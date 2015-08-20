requirejs.config({
    baseUrl: '',
    paths: {
          'SVG': 'bower_components/svg.js/dist/svg',
          'modules': 'src/js/modules',
          'jquery': 'bower_components/jquery/dist/jquery'
        },

    shim: {
        SVG: {
            exports: 'SVG'
        },
        modules: {
            deps: ['SVG', 'jquery'],
            exports: 'Links'
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(['jquery', 'SVG', 'modules'], function ($, SVG, Links) {
    Links.SVG = SVG;
    Links.init();
    Links.grid_lines.draw_vertical();
    Links.grid_lines.draw_link("T_1_2", "O_2", 30);
    // Links.grid_lines.draw_link("T_1_2", "O_3", 60);
    // Links.grid_lines.draw_link("T_2_1", "O_3", 60);
    // Links.grid_lines.draw_link("T_2_2", "O_3", 60);
    // //Links.grid_lines.draw_link("T_2_3", "O_3", 60);
    // Links.grid_lines.draw_link("T_2_3", "T_2_4", 40);
    
    $(".canvas").eq(0).addClass("blur");
    $(".field-card-container").eq(0).addClass("blur");
    $(".logic-modal-container").eq(0).addClass("visible");
    $(".logic-modal").eq(0).addClass("visible");
});

