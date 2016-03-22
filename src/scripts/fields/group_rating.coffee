Formbuilder.registerField 'group_rating',

  order: 8

  view: """
    <% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>
    <% for (i = 0; i < lis.length; i += 1) { %>
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
              id = "<%= rf.cid %>_0"
      ></button>
  """

  edit: "
    <%= Formbuilder.templates['edit/notify']() %>
    <%= Formbuilder.templates['edit/options']() %>
    <%= Formbuilder.templates['edit/notify_group_rating']() %>
  "

  addButton: """
    <span class="pull-left"><i class="fa fa-star"></i></span> Group Rating</span>
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
