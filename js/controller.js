util.namespace("app");

app.Workflow = util.Class.extend({
	/**
	 * ҵ������
	 * @param {Array.<model.Node>} nodes �ڵ�����
	 * @param {model.Document} doc ����
	 * @constructs
	 */
	init: function (nodes, doc) {
		this._nodes = nodes;
		this._doc = doc;
		this._staff = null;
	},
	/**
	 * ��ȡ���нڵ�
	 * @return {Array.<model.Node>}
	 */
	getNodes: function () {
		return this._nodes;
	},
	/**
	 * ��ȡ�����账��Ľڵ�
	 * @return {model.Node|null} ���̽ڵ�
	 */
	getCurrentNode: function () {
		var cur = null;
		if (this._nodes) {
			/**
			 * ��һ��δ����Ľڵ㼴Ϊ��ǰ�ڵ�
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
	 * ��ȡ�Ѵ���ڵ�
	 * @return {Array.<model.Node>}
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
	 * ��ȡ��������ڵ�
	 * @return {Array.<model.Node>}
	 */
	getNodesWillBe: function () {
		var result = [];
		var first = true;
		if (this._nodes) {
			var node;
			for (var i = 0; node = this._nodes[i]; i++) {
				//�ų���һ����ǰδ����ڵ�
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
	 * ������Ա
	 * @param {model.Staff} staff
	 */
	setStaff: function (staff) {
		this._staff = staff;
	},
	/**
	 * ͬ��
	 * @param {model.Staff} staff
	 */
	agree: function (staff) {
		var currentNode = this.getCurrentNode();
		currentNode.setNodeStatus(new model.NodeStatus(model.Node.STATUS.AGREE, staff));
	},
	/**
	 * ��ͬ��
	 * @param {model.Staff} staff
	 */
	disagree: function (staff) {
		var currentNode = this.getCurrentNode();
		currentNode.setNodeStatus(new model.NodeStatus(model.Node.STATUS.DISAGREE, staff));
	},
	/**
	 * �˻�
	 * @param {model.Staff} staff
	 * @return {boolean} �Ƿ��˻سɹ�
	 */
	goBack: function (staff) {
		var nodesTreated = this.getNodesTreated();
		if (nodesTreated.length > 0) {
			var lastTreatedNode = nodesTreated[nodesTreated.length - 1];
			lastTreatedNode.getNodeStatus().setStatus(model.Node.STATUS.GO_BACK);
			return true;
		}
		return false;
	},
	/**
	 * ת��������Ա����
	 * @param {model.Staff} otherStaff
	 */
	transferToOther: function (otherStaff) {
		otherStaff.addJurisdiction(this.getCurrentNode().getJurisdiction());
	}
});