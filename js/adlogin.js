var $ = layui.$;

$('#login').on('click', function(){
    var name = $("#uname").val(), password = $("#password").val();
    
    if (name != "" && password != "") {
    		$.ajax({
    			type:"POST",
    			url:ASKURL+"/admin/login",
    			data:{
    				name:name,
    				passwd:password
    			},
    			async:true,
    			success:function(result){
                if (result.code == 1) {
                    //登录成功
                    setCookie("qauser", result.data);
                    location.href = "./adminTypesPage.html";
                } else {
                    layer.msg(result.msg);
                }
            },
            error:function(err){
            		console.log(err);
           	 	layer.msg('网络异常，请稍后重试');
            }
    		});
        
    } else {
        layer.msg("请输入管理员用户名和密码");
    }
});