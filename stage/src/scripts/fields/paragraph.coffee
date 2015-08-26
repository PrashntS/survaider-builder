Formbuilder.registerField 'paragraph',

  order: 1

  view: """
    <div class="line">
        <p>Any Response</p>
        <button class="target" data-target="out"></button>
    </div>
  """

  edit2: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  edit: """
    This is a Paragraph Question.
  """

  addButton: """
    <span class="symbol">&#182;</span> Paragraph
  """
