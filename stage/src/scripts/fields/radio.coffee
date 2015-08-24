Formbuilder.registerField 'radio',

  order: 15

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div class="line">
          <span class="link"></span>
          <p><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %></p>
          <button class="target" id="T_1_2"></button>
      </div>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']() %>
  """

  addButton: """
    <span class="symbol"><span class="fa fa-circle-o"></span></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs