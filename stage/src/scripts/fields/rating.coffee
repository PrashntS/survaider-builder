Formbuilder.registerField 'rating',

  order: 52

  view: """
    <div class="line">
      <label class='fb-option'>
        <p>
            Any Response <br>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
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
