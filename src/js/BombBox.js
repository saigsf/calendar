/*
* @Author: saigsf<qq: 2270029397 email: sai_gsf@163.com>
* @Date:   2017-12-26
* @Last Modified by:   M S I
* @Last Modified time: 2017-12-27
*/
define([
    'jquery',
    'jqueryUI',
    'widget'
], function ($, $UI, widget) {
    // 'use strict';
    var BombBox = function () {
        this.cfg = {
            title: '系统信息',
            content: '',
            width: 500,
            height: 300,
            skinClassName: null,
            hasCloseBtn: true,
            isDraggable: false,
            dragHandle: null,
            hasMask: true,
            handler4CloseBtn: null,
            text4AlertBtn: '确定',        // alert
            handler4AlertBtn: null,
            text4ConfirmBtn: '确定',      // confirm
            text4CancelBtn: '取消',
            handler4ConfirmBtn: null,
            handler4CancelBtn: null,
            text4PromptBtn: '确定',       // prompt
            isPromptPassword: false,
            defaultValue4PromptInput: "",
            maxLengthPromptInput: 10,
            handler4PromptBtn: null,
        };
        // this.handles = {}
    }
    BombBox.prototype = $.extend({}, new widget.Widget(), {
        renderUI: function () {
            var footerContent = "";
            switch (this.cfg.winType) {
                case 'alert':
                    footerContent = '<input class="window_alertBtn" type="button" value="'
                        + this.cfg.text4AlertBtn + '">'
                    break;

                case 'confirm':
                    footerContent = '<input class="window_confirmBtn" type="button" value="'
                        + this.cfg.text4ConfirmBtn + '"><input class="window_cancelBtn" type="button" value="'
                        + this.cfg.text4CancelBtn + '">'
                    break;
                case 'prompt':
                    this.cfg.content += '<p class="window_promptInputWrapper"><input class="window_promptInput" type="'
                        + (this.cfg.isPromptPassword ? 'password' : 'text') +'"  value="'
                        + this.cfg.defaultValue4PromptInput +'" maxlength="'
                        + this.cfg.maxLengthPromptInput+'" ></p>'
                    footerContent = '<input class="window_promptBtn" type="button" value="'
                        + this.cfg.text4PromptBtn + '"><input class="window_cancelBtn" type="button" value="'
                        + this.cfg.text4CancelBtn + '">'
                    break;

                default:
                    break;
            }
            this.container = $('<div class="window_boundingBox">'
                + '<div class="window_body">' + this.cfg.content + '</div>'
                + '</div>');
            if(this.cfg.winType != "common"){
                this.container.prepend('<div class="window_header">' + this.cfg.title + '</div>')
                this.container.append('<div class="window_footer">' + footerContent + '</div>')
            }
            // 是否有模态框
            if (this.cfg.hasMask) {
                this._mask = $('<div class="window_mask"></div>');
                this._mask.appendTo('body');
            }
            // 设置取消按钮
            if (this.cfg.hasCloseBtn) {
                this.container.append('<div class="window_closeBtn">x</div>')
            }
            this.container.appendTo("body");
            this._promptInput = this.container.find(".window_promptInput");
        },
        bindUI: function () {
            var that = this;
            this.container.delegate('.window_alertBtn', 'click', function () {
                that.fire('alert');
                that.destroy();
            }).delegate('.window_closeBtn', 'click', function () {
                that.fire('close');
                that.destroy();
            }).delegate('.window_confirmBtn', 'click', function () {
                that.fire('confirm');
                that.destroy();
            }).delegate('.window_cancelBtn', 'click', function () {
                that.fire('cancel');
                that.destroy();
            }).delegate('.window_promptBtn', 'click', function () {
                that.fire('prompt', that._promptInput.val());
                that.destroy();
            });
            if (this.cfg.handler4AlertBtn) {
                this.on('alert', this.cfg.handler4AlertBtn)
            }
            if (this.cfg.handler4CloseBtn) {
                this.on('close', this.cfg.handler4CloseBtn)
            }
            if (this.cfg.handler4ConfirmBtn) {
                this.on('alert', this.cfg.handler4ConfirmBtn)
            }
            if (this.cfg.handler4CancelBtn) {
                this.on('close', this.cfg.handler4CancelBtn)
            }
            if (this.cfg.handler4PromptBtn) {
                this.on('close', this.cfg.handler4PromptBtn)
            }
        },
        syncUI: function () {
            // 设置大小位置
            this.container.css({
                width: this.cfg.width + 'px',
                height: this.cfg.height + 'px',
                left: (this.cfg.x || (window.innerWidth - this.cfg.width) / 2) + 'px',
                top: (this.cfg.y || (window.innerHeight - this.cfg.height) / 2) + 'px',
            });
            // 切换主题
            if (this.cfg.skinClassName) {
                this.container.addClass(this.cfg.skinClassName);
            }
            // 是否可以拖动
            if (this.cfg.isDraggable) {

                if (this.cfg.dragHandle) {
                    this.container.draggable({ handle: this.cfg.dragHandle });
                } else {
                    this.container.draggable();
                }
            }
        },
        destructor: function () {
            this._mask && this._mask.remove();
        },
        alert: function (cfg) {
            $.extend(this.cfg, cfg, {winType: 'alert'});
            this.render();
            return this;
        },
        confirm: function (cfg) { 
            $.extend(this.cfg, cfg, { winType: 'confirm' });
            this.render();
            return this; 
        },
        prompt: function (cfg) {
            $.extend(this.cfg, cfg, { winType: 'prompt' });
            this.render();
            this._promptInput.focus();
            return this; 
        },
        common: function (cfg) {
            $.extend(this.cfg, cfg, { winType: 'common' });
            this.render();
            return this; 
        }
    });

    return {
        BombBox: BombBox
    }
});