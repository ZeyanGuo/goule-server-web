var element = layui.element,
    layer = layui.layer,
    table = layui.table,
    upload = layui.upload,
    imgurl = "",
    form = layui.form,
    strUserInfo = getCookie("qauser"),
    $ = layui.$;
   
table.render({
    elem: '#LAY_table_good'
    ,url: ASKURL + "/admin/query"
    ,cellMinWidth: 40
    
    ,where: {
        type: 4,
        'xtoken':strUserInfo,
        
    }
    ,cols: [[
        {checkbox: true, fixed: true}
        ,{field:'id', title: '类别ID', sort: true, fixed: true}
        ,{field:'gtname', title: '类别名称', sort: true, edit: 'text'}
        ,{field:'gtuse', title:'启用', width:85, templet: '#switchTpl', unresize: true}
    ]]
    ,id: 'userTable'
    ,page: true
    
});