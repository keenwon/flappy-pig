/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */

var flappy = (function (self) {
    'use strict';

    //设置
    self.option = {
        //重力加速度，屏幕像素和实际物理上的米有差别，所以存在换算
        g: 400,
        //跳跃的初速度，控制猪的弹跳力
        v0: 400,
        //柱子移动速度
        vp: 2.5,
        //频率，控制动画帧数，默认20ms
        frequency: 20,
        //关卡数
        levels: 100,
        //开头的空白距离
        safeLift: 500,

        //地板高度（和图片有关）
        floorHeight: 64,

        //猪的宽度
        pigWidth: 33,
        //猪的高度
        pigHeight: 30,
        //猪当前高度
        pigY: 300,
        //猪距离左边的距离,
        pigLeft: 80,

        //柱子Html
        pillarHtml: '<div class="top"></div><div class="bottom"></div>',
        //柱子宽度
        pillarWidth: 45,
        //柱子上下间隔高度
        pillarGapY: 108,
        //柱子左右间隔宽度
        pillarGapX: 250,
        //上柱子的基础定位值（就是top值，和css写法有关）
        pillarTop: -550,
        //下柱子的基础定位值
        pillarBottom: -500
    };

    return self;

})(flappy || {});;/**
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

})(flappy || {});;/**
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

})(flappy || {});;/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */

var flappy = (function (self) {
    'use strict';

    var option = self.option,
        util = self.util,
        $ = util.$;

    //柱子
    self.pillar = {
        currentId: -1, //当前柱子id
        init: function () {
            var t = this;

            //缓存上下柱子位置的换算因子
            t._factor = option.pillarBottom - option.pillarGapY + 450;
            //s表示一个位置，到达这个位置的柱子就是“当前的柱子”，就算是靠近猪了，开始计算猪有没有撞到这根柱子，10是提前量。
            t._s = option.pigLeft + option.pigWidth + 10;

            t._render();
        },
        //把柱子渲染到DOM树中
        _render: function () {
            var t = this,
                initleft = option.safeLift;

            t.left = 0;
            t.dom = document.createElement('div');

            t.dom.className = t.dom.id = 'pillarWrapper';
            for (var i = 0, j = option.levels; i < j; i++) {
                var el = document.createElement('div');

                el.innerHTML = option.pillarHtml;
                el.className = 'pillar';
                el.id = 'pillar-' + i;
                el.style.left = initleft + 'px';

                var childs = util.getChilds(el),
                    topEl = childs[0],
                    bottomEl = childs[1],
                    pos = t._random(i);

                topEl.style.top = pos.top + 'px';
                bottomEl.style.bottom = pos.bottom + 'px';

                el.setAttribute('top', 600 + pos.top);
                el.setAttribute('bottom', 0 - pos.bottom);

                t.dom.appendChild(el);
                initleft += option.pillarGapX;
            }
            $('screen').appendChild(t.dom);
        },
        //计算柱子位置
        _random: function (i) {
            var t = this,
                x = Math.random(),
                h = Math.abs(Math.sin((i+1) * x)) * 290;
            
            return {
                top: option.pillarTop + h,
                bottom: t._factor - h
            };
        },
        //移动柱子
        move: function () {
            var t = this;

            t.dom.style.left = -t.left + 'px';
            t._find(t.left);

            t.left += option.vp;
        },
        //找到当前的柱子
        _find: function (l) {
            var t = this,
                x = (t._s + l - option.safeLift) / option.pillarGapX,
                intX = parseInt(x,10); //intX是当前柱子

            if (x > 0 && t.currentId != intX && Math.abs(x - intX) < 0.1) {
                t.currentId = intX;
            }
        }
    };

    return self;

})(flappy || {});;/**
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

            console.log(t.pillarWrapper.style.left);

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

})(flappy || {});;/**
 * 原生javascript实现的《Flappy Pig》v0.1.0
 * =======================================
 * @author keenwon
 * Full source at http://keenwon.com
 */

var flappy = (function (self) {
    'use strict';

    var pig = self.pig,
        pillar = self.pillar,
        pos = self.position,
        util = self.util,
        $ = util.$,
        option = self.option;

    //控制器
    self.controller = {
        init: function () {
            var t = this;

            t._isStart = false;
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
                    t.jump();
                    util.preventDefaultEvent(e);
                }
            };
        },
        jump: function () {
            var t = this;
            if (!t._isStart) {
                $('begin').style.display = 'none';
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
            $('end').style.display = 'block';
        },
        _createTimer: function (fn) {
            var t = this;

            t._timer = setInterval(fn, option.frequency);
        }
    };

    return self;

})(flappy || {});;/**
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