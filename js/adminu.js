var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser");

if (strUserInfo == "undefined") {
    console.log(strUserInfo);
   // location.href = "./admin_login.html";
}

table.render({
    elem: '#LAY_table_user'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    ,page:true
    ,where: {
        type: 1
    }
    ,cols: [[
        {checkbox: true, fixed: true}
        ,{field:'id', title: 'ID', sort: true, fixed: true}
        ,{field:'name', title: '名称', sort: true}
        ,{field:'password', title: '密码', sort: true}
        ,{field:'phone', title: '手机号码', sort: true}
        ,{field:'vip', title: 'VIP等级', sort: true}
    ]]
    ,id: 'userTable'
    ,page: true
    ,height: 430
});

var $ = layui.$, active = {
    reload: function(){
        var uid = $('#uid');
        table.reload('userTable', {
            page: {
                curr: 1
            }
            ,where: {
                key:  uid.val()
            }
        });
    }};

$('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
});
