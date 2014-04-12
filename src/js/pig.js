/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */


var flappy = (function (self) {
    'use strict';

    var option = self.option,
        $ = self.util.$;

    //猪
    self.pig = {
        Y: 0, //猪当前高度（底边）
        init: function (overCallback, controller) {
            var t = this;

            t.s = 0, //位移
            t.time = 0, //时间
            t.$pig = $('pig');
            t.$pig.style.left = option.pigLeft + 'px';
            t._controller = controller;

            t._addListener(overCallback);
        },
        //添加监听
        _addListener: function (overCallback) {
            this._overCallback = overCallback;
        },
        //启动
        start: function () {
            var t = this,
                interval = option.frequency / 1000;

            t.s = option.v0 * t.time - t.time * t.time * option.g * 2; //竖直上抛运动公式
            t.Y = option.pigY + t.s;
            if (t.Y >= option.floorHeight) {
                t.$pig.style.bottom = t.Y + 'px';
            } else {
                t._dead();
            }
            t.time += interval;
        },
        //跳
        jump: function () {
            var t = this;

            option.pigY = parseInt(t.$pig.style.bottom, 10);
            t.s = 0;
            t.time = 0;
        },
        //撞到地面时触发
        _dead: function () {
            this._overCallback.call(this._controller);
        },
        //撞到地面的处理
        fall: function () {
            var t = this;

            //摔到地上，修正高度
            t.Y = option.floorHeight;
            t.$pig.style.bottom = t.Y + 'px';
        },
        //撞到柱子的处理
        hit: function () {
            var t = this;

            //坠落
            var timer = setInterval(function () {
                t.$pig.style.bottom = t.Y + 'px';
                if (t.Y <= option.floorHeight) {
                    clearInterval(timer);
                }
                t.Y -= 12;
            }, option.frequency);
        }
    };

    return self;

})(flappy || {});