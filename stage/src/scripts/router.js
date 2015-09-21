var Router = {

    /**
     * Mapping between field_type and games.
     * @type {Object}
     */
    GameMap: {
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

    /**
     * Schema for the Translated data.
     * @type {Schema}
     */
    DataSchema: schema({
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

    /**
     * Schema for Incoming data.
     * @type {Schema}
     */
    RawSchema: schema(Array.of(1, 50, {
        cid: String,
        field_options: Object,
        field_type: String,
        label: String,
        required: Boolean
    })),

    /**
     * Processes the input data, and stores in `dat` global variable.
     * IMPORTANT: Always check the Router.ok flag.
     * KNOWN VULNERABILITIES: Race Around Condition exists. However, there's no exposed API in the Formbuilder Base as of now to circumvent this.
     * @param  {Object} dat  Object of Fields
     * @return {Boolean}     Object Translation Results.
     */
    translate: function(dat) {
        "use strict";

        if (Router.RawSchema(dat)) {
            var cp = dat, i = 0, rt = {};
            for (i; i < dat.length; i += 1) {
                cp[i].field_options = Router.Process.field_options(dat[i].field_options);
                cp[i].next = Router.Process.logic(dat[i + 1]);
                cp[i].gametype = Router.Process.game(dat[i])
            }

            rt.fields           = cp;
            rt.game_title       = $("#survey_title").val();
            rt.game_description = $("#survey_description").val();
            rt.game_footer      = $("#survey_thank_you").val();

            if (Router.DataSchema(rt)) {
                Router.dat = rt;
                Router.ok  = true;
                return true;
            }

        }

        Router.ok  = false;
        return false;
    },

    /**
     * Helper functions.
     * @type {Object}
     */
    Process: {
        /**
         * Flattens the field_option attribute.
         * @param  {object} opt field_options object.
         * @return {Array}      Flattened options.
         */
        field_options: function (opt) {
            "use strict";

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
            "use strict";

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

        /**
         * Assigns games on the basis of field_type.
         * @param  {Object} field Field contents.
         * @return {String}       Game ID.
         */
        game: function (field) {
            "use strict";

            if (Router.GameMap[field.field_type]) {
                var type = field.field_type,
                    len  = field.field_options.length,
                    games = [];
                for (var game in Router.GameMap[type]) {
                    if (Router.GameMap[type].hasOwnProperty(game)) {
                        if (Router.Helper.between(len, Router.GameMap[type][game])) {
                            games.push(game);
                        }
                    }
                }
                return games[Math.floor(Math.random() * games.length)];
            }
        }
    },

    /**
     * Other Helper functions.
     * @type {Object}
     */
    Helper: {
        /**
         * If the number is 
         * @param  {[type]} number [description]
         * @param  {[type]} list   [description]
         * @return {[type]}        [description]
         */
        between: function (number, list) {
            "use strict";

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
        "use strict";

    },
    play: function() {
        "use strict";

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
