Formbuilder.registerField 'short_text',

  order: 0

  view: """
    <div class="line">
        <p>Any Response</p>
        <button class="target hanging"
                data-target = "out"
                id = "<%= rf.cid %>_0"
        ></button>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/validation']() %>
  """

  addButton: """
    <span class='pull-left'><span class='fa fa-font'></span></span> Short Text
  """
