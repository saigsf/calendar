/**
 * @Author: saigsf<qq: 2270029397 email: sai_gsf@163.com>
 * @Date:   2017-12-01
 * @Last Modified by:   M S I
 * @Last Modified time: 2017-12-28
 * @Title: 日历插件(旧)
 */


;
(function(_global, undefined) {
    "use strict"
    // var _global;

    var version = '1.1.1';
    var getProto = Object.getPrototypeOf;

    var doc = document.documentElement;
    var targetEl = "", // 目标元素
        targetHeader = "",
        targetBody = "",
        targetCtrl = "",
        prevMonth = "",
        nextMonth = "",
        logData = "";
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
    ]


    var Calendar = function(opt) {
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
        this._init(opt)
    };

    Calendar.fn = Calendar.prototype = {
        Calendar: version,
        constructor: Calendar,

        // 初始化
        _init: function(opt) {
            var def = {
                el: doc
            }

            def = Calendar.extend(def, opt);
            console.log(def)
            this.createHtml(def)
            this.loadTime();
        },

        // 加载时间
        loadTime: function(time) {
            var timeDate;
            if (time) {
                timeDate = time;
            } else {
                timeDate = new Date();
            }
            this.year = timeDate.getFullYear();
            this.months = [31, this.isLeap(this.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            this.month = timeDate.getMonth();
            this.prevMonth = (this.month - 1) === -1 ? 11 : this.month - 1;
            this.nextMonth = (this.month + 1) === 12 ? 0 : this.month + 1;
            this.currentDay = timeDate.getDate();
            this.lunarDate = GetLunarDay(this.year, this.month + 1, this.currentDay);
            this.lunarYear = this.lunarDate.slice(0, 6);
            this.lunarMonth = this.lunarDate.slice(7, 9);
            this.rednerCandler();
            this.log()
        },

        // 是否是闰年
        isLeap: function(year) {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                return true;
            } else {
                return false;
            }
        },

        // 创建HTML
        createHtml: function(opt) {
            // 日历模板
            var HTML_TEMPLATE = '<div class="' + opt.type 
                + '"><div class="' + opt.type 
                + '-ctrl"></div><div class="' + opt.type 
                + '-header clearfix"></div><div class="' + opt.type 
                + '-body clearfix"></div></div > ';
            opt.el.innerHTML += HTML_TEMPLATE;
            targetEl = this.children(opt.el, opt.type);
            targetEl.className = opt.type;
            targetHeader = this.children(targetEl, opt.type + "-header");
            targetBody = this.children(targetEl, opt.type + "-body");
            targetCtrl = this.children(targetEl, opt.type + "-ctrl");
            logData = opt.data;

        },

        // 找孩子
        children: function(parent, className) {
            return parent.querySelector("." + className)
        },

        // 更改日期
        changeDate: function(type) {
            var date = new Date(this.year + '-' + (this.month + 1) + '-' + this.currentDay)
            if (type == "add") {
                date.setMonth(this.month + 1);
            } else {
                if (type != "init") {
                    date.setMonth(this.month - 1);
                }
            }
            this.loadTime(date);
        },
        // 更改年份
        changeYear: function(type) {
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

        // 渲染
        rednerCandler: function(year, month, currentDay) {
            // 要加入的HTML内容
            var htmlHeader = "";
            var htmlBody = "";
            var htmlCtrl = "";
            // 需要的样式
            var style = "";
            // 当月的最大天数
            var maxDays = this.months[this.month];
            // 前一个月的最大天数
            var prevMaxDays = this.months[this.prevMonth];
            // 当月的第一天是星期几
            var firstMonthOfDay = new Date(this.year, this.month, 1).getDay();
            // 当月的最后一天是星期几
            var lastMonthOfDay = new Date(this.year, this.month, maxDays).getDay();


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
            htmlCtrl += '<button class="prevMonth"><</button> <a href="javascript:;" id = "no" >' + this.year + '年' + (this.month + 1) + '月' + '</a><button class="nextMonth">></button>'

            // 清空内容
            targetHeader.innerHTML = "";
            targetBody.innerHTML = "";
            targetCtrl.innerHTML = "";
            // 添加内容
            targetHeader.innerHTML = htmlHeader;
            targetBody.innerHTML = htmlBody;
            targetCtrl.innerHTML = htmlCtrl;

            prevMonth = this.children(targetCtrl, "prevMonth");
            nextMonth = this.children(targetCtrl, "nextMonth");
            this.getChangeMonth();
        },
        // 更改月份事件
        getChangeMonth: function() {
            Calendar.addEvent(prevMonth, "click", () => {
                this.changeDate();
            }, false)
            Calendar.addEvent(nextMonth, "click", () => {
                this.changeDate('add');
            }, false)

        },

        // 设置HTML
        setHtml: function(index) {
            // 需要的样式
            var style = "",
                // 当月的最大天数
                maxDays = this.months[this.month],
                // 前一个月的最大天数
                prevMaxDays = this.months[this.prevMonth],

                html = "";

            if (index <= 0) {
                this.lunarDay = Calendar.getSolarTerm(this.year, this.prevMonth + 1, index + prevMaxDays);
                html = "<div class='prevData " + this.lunarDay[1] + "'><p class='solar'>" + (index + prevMaxDays) + "</p><p class='lunar'>" + this.lunarDay[0] + "</p></div>";
            } else if (index > maxDays) {
                this.lunarDay = Calendar.getSolarTerm(this.nextMonth === 0 ? this.year + 1 : this.year, this.nextMonth + 1, index % maxDays);
                html = "<div class='nextData " + this.lunarDay[1] + "'><p class='solar'>" + index % maxDays + "</p><p class='lunar'>" + this.lunarDay[0] + "</p></div>";
            } else {
                style = Calendar.styleConfirm(index, this.month, this.year);
                this.lunarDay = Calendar.getSolarTerm(this.year, this.month + 1, index);
                html = "<div class='" + style + " " + this.lunarDay[1] + "'><p class='solar'>" + index + "</p><p class='lunar'>" + this.lunarDay[0] + "</p></div>";
            }
            return html;
        },
        log: function() {
            Calendar.addLog(targetBody, logData)
        }

    }

    // 工具函数
    // 对象合并
    Calendar.extend = Calendar.prototype.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !Calendar.isFunction(target)) {
            target = {};
        }

        // Extend Calendar itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (Calendar.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && Calendar.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = Calendar.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }

    Calendar.extend({
        expando: "Calendar" + (version + Math.random()).replace(/\D/g, ""),
        isReady: true,
        isFunction: function(obj) {
            return Calendar.type(obj) === "function";
        },
        type: function(obj) {
            if (obj == null) {
                return obj + "";
            }

            // Support: Android <=2.3 only (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },
        isPlainObject: function(obj) {
            var proto, Ctor;

            // Detect obvious negatives
            // Use toString instead of Calendar.type to catch host objects
            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }

            proto = getProto(obj);

            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if (!proto) {
                return true;
            }

            // Objects with prototype are plain iff they were constructed by a global Object function
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        merge: function(o, n, override) {
            for (var key in n) {
                if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                    o[key] = n[key];
                }
            }
            return o;
        },
        fetchComputedStyle: function(obj, property) {
            //能力检测
            if (window.getComputedStyle) {
                //现在要把用户输入的property中检测一下是不是驼峰，转为连字符写法
                //强制把用户输入的词儿里面的大写字母，变为小写字母加-
                //paddingLeft  →  padding-left
                property = property.replace(/([A-Z])/g, function(match, $1) {
                    return "-" + $1.toLowerCase();
                });

                return window.getComputedStyle(obj)[property];
            } else {
                //IE只认识驼峰，我们要防止用户输入短横，要把短横改为大写字母
                //padding-left  → paddingLeft 
                property = property.replace(/\-([a-z])/g, function(match, $1) {
                    return $1.toUpperCase();
                });

                return obj.currentStyle[property];
            }
        },
        // 添加事件
        addEvent: function(target, type, callback, flag) {
            return target.addEventListener(type, function() {
                !callback || callback();
            }, !!flag)
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
        getSolarTerm: function(year, month, day) {
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

        addLog: function(el, data) {
            var html = `<div class="log">
                        <h2 class="title"></h2>
                        <div class="contnet"></div>
                        </div>`
            // console.log(el, data)
        }




    })

    // 最后将插件对象暴露给全局对象
    _global = (function() { return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Calendar;
    } else if (typeof define === "function" && define.amd) {
        define(function() { return Calendar; });
    } else {
        !('Calendar' in _global) && (_global.Calendar = Calendar);
    }

}(typeof window !== "undefined" ? window : this));