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

    data_schema: schema({
        fields: Array.of(1, 50, {
            label: String,
            field_type: String,
            required: Boolean,
            field_options: Array.of(0, 6, String),
            cid: String,
            next: {
                va: String
            },
            gametype: String
        }),
        game_title: String,
        game_footer: String,

    }),

    raw_schema: schema(Array.of(1, 50, {
        cid: String,
        field_options: Object,
        field_type: String,
        label: String,
        required: Boolean
    })),

    process: {
        field: function(dat) {

            if (Router.raw_schema(dat)) {
                var cp = dat, i = 0, rt = {};
                for (i; i < dat.length; i += 1) {
                    cp[i].field_options = Router.process.field_options(dat[i].field_options);
                    cp[i].next = Router.process.logic(dat[i + 1]);
                    cp[i].gametype = Router.process.game(dat[i])
                }

                rt.fields           = cp;
                rt.game_title       = $("#survey_title").val();
                rt.game_description = $("#survey_description").val();
                rt.game_footer      = $("#survey_thank_you").val();

                if (Router.data_schema(rt)) {
                    Router.dat = rt;
                    Router.ok  = true;
                    console.log(rt);
                    return dat;
                }
                else {
                    console.log(Router.data_schema.errors(rt));
                    return false;
                }

            }
            else {
                console.log(Router.raw_schema.errors(rt));
                return false;
            }
        },

        /**
         * Flattens the field_option attribute.
         * @param  {object} opt field_options object.
         * @return {Array}      Flattened options.
         */
        field_options: function (opt) {
            var options = []
            if (opt.options) {
                for (var i = 0; i < opt.options.length; i += 1) {
                    options.push(opt.options[i].label);
                }
            }
            return options;
        },

        /**
         * Assigns logical "next" hop from the question.
         * @param  {Object} id_next Next object to get the ID from.
         * @return {Object}         Logical Jump
         * **TODO** Not fully implemented.
         */
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
                if (number == list[0]) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (number >= list[0] && number <= list[1]) {
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
        swal({
            title: "Ready for the Magic?!",
            text: "Click on Build to build your Survey. If you wish to make more changes, click on Cancel.",
            type: "info",
            confirmButtonText: "Build",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        }, function() {

            $.ajax({
                type: "POST",
                url:  "https://api.github.com/gists",
                data: JSON.stringify({
                    files: {
                        json_dat: {
                            content: JSON.stringify(Router.get())
                        }
                    }
                }),
                contentType: 'application/json'
            }).done(function (data) {
                swal({
                    title: "Built!",
                    text:  "Your game has been built. Click Play Now!",
                    type:  "success",
                    confirmButtonText: "Play Now!",
                    closeOnConfirm: true
                }, function () {
                    window.open('//play.survaider.com?json=' + data.files.json_dat.raw_url, '_blank');
                });
            }).fail(function (data) {
                console.log(data);
                swal({
                    title: "We're Sorry!",
                    text:  "There's been some problem with the Server. Please try again in a little while.",
                    type:  "error",
                    closeOnConfirm: true
                });
            });

        });
    }
};
