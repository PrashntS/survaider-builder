Formbuilder.registerField 'ranking',

  order: 6

  view: """
    <% lis = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>
    <% for (i = 0; i < lis.length; i += 1) { %>
      <div class="line">
        <label class='sb-option'>
          <p>
            <span class="digit up"><i class="fa fa-arrow-up"></i></span><span class="digit down"><i class="fa fa-arrow-down"></i></span>
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
        </label>
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
    <span class="pull-left"><span class="fa fa-bars"></span></span> Ranking
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

