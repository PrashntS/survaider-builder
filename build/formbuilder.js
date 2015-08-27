var Links = {
    hook_id: "svg-canvas",
    target_hook: "button.target",
    max_draw: 0,

    init: function () {
        "use strict";
        this.draw = SVG(this.hook_id);
        this.vp_o_x = $("#" + this.hook_id).offset().left;
        this.vp_o_y = $("#" + this.hook_id).offset().top;
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

                pos_x = targets.eq(i).offset().left + offset - Links.vp_o_x;
                pos_y = targets.eq(i).offset().top  + offset - Links.vp_o_y;

                this.lines[i] = Links.draw.line(pos_x, pos_y, max_x, pos_y).stroke(this.style);
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
    },

    reload: function() {
        "use strict";
        $("#" + Links.hook_id).html("");
        Links.init();
        Links.grid_lines.draw_vertical();
        Links.un_blur();
    },

    blur: function () {
        "use strict";
        $("#" + Links.hook_id).attr("class", "blur");
    },

    un_blur: function () {
        "use strict";
        $("#" + Links.hook_id).attr("class", "");
    }

};

(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return $(el).bind('input.rivets', this.publish);
    },
    unbind: function(el) {
      return $(el).unbind('input.rivets');
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

}).call(this);

(function() {
  var BuilderView, EditFieldView, Formbuilder, FormbuilderCollection, FormbuilderModel, ViewFieldView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  FormbuilderModel = (function(superClass) {
    extend(FormbuilderModel, superClass);

    function FormbuilderModel() {
      return FormbuilderModel.__super__.constructor.apply(this, arguments);
    }

    FormbuilderModel.prototype.sync = function() {};

    FormbuilderModel.prototype.indexInDOM = function() {
      var $wrapper;
      $wrapper = $(".fb-field-wrapper").filter(((function(_this) {
        return function(_, el) {
          return $(el).data('cid') === _this.cid;
        };
      })(this)));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

  FormbuilderCollection = (function(superClass) {
    extend(FormbuilderCollection, superClass);

    function FormbuilderCollection() {
      return FormbuilderCollection.__super__.constructor.apply(this, arguments);
    }

    FormbuilderCollection.prototype.initialize = function() {
      return this.on('add', this.copyCidToModel);
    };

    FormbuilderCollection.prototype.model = FormbuilderModel;

    FormbuilderCollection.prototype.comparator = function(model) {
      return model.indexInDOM();
    };

    FormbuilderCollection.prototype.copyCidToModel = function(model) {
      return model.attributes.cid = model.cid;
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(superClass) {
    extend(ViewFieldView, superClass);

    function ViewFieldView() {
      return ViewFieldView.__super__.constructor.apply(this, arguments);
    }

    ViewFieldView.prototype.className = "fb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    };

    ViewFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', this.model.cid).attr('data-cid', this.model.cid).html(Formbuilder.templates["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      Links.reload();
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      $("#editField").addClass("active");
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function(e) {
      var cb, x;
      e.preventDefault();
      e.stopPropagation();
      cb = (function(_this) {
        return function() {
          _this.parentView.handleFormUpdate();
          return _this.model.destroy();
        };
      })(this);
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
      Links.reload();
      switch (typeof x) {
        case 'string':
          if (confirm(x)) {
            return cb();
          }
          break;
        case 'function':
          return x(cb);
        default:
          return cb();
      }
    };

    ViewFieldView.prototype.duplicate = function() {
      var attrs;
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
    };

    return ViewFieldView;

  })(Backbone.View);

  EditFieldView = (function(superClass) {
    extend(EditFieldView, superClass);

    function EditFieldView() {
      return EditFieldView.__super__.constructor.apply(this, arguments);
    }

    EditFieldView.prototype.className = "edit-response-field";

    EditFieldView.prototype.events = {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'click .js-default-updated': 'defaultUpdated',
      'input .option-label-input': 'forceRender',
      'click .fb-label-description': 'prepareLabel'
    };

    EditFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      return this.listenTo(this.model, "destroy", this.remove);
    };

    EditFieldView.prototype.render = function() {
      this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      Links.reload();
      return this;
    };

    EditFieldView.prototype.remove = function() {
      this.parentView.editView = void 0;
      $("#editField").removeClass("active");
      Links.reload();
      return EditFieldView.__super__.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, field_type, i, newOption, op_len, options;
      $el = $(e.currentTarget);
      i = this.$el.find('.option').index($el.closest('.option'));
      options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
      newOption = {
        label: "Option Value",
        checked: false
      };
      op_len = $el.parent().parent().find('.option').length;
      field_type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
      if (Formbuilder.options.limit_map[field_type] && op_len >= Formbuilder.options.limit_map[field_type].max) {
        alert("NO MAN!");
        return;
      }
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, field_type, index, op_len, options;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-option").index($el);
      op_len = $el.parent().parent().find('.option').length;
      field_type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
      if (Formbuilder.options.limit_map[field_type] && op_len <= Formbuilder.options.limit_map[field_type].min) {
        $el.eq(0).addClass("err");
        setTimeout((function() {
          return $el.eq(0).removeClass("err");
        }), 2000);
        return;
      }
      options = this.model.get(Formbuilder.options.mappings.OPTIONS);
      options.splice(index, 1);
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.defaultUpdated = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if (this.model.get(Formbuilder.options.mappings.FIELD_TYPE) !== 'checkboxes') {
        this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    };

    EditFieldView.prototype.forceRender = function() {
      Links.reload();
      return this.model.trigger('change');
    };

    EditFieldView.prototype.prepareLabel = function(e) {
      var $el;
      $el = $(e.currentTarget).find("input").eq(0);
      if ($el.val() === Formbuilder.options.dict.DEFAULT_LABEL) {
        return $el.val("");
      }
    };

    return EditFieldView;

  })(Backbone.View);

  BuilderView = (function(superClass) {
    extend(BuilderView, superClass);

    function BuilderView() {
      return BuilderView.__super__.constructor.apply(this, arguments);
    }

    BuilderView.prototype.SUBVIEWS = [];

    BuilderView.prototype.events = {
      'click .js-save-form': 'saveForm',
      'click .fb-tabs a': 'showTab',
      'click .fb-add-field-types a': 'addField',
      'mouseover .fb-add-field-types': 'lockLeftWrapper',
      'mouseout .fb-add-field-types': 'unlockLeftWrapper'
    };

    BuilderView.prototype.initialize = function(options) {
      var selector;
      selector = options.selector, this.formBuilder = options.formBuilder, this.bootstrapData = options.bootstrapData;
      if (selector != null) {
        this.setElement($(selector));
      }
      this.collection = new FormbuilderCollection;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
      this.collection.bind('destroy', this.ensureEditViewScrolled, this);
      this.render();
      this.collection.reset(this.bootstrapData);
      return this.bindSaveEvent();
    };

    BuilderView.prototype.bindSaveEvent = function() {
      this.formSaved = true;
      this.saveFormButton = this.$el.find(".js-save-form");
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      if (!!Formbuilder.options.AUTOSAVE) {
        setInterval((function(_this) {
          return function() {
            return _this.saveForm.call(_this);
          };
        })(this), 5000);
      }
      return $(window).bind('beforeunload', (function(_this) {
        return function() {
          if (_this.formSaved) {
            return void 0;
          } else {
            return Formbuilder.options.dict.UNSAVED_CHANGES;
          }
        };
      })(this));
    };

    BuilderView.prototype.reset = function() {
      this.$responseFields.html('');
      this.addAll();
      return Links.reload();
    };

    BuilderView.prototype.render = function() {
      var j, len, ref, subview;
      this.$el.html(Formbuilder.templates['page']());
      this.$fbLeft = this.$el.find('.fb-left');
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.bindWindowScrollEvent();
      this.hideShowNoResponseFields();
      ref = this.SUBVIEWS;
      for (j = 0, len = ref.length; j < len; j++) {
        subview = ref[j];
        new subview({
          parentView: this
        }).render();
      }
      Links.reload();
      return this;
    };

    BuilderView.prototype.bindWindowScrollEvent = function() {
      return $(window).on('scroll', (function(_this) {
        return function() {
          var element, maxMargin, newMargin;
          element = $(".fb-tab-pane");
          newMargin = Math.max(0, $(window).scrollTop() - element.offset().top);
          maxMargin = _this.$responseFields.height();
          return element.css({
            'padding-top': Math.min(maxMargin, newMargin)
          });
        };
      })(this));
    };

    BuilderView.prototype.showTab = function(e) {
      var $el, first_model, target;
      $el = $(e.currentTarget);
      target = $el.data('target');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        return this.createAndShowEditView(first_model);
      } else {
        return Links.reload();
      }
    };

    BuilderView.prototype.addOne = function(responseField, _, options) {
      var $replacePosition, view;
      view = new ViewFieldView({
        model: responseField,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
        Links.reload();
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: (function(_this) {
          return function(e, ui) {
            var rf;
            if (ui.item.data('field-type')) {
              rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
                $replaceEl: ui.item
              });
              _this.createAndShowEditView(rf);
            }
            _this.handleFormUpdate();
            return true;
          };
        })(this),
        update: (function(_this) {
          return function(e, ui) {
            if (!ui.item.data('field-type')) {
              return _this.ensureEditViewScrolled();
            }
          };
        })(this),
        deactivate: (function(_this) {
          return function(e, ui) {
            return Links.reload();
          };
        })(this),
        activate: (function(_this) {
          return function(e, ui) {
            return Links.blur();
          };
        })(this)
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons;
      $addFieldButtons = this.$el.find("[data-field-type]");
      return $addFieldButtons.draggable({
        connectToSortable: this.$responseFields,
        helper: (function(_this) {
          return function() {
            var $helper;
            $helper = $("<div class='response-field-draggable-helper' />");
            $helper.css({
              width: '374px',
              height: '80px'
            });
            return $helper;
          };
        })(this)
      });
    };

    BuilderView.prototype.addAll = function() {
      this.collection.each(this.addOne, this);
      this.setSortable();
      return Links.reload();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    };

    BuilderView.prototype.addField = function(e) {
      var field_type;
      field_type = $(e.currentTarget).data('field-type');
      return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type));
    };

    BuilderView.prototype.createField = function(attrs, options) {
      var rf;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      return this.handleFormUpdate();
    };

    BuilderView.prototype.createAndShowEditView = function(model) {
      var $newEditEl, $responseFieldEl;
      $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl);
          return;
        }
        this.editView.remove();
        $("#editField").removeClass("active");
      }
      this.editView = new EditFieldView({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      this.$el.find(".fb-edit-field-wrapper").html($newEditEl);
      $("#editField").addClass("active");
      this.scrollLeftWrapper($responseFieldEl);
      return this;
    };

    BuilderView.prototype.ensureEditViewScrolled = function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".fb-field-wrapper.editing"));
    };

    BuilderView.prototype.scrollLeftWrapper = function($responseFieldEl) {
      this.unlockLeftWrapper();
      if (!$responseFieldEl[0]) {
        return;
      }
      return $.scrollWindowTo((this.$el.offset().top + $responseFieldEl.offset().top) - this.$responseFields.offset().top, 200, (function(_this) {
        return function() {
          return _this.lockLeftWrapper();
        };
      })(this));
    };

    BuilderView.prototype.lockLeftWrapper = function() {
      return this.$fbLeft.data('locked', true);
    };

    BuilderView.prototype.unlockLeftWrapper = function() {
      return this.$fbLeft.data('locked', false);
    };

    BuilderView.prototype.handleFormUpdate = function() {
      if (this.updatingBatch) {
        return;
      }
      this.formSaved = false;
      return this.saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM);
    };

    BuilderView.prototype.saveForm = function(e) {
      var payload;
      if (this.formSaved) {
        return;
      }
      this.formSaved = true;
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      this.collection.sort();
      payload = JSON.stringify({
        fields: this.collection.toJSON()
      });
      if (Formbuilder.options.HTTP_ENDPOINT) {
        this.doAjaxSave(payload);
      }
      return this.formBuilder.trigger('save', payload);
    };

    BuilderView.prototype.doAjaxSave = function(payload) {
      return $.ajax({
        url: Formbuilder.options.HTTP_ENDPOINT,
        type: Formbuilder.options.HTTP_METHOD,
        data: payload,
        contentType: "application/json",
        success: (function(_this) {
          return function(data) {
            var datum, j, len, ref;
            _this.updatingBatch = true;
            for (j = 0, len = data.length; j < len; j++) {
              datum = data[j];
              if ((ref = _this.collection.get(datum.cid)) != null) {
                ref.set({
                  id: datum.id
                });
              }
              _this.collection.trigger('sync');
            }
            return _this.updatingBatch = void 0;
          };
        })(this)
      });
    };

    return BuilderView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, base;
        attrs = {};
        attrs[Formbuilder.options.mappings.LABEL] = Formbuilder.options.dict.DEFAULT_LABEL;
        attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type;
        attrs[Formbuilder.options.mappings.REQUIRED] = true;
        attrs['field_options'] = {};
        return (typeof (base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'fb-button',
      HTTP_ENDPOINT: '',
      HTTP_METHOD: 'POST',
      AUTOSAVE: true,
      CLEAR_FIELD_CONFIRM: false,
      mappings: {
        SIZE: 'field_options.size',
        UNITS: 'field_options.units',
        LABEL: 'label',
        FIELD_TYPE: 'field_type',
        REQUIRED: 'required',
        ADMIN_ONLY: 'admin_only',
        OPTIONS: 'field_options.options',
        DESCRIPTION: 'field_options.description',
        INCLUDE_OTHER: 'field_options.include_other_option',
        INCLUDE_BLANK: 'field_options.include_blank_option',
        INTEGER_ONLY: 'field_options.integer_only',
        MIN: 'field_options.min',
        MAX: 'field_options.max',
        MINLENGTH: 'field_options.minlength',
        MAXLENGTH: 'field_options.maxlength',
        LENGTH_UNITS: 'field_options.min_max_length_units',
        CID: 12
      },
      limit_map: {
        yes_no: {
          min: 2,
          max: 3
        },
        check_boxes: {
          min: 2,
          max: 5
        },
        multiple_choice: {
          min: 2,
          max: 5
        },
        ranking: {
          min: 2,
          max: 6
        },
        group_rating: {
          min: 2,
          max: 3
        }
      },
      dict: {
        ALL_CHANGES_SAVED: 'Saved',
        DEFAULT_LABEL: 'Question Title\x1e',
        SAVE_FORM: 'Save',
        UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.nonInputFields = {};

    Formbuilder.registerField = function(name, opts) {
      var j, len, ref, x;
      ref = ['view', 'edit'];
      for (j = 0, len = ref.length; j < len; j++) {
        x = ref[j];
        opts[x] = _.template(opts[x]);
      }
      opts.field_type = name;
      Formbuilder.fields[name] = opts;
      if (opts.type === 'non_input') {
        return Formbuilder.nonInputFields[name] = opts;
      } else {
        return Formbuilder.inputFields[name] = opts;
      }
    };

    function Formbuilder(opts) {
      var args;
      if (opts == null) {
        opts = {};
      }
      _.extend(this, Backbone.Events);
      args = _.extend(opts, {
        formBuilder: this
      });
      this.mainView = new BuilderView(args);
      Links.reload();
    }

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('group_rating', {
    order: 53,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"line\">\n    <label class='fb-option'>\n      <p>\n          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n          <br>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n      </p>\n    </label>\n  </div>\n<% } %>\n<button class=\"target hanging\"\n        data-target = \"out\"\n        data-target-index = \"0\"\n></button>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-star\"></span></span> Group Rating",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Field One Goes here",
          checked: false
        }, {
          label: "Field Two Goes here",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('multiple_choice', {
    order: 10,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"line\">\n      <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>\n  </div>\n<% } %>\n<button class=\"target hanging\"\n        data-target = \"out\"\n        data-target-index = \"0\"\n></button>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-square-o\"></span></span> Multiple Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Option One",
          checked: false
        }, {
          label: "Option Two",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('paragraph', {
    order: 1,
    view: "<div class=\"line\">\n    <p>Any Response</p>\n    <button class=\"target\" data-target=\"out\"></button>\n</div>",
    edit2: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    edit: "",
    addButton: "<span class=\"symbol\">&#182;</span> Paragraph"
  });

}).call(this);

(function() {
  Formbuilder.registerField('ranking', {
    order: 51,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"line\">\n    <label class='fb-option'>\n      <p>\n          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n          <br>\n          <span class=\"digit up\"><i class=\"fa fa-arrow-up\"></i></span>\n          <span class=\"digit down\"><i class=\"fa fa-arrow-down\"></i></span>\n      </p>\n    </label>\n  </div>\n<% } %>\n<button class=\"target hanging\"\n        data-target = \"out\"\n        data-target-index = \"0\"\n></button>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-bars\"></span></span> Ranking",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Field One Goes here",
          checked: false
        }, {
          label: "Field Two Goes here",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('rating', {
    order: 52,
    view: "<div class=\"line\">\n  <label class='fb-option'>\n    <p>\n          <span class=\"digit\">1</span>\n          <span class=\"digit\">2</span>\n          <span class=\"digit\">3</span>\n          <span class=\"digit\">4</span>\n          <span class=\"digit spacer\">...</span>\n          <span class=\"digit\">8</span>\n          <span class=\"digit\">9</span>\n          <span class=\"digit\">10</span>\n    </p>\n  </label>\n</div>\n<button class=\"target hanging\"\n        data-target = \"out\"\n        data-target-index = \"0\"\n></button>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-star\"></span></span> Rating"
  });

}).call(this);

(function() {
  Formbuilder.registerField('single_choice', {
    order: 15,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"line\">\n      <span class=\"link\"></span>\n      <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>\n      <button class=\"target\"\n              data-target = \"out\"\n              data-target-index = \"<%= i %>\"\n              data-target-value = \"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\"\n      ></button>\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-circle-o\"></span></span> Single Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Choice One",
          checked: false
        }, {
          label: "Choice Two",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    order: 0,
    view: "<div class=\"line\">\n    <p>Any Response</p>\n    <button class=\"target\" data-target=\"out\"></button>\n</div>",
    edit: "",
    ed: "<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'><span class='fa fa-font'></span></span> Short Text"
  });

}).call(this);

(function() {
  Formbuilder.registerField('yes_no', {
    order: 3,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div class=\"line\">\n      <span class=\"link\"></span>\n      <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>\n      <button class=\"target\"\n              data-target = \"out\"\n              data-target-index = \"<%= i %>\"\n              data-target-value = \"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\"\n      ></button>\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-dot-circle-o\"></span></span> Yes \/ No",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Yes",
          checked: false
        }, {
          label: "No",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n' +
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
'\'></code>\n  <span class=\'fa fa-arrow-right pull-right\'></span>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!--label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label-->\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Edit Question</div>\n\n<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description\'>\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-common-checkboxes\'>\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-clear\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>What question do you want to ask?</h3>\n<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' placeholder="Question" />';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Add Option</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\n    Include blank\n  </label>\n';
 } ;
__p += '\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-remove-option" title="Remove Option"><i class="fa fa-times-circle"></i></a>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<div class="fb-nah-bro">\n  Sorry! Cannot go lower than x options for this question type!\n</div>\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option .button"><i class="fa fa-plus-circle"></i>&nbsp;Add Option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/yes_no"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Yes No</div>\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-remove-option" title="Remove Option"><i class=\'fa fa-minus-circle\'></i></a>\n</div>\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['partials/left_side']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['partials/right_side']() )) == null ? '' : __t) +
'\n<div class=\'fb-clear\'></div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\n  <div class=\'fb-add-field-types\'>\n    <div class=\'section\'>\n      ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n\n    <div class=\'section\'>\n      ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-options\' id=\'editField\'>\n  <div class=\'fb-edit-field-wrapper\'></div>\n  <div class="fb-field-options-done">\n      <button onclick=\'$("#editField").removeClass("active");\'>Done</button>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-left\'>\n    <div class="header">\n        <h2>Sample Survey</h2>\n        <button class=\'js-save-form\'></button>\n        <button class=\'play-now\'>Play Now!</button>\n    </div>\n\n    <div class="content">\n        <h2>Question Type</h2>\n        <div class=\'fb-tab-content\'>\n            ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n            ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n        </div>\n\n        <h3>Generic Help Text here</h3>\n        <p>Hey! You know what? I love you! &lt;3 </p>\n    </div>\n\n    <div class="footer">\n        <p><img src="vendor/img/survaider.png">Survaider Builder</p>\n        <p>v0.1.2 Pre-Alpha</p>\n        <p><a href="https://github.com/PrashntS/survaider-builder">GitHub</a></p>\n    </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-right\'>\n  <div id=\'svg-canvas\'></div>\n  <div class=\'fb-no-response-fields\'>No response fields</div>\n  <div class=\'fb-response-fields\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-save-wrapper\'>\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n    <div class=\'cover\'></div>\n    <div class="field-card">\n        <div class="meta">\n            <p class="section">Question</p>\n\n            ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\n\n            <button class="target" id="O_1"></button>\n        </div>\n        <div class="logic">\n            <p class="section">Options</p>\n            ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n        </div>\n        ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n    </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</span>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate" title="Duplicate Field">Duplicate</a>\n  <a class="js-clear" title="Remove Field">Delete</a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<p class="title">' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'</p>\n<p class="type">\n    <!--<strong>Type</strong>: -->\n    <small>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.FIELD_TYPE)).replace(/_/, " ") )) == null ? '' : __t) +
'</small>\n    <!--\n    &bullet;\n    <strong>CID:</strong> ' +
((__t = ( Formbuilder.attributes )) == null ? '' : __t) +
'\n    &bullet;\n    ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n    Required\n    ';
 } else { ;
__p += '\n    Optional\n    ';
 } ;
__p += '\n    -->\n</p>';

}
return __p
};