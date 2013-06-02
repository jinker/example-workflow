/**
 * Date: 13-6-1
 * Time: ����2:52
 * ����ģ��
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
	 * ��ȡid
	 * @return {string}
	 */
	getId: function () {
		return this._index + "";
	}
});
//����
model.CountableClass.index = 0;

model.Staff = model.CountableClass.extend({
	/**
	 * ��Ա
	 * @param {string} name ����
	 * @param {Array.<model.Jurisdiction>} jurisdictions ����
	 * @constructs
	 */
	init: function (name, jurisdictions) {
		this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		this.name = name;
		this._jurisdicions = jurisdictions || [];
	},
	/**
	 * ����Ȩ��
	 * @param {model.Jurisdiction} jurisdiction
	 */
	addJurisdiction: function (jurisdiction) {
		this._jurisdicions.push(jurisdiction);
	},
	/**
	 * �Ƿ���и�Ȩ��
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
	 * Ȩ��
	 * @param {string} name ����
	 * @constructs
	 */
	init: function (name) {
		this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		this.name = name;
	}
});

model.Document = model.CountableClass.extend({
	/**
	 * ����
	 * @param {string} name ����
	 * @param {*=} asset ��Դ
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
	 * ���̽ڵ�
	 * @param {string} name ����
	 * @param {model.Jurisdiction} jurisdiction Ȩ��
	 * @constructs
	 */
	init: function (name, jurisdiction) {
		this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		this.name = name;
		this.jurisdiction = jurisdiction;
		this._nodeStatus = new model.NodeStatus();
	},
	/**
	 * ����״̬
	 * @param {model.NodeStatus} nodeStatus
	 */
	setNodeStatus: function (nodeStatus) {
		this._nodeStatus = nodeStatus;
	},
	/**
	 * ��ȡ״̬
	 * @return {model.NodeStatus}
	 */
	getNodeStatus: function () {
		return this._nodeStatus;
	},
	/**
	 * �Ƿ�δ����
	 * @return {boolean}
	 */
	isUntreated: function () {
		return this._nodeStatus.getStatus() === model.Node.STATUS.UNTREATED||
			this._nodeStatus.getStatus() === model.Node.STATUS.GO_BACK;
	},
	/**
	 * �Ƿ��Ѵ���
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
	 * ��ȡȨ��
	 * @return {model.Jurisdiction}
	 */
	getJurisdiction: function () {
		return this.jurisdiction;
	}
});
model.Node.STATUS = {
	UNTREATED: 0,//δ����
	AGREE: 1,//ͬ��
	DISAGREE: 2,//��ͬ��
	GO_BACK: 3//�˻�
};
model.NodeStatus = util.Class.extend({
	/**
	 * ���̽ڵ�״̬
	 * @param {int=} status ״̬
	 * @param {model.Staff=} staff ��Ա
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
	 * ����״̬
	 * @param {int} status
	 */
	setStatus: function (status) {
		this._status = status;
	}
});