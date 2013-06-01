util.namespace("app");

app.Workflow = util.Class.extend({
	/**
	 * 业务流程
	 * @param {Array.<model.Node>} nodes 节点数组
	 * @param {model.Document} doc 单据
	 * @constructs
	 */
	init: function (nodes, doc) {
		this._nodes = nodes;
		this._doc = doc;
		this._staff = null;
	},
	/**
	 * 获取所有节点
	 * @return {Array.<model.Node>}
	 */
	getNodes: function () {
		return this._nodes;
	},
	/**
	 * 获取现在需处理的节点
	 * @return {model.Node|null} 流程节点
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
	 * 获取将被处理节点
	 * @return {Array.<model.Node>}
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
	 * 设置人员
	 * @param {model.Staff} staff
	 */
	setStaff: function (staff) {
		this._staff = staff;
	},
	/**
	 * 同意
	 * @param {model.Staff} staff
	 */
	agree: function (staff) {
		var currentNode = this.getCurrentNode();
		currentNode.setNodeStatus(new model.NodeStatus(model.Node.STATUS.AGREE, staff));
	},
	/**
	 * 不同意
	 * @param {model.Staff} staff
	 */
	disagree: function (staff) {
		var currentNode = this.getCurrentNode();
		currentNode.setNodeStatus(new model.NodeStatus(model.Node.STATUS.DISAGREE, staff));
	},
	/**
	 * 退回
	 * @param {model.Staff} staff
	 * @return {boolean} 是否退回成功
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
	 * 转发其他人员处理
	 * @param {model.Staff} otherStaff
	 */
	transferToOther: function (otherStaff) {
		otherStaff.addJurisdiction(this.getCurrentNode().getJurisdiction());
	}
});