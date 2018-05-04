var $ = layui.$;

$('#login').on('click', function(){
    var name = $("#uname").val(), password = $("#password").val();
    if (name != "" && password != "") {
        $.post(ASKURL + "/admin/login",
            {name:name, passwd: password},
            function(result){
                if (result.code == 1) {
                    //登录成功
                    setCookie("qauser", result.data);
                    location.href = "./adminTypesPage.html";
                } else {
                    layer.msg(result.msg);
                }
            });
    } else {
        layer.msg("请输入管理员用户名和密码");
    }
});