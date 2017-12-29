/*
* @Author: saigsf<qq: 2270029397 email: sai_gsf@163.com>
* @Date:   2017-12-28
* @Last Modified by:   M S I
* @Last Modified time: 2017-12-29
* @Title: 日历插件（新）
*/
define([
    'jquery',
    'jqueryUI',
    'widget',
    'getcnDate',
    'BombBox',
], function ($, $UI, widget, getCnDate, BombBox) {
    'use strict';
    // console.log(getCnDate.GetCNDate);
    var win = new BombBox.BombBox();
    var GetLunarDay = getCnDate.GetCNDate;
    // 周数据
    var WEEK_DATE = ["日", "一", "二", "三", "四", "五", "六"];
    // 24节气
    var SOLAR_TERM = [
        [
            { month: 1 },
            { day: 1 },
            { name: "元旦" }
        ],
        [
            { month: 1 },
            { day: 5 },
            { name: "小寒" }
        ],
        [
            { month: 1 },
            { day: 20 },
            { name: "大寒" }
        ],
        [
            { month: 2 },
            { day: 3 },
            { name: "立春" }
        ],
        [
            { month: 2 },
            { day: 18 },
            { name: "雨水" }
        ],
        [
            { month: 3 },
            { day: 5 },
            { name: "惊蛰" }
        ],
        [
            { month: 3 },
            { day: 8 },
            { name: "妇女节" }
        ],
        [
            { month: 3 },
            { day: 20 },
            { name: "春分" }
        ],
        [
            { month: 4 },
            { day: 1 },
            { name: "愚人节" }
        ],
        [
            { month: 4 },
            { day: 4 },
            { name: "清明" }
        ],
        [
            { month: 4 },
            { day: 20 },
            { name: "谷雨" }
        ],
        [
            { month: 5 },
            { day: 1 },
            { name: "劳动节" }
        ],
        [
            { month: 5 },
            { day: 5 },
            { name: "立夏" }
        ],
        [
            { month: 5 },
            { day: 20 },
            { name: "小满" }
        ],
        [
            { month: 6 },
            { day: 1 },
            { name: "儿童节" }
        ],
        [
            { month: 6 },
            { day: 5 },
            { name: "芒种" }
        ],
        [
            { month: 6 },
            { day: 21 },
            { name: "夏至" }
        ],
        [
            { month: 7 },
            { day: 7 },
            { name: "小暑" }
        ],
        [
            { month: 7 },
            { day: 22 },
            { name: "大暑" }
        ],
        [
            { month: 8 },
            { day: 1 },
            { name: "建军节" }
        ],
        [
            { month: 8 },
            { day: 7 },
            { name: "立秋" }
        ],
        [
            { month: 8 },
            { day: 23 },
            { name: "处暑" }
        ],
        [
            { month: 9 },
            { day: 7 },
            { name: "白露" }
        ],
        [
            { month: 9 },
            { day: 23 },
            { name: "秋分" }
        ],
        [
            { month: 10 },
            { day: 1 },
            { name: "国庆节" }
        ],
        [
            { month: 10 },
            { day: 8 },
            { name: "寒露" }
        ],
        [
            { month: 10 },
            { day: 23 },
            { name: "霜降" }
        ],
        [
            { month: 11 },
            { day: 7 },
            { name: "立冬" }
        ],
        [
            { month: 11 },
            { day: 22 },
            { name: "小雪" }
        ],
        [
            { month: 12 },
            { day: 7 },
            { name: "大雪" }
        ],
        [
            { month: 12 },
            { day: 21 },
            { name: "冬至" }
        ],
        [
            { month: 12 },
            { day: 24 },
            { name: "平安夜" }
        ],
        [
            { month: 12 },
            { day: 25 },
            { name: "圣诞节" }
        ],
    ];

    // 传统节日
    var FESTIVAL = [
        ["正月初一", "春节"],
        ["正月十五", "元宵节"],
        ["二月初二", "龙抬头"],
        ["三月初七", "寒食节"],
        ["三月初八", "清明节"],
        ["五月初五", "端午节"],
        ["七月十五", "中元节"],
        ["八月十五", "中秋节"],
        ["九月初九", "重阳节"],
        ["腊月初八", "腊八节"],
        ["腊月廿三", "小年"],
        ["腊月三十", "除夕"],
    ];

    var EVENT_DATA = [
        {
            title: "",
            content: "",
            time: ''
        }
    ]

    var Calendar = function (opt) {
        //默认参数设置
        this.opt = {
            themeType: 'default',
            title: '日历',
            width: 350,
            height: 'auto',
            isDraggable: true,
            dragHandle: null,
        };
        this.months = [];
        this.year = "";
        this.month = "";
        this.lunarDate = "";
        this.lunarYear = "";
        this.lunarMonth = "";
        this.lunarDay = "";
        this.prevMonth = "";
        this.nextMonth = "";
        this.currentDay = "";
        this.festival = "";
        this.maxDays = "",
        this.prevMaxDays = "",
        this._init(opt);
    };
    Calendar.prototype = $.extend({}, new widget.Widget(), {
        _init: function (opt) {
            $.extend(this.opt, opt);
            this.loadTime();
            this.render(this.opt.container);
        },
        renderUI: function () {
            // 重置主题
            // this.setTheme();
            // 要加入的HTML内容
            var htmlHeader = "";
            var htmlBody = "";
            var htmlCtrl = "";
            // 当月的第一天是星期几
            var firstMonthOfDay = new Date(this.year, this.month, 1).getDay();
            // 当月的最后一天是星期几
            var lastMonthOfDay = new Date(this.year, this.month, this.maxDays).getDay();
            // 日历模板
            this.container = $('<div class="' + this.opt.themeType
                + '"><div class="' + this.opt.themeType
                + '-ctrl"></div><div class="' + this.opt.themeType
                + '-header clearfix"></div><div class="' + this.opt.themeType
                + '-body clearfix"></div></div > ');
            // 日历头容器
            var headerWrapper = this.container.find("."+this.opt.themeType+"-header");
            // 主体容器
            var bodyWrapper = this.container.find("."+this.opt.themeType+"-body");
            // 控制容器
            var ctrlWrapper = this.container.find("."+this.opt.themeType+"-ctrl");

            // 清空容器
            headerWrapper.html('');
            bodyWrapper.html('');
            // 循环遍历header
            for (let i = 0; i < WEEK_DATE.length; i++) {
                const week = WEEK_DATE[i];
                htmlHeader += "<div>" + week + "</div>"
            }
            // 循环遍历body
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    var index = (i * 7) + j - firstMonthOfDay + 1;
                    htmlBody += this.setHtml(index);
                }
            }
            // 标题和控制
            htmlCtrl = '<button class="prevMonth"><</button> <a href="javascript:;" id = "no" >' 
                + this.year + '年' + (this.month + 1) + '月' + this.currentDay + '日'
                + '</a><button class="nextMonth">></button>';

            headerWrapper.append($(htmlHeader));
            bodyWrapper.append($(htmlBody));
            ctrlWrapper.append($(htmlCtrl));

        },
        bindUI: function () {
            var inners = this.container.find(".inner");
            // console.log(inners);
            var that = this;
            this.container.delegate('.prevMonth', 'click', function () {
                that.destroy();
                that.fire('prevMonth');
                
            }).delegate('.nextMonth', 'click', function () {
                that.destroy();
                that.fire('nextMonth');

            }).delegate('.inner', 'click', function () {
                that.fire('inner');

            });
            this.on('prevMonth', function () {
                that.changeDate('');
            })
            this.on('nextMonth', function () {
                that.changeDate('add');
            })
            this.on('inner', function () {
                console.log(this);
                win.common({
                    content: '请输入你想要输入',
                    width: 300,
                    height: 150,
                });
            })
        },
        syncUI: function () {
            this.container.css({
                width: this.opt.width + 'px',
                left: (this.opt.x || (window.innerWidth - this.opt.width) / 2) + 'px',
                top: (this.opt.y || 0 / 2) + 'px',
            });

            // 是否可以拖动
            if (this.opt.isDraggable) {
                this.container.draggable({ handle: '.'+this.opt.themeType + '-ctrl' });
            }
            
        },
        // 重置主题
        setTheme: function(theme){
            this.opt.themeType = (!!theme) ? theme : this.opt.themeType;
            this.destroy();
            this.render(this.opt.container);
            return this;
        },
        // 加载时间
        loadTime: function (time) {
            var timeDate;
            if (time) {
                timeDate = time;
            } else {
                timeDate = new Date();
            }
            this.year = timeDate.getFullYear();
            this.months = [31, this.isLeap(this.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            this.month = timeDate.getMonth(); // 对于大于28或29的要单独处理
            this.prevMonth = (this.month - 1) === -1 ? 11 : this.month - 1;
            this.nextMonth = (this.month + 1) === 12 ? 0 : this.month + 1;
            this.currentDay = timeDate.getDate();
            this.lunarDate = GetLunarDay(this.year, this.month + 1, this.currentDay);
            this.lunarYear = this.lunarDate.slice(0, 6);
            this.lunarMonth = this.lunarDate.slice(7, 9);

            // 当月的最大天数
            this.maxDays = this.months[this.month];
            // 前一个月的最大天数
            this.prevMaxDays = this.months[this.prevMonth];
            // this.rednerCandler();
            // this.log()
        },

        // 是否是闰年
        isLeap: function (year) {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                return true;
            } else {
                return false;
            }
        },
        // 设置HTML
        setHtml: function (index) {
            // 需要的样式
            var style = "",
                html = "";

            if (index <= 0) {
                this.lunarDay = this.getSolarTerm(this.year, this.prevMonth + 1, index + this.prevMaxDays);
                html = "<div class='inner prevData " + this.lunarDay[1] + "'><p class='solar'>" + (index + this.prevMaxDays) + "</p><p class='lunar'>" + this.lunarDay[0] + "</p></div>";
            } else if (index > this.maxDays) {
                this.lunarDay = this.getSolarTerm(this.nextMonth === 0 ? this.year + 1 : this.year, this.nextMonth + 1, index % this.maxDays);
                html = "<div class='inner nextData " + this.lunarDay[1] + "'><p class='solar'>" + index % this.maxDays + "</p><p class='lunar'>" + this.lunarDay[0] + "</p></div>";
            } else {
                style = this.styleConfirm(index, this.month, this.year);
                this.lunarDay = this.getSolarTerm(this.year, this.month + 1, index);
                // console.log(this.lunarDay[1].length)
                html = "<div class='inner " + style + " " + this.lunarDay[1] + "'><p class='solar'>" + index + "</p><p class='lunar'>" + this.lunarDay[0] + "</p></div>";
            }
            return html;
        },
        // 当前样式的css
        styleConfirm: (index, month, year) => {
            // 当前的年月日
            var curDay = new Date().getDate(),
                curMonth = new Date().getMonth(),
                curYear = new Date().getFullYear(),
                sty = "";
            if ((curDay == index) && curMonth == month && year == curYear) {
                sty = "cur";
            } else if ((curDay == index) && curMonth == month && year != curYear) {
                sty = "curOther";
            } else {
                sty = "";
            }
            return sty;
        },
        // 获取阴历日期+24节气+节日
        getSolarTerm: function (year, month, day) {
            var flag = -1;
            var tmp = [];
            // console.log(year, month, day)
            for (let i = 0; i < SOLAR_TERM.length; i++) {
                const item = SOLAR_TERM[i];
                if (item[0].month == month && item[1].day == day) {
                    flag = i;
                    break;
                }
            }
            if (flag === -1) {
                var lunarDate = GetLunarDay(year, month, day);
                var lunarMonthDay = lunarDate.slice(7);
                // 添加传统节日
                for (let i = 0; i < FESTIVAL.length; i++) {
                    const item = FESTIVAL[i];
                    lunarMonthDay = (lunarMonthDay === item[0]) ? item[1] : lunarMonthDay;
                }

                // console.log(lunarMonthDay[1])
                if (lunarMonthDay[1] === "月") {
                    tmp = [lunarMonthDay.slice(2) === "初一" ? lunarMonthDay.slice(0, 2) : lunarMonthDay.slice(2), ""];
                } else if (lunarMonthDay[1] === "闰") {
                    tmp = [lunarMonthDay.slice(5) === "初一" ? lunarMonthDay.slice(0, 5) : lunarMonthDay.slice(5), ""];
                } else {
                    // this.festival = "festival";
                    tmp = [lunarMonthDay, "festival"];
                }

            } else {
                // this.festival = "festival";
                tmp = [SOLAR_TERM[flag][2].name, "festival"];
            }

            return tmp;

        },
        // 更改日期
        changeDate: function (type) {
            // console.log(this)
            var date = new Date(this.year + '-' + (this.month + 1) + '-' + this.currentDay)
            if (type == "add") {
                date.setMonth(this.month + 1);
            } else {
                if (type != "init") {
                    date.setMonth(this.month - 1);
                }
            }
            this.loadTime(date);
            this.render(this.opt.container);
        },
        // 更改年份
        changeYear: function (type) {
            var date = new Date(this.year + '-' + (this.month + 1) + '-' + this.currentDay)
            if (type == "add") {
                date.setFullYear(this.year + 1);
            } else {
                if (type != "init") {
                    date.setFullYear(this.year - 1);
                }
            }
            this.loadTime(date);
        },
    })

    return {
        Calendar: Calendar
    };
});