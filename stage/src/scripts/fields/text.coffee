Formbuilder.registerField 'text',

  order: 0

  view: """
    <div class="line">
        <p>Any Response</p>
        <button class="target" data-target="out"></button>
    </div>
  """

  edit: """"""
  
  ed:  """
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-font'></span></span> Short Text
  """
