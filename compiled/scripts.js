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
        if (obj.cid) {
          this._obj = obj;
        }
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
  var ImagePicker, ImagePickerOption, both_array_are_equal, sanitized_options,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $.fn.extend({
    imagepicker: function(opts) {
      if (opts == null) {
        opts = {};
      }
      return this.each(function() {
        var select;
        select = $(this);
        if (select.data("picker")) {
          select.data("picker").destroy();
        }
        select.data("picker", new ImagePicker(this, sanitized_options(opts)));
        if (opts.initialized != null) {
          return opts.initialized.call(select.data("picker"));
        }
      });
    }
  });

  sanitized_options = function(opts) {
    var default_options;
    default_options = {
      hide_select: true,
      show_label: false,
      initialized: void 0,
      changed: void 0,
      clicked: void 0,
      selected: void 0,
      limit: void 0,
      limit_reached: void 0
    };
    return $.extend(default_options, opts);
  };

  both_array_are_equal = function(a, b) {
    return $(a).not(b).length === 0 && $(b).not(a).length === 0;
  };

  ImagePicker = (function() {
    function ImagePicker(select_element, opts1) {
      this.opts = opts1 != null ? opts1 : {};
      this.sync_picker_with_select = bind(this.sync_picker_with_select, this);
      this.select = $(select_element);
      this.multiple = this.select.attr("multiple") === "multiple";
      if (this.select.data("limit") != null) {
        this.opts.limit = parseInt(this.select.data("limit"));
      }
      this.build_and_append_picker();
    }

    ImagePicker.prototype.destroy = function() {
      var i, len, option, ref;
      ref = this.picker_options;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        option.destroy();
      }
      this.picker.remove();
      this.select.unbind("change");
      this.select.removeData("picker");
      return this.select.show();
    };

    ImagePicker.prototype.build_and_append_picker = function() {
      if (this.opts.hide_select) {
        this.select.hide();
      }
      this.select.change((function(_this) {
        return function() {
          return _this.sync_picker_with_select();
        };
      })(this));
      if (this.picker != null) {
        this.picker.remove();
      }
      this.create_picker();
      this.select.after(this.picker);
      return this.sync_picker_with_select();
    };

    ImagePicker.prototype.sync_picker_with_select = function() {
      var i, len, option, ref, results;
      ref = this.picker_options;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        if (option.is_selected()) {
          results.push(option.mark_as_selected());
        } else {
          results.push(option.unmark_as_selected());
        }
      }
      return results;
    };

    ImagePicker.prototype.create_picker = function() {
      this.picker = $("<ul class='thumbnails image_picker_selector'></ul>");
      this.picker_options = [];
      this.recursively_parse_option_groups(this.select, this.picker);
      return this.picker;
    };

    ImagePicker.prototype.recursively_parse_option_groups = function(scoped_dom, target_container) {
      var container, i, j, len, len1, option, option_group, ref, ref1, results;
      ref = scoped_dom.children("optgroup");
      for (i = 0, len = ref.length; i < len; i++) {
        option_group = ref[i];
        option_group = $(option_group);
        container = $("<ul></ul>");
        container.append($("<li class='group_title'>" + (option_group.attr("label")) + "</li>"));
        target_container.append($("<li>").append(container));
        this.recursively_parse_option_groups(option_group, container);
      }
      ref1 = (function() {
        var k, len1, ref1, results1;
        ref1 = scoped_dom.children("option");
        results1 = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          option = ref1[k];
          results1.push(new ImagePickerOption(option, this, this.opts));
        }
        return results1;
      }).call(this);
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        option = ref1[j];
        this.picker_options.push(option);
        if (!option.has_image()) {
          continue;
        }
        results.push(target_container.append(option.node));
      }
      return results;
    };

    ImagePicker.prototype.has_implicit_blanks = function() {
      var option;
      return ((function() {
        var i, len, ref, results;
        ref = this.picker_options;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          option = ref[i];
          if (option.is_blank() && !option.has_image()) {
            results.push(option);
          }
        }
        return results;
      }).call(this)).length > 0;
    };

    ImagePicker.prototype.selected_values = function() {
      if (this.multiple) {
        return this.select.val() || [];
      } else {
        return [this.select.val()];
      }
    };

    ImagePicker.prototype.toggle = function(imagepicker_option) {
      var new_values, old_values, selected_value;
      old_values = this.selected_values();
      selected_value = imagepicker_option.value().toString();
      if (this.multiple) {
        if (indexOf.call(this.selected_values(), selected_value) >= 0) {
          new_values = this.selected_values();
          new_values.splice($.inArray(selected_value, old_values), 1);
          this.select.val([]);
          this.select.val(new_values);
        } else {
          if ((this.opts.limit != null) && this.selected_values().length >= this.opts.limit) {
            if (this.opts.limit_reached != null) {
              this.opts.limit_reached.call(this.select);
            }
          } else {
            this.select.val(this.selected_values().concat(selected_value));
          }
        }
      } else {
        if (this.has_implicit_blanks() && imagepicker_option.is_selected()) {
          this.select.val("");
        } else {
          this.select.val(selected_value);
        }
      }
      if (!both_array_are_equal(old_values, this.selected_values())) {
        this.select.change();
        if (this.opts.changed != null) {
          return this.opts.changed.call(this.select, old_values, this.selected_values());
        }
      }
    };

    return ImagePicker;

  })();

  ImagePickerOption = (function() {
    ImagePickerOption.prototype.template = "<div class=\"thumbnail\">\n  <img class=\"image_picker_image\" src=\"<%= dat.url %>\">\n  <a href=\"javascript:void(0)\"\n     data-target=\"<%= dat.id %>\"\n     class=\"image_picker_delete\">\n    <i class=\"fa fa-trash\"></i>\n  </a>\n</div>";

    function ImagePickerOption(option_element, picker, opts1) {
      this.picker = picker;
      this.opts = opts1 != null ? opts1 : {};
      this.clicked = bind(this.clicked, this);
      this.option = $(option_element);
      this.create_node();
    }

    ImagePickerOption.prototype.destroy = function() {
      return this.node.find(".thumbnail").unbind();
    };

    ImagePickerOption.prototype.has_image = function() {
      return this.option.data("img-src") != null;
    };

    ImagePickerOption.prototype.is_blank = function() {
      return !((this.value() != null) && this.value() !== "");
    };

    ImagePickerOption.prototype.is_selected = function() {
      var select_value;
      select_value = this.picker.select.val();
      if (this.picker.multiple) {
        return $.inArray(this.value(), select_value) >= 0;
      } else {
        return this.value() === select_value;
      }
    };

    ImagePickerOption.prototype.mark_as_selected = function() {
      return this.node.find(".thumbnail").addClass("selected");
    };

    ImagePickerOption.prototype.unmark_as_selected = function() {
      return this.node.find(".thumbnail").removeClass("selected");
    };

    ImagePickerOption.prototype.value = function() {
      return this.option.val();
    };

    ImagePickerOption.prototype.label = function() {
      if (this.option.data("img-label")) {
        return this.option.data("img-label");
      } else {
        return this.option.text();
      }
    };

    ImagePickerOption.prototype.clicked = function() {
      this.picker.toggle(this);
      if (this.opts.clicked != null) {
        this.opts.clicked.call(this.picker.select, this);
      }
      if ((this.opts.selected != null) && this.is_selected()) {
        return this.opts.selected.call(this.picker.select, this);
      }
    };

    ImagePickerOption.prototype.create_node = function() {
      var thumbnail;
      this.node = $("<li/>");
      thumbnail = $(_.template(this.template, {
        dat: {
          url: this.option.data("img-src"),
          id: this.option.data("img-id")
        }
      }));
      thumbnail.on('click', 'img.image_picker_image', (function(_this) {
        return function() {
          return _this.clicked();
        };
      })(this));
      thumbnail.on('click', 'a.image_picker_delete', (function(_this) {
        return function() {};
      })(this));
      this.node.append(thumbnail);
      return this.node;
    };

    return ImagePickerOption;

  })();

}).call(this);

(function() {
  var BuilderView, EditFieldView, Formbuilder, FormbuilderCollection, FormbuilderModel, ScreenCollection, ScreenModel, ScreenView, ViewFieldView,
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
      $wrapper = $(".sb-field-wrapper").filter((function(_this) {
        return function(_, el) {
          return $(el).data('cid') === _this.cid;
        };
      })(this));
      return $(".sb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    FormbuilderModel.prototype.create_uid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r, v;
        r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
        v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

  ScreenModel = (function(superClass) {
    extend(ScreenModel, superClass);

    function ScreenModel() {
      return ScreenModel.__super__.constructor.apply(this, arguments);
    }

    ScreenModel.prototype.screens = {
      intro: {
        title: 'Default Title',
        description: 'Default Description'
      },
      end: {
        title: 'Default Ending'
      }
    };

    return ScreenModel;

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
      return model.attributes.cid = model.create_uid();
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(superClass) {
    extend(ViewFieldView, superClass);

    function ViewFieldView() {
      return ViewFieldView.__super__.constructor.apply(this, arguments);
    }


    /*
    The question cards.
     */

    ViewFieldView.prototype.className = "sb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "set", this.render);
      this.listenTo(this.model, "destroy", this.remove);
      return this.listenTo(this.parentView, "change", this.render);
    };

    ViewFieldView.prototype.render = function() {
      var _t;
      _t = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
      this.$el.addClass("response-field-" + _t).data('cid', this.model.cid).attr('data-cid', this.model.cid).html(Formbuilder.templates["view/base"]({
        rf: this.model
      }));
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function(e) {
      var cb, x;
      e.preventDefault();
      e.stopPropagation();
      if (this.model.get('field_options.deletable')) {
        swal({
          title: "Cannot delete this field",
          text: "Fields of this type cannot be deleted. You may, however, move.",
          type: "error",
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Okay",
          closeOnConfirm: true
        });
        return;
      }
      cb = (function(_this) {
        return function() {
          _this.parentView.handleFormUpdate();
          return _this.model.destroy();
        };
      })(this);
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
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
      'change .option-label-input': 'forceRender',
      'blur .option-label-input': 'rerender',
      'click .notify-tick': 'delayedrerender',
      'change .check': 'optionUpdated',
      'click .check': 'optionUpdated',
      'click .sb-attach-init': 'attachImage',
      'click .sb-label-description': 'prepareLabel',
      'click .option': 'prepareLabel',
      'input input[data-uri=container]': 'attachImageProcess'
    };

    EditFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      return this.listenTo(this.model, "destroy", this.remove);
    };

    EditFieldView.prototype.render = function() {
      this.$el.html(Formbuilder.templates["edit/base"]({
        rf: this.model
      }));
      this.rv = rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    };

    EditFieldView.prototype.remove = function() {
      this.parentView.editView = void 0;
      $("#editField").removeClass("active");
      return EditFieldView.__super__.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, field_type, i, newOption, op_len, options, routine;
      $el = $(e.currentTarget);
      i = this.$el.find('.option').index($el.closest('.option'));
      options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
      newOption = {
        label: Formbuilder.options.dict.DEFAULT_OPTION,
        checked: false
      };
      op_len = $el.parent().parent().find('.option').length;
      field_type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
      routine = _.bind(function() {
        if (i > -1) {
          options.splice(i + 1, 0, newOption);
        } else {
          options.push(newOption);
        }
        this.model.set(Formbuilder.options.mappings.OPTIONS, options);
        this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
        return this.forceRender();
      }, this);
      return routine();
    };

    EditFieldView.prototype.rerender = function(e) {
      this.$el.html(Formbuilder.templates["edit/base"]({
        rf: this.model
      }));
      this.rv.unbind();
      return this.rv = rivets.bind(this.$el, {
        model: this.model
      });
    };

    EditFieldView.prototype.delayedrerender = function() {
      var log;
      log = _.bind(this.rerender, this);
      return _.delay(log, 100);
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, field_type, index, op_len, options;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-option").index($el);
      op_len = $el.parent().parent().find('.option').length;
      field_type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
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

    EditFieldView.prototype.optionUpdated = function(e) {
      var log;
      log = _.bind(this.forceRender, this);
      return _.delay(log, 100);
    };

    EditFieldView.prototype.attachImage = function(e) {
      var callback, ol_val, r, t, target;
      target = $(e.currentTarget);
      ol_val = target.find('input[data-sb-attach=uri]').val();
      t = target.offset().top + (target.outerHeight() * 0.125) - $(window).scrollTop();
      r = $(window).width() - target.offsetParent().offset().left + 10;
      callback = _.debounce(function(uridat) {
        var uri;
        uri = target.find('input[data-sb-attach=uri]');
        if (uridat !== "") {
          return uri.val(uridat).trigger('input');
        } else {
          return uri.val("").trigger('input');
        }
      }, 500);
      return Formbuilder.uploads.show(t, r, 'right', callback, ol_val);
    };

    EditFieldView.prototype.forceRender = function() {
      return this.model.trigger('change');
    };

    EditFieldView.prototype.prepareLabel = function(e) {
      var $el;
      $el = $(e.currentTarget).find("textarea,input").eq(0);
      if ($el.val().indexOf("\x1e") > -1) {
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
      'click .sb-add-field-types a': 'addField',
      'mouseover .sb-add-field-types': 'lockLeftWrapper',
      'mouseout .sb-add-field-types': 'unlockLeftWrapper',
      'hide.bs.modal #sb_edit_model': 'deSelectField'
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
      this.bindSaveEvent();
      return setTimeout((function(_this) {
        return function() {
          _this.formSaved = false;
          _this.saveForm.call(_this);
          return $(".play-now").removeAttr("disabled");
        };
      })(this), 2500);
    };

    BuilderView.prototype.bindSaveEvent = function() {
      this.formSaved = true;
      this.saveFormButton = $(".js-save-form");
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
      return this.addAll();
    };

    BuilderView.prototype.render = function() {
      var j, len, ref, subview;
      this.$el.html(Formbuilder.templates['page']());
      this.$fbLeft = this.$el.find('.sb-left');
      this.$responseFields = this.$el.find('.sb-response-fields');
      this.hideShowNoResponseFields();
      ref = this.SUBVIEWS;
      for (j = 0, len = ref.length; j < len; j++) {
        subview = ref[j];
        new subview({
          parentView: this
        }).render();
      }
      return this;
    };

    BuilderView.prototype.bindWindowScrollEvent = function() {
      return $(window).on('scroll', (function(_this) {
        return function() {
          var element, maxMargin, newMargin;
          element = $(".sb-tab-pane");
          newMargin = Math.max(0, $(window).scrollTop() - element.offset().top);
          maxMargin = _this.$responseFields.height();
          return element.css({
            'padding-top': Math.min(maxMargin, newMargin)
          });
        };
      })(this));
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
      } else if (($replacePosition = this.$responseFields.find(".sb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: (function(_this) {
          return function(e, ui) {
            var rf;
            console.log(ui, ui.item.attr('data-field-type'), e);
            if (ui.item.data('field-type')) {
              console.log("HERE");
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
          return function(e, ui) {};
        })(this),
        activate: (function(_this) {
          return function(e, ui) {};
        })(this)
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons;
      $addFieldButtons = this.$el.find("[data-field-types]");
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
      return this.setSortable();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      return this.$el.find(".sb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
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
      $responseFieldEl = this.$el.find(".sb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').siblings('.sb-field-wrapper').removeClass('editing');
      this.editView = new EditFieldView({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      this.$el.find(".sb-edit-field-wrapper").html($newEditEl);
      $('#sb_edit_model').modal('show');
      this.scrollLeftWrapper($responseFieldEl);
      return this;
    };

    BuilderView.prototype.deSelectField = function(model) {
      this.$el.find(".sb-field-wrapper").removeClass('editing');
      return Formbuilder.uploads.hide();
    };

    BuilderView.prototype.ensureEditViewScrolled = function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".sb-field-wrapper.editing"));
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

    BuilderView.prototype.handleFormUpdate = function(e) {
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
        fields: this.collection.toJSON(),
        screens: this.formBuilder.screenView.toJSON()
      });
      if (Formbuilder.options.HTTP_ENDPOINT) {
        this.doAjaxSave(payload);
      }
      return this.formBuilder.trigger('save', payload);
    };

    BuilderView.prototype.doForceSave = function() {
      this.formSaved = false;
      return this.saveForm();
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

  ScreenCollection = (function(superClass) {
    extend(ScreenCollection, superClass);

    function ScreenCollection() {
      return ScreenCollection.__super__.constructor.apply(this, arguments);
    }

    ScreenCollection.prototype.initialize = function() {};

    ScreenCollection.prototype.model = ScreenModel;

    return ScreenCollection;

  })(Backbone.Collection);

  ScreenView = (function(superClass) {
    extend(ScreenView, superClass);

    function ScreenView() {
      return ScreenView.__super__.constructor.apply(this, arguments);
    }

    ScreenView.prototype.events = {
      'input #survey_title': 'update',
      'input #survey_description': 'update',
      'input #survey_thank_you': 'update',
      'input #survey_image': 'update',
      'click .screen_img': 'attach_logo'
    };

    ScreenView.prototype.initialize = function(options) {
      var screens, selector;
      selector = options.selector, this.formBuilder = options.formBuilder, screens = options.screens;
      if (selector != null) {
        this.setElement($(selector));
      }
      this.dat = screens;
      return this.render(screens);
    };

    ScreenView.prototype.update = _.debounce(function() {
      this.dat = [$('#survey_title').val(), $('#survey_description').val(), $('#survey_thank_you').val(), $('#survey_image').val()];
      this.renderIcon();
      return this.formBuilder.mainView.doForceSave();
    }, 500);

    ScreenView.prototype.attach_logo = function(e) {
      var callback, ol_val, p, t, target;
      target = $(e.currentTarget);
      ol_val = $('#survey_image').val();
      t = target.offset().top + (target.outerHeight()) + 10;
      p = target.offset().left + (target.outerWidth() * 0.5);
      callback = _.debounce((function(_this) {
        return function(uridat) {
          var uri;
          uri = $('#survey_image');
          if (uridat !== "") {
            return uri.val(uridat).trigger('input');
          } else {
            return uri.val("").trigger('input');
          }
        };
      })(this), 500);
      return Formbuilder.uploads.show(t, p, 'logo', callback, ol_val);
    };

    ScreenView.prototype.toJSON = function() {
      return this.dat;
    };

    ScreenView.prototype.renderIcon = function() {
      if ($('#survey_image').val() !== "") {
        return $('#survey_image_status').show();
      } else {
        return $('#survey_image_status').hide();
      }
    };

    ScreenView.prototype.render = function(dat) {
      $('#survey_title').val(dat[0]);
      $('#survey_description').val(dat[1]);
      $('#survey_thank_you').val(dat[2]);
      $('#survey_image').val(dat[3]);
      return this.renderIcon();
    };

    return ScreenView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, base;
        attrs = {};
        attrs[Formbuilder.options.mappings.LABEL] = Formbuilder.options.dict.DEFAULT_LABEL;
        attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type;
        attrs[Formbuilder.options.mappings.REQUIRED] = true;
        attrs[Formbuilder.options.mappings.QNO] = 2;
        attrs['field_options'] = {};
        return (typeof (base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'sb-button',
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
        NEXT_VA: 'next.va',
        VALIDATION: 'field_options.validation',
        QNO: 'q_no',
        RICHTEXT: 'richtext',
        NOTIFICATION: 'notifications'
      },
      limit_map: {
        yes_no: {
          min: 2,
          max: 3
        },
        single_choice: {
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
        DEFAULT_OPTION: 'Option\x1e',
        DEFAULT_YES: 'Yes\x1e',
        DEFAULT_NO: 'No\x1e',
        DEFAULT_MAYBE: 'Maybe\x1e',
        SAVE_FORM: 'Save',
        UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!',
        FIELDS: {
          short_text: "Short and quick answers to short and quick questions!<br>eg. What is your name?",
          long_text: "Longer, detailed responses.<br>eg. What do you REALLY feel about our product?",
          yes_no: "The quick opinion question.",
          multiple_choice: "Your responder selects many or all options here!",
          single_choice: "For questions to which you want only one answer",
          ranking: "Users can drag and drop the following options according to their preference!",
          rating: "This question asks to rate on a scale of 1 to 10.<br>eg. How much do you like the design of our product?",
          group_rating: "Ask users to rate a number of things on a scale of one star to five stars!"
        }
      }
    };

    Formbuilder.uploads = {
      init: function(opt) {
        var show_bounce;
        this.dzbtn = Ladda.create(document.querySelector('#sb-dz-attach'));
        this.dzbtnel = $('#sb-dz-attach');
        this.cropmodal = $('div#sb-attach').find('.crop');
        this.cropcontainer = $('div#sb-attach').find('.croparea');
        this.cropdone = $('div#sb-attach').find('.sb-crop-done');
        this.cropcancel = $('div#sb-attach').find('.sb-crop-cancel');
        this.dz = new Dropzone('body', {
          url: opt.img_upload,
          paramName: 'swag',
          maxFilesize: 4,
          acceptedFiles: 'image/*',
          clickable: '#sb-dz-attach',
          previewTemplate: '',
          previewsContainer: false,
          autoQueue: false,
          autoProcessQueue: true
        });
        this.opt = opt;
        this.dz.on('addedfile', (function(_this) {
          return function(file) {
            if (!file.cropped) {
              return;
            }
            return _this.dzbtn.start();
          };
        })(this));
        this.dz.on('thumbnail', (function(_this) {
          return function(file) {
            var cancel_bound_btn, cancel_btn_handler, done_bound_btn, done_btn_handler, img, reader;
            if (file.cropped) {
              return;
            }
            _this.dz.removeFile(file);
            img = $('<img class="original" />');
            reader = new FileReader;
            reader.onloadend = function() {
              _this.cropcontainer.html(img);
              img.attr('src', reader.result);
              return img.cropper({
                aspectRatio: 1,
                movable: true,
                viewMode: 1,
                cropBoxResizable: true,
                autoCropArea: 0.8,
                background: false
              });
            };
            reader.readAsDataURL(file);
            _this.cropmodal.addClass('open');
            done_btn_handler = function() {
              return img.cropper('getCroppedCanvas').toBlob((function(_this) {
                return function(blob) {
                  var newfile;
                  newfile = new File([blob], file.name, {
                    type: file.type
                  });
                  newfile.status = file.status;
                  newfile.accepted = file.accepted;
                  newfile.upload = file.upload;
                  newfile.cropped = true;
                  _this.dz.addFile(newfile);
                  _this.dz.enqueueFile(newfile);
                  _this.cropmodal.removeClass('open');
                  img.cropper('destroy');
                  _this.cropcontainer.html('');
                  return _this.cropdone.off();
                };
              })(this));
            };
            cancel_btn_handler = function() {
              this.cropmodal.removeClass('open');
              img.cropper('destroy');
              this.cropcontainer.html('');
              return this.cropdone.off();
            };
            done_bound_btn = _.bind(done_btn_handler, _this);
            cancel_bound_btn = _.bind(cancel_btn_handler, _this);
            _this.cropdone.on('click', _.debounce(done_bound_btn, 100));
            return _this.cropcancel.on('click', _.debounce(cancel_bound_btn, 100));
          };
        })(this));
        this.dz.on('totaluploadprogress', (function(_this) {
          return function(progress) {
            return _this.dzbtn.setProgress(progress / 100);
          };
        })(this));
        this.dz.on('queuecomplete', (function(_this) {
          return function(progress) {
            return _this.dzbtn.setProgress(0);
          };
        })(this));
        this.dz.on('error', (function(_this) {
          return function(file, e, xhr) {
            _this.dzbtn.stop();
            _this.dz.removeAllFiles();
            if (xhr != null) {
              e = e.message;
            }
            return swal({
              title: "Upload Error",
              text: e,
              type: "error",
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Okay",
              closeOnConfirm: true
            });
          };
        })(this));
        this.dz.on('success', (function(_this) {
          return function(file, e) {
            var js;
            _this.dzbtn.stop();
            _this.dz.removeAllFiles();
            js = JSON.parse(file.xhr.response);
            return _this.add_thumbnail({
              uri: js.temp_uri,
              id: js.metadata.id,
              name: js.access_id
            });
          };
        })(this));
        this.th_el = $('#sb-thumbnails');
        this.load_old();
        this.init_thumbnail();
        show_bounce = _.bind(this.show_routine, this);
        this.show = _.debounce(show_bounce, 100);
        return this.at = $('#sb-attach');
      },
      init_thumbnail: function() {
        $('.sb-images-container').on('click', 'img.image_picker_image', (function(_this) {
          return function(e) {
            var v;
            _this.th_el.data('picker').sync_picker_with_select();
            v = _this.th_el.val();
            return _this.callback(v);
          };
        })(this));
        return $('.sb-images-container').on('click', 'a.image_picker_delete', (function(_this) {
          return function(e) {
            var im_id;
            im_id = $(e.currentTarget).attr('data-target');
            return swal({
              title: "Are you sure you want to delete this Image?",
              text: "As a fail-safe requirement, any existing question which uses this image will continue to access the image until manually changed.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false,
              showLoaderOnConfirm: true
            }, function() {
              return $.ajax({
                url: _this.opt.img_delete_uri,
                method: 'DELETE',
                data: {
                  swag: im_id
                }
              }).done(function() {
                var v;
                swal({
                  title: "Succesfully Deleted",
                  type: "success",
                  confirmButtonText: 'Proceed',
                  closeOnConfirm: true,
                  showCancelButton: false
                }, function() {});
                _this.th_el.find("option[data-img-id=" + im_id + "]").remove();
                _this.th_el.imagepicker();
                _this.th_el.data('picker').sync_picker_with_select();
                v = _this.th_el.val();
                return _this.callback(v);
              }).fail(function() {
                return swal({
                  title: "Sorry, something went wrong. Please try again, or contact Support.",
                  type: "error"
                });
              });
            });
          };
        })(this));
      },
      load_old: function() {
        return $.getJSON(this.opt.img_list, (function(_this) {
          return function(data) {
            var i, j, len, ref;
            console.log(data);
            ref = data.imgs;
            for (j = 0, len = ref.length; j < len; j++) {
              i = ref[j];
              _this.add_thumbnail(i);
            }
            return _this.add_thumbnail({});
          };
        })(this));
      },
      add_thumbnail: function(i) {
        return this.th_el.prepend($('<option>', {
          'data-img-src': i.uri,
          'data-img-id': i.id,
          'data-img-name': i.name,
          value: i.name
        })).imagepicker();
      },
      show_routine: function(t, r, delegate, callback, selected) {
        var scroll;
        this.at.removeClass('top');
        this.at.removeClass('right');
        if (delegate === 'right') {
          this.at.addClass('right').css('top', t - (this.at.height() * 0.5)).css('position', 'fixed').css('right', r).css('left', 'auto').css('z-index', 2000).addClass('open');
        } else if (delegate === 'logo') {
          this.at.addClass('top').css('top', t - 60).css('position', 'absolute').css('left', r - this.at.width() * 0.5 - 90).css('right', 'auto').css('z-index', 10).addClass('open');
        }
        this.th_el.val(selected).imagepicker();
        this.callback = callback;
        scroll = _.bind(function() {
          return $(".sb-images-container").scrollTo("div.thumbnail.selected", {
            duration: 200,
            offset: -50
          });
        });
        return _.delay(scroll, 100);
      },
      hide: function() {
        var df;
        this.at.removeClass('open');
        df = _.bind((function(_this) {
          return function() {
            return _this.at.css('top', 0);
          };
        })(this), this);
        this.callback = false;
        return _.delay(df, 1000);
      }
    };

    Formbuilder.proxy = {
      addTargetAndSources: function() {}
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
      this.screenView = new ScreenView(args);
      Formbuilder.uploads.init(args.endpoints);
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
    order: 8,
    view: "<% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>\n<% for (i = 0; i < lis.length; i += 1) { %>\n  <div class=\"line\">\n    <label class='sb-option'>\n      <p>\n          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n          <br>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n          <i class=\"fa fa-star\"></i>\n      </p>\n    </label>\n  </div>\n<% } %>\n  <button class=\"target hanging\"\n          data-target = \"out\"\n          id = \"<%= rf.cid %>_0\"\n  ></button>",
    edit: "<%= Formbuilder.templates['edit/notify']() %> <%= Formbuilder.templates['edit/options']() %> <%= Formbuilder.templates['edit/notify_group_rating']() %>",
    addButton: "<span class=\"pull-left\"><i class=\"fa fa-star\"></i></span> Group Rating</span>",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }, {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('multiple_choice', {
    order: 5,
    view: "<% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>\n<% for (i = 0; i < lis.length; i += 1) { %>\n  <div class=\"line\">\n      <p>\n        <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n        <% if (rf.get(Formbuilder.options.mappings.RICHTEXT ) &&\n               typeof rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"undefined\" &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"\") { %>\n          <i class=\"fa fa-paperclip\"></i>\n        <% } %>\n        <% if (rf.get(Formbuilder.options.mappings.NOTIFICATION) &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].notify) { %>\n          <i class=\"fa fa-globe\"></i>\n        <% } %>\n      </p>\n  </div>\n<% } %>\n  <button class=\"target hanging\"\n          data-target = \"out\"\n          id = \"<%= rf.cid %>_0\"\n  ></button>",
    edit: "<%= Formbuilder.templates['edit/notify']() %>\n<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"pull-left\"><span class=\"fa fa-square-o\"></span></span> Multiple Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }, {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('long_text', {
    order: 1,
    view: "<div class=\"line\">\n    <p>Any Response</p>\n    <button class=\"target\"\n            data-target = \"out\"\n            id = \"<%= rf.cid %>_0\"\n            data-target-index = \"0\"\n            data-target-value = \"\"\n    ></button>\n</div>",
    edit2: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    edit: "",
    addButton: "<span class=\"pull-left\">&#182;</span> Long Text"
  });

}).call(this);

(function() {
  Formbuilder.registerField('ranking', {
    order: 6,
    view: "<% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>\n<% for (i = 0; i < lis.length; i += 1) { %>\n  <div class=\"line\">\n    <label class='sb-option'>\n      <p>\n        <span class=\"digit up\"><i class=\"fa fa-arrow-up\"></i></span><span class=\"digit down\"><i class=\"fa fa-arrow-down\"></i></span>\n        <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n        <% if (rf.get(Formbuilder.options.mappings.RICHTEXT ) &&\n               typeof rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"undefined\" &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"\") { %>\n          <i class=\"fa fa-paperclip\"></i>\n        <% } %>\n        <% if (rf.get(Formbuilder.options.mappings.NOTIFICATION) &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].notify) { %>\n          <i class=\"fa fa-globe\"></i>\n        <% } %>\n      </p>\n    </label>\n  </div>\n<% } %>\n  <button class=\"target hanging\"\n          data-target = \"out\"\n          id = \"<%= rf.cid %>_0\"\n  ></button>",
    edit: "<%= Formbuilder.templates['edit/notify']() %>\n<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"pull-left\"><span class=\"fa fa-bars\"></span></span> Ranking",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }, {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('rating', {
    order: 7,
    view: "<div class=\"line\">\n  <label class='sb-option'>\n    <p>\n          <span class=\"digit\">1</span>\n          <span class=\"digit\">2</span>\n          <span class=\"digit\">3</span>\n          <span class=\"digit\">4</span>\n          <span class=\"digit spacer\">...</span>\n          <span class=\"digit\">8</span>\n          <span class=\"digit\">9</span>\n          <span class=\"digit\">10</span>\n    </p>\n  </label>\n</div>\n  <button class=\"target hanging\"\n          data-target = \"out\"\n          id = \"<%= rf.cid %>_0\"\n  ></button>",
    edit: "<%= Formbuilder.templates['edit/notify']() %>\n<%= Formbuilder.templates['edit/notify_rating']() %>\n",
    addButton: "<span class=\"pull-left\"><span class=\"fa fa-star\"></span></span> Rating"
  });

}).call(this);

(function() {
  Formbuilder.registerField('short_text', {
    order: 0,
    view: "<div class=\"line\">\n    <p>Any Response</p>\n    <button class=\"target hanging\"\n            data-target = \"out\"\n            id = \"<%= rf.cid %>_0\"\n    ></button>\n</div>",
    edit: "<%= Formbuilder.templates['edit/validation']() %>",
    addButton: "<span class='pull-left'><span class='fa fa-font'></span></span> Short Text"
  });

}).call(this);

(function() {
  Formbuilder.registerField('single_choice', {
    order: 4,
    view: "<% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>\n<% for (i = 0; i < lis.length; i += 1) { %>\n  <div class=\"line\">\n      <span class=\"link\"></span>\n      <p>\n        <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n        <% if (rf.get(Formbuilder.options.mappings.RICHTEXT ) &&\n               typeof rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"undefined\" &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"\") { %>\n          <i class=\"fa fa-paperclip\"></i>\n        <% } %>\n        <% if (rf.get(Formbuilder.options.mappings.NOTIFICATION) &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].notify) { %>\n          <i class=\"fa fa-globe\"></i>\n        <% } %>\n      </p>\n      <button class=\"target\"\n              data-target = \"out\"\n              id = \"<%= rf.cid %>_<%= i %>\"\n              data-target-index = \"<%= i %>\"\n              data-target-value = \"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\"\n      ></button>\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/notify']() %>\n<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"pull-left\"><span class=\"fa fa-circle-o\"></span></span> Single Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }, {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('yes_no', {
    order: 2,
    view: "<% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>\n<% for (i = 0; i < lis.length; i += 1) { %>\n  <div class=\"line\">\n      <span class=\"link\"></span>\n      <p>\n        <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n        <% if (rf.get(Formbuilder.options.mappings.RICHTEXT ) &&\n               typeof rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"undefined\" &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== \"\") { %>\n          <i class=\"fa fa-paperclip\"></i>\n        <% } %>\n        <% if (rf.get(Formbuilder.options.mappings.NOTIFICATION) &&\n               rf.get(Formbuilder.options.mappings.OPTIONS)[i].notify) { %>\n          <i class=\"fa fa-globe\"></i>\n        <% } %>\n      </p>\n      <!--span class=\"skip\"><i class=\"fa fa-level-up\"></i><span>11</span></span-->\n      <button class=\"target\"\n              data-target = \"out\"\n              id = \"<%= rf.cid %>_<%= i %>\"\n              data-target-index = \"<%= i %>\"\n              data-target-value = \"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\"\n      ></button>\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/notify']() %>\n<%= Formbuilder.templates['edit/options']() %>",
    addButton: "<span class=\"pull-left\"><span class=\"fa fa-dot-circle-o\"></span></span> Yes \/ No",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }, {
          label: Formbuilder.options.dict.DEFAULT_OPTION,
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);
