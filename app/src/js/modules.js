var Links = {
    hook_id: "link_canvas",
    target_hook: "button.target",
    max_draw: 0,

    init: function () {
        "use strict";
        this.draw = this.SVG(this.hook_id);
        this.sub();
    },
    update_height: function (height) {
        "use strict";
        $("#" + this.hook_id).css({height: this.max_draw});
    },

    sub: function () {
        if (!String.prototype.format) {
          String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) { 
              return typeof args[number] != 'undefined'
                ? args[number]
                : match
              ;
            });
          };
        }
    },

    grid_lines: {
        lines: [],
        style: {
            width: 2,
            color: "#BBB"
        },

        /**
         * Finds the buttons with classes "target" and draws a reference
         * grid-line on canvas.
         */
        draw_vertical: function () {
            "use strict";
            // Find the "target buttons" and draw lines.

            var targets = $(Links.target_hook),
                i = 0,
                pos_x = 0,
                pos_y = 0,
                offset = 0,
                max_x = Links.draw.width();

            for (i = 0; i < targets.length; i += 1) {
                offset = targets.eq(i).outerHeight() / 2;

                pos_x = targets.eq(i).offset().left + offset;
                pos_y = targets.eq(i).offset().top  + offset;

                this.lines[i] = Links.draw.line(pos_x, pos_y, max_x, pos_y).stroke(this.style);

                if (pos_y >= Links.max_draw) {
                    Links.max_draw = pos_y + 10;
                }

                Links.update_height();
            }
        },

        /**
         * Draws a link between `origin` and `target` buttons.
         * Although we're assuming the elements are buttons, they can be any
         * element in DOM. The widths are calculated in real time.
         * @param  {string} origin Element ID of the origin.
         * @param  {string} target Element ID of the target.
         */
        draw_link: function (origin, target, grid_space) {
            "use strict";
            var origin_el = $("#" + origin),
                target_el = $("#" + target),
                offset    = {
                    origin: origin_el.outerHeight() / 2,
                    target: target_el.outerHeight() / 2
                },
                origin_mt = {
                    x: origin_el.offset().left + offset.origin,
                    y: origin_el.offset().top + offset.origin
                },
                target_mt = {
                    x: target_el.offset().left + offset.target,
                    y: target_el.offset().top + offset.target
                };

            var path = "M{0},{1} L{2},{3} L{4},{5} L{6},{7}".format(
                origin_mt.x,
                origin_mt.y,
                origin_mt.x + grid_space,
                origin_mt.y,
                origin_mt.x + grid_space,
                target_mt.y - grid_space,
                target_mt.x,
                target_mt.y
            );

            Links.draw.path(path).stroke({width: 2}).fill({color: "transparent"});
        }

    }
};

//M427.756017,147.713812 L449.898849,147.713812 L449.898849,203.298851 L427.507624,218.298851
