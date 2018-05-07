var ASKURL = "http://goule.cjyong.com";
//var ASKURL = "http://localhost:8181";
/*
    class name:getCookie
    description:通过key获取cookie值
    return string key对应的值
*/
function getCookie(key){
    var params = divideParams(document.cookie,";");
    return unescape(params[key]);
}
/*
    class name:setCookie
    description:设置cookie
    @param key string
    @param value string
    @param expire 整数毫秒数
*/
function setCookie(key,value,expire){
    var exp = new Date();
    expire?exp.setTime(exp.getTime()+expire):exp.setTime(exp.getTime()+7*24*60*600);
    document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";";
}
/*
    class name:delCookie
    description:通过key删除cookie
*/
function delCookie(key){
    var exp = new Date();
    var value = getCookie(key);
    if(value){
        exp.setTime(exp.getTime()-1);
        document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";";
    }
}

function delCookieAll(){
    var params = divideParams(document.cookie,";");
    for(var key in params){
        delCookie(key);
    }
}

/*
    class name: divideParams
    description:分割 分割符分离的参数对 例: name=qy&passowrd=123456
    return object 返回参数键值对对象{name:qy,password:123456}
*/
function divideParams(strParams,separator){
    var params = {};
    var aStrParams = strParams.split(separator);
    for(var param in aStrParams){
        var aTempParam = aStrParams[param].trim().split("=");
        params[aTempParam[0]] = aTempParam[1];
    }
    return params;
}

function getCurrentTime() {
    var dateTime = new Date();
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var seconds = dateTime.getSeconds();
    function getRightFormat(num) {
        var result = "";
        if (num < 10) {
            result += "0";
        }
        return result + num;
    }
    return year + "-" + getRightFormat(month) + "-" + getRightFormat(day) + " " + getRightFormat(hours) + ":" +
        getRightFormat(minutes) + ":" + getRightFormat(seconds);
}

/*
   class name:getParams
   description: 获取get传递的参数
   return object 参数键值对对象
*/
function getURIParams(){
    var location = document.location.href;
    if(location.indexOf("?") < 0){
        return null;
    }
    var strParams = location.substring( location.indexOf("?") + 1);
    return divideParams(strParams,"&");
}
/*
    class name: divideParams
    description:分割 分割符分离的参数对 例: name=qy&passowrd=123456
    return object 返回参数键值对对象{name:qy,password:123456}
*/
function divideParams(strParams,separator){
    var params = {};
    var aStrParams = strParams.split(separator);
    for(var param in aStrParams){
        var aTempParam = aStrParams[param].trim().split("=");
        params[aTempParam[0]] = aTempParam[1];
    }
    return params;
}


function QueryString(item){
	var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
	return svalue ? svalue[1] : svalue;
}
