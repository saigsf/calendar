
/*
* @Author: saigsf<qq: 2270029397 email: sai_gsf@163.com>
* @Date:   2017-12-26
* @Last Modified by:   M S I
* @Last Modified time: 2017-12-27
*/
define([
    'jquery'
],function($) {
    'use strict';
    function Widget() {
        // 
        this.container = null;
    }
    Widget.prototype = {
        on: function (type, handler) {
            if (typeof this.handles[type] == "undefined") {
                this.handles[type] = []
            }
            this.handles[type].push(handler);
            return this;
        },
        fire: function (type, data) {
            if (this.handles[type] instanceof Array) {
                var handles = this.handles[type];
                for (let i = 0; i < handles.length; i++) {
                    handles[i](data);
                }
            }
            return this;
        },
        renderUI: function () { },   // 接口：添加dom节点
        bindUI: function () { },     // 接口：事件监听
        syncUI: function () { },     // 接口：初始化组件
        destructor: function () { }, // 接口：销毁前的处理
        render: function (container) {
            this.renderUI();
            this.handles = {};
            this.bindUI();
            this.syncUI();
            $(container || document.body).append(this.container);
        }, // 方法：渲染组件
        destroy: function () {
            this.destructor();
            this.container.off();
            this.container.remove();
        }, // 方法：销毁组件
    }
    return { Widget: Widget }
});