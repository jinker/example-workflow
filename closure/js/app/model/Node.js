goog.provide("app.model.Node");

goog.require("app.model.CountableClass");

app.model.Node = app.model.CountableClass.extend({
    /**
     * 流程节点
     * @param {string} name 名称
     * @param {app.model.Jurisdiction} jurisdiction 权限
     * @constructs
     */
    init: function (name, jurisdiction) {
        this._super.apply(this, Array.prototype.slice.call(arguments, 0));
        this.name = name;
        this.jurisdiction = jurisdiction;
        this._nodeStatus = new model.NodeStatus();
    },
    /**
     * 设置状态
     * @param {model.NodeStatus} nodeStatus
     */
    setNodeStatus: function (nodeStatus) {
        this._nodeStatus = nodeStatus;
    },
    /**
     * 获取状态
     * @return {model.NodeStatus}
     */
    getNodeStatus: function () {
        return this._nodeStatus;
    },
    /**
     * 是否未处理
     * @return {boolean}
     */
    isUntreated: function () {
        return this._nodeStatus.getStatus() === app.model.Node.STATUS.UNTREATED ||
            this._nodeStatus.getStatus() === app.model.Node.STATUS.GO_BACK;
    },
    /**
     * 是否已处理
     * @return {boolean}
     */
    isTreated: function () {
        switch (this._nodeStatus.getStatus()) {
            case app.model.Node.STATUS.AGREE:
            case app.model.Node.STATUS.DISAGREE:
                return true;
        }
        return false;
    },
    /**
     * 获取权限
     * @return {app.model.Jurisdiction}
     */
    getJurisdiction: function () {
        return this.jurisdiction;
    }
});

app.model.Node.STATUS = {
    UNTREATED: 0,//未处理
    AGREE: 1,//同意
    DISAGREE: 2,//不同意
    GO_BACK: 3//退回
};
