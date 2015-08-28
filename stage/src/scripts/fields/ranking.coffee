Formbuilder.registerField 'ranking',

  order: 51

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div class="line">
        <label class='fb-option'>
          <p>
              <span class="digit up"><i class="fa fa-arrow-up"></i></span><span class="digit down"><i class="fa fa-arrow-down"></i></span>
              <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
          </p>
        </label>
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
    <span class="symbol"><span class="fa fa-bars"></span></span> Ranking
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

