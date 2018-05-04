var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    form = layui.form,
    params = getURIParams(),
    gid = -1;
    $ = layui.$,
    strUserInfo = getCookie("qauser");

if (strUserInfo == "undefined") {
    //location.href = "./admin_login.html";
}

if (!params) {
    gid = 0;
    layer.msg("请输入商品ID号");
} else {
    gid = params.id;
    $("#uid").val(gid);
}

table.render({
    elem: '#LAY_table_comment'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    ,page:true
    ,where: {
        type: 5,
        key: gid,
    }
    ,cols: [[
        {checkbox: true, fixed: true}
        ,{field:'id', title: 'ID', sort: true, fixed: true}
        ,{field:'goodid', title: '商品ID', sort: true}
        ,{field:'userid', title: '用户ID', sort: true}
        ,{field:'detail', title: '详细评论', sort: true, edit: 'text'}
        ,{field: 'addtime', title:'评论时间', sort: true}
    ]]
    ,id: 'commentTable'
    ,page: true
    ,height: 600
});

var active = {
    reload: function(){
        gid = $('#uid').val();
        table.reload('commentTable', {
            page: {
                curr: 1
            }
            ,where: {
                key:  gid
            }
        });
    },
    delete: function() {
        var checkStatus = table.checkStatus('commentTable')
            ,data = checkStatus.data;
        var ids= "";
        if (data.length == 0) {
            layer.msg("请选择需要删除的数据");
            return;
        }
        for(var i = 0; i < data.length; i++) {
            if (i != 0) {
                ids += "a";
            }
            ids += data[i].id;
        }
        var url = ASKURL + "/admin/delete" + "?type=5&ids=" + ids;
        //确定删除
        layer.confirm('你确定删除' + data.length + '条记录吗?', function(index){
            $.get(url, function(data){
                if (data.code == 0) {
                    //表单刷新
                    table.reload('commentTable', {
                        page: {
                            curr: 1
                        }
                    });
                }
            });
            layer.close(index);
        }, function(){
        });
    }
};
//监听单元格编辑
table.on('edit(comment)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
    $.post(ASKURL + "/admin/update",
        {type: 5, id: data.id, position: field, value: value},
        function(data) {
            console.log(data);
            if (data.code == 0) {
                layer.msg("更新成功");
            }
        });
});


$('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
});
