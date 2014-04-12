/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */

var flappy = (function (self) {
    'use strict';

    var controller = self.controller,
        option = self.option,
        pig = self.pig,
        pillar = self.pillar,
        pos = self.position,
        util = self.util,
        $ = self.util.$;

    //主程序
    self.game = {
        init: function () {
            var t = this;

            t._isStart = false;
            t._isEnd = false;
            t._timer = null;

            pig.init(t.fall, t);
            pillar.init();
            pos.init(t.hit, t);

            t.addKeyListener();
        },
        addKeyListener: function () {
            var t = this;
            document.onkeydown = function (e) {
                e = e || event;
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey == 32) {
                    if (!t._isEnd) {
                        t.jump();
                    } else {
                        window.location.reload();
                    }
                    util.preventDefaultEvent(e);
                }
            };
        },
        jump: function () {
            var t = this;
            if (!t._isStart) {
                $('start').style.display = 'none';
                t._createTimer(function () {
                    pig.start();
                    pillar.move();
                    pos.judge();
                    $('score').innerHTML = pillar.currentId + 1;
                });
                t._isStart = true;
            } else {
                pig.jump();
            }
        },
        hit: function () {
            var t = this;

            t.over();
            pig.hit();
        },
        fall: function () {
            var t = this;

            t.over();
            pig.fall();
        },
        over: function () {
            var t = this;
            clearInterval(t._timer);
            t._isEnd = true;
            $('end').style.display = 'block';
        },
        _createTimer: function (fn) {
            var t = this;

            t._timer = setInterval(fn, option.frequency);
        }
    };

    flappy.init = function () {
        self.game.init();
    };

    return self;

})(flappy || {});