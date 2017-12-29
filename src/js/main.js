/*
* @Author: saigsf<qq: 2270029397 email: sai_gsf@163.com>
* @Date:   2017-12-12
* @Last Modified by:   M S I
* @Last Modified time: 2017-12-26
*/
require.config({
    paths: {
        jquery: 'https://cdn.bootcss.com/jquery/3.2.1/jquery',
        jqueryUI: 'https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui',
    }
});

require(['jquery', 'Calendar'], function($, calendar){
    var calendar = new calendar.Calendar({
        y: 100
    });
    console.log(calendar)
    $("#changeTheme").click(function(){
        calendar.setTheme('date')
    })
});