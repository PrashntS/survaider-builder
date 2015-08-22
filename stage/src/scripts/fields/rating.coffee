Formbuilder.registerField 'group_rating',

  order: 52

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div>
        <label class='fb-option'>
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>

          <input type='radio' value='00' onclick="javascript: return false;" />
          <input type='radio' value='01' onclick="javascript: return false;" />
          <input type='radio' value='02' onclick="javascript: return false;" />
          <input type='radio' value='03' onclick="javascript: return false;" />
          <input type='radio' value='04' onclick="javascript: return false;" />
          <input type='radio' value='05' onclick="javascript: return false;" />

          1 -- 5
        </label>
      </div>
    <% } %>
  """

  edit: "
    <%= Formbuilder.templates['edit/group_rating']() %>
  "

  addButton: """
    <span class="symbol"><span class="fa fa-"></span></span> Group Rating
  """
