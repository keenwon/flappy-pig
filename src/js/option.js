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

})(flappy || {});