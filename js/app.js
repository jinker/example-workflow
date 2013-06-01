util.namespace("app");

(function () {
	var jurisdiction0 = new model.Jurisdiction("node0");
	var jurisdiction1 = new model.Jurisdiction("node1");
	var jurisdiction2 = new model.Jurisdiction("node2");

	var staff0 = new model.Staff("张三", [jurisdiction0]);
	var staff1 = new model.Staff("李四", [jurisdiction1]);
	var staff2 = new model.Staff("王二", [jurisdiction2]);
	var staffs = [staff0, staff1, staff2];

	var node0 = new model.Node("node0", jurisdiction0);
	var node1 = new model.Node("node1", jurisdiction1);
	var node2 = new model.Node("node2", jurisdiction2);

	var workflow = new app.Workflow([node0, node1, node2], new model.Document("单据", "单据详细内容"));


	app.App = {
		curStaff: null,
		/**
		 * 登录
		 * @param {string} userName
		 * @param {function(model.Staff)} callback
		 */
		login: function (userName, callback) {
			var staff = null;
			for (var i = 0; staff = staffs[i]; i++) {
				if (staff.name === userName) {
					this.curStaff = staff;
					break;
				}
			}
			if (typeof  callback == "function") {
				callback(this.curStaff);
			}
		},
		/**
		 * 显示节点
		 */
		renderNodes: function () {
			var nodes = workflow.getNodes();
			var html = "";
			var node;
			for (var i = 0; node = nodes[i]; i++) {
				html += "<li>" + node.name + "</li>";
			}
			$("#node_list").html(html);
		},
		/**
		 * 事件绑定
		 */
		bind: function () {
			var self = this;
			//登录
			$("#btn_login").click(function () {
				var userName = $("#user_name").val();
				self.login(userName, function (staff) {
					if (staff) {
						self.renderNodes();
						$("#panel_login").hide();
						$("#panel_workflow").show();
					} else {
						alert("用户名:" + userName + " 不存在");
					}
				});
			});
			//退出
			$("#btn_logout").click(function () {
				self.curStaff = null;
				$("#panel_login").show();
				$("#panel_workflow").hide();
			});
		}
	};

	app.App.bind();
})();