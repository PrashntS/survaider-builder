Formbuilder.registerField 'group_rating',

  order: 8

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div class="line">
        <label class='sb-option'>
          <p>
              <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
              <br>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
          </p>
        </label>
      </div>
    <% } %>
    <button class="target hanging"
            data-target = "out"
            data-target-index = "0"
    ></button>
  """

  edit: "
    <%= Formbuilder.templates['edit/options']() %>
  "

  addButton: """
    <span class="symbol"><span class="fa fa-star"></span></span> Group Rating
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.field_options.options = [
      label: Formbuilder.options.dict.DEFAULT_OPTION,
      checked: false
    ,
      label: Formbuilder.options.dict.DEFAULT_OPTION,
      checked: false
    ]

    attrs
