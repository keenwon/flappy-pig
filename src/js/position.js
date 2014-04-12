/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */

var flappy = (function (self) {
    'use strict';

    var pig = self.pig,
        pillar = self.pillar,
        option = self.option,
        $ = self.util.$;

    //位置判断
    self.position = {
        init: function (overCallback, controller) {
            var t = this;

            t.pillarWrapper = $('pillarWrapper');
            
            t.pigX1 = option.pigLeft,
            t.pigX2 = option.pigLeft + option.pigWidth, //猪的左右位置，固定的

            t._controller = controller;
            t._addListener(overCallback);
        },
        //添加监听
        _addListener: function (overCallback) {
            this._overCallback = overCallback;
        },
        judge: function () {
            var t = this,
                currentPillar = $('pillar-' + pillar.currentId);

            if (pillar.currentId == -1) {
                return;
            }

            t.pigY2 = 600 - pig.Y;
            t.pigY1 = t.pigY2 - option.pigHeight; //猪的上下位置
            t.pY1 = currentPillar.getAttribute('top');
            t.pY2 = currentPillar.getAttribute('bottom');
            t.pX1 = parseInt(currentPillar.style.left,10) + parseInt(t.pillarWrapper.style.left,10);
            t.pX2 = t.pX1 + option.pillarWidth; //柱子的上下左右位置

            if (option.pigLeft + option.pigWidth >= t.pX1 && option.pigLeft <= t.pX2) {
                if (t.pigY1 < t.pY1 || t.pigY2 > t.pY2) {
                    t._dead();
                }
            }
        },
        //撞到柱子时触发
        _dead: function () {
            this._overCallback.call(this._controller);
        }
    };

    return self;

})(flappy || {});