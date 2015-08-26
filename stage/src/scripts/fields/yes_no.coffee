Formbuilder.registerField 'yesNo',

  order: 3

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

  edit: "No options"


  addButton: """
    <span class="symbol"><span class="fa fa-dot-circle-o"></span></span> Yes \/ No
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.field_options.options = [
      label: "Yes",
      checked: false
    ,
      label: "No",
      checked: false
    ]

    attrs
