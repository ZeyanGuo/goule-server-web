var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    params = getURIParams(),
    gid = -1;
    $ = layui.$,
    strUserInfo = getCookie("qauser"),
    properties = [];
   

if (strUserInfo == "undefined") {
    location.href = "./admin.html";
}

if (!params||(params&&!params.id)) {
    gid = 0;
    location.href = "./admin.html";
} else {
    gid = params.id;
    $("#uid").html(gid);
}

$.ajax({
	url:ASKURL+'/admin/querybyid',
	type:'GET',
	data:{
		type:2,
		id:gid,
		xtoken:strUserInfo
	},
	success:function(data){
		if(data.code == 1){
			properties = data.data.gdproperty.split(';');
			
			renderTable(properties);
		}else{
			layer.msg('信息获取失败');
		}
	},
	error:function(){
		layer.msg('商品信息获取失败，请稍后重试');
	}
});

function renderTable(properties){
	var renderData;
	
	if(!(properties.length == 1&& properties[0] == '')){
		
		
		renderData = properties.map(function(obj,index){
			var data = obj.split(':');
			return {
				id:index+1,
				property:data[0],
				value:data[1]
			}
		});
	}
	
	
	table.render({
	    elem: '#LAY_table_picture'
	    ,cellMinWidth: 40
	    ,page:true
	    ,cols: [[
	        {checkbox: true, fixed: true}
	        ,{field:'id', title: 'ID', sort: true, fixed: true}
	        ,{field:'property', title: '属性'}
	        ,{field:'value',title:'属性值'}
	        
	    ]]
	    ,id: 'goodTable'
	    ,data: renderData
	    ,page: false
	    
	});
	
}

var active = {
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
        
        if (data.length == 0) {
            layer.msg("请选择需要删除的数据");
            return;
        }
        data.map(function(obj){
        		var value = obj.property+':'+obj.value;
        		for(var i = 0; i < properties.length ; i++){
        			if(properties[i] == value){
        				properties.splice(i,1);
        			}
        		}
        })
        
        properties = properties.join(';');
        //确定删除
        
        layer.confirm('你确定删除' + data.length + '条记录吗?', function(index){
           	$.post(ASKURL + "/admin/update",
                {
		        		type: 2, 
		        		id: gid, 
		        		position: 'gdproperty', 
		        		value: properties,
		        		xtoken: strUserInfo
		        },
                function(data) {
                    if (data.code == 1) {
                        //表单刷新
                        location.reload()
                    }
                    layer.closeAll('page');
                });
            layer.close(index);
        }, function(){
        });
    },
    create: function () {
    	
        var html = '<div style="padding-top: 30px;padding-bottom:30px;" class="layui-form">';
        html += '<div style="margin-bottom: 10px"><p class="p-name">属性名称：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="输入属性名称" name="name" id="property" autocomplete="off"></div></div>';
        html += '<div style="margin-bottom: 10px"><p class="p-name">属性值：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="输入属性值" type="text" name="price" id="value" autocomplete="off"></div></div>';
        html += '<button class="layui-btn" style="margin:20px 0 0 30px;width:270px" id="csub" data-type="reload">发布商品</button>';
        html += '</div>';
        layer.open({
            type: 1,
            title: "商品基础信息",
            area: ['330px', '250px'],
            content: html
        });
        form.render();
      
        $("#csub").on('click', function(){
        		var property = $('#property').val(),
        			value = $('#value').val();
        		
        		if(property == '' || value == ''){
        			layer.msg('以上信息为必填项，请输入上述信息');
        		}
        		else{
        			if(properties.length == 1 && properties[0]== ''){
        				properties[0] = property+':'+value;
        				properties = properties.join(';');
        			}
        			else{
	        			properties.push(property+':'+value);
	        			properties = properties.join(';');
        			}
        			postValue();
        		}
        		

        		function postValue(){
	            $.post(ASKURL + "/admin/update",
	                {
			        		type: 2, 
			        		id: gid, 
			        		position: 'gdproperty', 
			        		value: properties,
			        		xtoken: strUserInfo
			        },
	                function(data) {
	                    if (data.code == 1) {
	                        //表单刷新
	                        location.reload()
	                    }
	                    layer.closeAll('page');
	                });
             }
        });
    }
};


$('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
});