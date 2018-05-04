var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser"),
    $ = layui.$,
    active = {
    reload: function(){
        var uid = $('#uid');
        table.reload('goodTable', {
            page: {
                curr: 1
            }
            ,where: {
                key:  uid.val()
            }
        });
    },
    delete: function() {
        var checkStatus = table.checkStatus('goodTable')
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
        var url = ASKURL + "/admin/delete" + "?type=4&ids=" + ids+"&xtoken="+strUserInfo;
        //确定删除
        layer.confirm('删除该类别以后将无法在此类别添加商品,你确定删除这(' + data.length + ')个类别吗?', function(index){
            $.get(url, function(data){
                if (data.code == 1) {
                    //表单刷新
                    table.reload('goodTable', {
                        page: {
                            curr: 1
                        }
                    });
                }
            });
            layer.close(index);
        }, function(){
        });
    },
    create: function () {
        var html = '<div style="padding: 5px" align="center">';
        html += '<div style="margin-bottom: 5px">类别名称：<div class="layui-inline"><input class="layui-input" placeholder="输入类别名" name="gtname" id="gtname" autocomplete="off"></div></div>';
        html += '<button class="layui-btn" id="csub" data-type="reload">提交</button>';
        html += '</div>';
        layer.open({
            type: 1,
            title: "新增类别",
            area: ['300px', '140px'],
            content: html
        });
       
        $("#csub").on('click', function(){
            $.post(ASKURL + "/admin/addGoodType",
                {
                		gtname:$('#gtname').val(),
                		gtuse:1,
                		xtoken:strUserInfo
                },
                function(data) {
                    if (data.code == 1) {
                        //表单刷新
                        table.reload('goodTable', {
                            page: {
                                curr: 1
                            }
                        });
                    }
                    layer.closeAll('page');
                });
        });
    }
};

if (strUserInfo == "undefined") {
    console.log(strUserInfo);
    location.href = "./adminLogin.html";
}

table.render({
    elem: '#LAY_table_good'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    ,page:true
    ,where: {
        type: 4,
        'xtoken':strUserInfo,
        
    }
    ,cols: [[
        {checkbox: true, fixed: true}
        ,{field:'id', title: '类别ID', sort: true, fixed: true}
        ,{field:'gtname', title: '类别名称', sort: true, edit: 'text'}
        ,{field:'gtuse', title:'启用', width:85, templet: '#switchTpl', unresize: true}
    ]]
    ,id: 'goodTable'
    ,page: true
    
});

//监听单元格编辑
table.on('edit(good)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
    $.post(ASKURL + "/admin/update",
        {
        		type: 4, 
        		id: data.id, 
        		position: field, 
        		value: value,
        		xtoken:strUserInfo
        },
        function(data) {
            console.log(data);
            if (data.code == 1) {
                layer.msg("更新成功");
            }
            else{
            		layer.msg('更新失败');
            }
        });
});


//监听热销操作
form.on('switch(gtuse)', function(obj){
    //layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    var value = obj.elem.checked ? 1 : 0;
    $.post(ASKURL + "/admin/update",
        {
        		type: 4, 
        		id: this.value, 
        		position: this.name, 
        		value: value,
        		xtoken:strUserInfo
        },
        function(data) {
            if (data.code == 1) {
                layer.msg("更新成功");
            }
            else{
            		layer.msg('更新失败');
            }
        });
});

$('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
});