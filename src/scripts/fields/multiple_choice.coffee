Formbuilder.registerField 'multiple_choice',

  order: 5

  view: """
    <% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>
    <% for (i = 0; i < lis.length; i += 1) { %>
      <div class="line">
          <p>
            <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
            <% if (rf.get(Formbuilder.options.mappings.RICHTEXT ) &&
                   rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_uri !== "") { %>
              <i class="fa fa-paperclip"></i>
            <% } %>
            <% if (rf.get(Formbuilder.options.mappings.NOTIFICATION) &&
                   rf.get(Formbuilder.options.mappings.OPTIONS)[i].notify) { %>
              <i class="fa fa-globe"></i>
            <% } %>
          </p>
      </div>
    <% } %>
      <button class="target hanging"
              data-target = "out"
              id = "<%= rf.cid %>_0"
      ></button>
  """

  edit: """
    <%= Formbuilder.templates['edit/notify']() %>
    <%= Formbuilder.templates['edit/options']() %>
  """

  addButton: """
    <span class="pull-left"><span class="fa fa-square-o"></span></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: Formbuilder.options.dict.DEFAULT_OPTION,
      checked: false
    ,
      label: Formbuilder.options.dict.DEFAULT_OPTION,
      checked: false
    ]

    attrs
