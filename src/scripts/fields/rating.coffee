Formbuilder.registerField 'rating',

  order: 7

  view: """
    <div class="line">
      <label class='sb-option'>
        <p>
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
      <button class="target hanging"
              data-target = "out"
              id = "<%= rf.cid %>_0"
      ></button>
  """

  edit: """
    <%= Formbuilder.templates['edit/notify']() %>
    <%= Formbuilder.templates['edit/notify_rating']() %>

  """

  addButton: """
    <span class="pull-left"><span class="fa fa-star"></span></span> Rating
  """
