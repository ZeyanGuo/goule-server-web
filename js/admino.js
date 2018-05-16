var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
   	laypage = layui.laypage,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser"),
    $ = layui.$,
    page = 1,
    limit = 10,
    firstRender = false,
    postInfo = {};

form.render('select');

if (strUserInfo == "undefined") {
    location.href = "./adminLogin.html";
}

function getAjaxDataById(id){
	$.ajax({
		type:"get",
		url:ASKURL+"/admin/querybyid",
		data:{
			type:3,
			id:id,
			xtoken:strUserInfo
		},
		async:true,
		success:function(data){
			if(data.code == 1){
				var ArrayData = [];
				ArrayData.push(data.data);
				renderTable(ArrayData,1);	
			}
			else{
				layer.msg(data.msg);
			}
		},
		error:function(){
			layer.msg('获取订单信息失败');
		}
	});
}

function getAjaxData(key){
	$.ajax({
		type:"get",
		url:ASKURL+"/admin/query",
		data:{
			type:3,
			page:page,
			limit:limit,
			xtoken:strUserInfo,
			key:key
		},
		async:true,
		success:function(data){
			if(data.code == 1){
				renderTable(data.data,data.count);	
			}
			else{
				layer.msg(data.msg);
			}
			
		},
		error:function(err){
			layer.msg('获取数据失败')
		}
	});
}

function renderTable(data,count){
	var dataRender = [];

	data.map(function(obj){
		var order = obj.order,
			status,
			checkArray = {
				'SF':'顺丰速运',
				'HTKY':'百世快递',
				'ZTO':'中通快递',
				'STO':'申通快递',
				'YTO':'圆通速递',
				'YD':'韵达速递',
				'YZPY':'邮政快递包裹',
				'EMS':'EMS',
				'HHTT':'天天快递',
				'JD':'京东物流',
				'UC':'优速快递',
				'DBL':'德邦',
				'FAST':'快捷快递',
				'ZJS':'宅急送',
				'TNT':'TNT快递',
				'UPS':'UPS',
				'DHL':'DHL',
				'FEDEX':'FEDEX联邦'
			};
		switch(order.odstatus){
			case -1:{
				status = '订单取消'
			} break;
			case 0:{
				status = '未支付'
			} break;
			case 1:{
				status = '待发货'
			} break;
			case 2:{
				status = '已发货'
			} break;
			case 3:{
				status = '交易完成'
			} break;
			default:{}
		}
		postInfo[order.id] = {
			postId:order.postid,
			postType:order.posttype
		}
		
		dataRender.push({
			id:order.id,
			createTime:new Date(order.createtime).toLocaleString(),
			odStatus:status,
			postid:order.postid,
			postType:checkArray[order.posttype]
		})
	})
	table.render({
		elem: '#LAY_table_order'
	    ,cellMinWidth: 40
	    ,limit:limit
	    ,cols: [[
	    		{checkbox: true, fixed: true}
	      	,{field:'id', title: 'ID', sort: true, fixed: true}
	         ,{field:'odStatus',title:'订单状态',sort:true}
	         ,{field:'postid',title:'快递编号',edit:true}
	         ,{field:'postType',title:'快递商家',edit:true}
	        ,{field:'createTime', title: '创建时间',sort:true}
	        ,{field:'operation',title:'订单操作',toolbar:'#bar'}
	    ]]
	    ,id: 'orderTable'
	    ,data: dataRender
	    ,page:false
	})
	
	if(!firstRender){
		laypage.render({
	    elem: 'layui-table-page1'
	    ,count:count
	    ,layout: ['prev', 'page', 'next','skip','count','limit',]
	    ,theme:'defualt'
	    ,jump: function(obj){
	     	page = obj.curr;
	     	limit = obj.limit;
	     	if(firstRender){
	     		getAjaxData();
	     	}
	     	firstRender = true;
	    }
	  });
	}
	
}

function initPage(){
	getAjaxData();	
}

function initBtnClick(){
	$('#search').on('click',function(){
		var val = $('#uid').val();
		if(/^[0-9]*$/.test(val)){
			getAjaxDataById(val);
		}else{
			layer.msg('只支持ID查询，请输入正确ID')
		}
	})
}

function initSelectChange(){
	form.on('select(orderType)', function (data) {
		if(data.value == 4){
			getAjaxData();
		}
		else{
       	 	getAjaxData(data.value);
       	}
    });
}

function postTypeCheck(d){
	var hasOne = false;
	var checkArray = {
		'顺丰': 'SF',
		'百世': 'HTKY',
		'中通':'ZTO',
		'申通':'STO',
		'圆通':'YTO',
		'韵达':'YD',
		'邮政':'YZPY',
		'EMS':'EMS',
		'天天':'HHTT',
		'京东':'JD',
		'优速':'UC',
		'德邦':'DBL',
		'快捷':'FAST',
		'宅急送':'ZJS',
		'TNT':'TNT',
		'UPS':'UPS',
		'DHL':'DHL',
		'FEDEX':'FEDEX'
	}
	var index = d.data.id;
	for(var key in checkArray){
		var reg = new RegExp(key);
		if(reg.test(d.value.toUpperCase())){
			postInfo[index]={
				postId:!!postInfo[index]?postInfo[index].postId:'',
				postType:checkArray[key]
			}
			hasOne = true;
			break;
		}
	}
	if(!hasOne){
		layer.msg('请输入正确的快递商名字');
		if(!!postInfo[index]){
			postInfo[index].postType = '';
		}
	}
}

function postIdCheck(d){
	var index = d.data.id;
	postInfo[index] = {
		postId:d.value,
		postType:!!postInfo[index]?postInfo[index].postType:'',
	}
}

function initFormEdit(){
	table.on('edit(order)',function(d){
		console.log(d);
		
		if(d.field == "postType"){
			postTypeCheck(d);
		}
		else if(d.field == 'postid'){
			postIdCheck(d)
		}
		
		console.log(postInfo);
	})
}

function initTool(){
	table.on('tool(order)', function(obj){
		
	    var data = obj.data;
	    if(obj.event === 'updateLogistic'){
	        updateLogistic(obj.data.id);
	    } else if (obj.event === 'orderDetail') {
	        window.open("adminOrderDetail.html?id=" + data.id);
	    }
	});
}

function updateLogistic(id){
	if(!postInfo[id]){
		layer.msg('请填入完整且正确物流信息');
		return;
	}
	
	if(!postInfo[id].postType || !postInfo[id].postId){
		layer.msg('请填入完整且正确物流信息');
		return;
	}
	$.ajax({
		type:'POST',
		url:ASKURL+'/admin/addPostInfo',
		data:{
			orderid:id,
			posttype:postInfo[id].postType,
			postid:postInfo[id].postId,
			xtoken:strUserInfo
		},
		success:function(data){
			if(data.code==1){
				layer.msg('更新成功');
			}
			else{
				layer.msg(data.msg);
			}
		},
		error:function(err){
			layer.msg('更新物流信息失败，请稍后重试');
		}
	})
}

function initCancle(){
	$('#delete').on('click',function(){
		var checkStatus = table.checkStatus('orderTable')
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
        var url = ASKURL + "/admin/delete" + "?type=3&ids=" + ids + '&xtoken='+strUserInfo;
        //确定删除
        layer.confirm('你确定取消' + data.length + '个订单吗?', function(index){
            $.get(url, function(data){
                if (data.code == 1) {
                    //表单刷新
                    layer.msg('取消订单成功');
                    getAjaxData();
                }
            });
            layer.close(index);
        }, function(){
        });
	})
}

$(function(){
	initPage();
	initSelectChange();
	initBtnClick();
	initFormEdit();
	initTool();
	initCancle();
})

