var $ = layui.$,
	layer = layui.layer,
	 strUserInfo = getCookie("qauser"),
	 id = QueryString('id');

if(!strUserInfo ||strUserInfo == 'undefined'){
	window.location.href = 'adminLogin.html';
}

function initPage(){
	$.ajax({
		type:"get",
		url:ASKURL+"/admin/querybyid",
		async:true,
		data:{
			id:id,
			type:3,
			xtoken:strUserInfo
		},
		success:function(data){
			if(data.code == 1){
				renderPage(data.data);
			}
			else{
				layer.msg(data.msg);
			}
		},
		error:function(err){
			layer.msg('订单数据请求失败，请稍后重试')
		}
	});
}

function renderPage(data){
	var orderContainer = $('#orderDetail'),
		userContainer = $('#userContainer'),
		goodsContainer = $('#goodsContainer');
	orderContainer.append( addOrderDetail(data));
	userContainer.append(addUserDerail(data));
	
	data.goods.map(function(obj){
		goodsContainer.append(addGoodItem(obj));
	})
}

function addUserDerail(data){
	var html = `<div class="order-info-value-container">
								<p>收货人：</p>
								<p>${data.address.receptor}</p>
							</div>
							<div class="order-info-value-container">
								<p>联系方式：</p>
								<p>${data.address.phone}</p>
							</div>
							<div class="order-info-value-container">
								<p>收获地址：</p>
								<p>${data.address.detail}</p>
							</div>
							
							<div class="order-info-value-container">
								<p style = "vertical-align:top">用户备注：</p>
								<p class="order-info-remark" style = "vertical-align:top">${data.order.remarks}</p>
							</div>`
	return html;
}

function addGoodItem(obj){
	
	var singlePrice = (Number(obj.price) / Number(obj.produce.goodnum)).toFixed(2),
		price = Number(obj.price).toFixed(2);
	var html =`<div class="order-info-goods-container"  style="display: inline-block;"	>
								<div class="order-info-goods-title">
									<p style="width: 440px;">商品名称</p>
									<p style="width: 100px;">商品单价</p>
									<p style="width: 100px;">数量</p>
									<p style="width: 90px; padding-right: 0;">小计</p>
								</div>
								<div class="order-info-goods-value" style="padding-right: 0;">
									<img class="order-goods-img" src="${obj.thumbnail}" />
									<p class="name">${obj.name}</p>
									<p class="p-middle" style="color: black; width: 100px; border-left: 1px solid lightgray;">¥${singlePrice}</p>
									<p class="p-middle" style="width: 100px;">${obj.produce.goodnum}</p>
									<p class="p-middle" style="width: 100px; border-right: none; color:red">¥${price}</p>
								</div>
							</div>`
	return html;
}

function addOrderDetail(data){
	var status,price = 0,cinvoice,
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
			},
		postType;
	switch(data.order.odstatus){
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
	
	data.goods.map(function(obj){
		price += obj.price;	
	});
	price = price.toFixed(2);
	$('#totalPrice').html('¥'+price);
	if(data.order.cinvoice == 0){
		cinvoice = '否';
	}
	else{
		cinvoice = '是';
	}
	postType = checkArray[data.order.posttype];
	
	var html = ` <div class="order-info-value-container">
								<p>订单编号：</p>
								<p>${data.order.id}</p>
							</div>
							<div class="order-info-value-container">
								<p>订单状态：</p>
								<p>${status}</p>
							</div>
							<div class="order-info-value-container">
								<p>交易金额：</p>
								<p style = "color:red">¥${price}</p>
							</div>
							<div class="order-info-value-container">
								<p>付款方式：</p>
								<p>微信支付</p>
							</div>
							
							<div class="order-info-value-container">
								<p>开具发票：</p>
								<p>${cinvoice}</p>
							</div>
							<div class="order-info-value-container">
								<p>物流方式：</p>
								<p>${postType}</p>
							</div>
							
							<div class="order-info-value-container">
								<p>物流单号：</p>
								<p>${data.order.postid}</p>
							</div>`
	return html;
}

$(function(){
	initPage();
})
