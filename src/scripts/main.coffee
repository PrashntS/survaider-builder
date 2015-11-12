class FormbuilderModel extends Backbone.DeepModel
  sync: -> # noop
  indexInDOM: ->
    $wrapper = $(".sb-field-wrapper").filter (_, el) => $(el).data('cid') == @cid
    $(".sb-field-wrapper").index $wrapper
  is_input: ->
    Formbuilder.inputFields[@get(Formbuilder.options.mappings.FIELD_TYPE)]?

class ScreenModel extends Backbone.DeepModel
  screens:
    intro:
      title: 'Default Title'
      description: 'Default Description'
    end:
      title: 'Default Ending'

class FormbuilderCollection extends Backbone.Collection
  initialize: ->
    @on 'add', @copyCidToModel

  model: FormbuilderModel

  comparator: (model) ->
    model.indexInDOM()

  copyCidToModel: (model) ->
    model.attributes.cid = model.cid

class ViewFieldView extends Backbone.View
  ###
  The question cards.
  ###

  className: "sb-field-wrapper"

  events:
    'click .subtemplate-wrapper': 'focusEditView'
    'click .js-duplicate': 'duplicate'
    'click .js-clear': 'clear'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "change", @render
    @listenTo @model, "destroy", @remove

  render: ->
    @$el.addClass('response-field-' + @model.get(Formbuilder.options.mappings.FIELD_TYPE))
        .data('cid', @model.cid)
        .attr('data-cid', @model.cid)
        .html(Formbuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    return @

  focusEditView: ->
    @parentView.createAndShowEditView(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    cb = =>
      @parentView.handleFormUpdate()
      @model.destroy()

    x = Formbuilder.options.CLEAR_FIELD_CONFIRM

    switch typeof x
      when 'string'
        if confirm(x) then cb()
      when 'function'
        x(cb)
      else
        cb()


  duplicate: ->
    attrs = _.clone(@model.attributes)
    delete attrs['id']
    attrs['label'] += ' Copy'
    @parentView.createField attrs, { position: @model.indexInDOM() + 1 }

class EditFieldView extends Backbone.View
  className: "edit-response-field"

  events:
    'click .js-add-option': 'addOption'
    'click .js-remove-option': 'removeOption'
    'click .js-default-updated': 'defaultUpdated'
    'input .option-label-input': 'forceRender'
    'click .sb-label-description': 'prepareLabel'
    'click .option': 'prepareLabel'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "destroy", @remove

  render: ->
    @$el.html(Formbuilder.templates["edit/base"]({rf: @model}))
    rivets.bind @$el, { model: @model }
    return @

  remove: ->
    @parentView.editView = undefined
    $("#editField").removeClass("active")
    super

  # @todo this should really be on the model, not the view
  addOption: (e) ->
    $el = $(e.currentTarget)
    i = @$el.find('.option').index($el.closest('.option'))
    options = @model.get(Formbuilder.options.mappings.OPTIONS) || []
    newOption = {label: Formbuilder.options.dict.DEFAULT_OPTION, checked: false}

    op_len = $el.parent().parent().find('.option').length

    field_type = @model.get(Formbuilder.options.mappings.FIELD_TYPE)

    if (Formbuilder.options.limit_map[field_type] && op_len >= Formbuilder.options.limit_map[field_type].max)
      sweetAlert("", "This question only supports three options." + field_type, "error")
      return

    if i > -1
      options.splice(i + 1, 0, newOption)
    else
      options.push newOption

    @model.set Formbuilder.options.mappings.OPTIONS, options
    @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
    @forceRender()

  removeOption: (e) ->
    $el = $(e.currentTarget)
    index = @$el.find(".js-remove-option").index($el)
    op_len = $el.parent().parent().find('.option').length

    field_type = @model.get(Formbuilder.options.mappings.FIELD_TYPE)

    if (Formbuilder.options.limit_map[field_type] && op_len <= Formbuilder.options.limit_map[field_type].min)
      sweetAlert("", "This question only supports three options." + field_type, "error")
      return

    options = @model.get Formbuilder.options.mappings.OPTIONS
    options.splice index, 1
    @model.set Formbuilder.options.mappings.OPTIONS, options
    @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
    @forceRender()

  defaultUpdated: (e) ->
    $el = $(e.currentTarget)

    unless @model.get(Formbuilder.options.mappings.FIELD_TYPE) == 'checkboxes' # checkboxes can have multiple options selected
      @$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change')

    @forceRender()

  forceRender: ->
    @model.trigger('change')

  prepareLabel: (e) ->
    $el = $(e.currentTarget).find("input").eq(0)
    $el.val("") if $el.val().indexOf("\x1e") > -1

class BuilderView extends Backbone.View
  SUBVIEWS: []

  events:
    'click .js-save-form': 'saveForm'
    'click .sb-add-field-types a': 'addField'
    'mouseover .sb-add-field-types': 'lockLeftWrapper'
    'mouseout .sb-add-field-types': 'unlockLeftWrapper'
    'hide.bs.modal #sb_edit_model': 'deSelectField'

  initialize: (options) ->
    {selector, @formBuilder, @bootstrapData} = options

    # This is a terrible idea because it's not scoped to this view.
    if selector?
      @setElement $(selector)

    # Create the collection, and bind the appropriate events
    @collection = new FormbuilderCollection
    @collection.bind 'add', @addOne, @
    @collection.bind 'reset', @reset, @
    @collection.bind 'change', @handleFormUpdate, @
    @collection.bind 'destroy add reset', @hideShowNoResponseFields, @
    @collection.bind 'destroy', @ensureEditViewScrolled, @
    @render()
    @collection.reset(@bootstrapData)
    @bindSaveEvent()

    # STUPID HACK. :(
    setTimeout =>
      @formSaved = false
      @saveForm.call(@)
      $(".play-now").removeAttr("disabled")
    , 2500

  bindSaveEvent: ->
    @formSaved = true
    @saveFormButton = $(".js-save-form")
    @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)

    unless !Formbuilder.options.AUTOSAVE
      setInterval =>
        @saveForm.call(@)
      , 5000

    $(window).bind 'beforeunload', =>
      if @formSaved then undefined else Formbuilder.options.dict.UNSAVED_CHANGES

  reset: ->
    @$responseFields.html('')
    @addAll()

  render: ->
    @$el.html Formbuilder.templates['page']()

    # Save jQuery objects for easy use
    @$fbLeft = @$el.find('.sb-left')
    @$responseFields = @$el.find('.sb-response-fields')

    @hideShowNoResponseFields()

    # Render any subviews (this is an easy way of extending the Formbuilder)
    new subview({parentView: @}).render() for subview in @SUBVIEWS

    return @

  bindWindowScrollEvent: ->
    $(window).on 'scroll', =>
      #return if @$fbLeft.data('locked') == true
      element   = $(".sb-tab-pane")
      newMargin = Math.max(0, $(window).scrollTop() - element.offset().top)
      maxMargin = @$responseFields.height()

      element.css
        'padding-top': Math.min(maxMargin, newMargin)

  addOne: (responseField, _, options) ->
    view = new ViewFieldView
      model: responseField
      parentView: @

    #####
    # Calculates where to place this new field.
    #
    # Are we replacing a temporarily drag placeholder?
    if options.$replaceEl?
      options.$replaceEl.replaceWith(view.render().el)

    # Are we adding to the bottom?
    else if !options.position? || options.position == -1
      @$responseFields.append view.render().el

    # Are we adding to the top?
    else if options.position == 0
      @$responseFields.prepend view.render().el

    # Are we adding below an existing field?
    else if ($replacePosition = @$responseFields.find(".sb-field-wrapper").eq(options.position))[0]
      $replacePosition.before view.render().el

    # Catch-all: add to bottom
    else
      @$responseFields.append view.render().el

  setSortable: ->
    if @$responseFields.hasClass('ui-sortable')
      @$responseFields.sortable('destroy')
    @$responseFields.sortable
      forcePlaceholderSize: true
      placeholder: 'sortable-placeholder'
      stop: (e, ui) =>
        if ui.item.data('field-type')
          rf = @collection.create Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {$replaceEl: ui.item}
          @createAndShowEditView(rf)
        @handleFormUpdate()
        return true
      update: (e, ui) =>
        # ensureEditViewScrolled, unless we're updating from the draggable
        @ensureEditViewScrolled() unless ui.item.data('field-type')
      deactivate: (e, ui) =>
      activate: (e, ui) =>

    @setDraggable()

  setDraggable: ->
    $addFieldButtons = @$el.find("[data-field-type]")

    $addFieldButtons.draggable
      connectToSortable: @$responseFields
      helper: =>
        $helper = $("<div class='response-field-draggable-helper' />")
        $helper.css
          #width: @$responseFields.width() # hacky, won't get set without inline style
          width: '374px'
          height: '80px'
        $helper

  list_update: ->
    i = 0
    last = undefined
    for j in @collection.models
      j.set 'q_no', i + 1
      last = j
      i += 1
    console.log last

  addAll: ->
    @collection.each @addOne, @
    @setSortable()

  hideShowNoResponseFields: ->
    @$el.find(".sb-no-response-fields")[if @collection.length > 0 then 'hide' else 'show']()

  addField: (e) ->
    field_type = $(e.currentTarget).data('field-type')
    @createField Formbuilder.helpers.defaultFieldAttrs(field_type)

  createField: (attrs, options) ->
    rf = @collection.create attrs, options
    @createAndShowEditView(rf)
    @handleFormUpdate()

  createAndShowEditView: (model) ->
    $responseFieldEl = @$el.find(".sb-field-wrapper").filter( -> $(@).data('cid') == model.cid )
    $responseFieldEl.addClass('editing').siblings('.sb-field-wrapper').removeClass('editing')

    @editView = new EditFieldView
      model: model
      parentView: @

    $newEditEl = @editView.render().$el

    @$el.find(".sb-edit-field-wrapper").html $newEditEl

    $('#sb_edit_model').modal('show')

    @scrollLeftWrapper($responseFieldEl)
    return @

  deSelectField: (model)->
    @$el.find(".sb-field-wrapper").removeClass('editing')

  ensureEditViewScrolled: ->
    return unless @editView
    @scrollLeftWrapper $(".sb-field-wrapper.editing")

  scrollLeftWrapper: ($responseFieldEl) ->
    @unlockLeftWrapper()
    return unless $responseFieldEl[0]
    $.scrollWindowTo ((@$el.offset().top + $responseFieldEl.offset().top) - @$responseFields.offset().top), 200, =>
      @lockLeftWrapper()

  lockLeftWrapper: ->
    @$fbLeft.data('locked', true)

  unlockLeftWrapper: ->
    @$fbLeft.data('locked', false)

  handleFormUpdate: (e)->
    return if @updatingBatch
    @formSaved = false
    @saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM)
    @list_update()

  saveForm: (e) ->
    return if @formSaved
    @formSaved = true
    @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)
    @collection.sort()

    payload = JSON.stringify
      fields: @collection.toJSON()
      screens: @formBuilder.screenView.toJSON()

    console.log payload

    if Formbuilder.options.HTTP_ENDPOINT then @doAjaxSave(payload)
    @formBuilder.trigger 'save', payload

  doForceSave: ->
    @formSaved = false
    @saveForm()

  doAjaxSave: (payload) ->
    $.ajax
      url: Formbuilder.options.HTTP_ENDPOINT
      type: Formbuilder.options.HTTP_METHOD
      data: payload
      contentType: "application/json"
      success: (data) =>
        @updatingBatch = true

        for datum in data
          # set the IDs of new response fields, returned from the server
          @collection.get(datum.cid)?.set({id: datum.id})
          @collection.trigger 'sync'

        @updatingBatch = undefined

class ScreenCollection extends Backbone.Collection
  initialize: ->

  model: ScreenModel

class ScreenView extends Backbone.View
  events:
    'input #survey_title': 'update'
    'input #survey_description': 'update'
    'input #survey_thank_you': 'update'

  initialize: (options) ->
    {selector, @formBuilder, screens} = options

    if selector?
      @setElement $(selector)

    @dat = screens
    @render screens

  update: _.debounce ->
      @dat = [
        $('#survey_title').val(),
        $('#survey_description').val(),
        $('#survey_thank_you').val(),
      ]
      @formBuilder.mainView.doForceSave()
    ,500

  toJSON: ->
    @dat

  render: (dat) ->
    $('#survey_title').val(dat[0])
    $('#survey_description').val(dat[1])
    $('#survey_thank_you').val(dat[2])

class Formbuilder
  @helpers:
    defaultFieldAttrs: (field_type) ->
      attrs = {}
      attrs[Formbuilder.options.mappings.LABEL] = Formbuilder.options.dict.DEFAULT_LABEL
      attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type
      attrs[Formbuilder.options.mappings.REQUIRED] = true
      attrs[Formbuilder.options.mappings.QNO] = 2
      attrs['field_options'] = {}
      Formbuilder.fields[field_type].defaultAttributes?(attrs) || attrs

    simple_format: (x) ->
      x?.replace(/\n/g, '<br />')

  @options:
    BUTTON_CLASS: 'sb-button'
    HTTP_ENDPOINT: ''
    HTTP_METHOD: 'POST'
    AUTOSAVE: true
    CLEAR_FIELD_CONFIRM: false

    mappings:
      SIZE: 'field_options.size'
      UNITS: 'field_options.units'
      LABEL: 'label'
      FIELD_TYPE: 'field_type'
      REQUIRED: 'required'
      ADMIN_ONLY: 'admin_only'
      OPTIONS: 'field_options.options'
      DESCRIPTION: 'field_options.description'
      INCLUDE_OTHER: 'field_options.include_other_option'
      INCLUDE_BLANK: 'field_options.include_blank_option'
      INTEGER_ONLY: 'field_options.integer_only'
      MIN: 'field_options.min'
      MAX: 'field_options.max'
      MINLENGTH: 'field_options.minlength'
      MAXLENGTH: 'field_options.maxlength'
      LENGTH_UNITS: 'field_options.min_max_length_units'
      NEXT_VA: 'next.va'
      VALIDATION: 'field_options.validation'
      QNO: 'q_no'

    limit_map:
      yes_no:
        min: 2
        max: 3
      single_choice:
        min: 2
        max: 5
      multiple_choice:
        min: 2
        max: 5
      ranking:
        min: 2
        max: 6
      group_rating:
        min: 2
        max: 3

    dict:
      ALL_CHANGES_SAVED: 'Saved'
      DEFAULT_LABEL: 'Question Title\x1e'
      DEFAULT_OPTION: 'Option\x1e'
      DEFAULT_YES: 'Yes\x1e'
      DEFAULT_NO: 'No\x1e'
      DEFAULT_MAYBE: 'Maybe\x1e'
      SAVE_FORM: 'Save'
      UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'
      FIELDS:
        short_text: "Short and quick answers to short and quick questions!<br>eg. What is your name?"
        long_text: "Longer, detailed responses.<br>eg. What do you REALLY feel about our product?"
        yes_no: "The quick opinion question."
        multiple_choice: "Your responder selects many or all options here!"
        single_choice: "For questions to which you want only one answer"
        ranking: "Users can drag and drop the following options according to their preference!"
        rating: "This question asks to rate on a scale of 1 to 10.<br>eg. How much do you like the design of our product?"
        group_rating: "Ask users to rate a number of things on a scale of one star to five stars!"

  @richtext:
    template:
      "font-styles": -> """
        <li class="dropdown">
          <a data-toggle="dropdown" class="btn btn-default dropdown-toggle ">
            <span class="editor-icon editor-icon-headline">
            </span>
            <span class="current-font">
              Normal
            </span>
            <b class="caret">
            </b>
          </a>
          <ul class="dropdown-menu">
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="p" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                Normal
              </a>
            </li>
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="h1" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                1
              </a>
            </li>
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="h2" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                2
              </a>
            </li>
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="h3" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                3
              </a>
            </li>
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="h4" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                4
              </a>
            </li>
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="h5" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                5
              </a>
            </li>
            <li>
              <a tabindex="-1" data-wysihtml5-command-value="h6" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">
                6
              </a>
            </li>
          </ul>
        </li>
      """
      emphasis: -> """
        <li>
          <div class="btn-group">
            <a tabindex="-1" title="CTRL+B" data-wysihtml5-command="bold" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-bold">
              </i>
            </a>
            <a tabindex="-1" title="CTRL+I" data-wysihtml5-command="italic" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-italic">
              </i>
            </a>
            <a tabindex="-1" title="CTRL+U" data-wysihtml5-command="underline" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-underline">
              </i>
            </a>
          </div>
        </li>
      """
      blockquote: -> """
        <li>
          <a tabindex="-1" data-wysihtml5-display-format-name="false" data-wysihtml5-command-value="blockquote" data-wysihtml5-command="formatBlock" class="btn  btn-default" href="javascript:;" unselectable="on">
            <i class="editor-icon editor-icon-quote">
            </i>
          </a>
        </li>
      """
      lists: -> """
        <li>
          <div class="btn-group">
            <a tabindex="-1" title="Unordered list" data-wysihtml5-command="insertUnorderedList" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-ul">
              </i>
            </a>
            <a tabindex="-1" title="Ordered list" data-wysihtml5-command="insertOrderedList" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-ol">
              </i>
            </a>
            <a tabindex="-1" title="Outdent" data-wysihtml5-command="Outdent" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-outdent">
              </i>
            </a>
            <a tabindex="-1" title="Indent" data-wysihtml5-command="Indent" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-indent">
              </i>
            </a>
          </div>
        </li>
      """
      image: -> """
        <li>
          <div class="bootstrap-wysihtml5-insert-image-modal modal fade">
            <div class="modal-dialog ">
              <div class="modal-content">
                <div class="modal-header">
                  <a data-dismiss="modal" class="close">
                    x
                  </a>
                  <h3>
                    Insert image
                  </h3>
                </div>
                <div class="modal-body">
                  <input class="bootstrap-wysihtml5-insert-image-url form-control" value="http://">
                </div>
                <div class="modal-footer">
                  <a data-dismiss="modal" class="btn btn-default">
                    Cancel
                  </a>
                  <a data-dismiss="modal" class="btn btn-primary">
                    Insert image
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a tabindex="-1" title="Insert image" data-wysihtml5-command="insertImage" class="btn  btn-default" href="javascript:;" unselectable="on">
            <i class="editor-icon editor-icon-image">
            </i>
          </a>
        </li>
      """
      link: -> """
        <li>
          <div class="bootstrap-wysihtml5-insert-link-modal modal fade">
            <div class="modal-dialog ">
              <div class="modal-content">
                <div class="modal-header">
                  <a data-dismiss="modal" class="close">
                    Ã—
                  </a>
                  <h3>
                    Insert link
                  </h3>
                </div>
                <div class="modal-body">
                  <input class="bootstrap-wysihtml5-insert-link-url form-control" value="http://">
                  <label class="checkbox">

                    <input type="checkbox" checked="" class="bootstrap-wysihtml5-insert-link-target">
                    Open link in new window
                  </label>
                </div>
                <div class="modal-footer">
                  <a data-dismiss="modal" class="btn btn-default">
                    Cancel
                  </a>
                  <a data-dismiss="modal" class="btn btn-primary" href="#">
                    Insert link
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a tabindex="-1" title="Insert link" data-wysihtml5-command="createLink" class="btn  btn-default" href="javascript:;" unselectable="on">
            <i class="editor-icon editor-icon-link">
            </i>
          </a>
        </li>
      """
      html: -> """
        <li>
          <div class="btn-group">
            <a tabindex="-1" title="Edit HTML" data-wysihtml5-action="change_view" class="btn  btn-default" href="javascript:;" unselectable="on">
              <i class="editor-icon editor-icon-html">
              </i>
            </a>
          </div>
        </li>
      """

    init: ->
      $('#sb-edit-rich').wysihtml5
        html: true,
        customTemplates: @template

  @uploads:
    init: (opt) ->
      el = $ 'div#sbDropzone'
      console.log opt
      el.dropzone
        url: opt.img_upload
        paramName: 'swag'
        maxFilesize: 4
        uploadMultiple: false
        clickable: true

  @proxy:
    addTargetAndSources: ->

  @fields: {}
  @inputFields: {}
  @nonInputFields: {}

  @registerField: (name, opts) ->
    for x in ['view', 'edit']
      opts[x] = _.template(opts[x])

    opts.field_type = name

    Formbuilder.fields[name] = opts

    if opts.type == 'non_input'
      Formbuilder.nonInputFields[name] = opts
    else
      Formbuilder.inputFields[name] = opts

  constructor: (opts={}) ->
    _.extend @, Backbone.Events
    args = _.extend opts, {formBuilder: @}
    @mainView = new BuilderView args
    @screenView = new ScreenView args
    Formbuilder.uploads.init args.endpoints

window.Formbuilder = Formbuilder

if module?
  module.exports = Formbuilder
else
  window.Formbuilder = Formbuilder
