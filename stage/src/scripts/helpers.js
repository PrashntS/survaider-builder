var Helper = {
    textarea_autogrow: function (element) {
        "use strict";
        //element.style.height = "5px";
        element.css("height", element.prop('scrollHeight'));
    }
};
