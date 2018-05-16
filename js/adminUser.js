var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser"),
    $ = layui.$;

var sex = {
	0:'女',
	1:'男',
	2:'未知'
}

table.render({
    elem: '#LAY_table_good'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    ,where: {
        type: 1,
        'xtoken':strUserInfo
    }
    ,cols: [[
        {field:'id', title: '用户ID', sort: true, fixed: true}
        ,{field:'nickname', title: '昵称', sort: true, edit: 'text' }
        ,{field:'sexe', title:'性别',sort:true,templet:function(d){return sex[d.sex]},edit:'text'}
        ,{field:'avatar', title:'头像',edit:'text'}
    ]]
    ,id: 'userTable'
    ,page: true
    
});

$('#search').on('click',function(){
	 
    var uid = $('#uid');
    table.reload('userTable', {
        page: {
            curr: 1
        }
        ,where: {
            key:  uid.val()
        }
    });
    
})

table.on('edit(good)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
    if(field == 'sexe'){
    		var correct = false;
    		field = 'sex';
    		if(value == '女'){
    			value = 0;
    			correct = true;
    		}
    		if(value == '男'){
    			value = 1;
    			correct = true;
    		}
    		if(!correct){
    			layer.msg('请输入正确的性别')
    			return;
    		}
    		
    }
   
    $.post(ASKURL + "/admin/update",
        {
        		type: 1, 
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
