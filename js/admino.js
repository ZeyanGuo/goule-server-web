var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser");

if (strUserInfo == "undefined") {
    location.href = "./admin_login.html";
}


table.render({
    elem: '#LAY_table_order'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    ,page:true
    ,where: {
        type: 4
    }
    ,cols: [[
        {checkbox: true, fixed: true}
        ,{field:'id', title: 'ID', sort: true, fixed: true}
        ,{field:'goodid', title: '商品ID', sort: true, }
        ,{field:'userid', title: '用户ID', sort: true, }
        ,{field:'addressid', title: '收货地址ID', sort: true, }
        ,{field:'quantity', title: '数量', sort: true,  sort: true}
        ,{field:'money', title: '金额',  sort: true}
        ,{field:'status', title:'状态',  sort: true}
        ,{field:'pmethod', title:'支付方式', sort: true}
        ,{field:'addtime', title: '创建时间', sort: true,  sort: true}
    ]]
    ,id: 'orderTable'
    ,page: true
    ,height: 430
});

var $ = layui.$, active = {
    reload: function(){
        var uid = $('#uid');
        table.reload('orderTable', {
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
