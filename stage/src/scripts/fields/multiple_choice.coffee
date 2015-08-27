Formbuilder.registerField 'multiple_choice',

  order: 10

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div class="line">
          <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>
      </div>
    <% } %>
    <button class="target hanging"
            data-target = "out"
            data-target-index = "0"
    ></button>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']() %>
  """

  addButton: """
    <span class="symbol"><span class="fa fa-square-o"></span></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "Option One",
      checked: false
    ,
      label: "Option Two",
      checked: false
    ]

    attrs