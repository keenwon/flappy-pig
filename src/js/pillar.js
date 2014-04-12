/**
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

})(flappy || {});