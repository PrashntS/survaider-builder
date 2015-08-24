Formbuilder.registerField 'text',

  order: 0

  view: """
    <div class="line">
        <p>Any Response</p>
        <button class="target" id="T_1_2"></button>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-font'></span></span> Text
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs
