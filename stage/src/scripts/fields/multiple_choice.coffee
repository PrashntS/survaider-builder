Formbuilder.registerField 'multiple_choice',

  order: 10

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div class="line">
          <span class="link"></span>
          <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>
          <button class="target"
                  data-target = "out"
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
    <span class="symbol"><span class="fa fa-square-o"></span></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs