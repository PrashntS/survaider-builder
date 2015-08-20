Formbuilder.registerField 'ranking',

  order: 51

  view: """
    <div>
      <label class='fb-optdion'>
        <input type='radio' value='00' onclick="javascript: return false;" />
        <input type='radio' value='01' onclick="javascript: return false;" />
        <input type='radio' value='02' onclick="javascript: return false;" />
        <input type='radio' value='03' onclick="javascript: return false;" />
        <input type='radio' value='04' onclick="javascript: return false;" />
        <input type='radio' value='05' onclick="javascript: return false;" />
        <input type='radio' value='06' onclick="javascript: return false;" />
        <input type='radio' value='07' onclick="javascript: return false;" />
        <input type='radio' value='08' onclick="javascript: return false;" />
        <input type='radio' value='09' onclick="javascript: return false;" />
        <input type='radio' value='10' onclick="javascript: return false;" />
        0 -- 10
      </label>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="fa fa-sort"></span></span> Ranking
  """
