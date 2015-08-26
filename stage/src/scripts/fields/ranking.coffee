Formbuilder.registerField 'ranking',

  order: 51

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div class="line">
        <label class='fb-option'>
          <p>
              <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
              <br>
              <span class="digit">1</span>
              <span class="digit">2</span>
              <span class="digit">3</span>
              <span class="digit">4</span>
              <span class="digit spacer">...</span>
              <span class="digit">8</span>
              <span class="digit">9</span>
              <span class="digit">10</span>
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
      label: "Field One Goes here",
      checked: false
    ,
      label: "Field Two Goes here",
      checked: false
    ]

    attrs

