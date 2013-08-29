goog.provide("app.view.WorkflowView")

goog.require("app.Class");

app.view.WorkflowView = app.Class.extend({
    /**
     * 流程界面
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

        var workflow = this._workflow;

        $("#buttons")
            .on("click", "button", function () {
                var action = $(this).attr("data-node-action");
                switch (action) {
                    case "agree":
                        workflow.agree();
                        break;
                    case "disagree":
                        workflow.disagree();
                        break;
                    case "goBack":
                        workflow.goBack();
                        break;
                    case "transfer":
                        self.showTransferPop();
                        break;
                }
            })

        $(document)
            .on("click", ".popup .confirm", function () {
                var otherIds = [];
                $("#popup input").each(function (index, el) {
                    if ($(el).prop("checked")) {
                        otherIds.push($(el).attr("data-staff-id"));
                    }
                });
                var otherId;
                for (var i = 0; otherId = otherIds[i]; i++) {
                    var staff = workflow.getStaff(otherId);
                    if (staff) {
                        workflow.transferToOther(staff);
                    }
                }
                $("#popup").remove();
            })
            .on("click", ".popup .cancel", function () {
                $("#popup").remove();
            });
    },
    /**
     * 显示表单内容
     */
    renderDocument: function () {
        var html = "";
        var doc = this._workflow.getDoc();
        html += "<h2>" + doc.name + "</h2>"
        html += "<div>" + doc.asset + "</div>"
        $("#doc").html(html);
    },
    /**
     * 显示节点
     */
    renderNodes: function () {
        var currentNode = this._workflow.getCurrentNode();
        var nodes = this._workflow.getNodes();
        var html = "";
        var className;
        var isTreated;
        var isCurrent;
        var node;
        for (var i = 0; node = nodes[i]; i++) {
            isCurrent = currentNode && node.getId() === currentNode.getId();
            var nodeStatus = node.getNodeStatus();
            switch (nodeStatus.getStatus()) {
                case app.model.Node.STATUS.AGREE:
                case app.model.Node.STATUS.DISAGREE:
                    className = "treated";
                    isTreated = true;
                    break;
                case app.model.Node.STATUS.UNTREATED:
                case app.model.Node.STATUS.GO_BACK:
                    className = "untreated";
                    isTreated = false;
                    break;
            }
            isCurrent && (className += " current");
            html += "<li class='" + className + "' data-node-id='" + node.getId() + "'>" + node.name;
            if (isTreated) {
                var statusStr;
                switch (nodeStatus.getStatus()) {
                    case app.model.Node.STATUS.AGREE:
                        statusStr = "同意";
                        break;
                    case app.model.Node.STATUS.DISAGREE:
                        statusStr = "不同意";
                        break;
                    case app.model.Node.STATUS.GO_BACK:
                        statusStr = "退回";
                        break;
                }
                html += "<div class='status'>" + nodeStatus.staff.name + statusStr + "</div>";
            }
            html += "</li>";
        }
        $("#node_list").html(html);
    },
    /**
     * 显示操作按钮
     */
    renderButtons: function () {
        var curStaff = this._workflow.getCurStaff();
        var currentNode = this._workflow.getCurrentNode();
        var nodesTreated = this._workflow.getNodesTreated();
        var html = "";
        if (currentNode && curStaff.canHandle(currentNode.getJurisdiction().getId())) {
            html += "<button class='agree' data-node-action='agree'>同意</button>";
            html += "<button class='disagree' data-node-action='disagree'>不同意</button>";
            if (nodesTreated.length > 0) {
                html += "<button class='disagree' data-node-action='goBack'>退回</button>";
            }
            html += "<button class='transfer' data-node-action='transfer'>转发其他人</button>";
        }
        $("#buttons").html(html);
    },
    /**
     * 显示转发popup
     */
    showTransferPop: function () {
        var curStaff = this._workflow.getCurStaff();
        var staffs = this._workflow.getStaffs();
        var html = "";
        html += "<div class='popup' id='popup'>";
        var staff;
        for (var i = 0; staff = staffs[i]; i++) {
            if (staff.getId() !== curStaff.getId()) {
                html += "<div><label><input type='checkbox' name='staff' data-staff-id='" + staff.getId() + "'>" + staff.name + "</label></div>";
            }
        }
        html += "<div class='buttons'><button class='confirm'>确认</button><button class='cancel'>取消</button></div>";
        html += "</div>";
        $(html).appendTo($("body"));
    }
});