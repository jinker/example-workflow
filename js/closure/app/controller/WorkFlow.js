goog.provide("app.controller.Workflow");

goog.require("app.Class");
goog.require("app.model.Jurisdiction");
goog.require("app.model.Staff");
goog.require("app.model.Node");
goog.require("app.model.Document");

app.controller.Workflow = app.Class.extend(
    /*@lends app.controller.Workflow#*/
    {
        /**
         * 业务流程
         * @param {Array.<app.model.Staff>} staffs 员工数组
         * @param {Array.<app.model.Node>} nodes 节点数组
         * @param {app.model.Document} doc 单据
         * @constructs
         */
        init: function (staffs, nodes, doc) {
            this._staffs = staffs || [];
            this._nodes = nodes;
            this._doc = doc;
            //当前登录员工
            this._curStaff = null;
            this._workflowView = null;
            this._loginView = null;
        },
        /**
         * 获取所有节点
         * @return {Array.<app.model.Node>}
         */
        getNodes: function () {
            return this._nodes;
        },
        /**
         * @return {app.model.Document}
         */
        getDoc: function () {
            return this._doc;
        },
        /**
         * 获取现在需处理的节点
         * @return {app.model.Node|null} 流程节点
         */
        getCurrentNode: function () {
            var cur = null;
            if (this._nodes) {
                /**
                 * 第一个未处理的节点即为当前节点
                 */
                var node;
                for (var i = 0; node = this._nodes[i]; i++) {
                    if (node.isUntreated()) {
                        cur = node;
                        break;
                    }
                }
            }
            return cur;
        },
        /**
         * 获取已处理节点
         * @return {Array.<app.model.Node>}
         */
        getNodesTreated: function () {
            var result = [];
            if (this._nodes) {
                var node;
                for (var i = 0; node = this._nodes[i]; i++) {
                    if (node.isTreated()) {
                        result.push(node);
                    }
                }
            }
            return result;
        },
        /**
         * 获取将被处理节点
         * @return {Array.<app.model.Node>}
         */
        getNodesWillBe: function () {
            var result = [];
            var first = true;
            if (this._nodes) {
                var node;
                for (var i = 0; node = this._nodes[i]; i++) {
                    //排除第一个当前未处理节点
                    if (!node.isTreated()) {
                        if (first) {
                            first = false;
                        } else {
                            result.push(node);
                        }
                    }
                }
            }
            return result;
        },
        /**
         * 同意
         */
        agree: function () {
            var currentNode = this.getCurrentNode();
            currentNode.setNodeStatus(new app.model.NodeStatus(app.model.Node.STATUS.AGREE, this._curStaff));
            this._workflowView.renderNodes();
            this._workflowView.renderButtons();
        },
        /**
         * 不同意
         */
        disagree: function () {
            var currentNode = this.getCurrentNode();
            currentNode.setNodeStatus(new app.model.NodeStatus(app.model.Node.STATUS.DISAGREE, this._curStaff));
            this._workflowView.renderNodes();
            this._workflowView.renderButtons();
        },
        /**
         * 退回
         * @return {boolean} 是否退回成功
         */
        goBack: function () {
            var nodesTreated = this.getNodesTreated();
            if (nodesTreated.length > 0) {
                var lastTreatedNode = nodesTreated[nodesTreated.length - 1];
                lastTreatedNode.getNodeStatus().setStatus(app.model.Node.STATUS.GO_BACK);
                this._workflowView.renderNodes();
                this._workflowView.renderButtons();
                return true;
            }
            return false;
        },
        /**
         * 转发其他人员处理
         * @param {app.model.Staff} otherStaff
         */
        transferToOther: function (otherStaff) {
            otherStaff.addJurisdiction(this.getCurrentNode().getJurisdiction());
        },
        /**
         *
         * @return {Array.<app.model.Staff>}
         */
        getStaffs: function () {
            return this._staffs;
        },
        /**
         * @param {string} staffId
         * @return {app.model.Staff}
         */
        getStaff: function (staffId) {
            var staffs = this._staffs;
            var staff;
            for (var i = 0; staff = staffs[i]; i++) {
                if (staff.getId() === staffId) {
                    return staff;
                }
            }
            return null;
        },
        /**
         * 登录
         * @param {string} userName
         */
        login: function (userName) {
            var staffs = this._staffs;
            var staff = null;
            for (var i = 0; staff = staffs[i]; i++) {
                if (staff.name === userName) {
                    this._curStaff = staff;
                    break;
                }
            }
            if (staff) {
                this._loginView.showLogin(staff);
                this._workflowView.renderNodes();
                this._workflowView.renderDocument();
                this._workflowView.renderButtons();
            } else {
                alert("用户名:" + userName + " 不存在");
            }
        },
        /**
         * 退出
         */
        logout: function () {
            this._curStaff = null;
            this._loginView.showLogout();
        },
        /**
         * @param {app.view.LoginView} loginView
         */
        setLoginView: function (loginView) {
            this._loginView = loginView;
        },
        /**
         * @param {app.view.WorkflowView} workflowView
         */
        setWorkflowView: function (workflowView) {
            this._workflowView = workflowView;
        },
        /**
         * 当前员工
         * @return {app.model.Staff}
         */
        getCurStaff: function () {
            return this._curStaff;
        }
    }
);
