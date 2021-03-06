﻿//请求地址(列表)
var RequestListUrl = $.requestPath() + "api/user/getlist";
//请求地址(单条记录)
var RequestUrl = "/Manager_role/GetManager_role";
//请求地址(删除记录)
var RequestDelUrl = "/Manager_role/DelManager_role";
//请求地址(修改)
var RequestEditUrl = "/Manager_role/EditManager_role";
//请求控制器(添加)
var RequestAddUrl = "/Manager_role/AddManager_role"

$(function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

});
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_departments').bootstrapTable({
            url: RequestListUrl,                 //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            ajaxOptions: {
                headers: { "token": $.token() }
            },
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 15,                       //每页的记录行数（*）

            pageList: [15, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            silent: true,  //刷新事件必须设置
            formatLoadingMessage: function () {
                return "<div class='sk-spinner sk-spinner-wave'>" +
                    "<div class='sk-rect1'></div>" +
                    "<div class='sk-rect2'></div>" +
                    "<div class='sk-rect3'></div>" +
                    "<div class='sk-rect4'></div>" +
                    "<div class='sk-rect5'></div>" +
                    "</div>";
            },
            responseHandler:responseHandler,
            strictSearch: true,
            showColumns: false,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 621,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: '编号'
                //formatter: titleFormatter
                }, {
                    field: 'user_name',
                    title: '用户名'
             }, {
                field: 'password',
                title: '密码'
                }, {
                    field: 'mobile',
                    title: '手机号'
            }, {
                field: 'is_del',
                title: '是否删除'
                }
            ]

        });
    };
    function titleFormatter(value, row, index) {
        return row.user_name;
    }

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
             order: [{ "searchType": 1, "value": "id" }],
             paging: [params.offset, params.limit]

        };
        return temp;
    };

    //获取返回的数据的时候做相应处理
    function responseHandler(json)
    {
        if (json.status == -1)
        {
            parent.location.href = "/home/login";
        }
        return {
            "rows": json.data, // 具体每一个bean的列表
            "total": json.total  // 总共有多少条返回数据
        }
    }
    return oTableInit;
};



var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        $("#btn_add").click(function () {
            $("#myModalLabel").text("新增");
            $("#myModal").find(".form-control").val("");
            $("#form0").attr("action", RequestAddUrl);
            //全部设置为未选择
            $(".table-responsive table tr td .chkbox").each(function () {
                $(this).prev().prop("checked", "");
                $(this).removeClass("checked");
                $(this).addClass("unchecked");
                $(this).children(".check-image").css("background", "url(../img/input-unchecked.png)");
            })
            $('#myModal').modal()

        });

        $("#btn_edit").click(function () {
            var arrselections = $("#tb_departments").bootstrapTable('getSelections');
            if (arrselections.length > 1) {
                var d = dialog({
                    fixed: true,
                    content: "只能选择一行进行编辑",
                    padding: 30

                });
                d.show();
                //关闭提示模态框
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
                return;
            }
            if (arrselections.length <= 0) {
                var d = dialog({
                    fixed: true,
                    content: "请选择有效数据",
                    padding: 30

                });
                d.show();
                //关闭提示模态框
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
                return;
            }
            $("#myModalLabel").text("编辑");
            $.post(RequestUrl, { id: arrselections[0].id }, function (data) {
                $("#id").val(data.id);
                $("#txt_role_name").val(data.role_name);

                //全部设置为未选择
                $(".table-responsive table tr td .chkbox").each(function () {
                    $(this).prev().prop("checked", "");
                    $(this).removeClass("checked");
                    $(this).addClass("unchecked");
                    $(this).children(".check-image").css("background", "url(../img/input-unchecked.png)");
                })
                //将部分选择上
                $(".table-responsive table tbody").find("tr").each(function () {
                    var t = $(this).find("td").eq(0).find(".chkbox");
                    var navid = $(t).attr("id");
                    var all = 0;
                    $(t).each(function () {
                        var action_type = $(this).children(".radiobox-content").html();
                        var k = $(this);
                        //发送ajax请求,验证是否具有这个权限,这里必须同步
                        para = { role_id: data.id, nav_id: navid, action_type: action_type };
                        $.ajax({
                            type: "post",
                            url: "/Manager_role/CheckManager_role_value",
                            async: false,
                            dataType: "json",
                            data: para,
                            success: function (datas, textStatus) {
                                if (datas == "true") {
                                    $(k).prev().prop("checked", "checked");
                                    $(k).removeClass("unchecked");
                                    $(k).addClass("checked");
                                    $(k).children(".check-image").css("background", "url(../img/input-checked.png)");
                                } else {
                                    all = 1;
                                }
                            }
                        });
                        if (all == 0) {
                            $(k).parent().parent().next().find(".chklist").prop("checked", "checked");
                            $(k).parent().parent().next().find(".ckAll").removeClass("unchecked");
                            $(k).parent().parent().next().find(".ckAll").addClass("checked");
                            $(k).parent().parent().next().find(".ckAll").children(".check-image").css("background", "url(../img/input-checked.png)");
                        }
                    })
                })
                $("#form0").attr("action", RequestEditUrl);
            }, "json");
            $('#myModal').modal();
        });

        $("#btn_delete").click(function () {
            var arrselections = $("#tb_departments").bootstrapTable('getSelections');
            if (arrselections.length <= 0) {
                var d = dialog({
                    fixed: true,
                    content: "请选择有效数据",
                    padding: 30

                });
                d.show();
                //关闭提示模态框
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
                return;
            }


            var d = dialog({
                title: '系统提示',
                padding: 30,
                content: '确定要删除这些数据?',
                okValue: '确定',
                ok: function () {
                    this.title('提交中…');
                    var ids = "";
                    $(arrselections).each(function () {
                        ids += this.id + ",";
                    })
                    if (ids.length > 1)//去掉最后一个,
                    {
                        ids = ids.substring(0, ids.length - 1);
                    }

                    $.post(RequestDelUrl, { ids: ids }, function (data) {
                        var e = dialog({
                            padding: 30,
                            content: data.msg
                        });
                        //显示模态框
                        e.show();
                        //先关闭主窗体
                        $('#myModal').modal('hide')
                        //刷新数据
                        $('#tb_departments').bootstrapTable('refresh', { url: RequestListUrl });
                        //关闭提示模态框
                        setTimeout(function () {
                            e.close().remove();
                        }, 2000);
                    });
                },
                cancelValue: '取消',
                cancel: function () { }
            });
            d.show();



        });


        $("#btn_query").click(function () {
            $("#tb_departments").bootstrapTable('refresh');
        });
    };

    return oInit;
};