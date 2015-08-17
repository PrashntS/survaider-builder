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
    }
});

requirejs(['jquery', 'SVG', 'modules'], function ($, SVG, Links) {
    Links.SVG = SVG;
    Links.init();
    Links.grid_lines.draw_vertical();
    Links.grid_lines.draw_link("T_1_1", "O_2", 40);
    Links.grid_lines.draw_link("T_1_2", "O_3", 60);
    Links.grid_lines.draw_link("T_2_1", "O_3", 60);
    Links.grid_lines.draw_link("T_2_2", "O_3", 60);
    //Links.grid_lines.draw_link("T_2_3", "O_3", 60);
    Links.grid_lines.draw_link("T_2_3", "T_2_4", 40);
});

