Formbuilder.registerField 'single_choice',

  order: 4

  view: """
    <% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>
    <% for (i = 0; i < lis.length; i += 1) { %>
      <div class="line">
          <span class="link"></span>
          <p>
            <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
            <% if (rf.get(Formbuilder.options.mappings.RICHTEXT ) &&
                   rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_enabled) { %>
              <i class="fa fa-paperclip"></i>
            <% } %>
            <% if (rf.get(Formbuilder.options.mappings.NOTIFICATION) &&
                   rf.get(Formbuilder.options.mappings.OPTIONS)[i].notify) { %>
              <i class="fa fa-globe"></i>
            <% } %>
          </p>
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
    <%= Formbuilder.templates['edit/notify']() %>
    <%= Formbuilder.templates['edit/options']() %>
  """

  addButton: """
    <span class="pull-left"><span class="fa fa-circle-o"></span></span> Single Choice
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
