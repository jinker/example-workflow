goog.provide("app.view.LoginView")

goog.require("app.Class");

app.view.LoginView = app.Class.extend({
    /**
     * 登录界面
     * @param {app.controller.Workflow} workflow
     * @constructs
     */
    init: function (workflow) {
        this._workflow = workflow;
        this._bind();
    },
    /**
     * 事件绑定
     */
    _bind: function () {
        var self = this;

        //登录
        var login = function () {
            var userName = $("#user_name").val();
            self._workflow.login(userName);
        };
        $("#user_name").on("keydown", function (e) {
            if (e.keyCode === 13) {
                login();
            }
        });
        $("#btn_login").click(function () {
            login();
        });
        //退出
        $("#btn_logout").click(function () {
            self._workflow.logout();
        });
    },
    /**
     * 显示登入界面
     * @param {app.model.Staff} staff
     */
    showLogin: function (staff) {
        $("#panel_login").hide();
        $("#panel_workflow").show();
    },
    /**
     * 显示登出界面
     */
    showLogout: function () {
        $("#panel_login").show();
        $("#panel_workflow").hide();
    }
});
