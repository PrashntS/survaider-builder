Formbuilder.registerField 'yes_no',

  order: 2

  view: """
    <% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>
    <% for (i = 0; i < lis.length; i += 1) { %>
      <div class="line">
          <span class="link"></span>
          <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>
          <button class="target"
                  data-target = "out"
                  id = "<%= rf.cid %>_<%= i %>"
                  data-target-index = "<%= i %>"
                  data-target-value = "<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>"
          ></button>
      </div>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']() %>
  """

  addButton: """
    <span class="symbol"><span class="fa fa-dot-circle-o"></span></span> Yes \/ No
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
