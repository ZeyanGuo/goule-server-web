
var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser"),
    types={},
   	$ = layui.$;

if (strUserInfo == "undefined") {
    console.log(strUserInfo);
    location.href = "./adminLogin.html";
}

$.ajax({
	url:ASKURL+'/admin/query',
	type:'GET',
	data:{
		type:4,
		xtoken:strUserInfo,
		page:1,
		limit:1000 
	},
	success:function(data){
		data.data.map(function(obj){
			types[obj.id]={
				gtname:obj.gtname,
				gtuse:obj.gtuse
			};
			
		});
		renderTable();
	},
	error:function(){
		layer.msg('获取类型失败');
	}
})

function renderTable(){
	table.render({
	    elem: '#LAY_table_good'
	    ,url: ASKURL + "/admin/query"
	    ,cellMinWidth: 40
	    ,page:true
	    ,where: {
	        type: 2,
	        xtoken:strUserInfo
	    }
	    ,cols: [[
	        {checkbox: true, fixed: true}
	        ,{field:'id', title: 'ID', sort: true, fixed: true}
	        ,{field:'name', title: '名称', sort: true, edit: 'text', fixed: true}
	        ,{field:'price', title: '价格',  sort: true, edit: 'text', fixed: true}
	        ,{field:'stock', title: '库存', sort: true, edit: 'text', fixed: true}
	        ,{field:'typeid', title: '类别', templet:function(d){return types[d.typeid].gtname},sort:true}
	        ,{field:'homerecommend', title:'首推', width:80, templet: '#switchTp3', unresize: true}
	        ,{field:'recommed', title:'精推', width:80, templet: '#switchTpl', unresize: true}
			,{field:'funsnacks', title:'趣零', width:80, templet: '#switchTp5', unresize: true}
			,{field:'freshfruit', title:'新果', width:80, templet: '#switchTp6', unresize: true}
			,{field:'discount', title:'今折', width:80, templet: '#switchTp4', unresize: true}
			,{field:'discountrate', title:'折扣', sort: true, edit: 'text', fixed: true}
	        ,{field:'status', title:'在售', width:80, templet: '#switchTp2', unresize: true}
	        ,{fixed: 'right', title:'操作', width:150, toolbar: '#bar', align: 'center'}
	    ]]
	    ,id: 'goodTable'
	    ,page: true
	});
}

function makeSelectTypes(){
	var html = '<select id = "typeid" lay-filter = "typeid">'
	for(var key in types){
		if(types[key].gtuse == 1){
			html += '<option value = "'
				 + key
				 +'">'
				 +types[key].gtname
				 +'</option>';
		}
	}
	html += '</select>';
	return html;
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
        var url = ASKURL + "/admin/delete" + "?type=2&ids=" + ids + '&xtoken='+strUserInfo;
        //确定删除
        layer.confirm('你确定删除' + data.length + '条记录吗?', function(index){
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
    	
        var html = '<div style="padding-top: 30px;padding-bottom:30px;" class="layui-form">';
        html += '<div style="margin-bottom: 10px"><p class="p-name">商品名称：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="输入商品名称" name="name" id="name" autocomplete="off"></div></div>';
        html += '<div style="margin-bottom: 10px"><p class="p-name">商品单价：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="输入商品单价" type="number" name="price" id="price" autocomplete="off"></div></div>';
        html += '<div style="margin-bottom: 10px"><p class="p-name">商品库存：</p><div class="layui-inline"><input class="layui-input input-margin-left" placeholder="输入商品库存" type="number" name="stock" id="stock" autocomplete="off"></div></div>';
        html += '<div style="margin-bottom: 10px"><p class="p-name">商品类别：</p><div class="layui-inline" style="padding-left:20px;">'+makeSelectTypes()+'</div></div>';
        html += '<button class="layui-btn" style="margin:20px 0 0 30px;width:280px" id="csub" data-type="reload">发布商品</button>';
        html += '</div>';
        layer.open({
            type: 1,
            title: "商品基础信息",
            area: ['330px', '380px'],
            content: html
        });
        form.render();
        $("#csub").on('click', function(){
        		var name = $('#name').val(),
        			price = $('#price').val(),
        			stock = $('#stock').val(),
        			typeid = $('#typeid').val();
        		
        		if(name == '' || price == '' || stock == '' || typeid == ''){
        			layer.msg('以上信息为必填项，请输入上述信息');
        		}
        		else{
        			postValue();
        		}
        		function postValue(){
	            $.post(ASKURL + "/admin/release",
	                {
	                		name : $("#name").val(),
	                		price : $("#price").val(),
	                		stock : $("#stock").val(),
	                		typeid : $('#typeid').val(),
	                		thumbnail:'',
	                		video:'',
	                		discount:0,
	                		post:1,
	                		postprice:'',
	                		recommend:0,	                		
	                		status:0,
	                		introduce:'',
	                		gdproperty:'',
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
             }
        });
    }
};
//监听单元格编辑
table.on('edit(good)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
    if(field == 'price'){
    		if(!/^[0-9]*\.?[0-9]*$/.test(value)){
    			layer.msg('更新失败，请输入正确格式的价格');
    			return;
    		}
    }
    if(field == 'stock'){
    		if(!/^[0-9]*$/.test(value)){
    			layer.msg('更新失败，请输入正确格式的库存');
    			return;
    		}
    }
	if(field == 'discountrate'){
    		if(!/^[0-9]*$/.test(value)){
    			layer.msg('更新失败，请输入正确格式的折扣率(百分比80代表八折)');
    			return;
    		}
    }
    $.post(ASKURL + "/admin/update",
        {
        		type: 2, 
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

//监听热销操作
form.on('switch(recommed)', function(obj){
    //layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    var value = obj.elem.checked ? 1 : 0,
    		thumbValue = $(this).attr('thumbValue'),
    		id = this.value;
     if(thumbValue==''||!thumbValue){
    		//表示没有缩略图
    		
    		layer.msg('不存在缩略图，无法推荐，请给商品配图');
    			$(this).prop('checked',false);
    		form.render('checkbox');
    }
    else{
 	   	changeStatus();
    }
    function changeStatus(){
	    $.post(ASKURL + "/admin/update",
	        {
	        		type: 2, 
	        		id: id, 
	        		position: 'recommed', 
	        		value: value,
	        		xtoken: strUserInfo
	        },
	        function(data) {
	            if (data.code == 1) {
	                layer.msg("更新成功");
	            }
	        });
     }
});
form.on('switch(homerecommend)', function(obj){
    //layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    var value = obj.elem.checked ? 1 : 0,
    		thumbValue = $(this).attr('thumbValue'),
    		id = this.value;
    		
    		
     if(thumbValue==''||!thumbValue){
    		//表示没有缩略图
    		
    		layer.msg('不存在简介图，无法推荐，请给商品配简介图');
    		$(this).prop('checked',false);
    		form.render('checkbox');
    }
    else{
 	   	changeStatus();
    }
    function changeStatus(){
	    $.post(ASKURL + "/admin/update",
	        {
	        		type: 2, 
	        		id: id, 
	        		position: 'homerecommend', 
	        		value: value,
	        		xtoken: strUserInfo
	        },
	        function(data) {
	            if (data.code == 1) {
	                layer.msg("更新成功");
	            }
	        });
     }
});
//监听上架操作
form.on('switch(status)', function(obj){
    //layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    var value = obj.elem.checked ? 1 : 0,
    		thumbValue = $(this).attr('thumbValue'),
    		id = this.value;
    if(thumbValue==''||!thumbValue){
    		//表示没有缩略图
    		
    		layer.msg('不存在缩略图，无法上架，请给商品配图');
    		$(this).prop('checked',false);
    		form.render('checkbox');
    }
    else{
    		changeStatus();
    }
    function changeStatus(){ 
	    $.post(ASKURL + "/admin/update",
	        {
	        		type: 2, 
	        		id: id, 
	        		position: 'status', 
	        		value: value,
	        		xtoken:strUserInfo
	        },
	        function(data) {
	            if (data.code == 1) {
	                layer.msg("更新成功");
	            }
	        });
     }
});
//监听折扣操作
form.on('switch(discount)', function(obj){
	var value = obj.elem.checked ? 1 : 0,
		id = this.value;
	$.post(ASKURL + "/admin/update",
		{
				type: 2, 
				id: id, 
				position: 'discount', 
				value: value,
				xtoken:strUserInfo
		},
		function(data) {
			if (data.code == 1) {
				layer.msg("更新成功");
			}
		});
});
//监听新鲜果蔬操作
form.on('switch(funsnacks)', function(obj){
    var value = obj.elem.checked ? 1 : 0,
    		id = this.value;
	$.post(ASKURL + "/admin/update",
		{
				type: 2, 
				id: id, 
				position: 'funsnacks', 
				value: value,
				xtoken:strUserInfo
		},
		function(data) {
			if (data.code == 1) {
				layer.msg("更新成功");
			}
		});
});
//监听趣味零食操作
form.on('switch(freshfruit)', function(obj){
    var value = obj.elem.checked ? 1 : 0,
    		id = this.value;
	$.post(ASKURL + "/admin/update",
		{
				type: 2, 
				id: id, 
				position: 'freshfruit', 
				value: value,
				xtoken:strUserInfo
		},
		function(data) {
			if (data.code == 1) {
				layer.msg("更新成功");
			}
		});
});
//监听工具条
table.on('tool(good)', function(obj){
    var data = obj.data;
    if(obj.event === 'media'){
        window.open("admingp.html?type=media&id=" + data.id);
    } else if (obj.event === 'introPicture') {
        window.open("admingp.html?type=introPicture&id=" + data.id);
    }
    else if (obj.event === 'property'){
    		window.open("propertyChange.html?id=" + data.id);
    }
});


$('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
});