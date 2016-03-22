this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/add_logic"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Add Option</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\n    Include blank\n  </label>\n';
 } ;
__p += '\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-remove-option" title="Remove Option"><i class="fa fa-times-circle"></i></a>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<a class="js-add-option .button"><i class="fa fa-plus-circle"></i>&nbsp;Add Option</a>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n' +
((__t = ( Formbuilder.templates['edit/common']({rf: rf}) )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-field-label\'>\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
'\'></code>\n  <span class=\'fa fa-arrow-right pull-right\'></span>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label>\n\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.RICHTEXT )) == null ? '' : __t) +
'\' />\n  Richtext\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Edit Question</div>\n\n<div class=\'sb-common-wrapper\'>\n  <div class=\'sb-label-description\'>\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']({rf: rf}) )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'sb-common-checkboxes\'>\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'sb-clear\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="form-group form-group-default required">\n<label>Question Label</label>\n<textarea class="form-control" data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\'></textarea>\n</div>\n<div class="form-group form-group-default">\n<label>Question Description</label>\n<textarea class="form-control" data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'></textarea>\n</div>\n<p>\n' +
((__t = ( Formbuilder.options.dict.FIELDS[rf.get(Formbuilder.options.mappings.FIELD_TYPE)] )) == null ? '' : __t) +
'\n</p>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/notify"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Notifications</div>\n\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.notifications\' />\n  Notify for Answers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/notify_group_rating"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'sb-edit-section-header\' data-rv-each-option="model.field_options.options">\n  <div data-rv-show=\'option:notify\'>\n  <p>Notify for <strong data-rv-text="option:label"></strong>:</p>\n  ';
 for(var i=0; i < 5; i++) {;
__p += '\n    <label>\n      ' +
((__t = ( i+1 )) == null ? '' : __t) +
'\n      <input type="checkbox" class="check"\n        data-rv-checked="option:notify_' +
((__t = ( i+1 )) == null ? '' : __t) +
'">\n    </label>\n  ';
 } ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/notify_rating"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'sb-edit-section-header\' data-rv-show=\'model.notifications\'>\n  <p>Notify for following ratings:</p>\n  ';
 for(var i=0; i < 10; i++) {;
__p += '\n    <label>\n      ' +
((__t = ( i+1 )) == null ? '' : __t) +
'\n      <input type="checkbox" class="check" data-rv-checked="model.field_options.notifications.' +
((__t = ( i+1 )) == null ? '' : __t) +
'">\n    </label>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Add Option</div>\n\n<div class="input-group option m-b-5" data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="text" class="form-control option-label-input" data-rv-input="option:label">\n  <a class="input-group-addon sb-attach-init" data-rv-if="model.' +
((__t = ( Formbuilder.options.mappings.RICHTEXT )) == null ? '' : __t) +
'">\n    <i class="fa fa-paperclip"></i>\n    <input type="text" data-rv-input="option:img_uri" class="form-control option-label-input" data-sb-attach="uri" style="display:none">\n    <input type="checkbox" class="check" data-sb-attach="enabled" data-rv-checked="option:img_enabled" style="display:none">\n  </a>\n  <a class="input-group-addon" data-rv-if="model.' +
((__t = ( Formbuilder.options.mappings.NOTIFICATION )) == null ? '' : __t) +
'">\n    <input type="checkbox" class="check notify-tick" data-rv-checked="option:notify">\n  </a>\n  <a class="input-group-addon js-remove-option">\n    <i class="fa fa-times-circle"></i>\n  </a>\n</div>\n\n<button class="btn btn-primary btn-sm m-b-10 js-add-option" type="button">\n  <i class="fa fa-plus-circle"></i> <span class="bold">Add Option</span>\n</button>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Size</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/validation"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="form-group required">\n    <select data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.VALIDATION )) == null ? '' : __t) +
'\'>\n      <option value="text">Text</option>\n      <option value="email">Email</option>\n      <option value="telephone">Phone Number</option>\n    </select>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/yes_no"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-edit-section-header\'>Yes No</div>\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-remove-option" title="Remove Option"><i class=\'fa fa-minus-circle\'></i></a>\n</div>\n\n<div class=\'sb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row no-margin">\n    <div class="col-xs-3 fixed">\n        <div id="builder-panel"></div>\n        <div class="panel panel-transparent affix" style="position:fixed; width:25%; bottom: 0; overflow: hidden; top: 60px;">\n          <div class="panel-heading">\n            <span class="font-montserrat text-uppercase bold">Project Details</span><br>\n            <span class="h3 font-montserrat" id="builder-project-title"></span>\n            <br>\n            <div class="btn-group btn-group-sm btn-group-justified m-t-10 m-b-10">\n              <a href="#" class="btn btn-primary" onclick="$(\'#survey_export_modal\').modal(\'show\');">\n                <span class="font-montserrat">Share / Preview</span>\n              </a>\n              <a href="#" class="btn btn-default" onclick="$(\'#survey_settings_modal\').modal(\'show\');">\n                <i class="fa fa-cog"></i>\n                <span class="font-montserrat">Settings</span>\n              </a>\n            </div>\n            <button class="btn btn-success font-montserrat btn-sm js-save-form">Save</button>\n          </div>\n          <div class="panel-body">\n            <hr>\n            <span class="font-montserrat text-uppercase bold">Fields</span>\n            <br>\n            ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n            <hr>\n            <p>Drag and Drop the questions to begin building the survaider.</p>\n          </div>\n        </div>\n\n        <!-- <button class=\'btn btn-success js-save-form\'></button> -->\n    </div>\n    <div class="col-xs-9 no-padding">\n        ' +
((__t = ( Formbuilder.templates['partials/right_side']() )) == null ? '' : __t) +
'\n    </div>\n</div>\n' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'sb-tab-pane active\' id=\'addField\'>\n  <div class=\'sb-add-field-types\'>\n    <div class=\'section\'>\n      ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\n        <a class="btn btn-block btn-default font-montserrat" data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n\n    <div class=\'section\'>\n      ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="modal fade slide-right" id="sb_edit_model" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content-wrapper">\n      <div class="modal-content">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="pg-close fs-14"></i>\n        </button>\n        <div class="container-xs-height full-height">\n          <div class="row-xs-height">\n            <div class="modal-body col-xs-height col-middle">\n              <div class=\'sb-field-options\' id=\'editField\'>\n                <div class=\'sb-edit-field-wrapper\'></div>\n                <div class="sb-field-options-done">\n                  <button onclick=\'$("#sb_edit_model").modal("hide");\' class="btn btn-success font-montserrat btn-block m-t-10">Done</button>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class="container sb-attach right" id="sb-attach">\n  <div class="row">\n    <div class="col-xs-12">\n      <span class="font-montserrat text-uppercase bold">Attach an Image</span><br>\n      <div class="sb-images">\n        <div class="sb-images-container">\n          <select class="image-picker show-html" id="sb-thumbnails"></select>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-xs-12 m-t-10 sm-m-t-10">\n      <a class="btn btn-primary font-montserrat btn-sm ladda-button"\n         id="sb-dz-attach"\n         data-style="expand-left">\n         <span class="ladda-label">Upload</span>\n      </a>\n      <small><span class="font-montserrat text-uppercase bold">You may also Drag and Drop the image here.</span></small>\n      <div class="pull-right">\n        <button type="button" class="btn btn-primary font-montserrat btn-sm m-t-5" onclick="Formbuilder.uploads.hide();">Done</button>\n      </div>\n    </div>\n  </div>\n  <div class="crop">\n    <div class="tools">\n      <div class="col-xs-6">\n        <p>Move and adjust the box to resize your picture.</p>\n      </div>\n      <div class="col-xs-6">\n        <div class="pull-right">\n          <button type="button" class="btn btn-dark font-montserrat btn-sm sb-crop-cancel">Cancel</button>\n          <button type="button" class="btn btn-primary font-montserrat btn-sm sb-crop-done">Done</button>\n        </div>\n      </div>\n    </div>\n    <div class="croparea">\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '    <div class="hesader">\n        <h2>Sample Survey</h2>\n        <button class=\'js-save-form\'></button>\n        <button class=\'play-now\' onclick="Router.play();" disabled>Play Now!</button>\n    </div>\n\n    <div class="content">\n        <h2>Question Type</h2>\n        <div class=\'sb-tab-content\'>\n            Formbuilder.templates[\'partials/edit_field\']()\n        </div>\n    </div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-right\'>\n  <div id=\'svg-canvas\'></div>\n  <div class="sb-survey-description above">\n      <p class="section">Introduction Screen</p>\n      <div class="screen_head">\n        <input type="text" placeholder="Survey Title" value="" id="survey_title">\n        <input type="text" id="survey_image" style="display:none">\n        <button class="screen_img">Logo <i class="fa fa-paperclip" id="survey_image_status"></i></button>\n        <textarea id="survey_description"></textarea>\n        <button class="target_O"\n                id = "i"\n                data-target = "top_out"\n                data-target-index = "0"\n        ></button>\n      </div>\n  </div>\n  <div class=\'sb-response-fields\'>\n  </div>\n  <div class="sb-survey-description below">\n      <p class="section">End Screen</p>\n      <textarea id="survey_thank_you"></textarea>\n      <button class="target_O"\n              id = "j"\n              data-target = "top_in"\n              data-target-index = "0"\n      ></button>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'sb-save-wrapper\'>\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n    <div class="field-card">\n        <div class="meta">\n            <p class="section">Question </p>\n\n            ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\n\n            <button class="target" data-target="in" id="' +
((__t = ( rf.cid )) == null ? '' : __t) +
'" ></button>\n        </div>\n        <div class="logic">\n            <p class="section">Options</p>\n            ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n        </div>\n        ';
 if (!(rf.get('field_options.deletable') === false)) { ;
__p += '\n        ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n        ';
 } ;
__p += '\n    </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</span>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate" title="Duplicate Field">Duplicate</a>\n  <a class="js-clear" title="Remove Field">Delete</a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<p class="title">' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'</p>\n<p class="type">\n    <!--<strong>Type</strong>: -->\n    <small>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.FIELD_TYPE)).replace(/_/, " ") )) == null ? '' : __t) +
'</small>\n    <!--\n    &bullet;\n    <strong>CID:</strong> ' +
((__t = ( Formbuilder.attributes )) == null ? '' : __t) +
'\n    -->\n    &bullet;<small>\n    ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n    Required\n    ';
 } else { ;
__p += '\n    Optional\n    ';
 } ;
__p += '\n    ';
 if (rf.get(Formbuilder.options.mappings.VALIDATION)) { ;
__p += '\n    &bullet; ' +
((__t = ( rf.get(Formbuilder.options.mappings.VALIDATION) )) == null ? '' : __t) +
'\n    ';
 } ;
__p += '\n    ';
 if (rf.get(Formbuilder.options.mappings.NOTIFICATION)) { ;
__p += '\n    &bullet; <i class="fa fa-globe"></i>\n    ';
 } ;
__p += '\n    </small>\n</p>\n<p><small>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'</small></p>\n';

}
return __p
};