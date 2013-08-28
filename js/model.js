/**
 * Date: 13-6-1
 * Time: 下午2:52
 * 数据模型
 * @author jinker
 */
util.namespace("model");

model.CountableClass = util.Class.extend({
    /**
     * @constructs
     */
    init: function () {
        this._index = model.CountableClass.index++;
    },
    /**
     * 获取id
     * @return {string}
     */
    getId: function () {
        return this._index + "";
    }
});
//计数
model.CountableClass.index = 0;

model.Staff = model.CountableClass.extend({
    /**
     * 人员
     * @param {string} name 姓名
     * @param {Array.<model.Jurisdiction>} jurisdictions 姓名
     * @constructs
     */
    init: function (name, jurisdictions) {
        this._super.apply(this, Array.prototype.slice.call(arguments, 0));
        this.name = name;
        this._jurisdicions = jurisdictions || [];
    },
    /**
     * 增加权限
     * @param {model.Jurisdiction} jurisdiction
     */
    addJurisdiction: function (jurisdiction) {
        this._jurisdicions.push(jurisdiction);
    },
    /**
     * 是否具有该权限
     * @param {string} jurisdictionId
     * @return {boolean}
     */
    canHandle: function (jurisdictionId) {
        var jurisdiction;
        for (var i = 0; jurisdiction = this._jurisdicions[i]; i++) {
            if (jurisdiction.getId() === jurisdictionId) {
                return true;
            }
        }
        return false;
    }
});

model.Jurisdiction = model.CountableClass.extend({
    /**
     * 权限
     * @param {string} name 名称
     * @constructs
     */
    init: function (name) {
        this._super.apply(this, Array.prototype.slice.call(arguments, 0));
        this.name = name;
    }
});

model.Document = model.CountableClass.extend({
    /**
     * 单据
     * @param {string} name 名称
     * @param {*=} asset 资源
     * @constructs
     */
    init: function (name, asset) {
        this._super.apply(this, Array.prototype.slice.call(arguments, 0));
        this.name = name;
        this.asset = asset;
    }
});

model.Node = model.CountableClass.extend({
    /**
     * 流程节点
     * @param {string} name 名称
     * @param {model.Jurisdiction} jurisdiction 权限
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
        return this._nodeStatus.getStatus() === model.Node.STATUS.UNTREATED||
            this._nodeStatus.getStatus() === model.Node.STATUS.GO_BACK;
    },
    /**
     * 是否已处理
     * @return {boolean}
     */
    isTreated: function () {
        switch (this._nodeStatus.getStatus()) {
            case model.Node.STATUS.AGREE:
            case model.Node.STATUS.DISAGREE:
                return true;
        }
        return false;
    },
    /**
     * 获取权限
     * @return {model.Jurisdiction}
     */
    getJurisdiction: function () {
        return this.jurisdiction;
    }
});
model.Node.STATUS = {
    UNTREATED: 0,//未处理
    AGREE: 1,//同意
    DISAGREE: 2,//不同意
    GO_BACK: 3//退回
};
model.NodeStatus = util.Class.extend({
    /**
     * 流程节点状态
     * @param {int=} status 状态
     * @param {model.Staff=} staff 人员
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