var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser"),
    $ = layui.$,
    md5Password;
    

table.render({
    elem: '#LAY_table_good'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    ,where: {
        type: 5,
        'xtoken':strUserInfo
    }
    ,cols: [[
        {field:'id', title: '用户ID', sort: true, fixed: true}
        ,{field:'name', title: '管理员账户', sort: true }
       ,{field:'passwd', title: '管理员密码(MD5加密值)',templet:function(d){
       	md5Password = d.passwd;
       	return d.passwd;
       }, sort: true }
        ,{field:'phone', title: '客服电话', sort: true, edit: 'text' }
    ]]
    ,id: 'userTable'
    ,page: false
});

$('#change').on('click',function(){
	 var html = '<div style="padding-top: 30px;padding-bottom:30px;" class="layui-form">';
        html += '<div style="margin-bottom: 10px"><p class="p-name">原始密码：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="输入原始密码" name="oldPwd" id="oldPwd" autocomplete="off"></div></div>';
        html += '<div style="margin-bottom: 10px"><p class="p-name">新密码：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="请设置新密码" type="password" name="newPwd" id="newPwd" autocomplete="off"></div></div>';
        html += '<div style="margin-bottom: 10px"><p class="p-name">重复密码：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="请重复新密码" type="password" name="rePwd" id="rePwd" autocomplete="off"></div></div>';
        html += '<button class="layui-btn" style="margin:20px 0 0 30px;width:280px" id="csub" data-type="reload">修改密码</button>';
        html += '</div>';
        layer.open({
            type: 1,
            title: "修改密码",
            area: ['330px', '380px'],
            content: html
        });
        $('#csub').on('click',function(){
        		var oldPwd = $('#oldPwd').val(),
        			newPwd = $('#newPwd').val(),
        			rePwd = $('#rePwd').val(),
        			md5oldPwd = md5(oldPwd);
        		if(md5oldPwd == '' || newPwd == '' || rePwd == ''){
        			layer.msg('数据不能为空');
        			return;
        		}
        		if(newPwd.length<6){
        			layer.msg('新密码必须大于6位');
        			return;
        		}
        		if(md5oldPwd != md5Password){
        			layer.msg('原始密码错误，请重新输入');
        			return;
        		}
        		else{
        			if(newPwd != rePwd){
        				layer.msg('重复密码不一致，请重新输入');
        				return;
        			}
        			else{
        				 $.post(ASKURL + "/admin/update",
				        {
				        		type: 5, 
				        		id: 1, 
				        		position: 'passwd', 
				        		value: md5(newPwd),
				        		xtoken: strUserInfo
				        },
				        function(data) {
				            if (data.code == 1) {
		                        //表单刷新
		                        layer.msg('更新成功');
		                        table.reload('userTable');
		                    }
		                    layer.closeAll('page');
				        });
        			}
        		}
        		
        })
})


table.on('edit(good)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
   
   
    $.post(ASKURL + "/admin/update",
        {
        		type: 5, 
        		id: data.id, 
        		position: field, 
        		value: value,
        		xtoken: strUserInfo
        },
        function(data) {
            if (data.code == 1) {
                layer.msg("更新成功");
            }
        });
});