goog.provide("app.model.NodeStatus");

goog.require("app.Class");

app.model.NodeStatus = app.Class.extend({
    /**
     * 流程节点状态
     * @param {int=} status 状态
     * @param {app.model.Staff=} staff 人员
     * @constructs
     */
    init: function (status, staff) {
        this._status = status || model.Node.STATUS.UNTREATED;
        this.staff = staff;
    },
    /**
     * @return {int}
     */
    getStatus: function () {
        return this._status;
    },
    /**
     * 设置状态
     * @param {int} status
     */
    setStatus: function (status) {
        this._status = status;
    }
});