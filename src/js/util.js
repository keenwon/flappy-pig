/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */

var flappy = (function (self) {
    'use strict';

    //工具
    self.util = {
        preventDefaultEvent: function (event) {
            event = window.event || event;
            if (event) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
            }
        },
        $: function (id) {
            return document.getElementById(id);
        },
        getChilds: function (obj) {
            var childs = obj.children || obj.childNodes,
                childsArray = [];
            for (var i = 0, len = childs.length; i < len; i++) {
                if (childs[i].nodeType == 1) {
                    childsArray.push(childs[i]);
                }
            }
            return childsArray;
        }
    };

    return self;

})(flappy || {});