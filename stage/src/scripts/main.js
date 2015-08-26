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
    'input .option-label-input': 'forceRender'
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
    var $el, i, newOption, options;
    $el = $(e.currentTarget);
    i = this.$el.find('.option').index($el.closest('.option'));
    options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
    newOption = {
      label: "",
      checked: false
    };
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
    var $el, index, options;
    $el = $(e.currentTarget);
    index = this.$el.find(".js-remove-option").index($el);
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
    return this.addAll();
  };

  BuilderView.prototype.render = function() {
    var j, len, ref, subview;
    this.$el.html(Formbuilder.templates['page']());
    this.$fbLeft = this.$el.find('.fb-left');
    this.$responseFields = this.$el.find('.fb-response-fields');
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
        var maxMargin, newMargin;
        if (_this.$fbLeft.data('locked') === true) {
          return;
        }
        newMargin = Math.max(0, $(window).scrollTop() - _this.$el.offset().top);
        maxMargin = _this.$responseFields.height();
        return _this.$fbLeft.css({
          'margin-top': Math.min(maxMargin, newMargin)
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
          console.log("DO")
          Links.reload();
          return true;
        };
      })(this),
      update: (function(_this) {
        return function(e, ui) {
          if (!ui.item.data('field-type')) {
            _this.ensureEditViewScrolled();
          }
          return Links.reload();
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
          Links.blur();
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
      attrs[Formbuilder.options.mappings.LABEL] = 'Question Title';
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
    dict: {
      ALL_CHANGES_SAVED: 'Saved',
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

// ---
// generated by coffee-script 1.9.2