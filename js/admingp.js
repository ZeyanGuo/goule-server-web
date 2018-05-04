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
    pageType = params.type,
    imgType = {
   		media:'thumbnail',
   		introPicture:'introduce'
    };
    
var loading,thumbNail;

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

upload.render({
    elem: '#upload-video'
    ,url: ASKURL + "/admin/upimage"
    ,before: function(obj){
    		loading = layer.load(2);
//      obj.preview(function(index, file, result){
//          $('#cimage').attr('src', result);
//      });
    }
    ,size: 1024
    ,data: {
        goodid : gid,
        xtoken:strUserInfo
    }
    ,accept:'video'
    ,done: function(res){
    		layer.close(loading);
        if(res.code != 1){
            return layer.msg(res.msg);
        }
        $('#video-area').attr('src',res.data);
        $('#video-gray-area').hide();
        $('#video-area').show();
        
        layer.msg("上传成功");
        
        $.ajax({
        		url:ASKURL + "/admin/update",
        		type:'POST',
        		data:{
        			xtoken:strUserInfo,
        			position:'video',
        			value:res.data,
        			id:gid,
        			type:2
        		},
        		success:function(data){

        		},
        		error:function(){
        			layer.msg('同步用户失败，请稍后重试');
        		}
        })
    }
    ,error: function(){
        //上传失败，实现重传
        layer.msg("网络异常，上传失败，请稍后重传");
    }
});

upload.render({
    elem: '#upload-img'
    ,url: ASKURL + "/admin/upimage"
    ,before: function(obj){
    		loading = layer.load(2);
    }
    ,size: 1024
    ,data: {
        goodid : gid,
        xtoken:strUserInfo
    }
    ,done: function(res){
    		var sendData = thumbNail.split(';'),
    			hasPicture = false;
    		layer.close(loading);
        if(res.code != 1){
            return layer.msg(res.msg);
        }
        imgurl = res.data;
       	if(sendData[0]==''){
       		sendData.shift();
       	}
       	for(var i = 0; i< sendData.length;i++){
       		if(sendData[i] == res.data){
       			hasPicture = true;
       		}
       	}
       	if(!hasPicture){
	       	sendData.push(imgurl);
	       	renderTable(sendData);
	       	
	       	sendData = sendData.join(';');
	       	thumbNail = sendData;
	        layer.msg("上传成功");
	        
	        $.ajax({
	        		url:ASKURL + "/admin/update",
	        		type:'POST',
	        		data:{
	        			xtoken:strUserInfo,
	        			position:imgType[pageType],
	        			value:sendData,
	        			id:gid,
	        			type:2
	        		},
	        		success:function(data){
	
	        		},
	        		error:function(){
	        			layer.msg('同步用户失败，请稍后重试');
	        		}
	        })
        }
       	else{
       		layer.msg("该配图已存在，请勿重复上传");
       	}
    }
    ,error: function(){
        //上传失败，实现重传
       layer.msg('配图上传失败，请稍后重试');
    }
});


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
			var video,imagesUrls;
			thumbNail = data.data[imgType[pageType]],
			video = data.data.video,
			imagesUrls = thumbNail.split(';');
			if(pageType == 'media'){
				if(!video){
					$('#video-area').hide();
				}
				else{
					$('#video-gray-area').hide();
					
					$('#video-area').attr('src',video);
					$('#video-area').show();
				}
			}
			else if(pageType == 'introPicture'){
				$('.media-video').hide();
			}
			else{
				window.location.href = 'admin.html';
			}
			
			renderTable(imagesUrls);
		}else{
			layer.msg('信息获取失败');
		}
	},
	error:function(){
		layer.msg('商品信息获取失败，请稍后重试');
	}
});



function renderTable(imageUrls){
	var renderData;
	
	if(!(imageUrls.length == 1&& imageUrls[0] == '')){
		
		
		renderData = imageUrls.map(function(obj,index){
			return {
				id:index+1,
				linkurl:obj
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
	        ,{field:'linkurl', title: '图片链接'}
	        ,{field:'gallery',title:'预览',templet:'#bar',width:80}
	        
	    ]]
	    ,id: 'pictureTable'
	    ,data: renderData
	    ,page: false
	});
}
$('#delete-img').on('click',deletePicture);
function deletePicture(){
	var checkStatus = table.checkStatus('pictureTable')
            ,data = checkStatus.data,
            newData = thumbNail.split(';');
        var ids= "";
        if (data.length == 0) {
            layer.msg("请选择需要删除的数据");
            return;
        }
        for(var i = 0; i < data.length; i++) {
            for(var j = 0; j<newData.length;j++){
            		if(newData[j] == data[i].linkurl){
            			newData.splice(j,1);
            		}
            }
        }
        thumbNail = newData.join(';');
        if(!thumbNail){
        		thumbNail = '';
        }
        //确定删除
        layer.confirm('你确定删除' + data.length + '个配图吗?', function(index){
            $.ajax({
            		url:ASKURL+'/admin/update',
            		type:'POST',
            		data:{
            			xtoken:strUserInfo,
            			type:2,
            			position:imgType[pageType],
            			id:gid,
            			value:thumbNail
            		},
            		success:function(data){
            			if(data.code == 1){
            				layer.msg('删除数据成功');
            				renderTable(thumbNail.split(';'));
            				if(thumbNail == ''&&pageType == 'media'){//数据为空，取消推荐与上架
            					 $.ajax({
				            		url:ASKURL+'/admin/update',
				            		type:'POST',
				            		data:{
				            			xtoken:strUserInfo,
				            			type:2,
				            			position:'recommed',
				            			id:gid,
				            			value:0
				            		},
				            		success:function(){}
				            		
				            	});
				            	$.ajax({
				            		url:ASKURL+'/admin/update',
				            		type:'POST',
				            		data:{
				            			xtoken:strUserInfo,
				            			type:2,
				            			position:'status',
				            			id:gid,
				            			value:0
				            		},
				            		success:function(){}
				            		
				            	});
            					 
            				}
            			}
          			else{
          				layer.msg(data.msg);
          			}
            		},
            		error:function(){
            			layer.msg('删除数据失败，请稍后重试');
            		}
            })
            layer.close(index);
        }, function(){
        });
}


//监听单元格编辑
table.on('edit(picture)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
    $.post(ASKURL + "/admin/update",
        {type: 3, id: data.id, position: field, value: value},
        function(data) {
            console.log(data);
            if (data.code == 0) {
                layer.msg("更新成功");
            }
        });
});

//监听工具条
table.on('tool(picture)', function(obj){
    var data = obj.data;
    if(obj.event === 'views'){
        var html = '<div style="padding: 5px" align="center">';
        html += '<img src="' + data.linkurl + '" width="320px">'
        html += '</div>';
        layer.open({
            type: 1,
            title: "配图预览",
            content: html
        });
    }
});


