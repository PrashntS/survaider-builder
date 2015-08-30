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
            data-target-index = "0"
    ></button>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="fa fa-star"></span></span> Rating
  """
