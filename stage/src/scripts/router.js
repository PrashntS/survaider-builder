var Router = {
    game_map: {
        short_text: {
            text_scene: [0, 0]
        },
        long_text: {
            suggestions: [0, 0]
        },
        yes_no: {
            car: [2, 2],
            happy_or_sad: [3, 3]
        },
        single_choice: {
            catapult: [2, 4],
            fish_scene_one: [2, 5],
            bird_tunnel: [2, 4]
        },
        multiple_choice: {
            balloon: [2, 5],
            fish_scene_two: [2, 5]
        },
        ranking: {
            stairs: [2, 6]
        },
        rating: {
            scroll_scene: [0, 0]
        },
        group_rating: {
            star_game: [2, 3]
        }
    },
    process: {
        field: function() {
            var fields = Router.dat.fields;
            if (fields) {
                for (var i = 0; i < fields.length; i += 1) {
                    fields[i].field_options = Router.process.field_options(fields[i].field_options);
                    fields[i].next = Router.process.logic(fields[i + 1]);
                    fields[i].gametype = Router.process.game(fields[i]);
                }
            }
            Router.dat.game_title = $("#survey_title").val();
            Router.dat.game_description = $("#survey_description").val();
            Router.dat.game_footer = $("#survey_thank_you").val();
        },
        field_options: function (opt) {
            var options = []
            if (opt.options) {
                for (var i = 0; i < opt.options.length; i += 1) {
                    options.push(opt.options[i].label);
                }
            }
            return options;
        },
        logic: function (id_next) {
            if (id_next) {
                return {
                    va: id_next.cid
                };
            } else {
                return {
                    va: "end"
                };
            }
        },
        game: function (field) {
            if (Router.game_map[field.field_type]) {
                var type = field.field_type,
                    len  = field.field_options.length,
                    games = [];
                for (var game in Router.game_map[type]) {
                    if (Router.game_map[type].hasOwnProperty(game)) {
                        if (Router.helper.between(len, Router.game_map[type][game])) {
                            games.push(game);
                        }
                    }
                }
                return games[Math.floor(Math.random() * games.length)];
            }
        }
    },
    dat: {},
    helper: {
        between: function (number, list) {
            if (list[0] == list[1]) {
                return true;
            }
            else if (number >= list[0] || number <= list[1]) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    get: function () {
        Router.process.field();
        return Router.dat;
    },
    play: function() {
        var json = JSON.stringify(Router.get());
        window.open('http://vkphillia.github.io/SurvaiderTesting?json=' + json, '_blank');
    }
};
