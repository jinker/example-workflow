util.namespace("app");

(function () {
	var jurisdiction0 = new model.Jurisdiction("node0");
	var jurisdiction1 = new model.Jurisdiction("node1");
	var jurisdiction2 = new model.Jurisdiction("node2");

	var staff0 = new model.Staff("����", [jurisdiction0, jurisdiction1]);
	var staff1 = new model.Staff("����", [jurisdiction1]);
	var staff2 = new model.Staff("����", [jurisdiction2]);
	var staffs = [staff0, staff1, staff2];

	var node0 = new model.Node("node0", jurisdiction0);
	var node1 = new model.Node("node1", jurisdiction1);
	var node2 = new model.Node("node2", jurisdiction2);

	var workflow = new app.Workflow([node0, node1, node2], new model.Document("����", "������ϸ����"));

	app.App = {
		curStaff: null,
		/**
		 * ��¼
		 * @param {string} userName
		 * @param {function(model.Staff)} callback
		 */
		login: function (userName, callback) {
			var staff = null;
			for (var i = 0; staff = staffs[i]; i++) {
				if (staff.name === userName) {
					this.curStaff = staff;
					app.App.renderButtons();
					break;
				}
			}
			if (typeof  callback == "function") {
				callback(this.curStaff);
			}
		},
		/**
		 * ��ʾ������
		 */
		renderDocument: function () {
			var html = "";
			var doc = workflow.getDoc();
			html += "<h2>" + doc.name + "</h2>"
			html += "<div>" + doc.asset + "</div>"
			$("#doc").html(html);
		},
		/**
		 * ��ʾ�ڵ�
		 */
		renderNodes: function () {
			var currentNode = workflow.getCurrentNode();
			var nodes = workflow.getNodes();
			var html = "";
			var className;
			var isTreated;
			var isCurrent;
			var node;
			for (var i = 0; node = nodes[i]; i++) {
				isCurrent = currentNode && node.getId() === currentNode.getId();
				var nodeStatus = node.getNodeStatus();
				switch (nodeStatus.getStatus()) {
					case model.Node.STATUS.AGREE:
					case model.Node.STATUS.DISAGREE:
						className = "treated";
						isTreated = true;
						break;
					case model.Node.STATUS.UNTREATED:
					case model.Node.STATUS.GO_BACK:
						className = "untreated";
						isTreated = false;
						break;
				}
				isCurrent && (className += " current");
				html += "<li class='" + className + "' data-node-id='" + node.getId() + "'>" + node.name;
				if (isTreated) {
					var statusStr;
					switch (nodeStatus.getStatus()) {
						case model.Node.STATUS.AGREE:
							statusStr = "ͬ��";
							break;
						case model.Node.STATUS.DISAGREE:
							statusStr = "��ͬ��";
							break;
						case model.Node.STATUS.GO_BACK:
							statusStr = "�˻�";
							break;
					}
					html += "<div class='status'>" + nodeStatus.staff.name + statusStr + "</div>";
				}
				html += "</li>";
			}
			$("#node_list").html(html);
		},
		renderButtons: function () {
			var currentNode = workflow.getCurrentNode();
			var nodesTreated = workflow.getNodesTreated();
			var html = "";
			if (currentNode && this.curStaff.canHandle(currentNode.getJurisdiction().getId())) {
				html += "<button class='agree' data-node-action='agree'>ͬ��</button>";
				html += "<button class='disagree' data-node-action='disagree'>��ͬ��</button>";
				if (nodesTreated.length > 0) {
					html += "<button class='disagree' data-node-action='goBack'>�˻�</button>";
				}
				html += "<button class='transfer' data-node-action='transfer'>ת��������</button>";
			}
			$("#buttons").html(html);
		},
		/**
		 * ��ʾת��popup
		 */
		showTransferPop: function () {
			var html = "";
			html += "<div class='popup' id='popup'>";
			var staff;
			for (var i = 0; staff = staffs[i]; i++) {
				if (staff.getId() !== this.curStaff.getId()) {
					html += "<div><label><input type='checkbox' name='staff' data-staff-id='" + staff.getId() + "'>" + staff.name + "</label></div>";
				}
			}
			html += "<div class='buttons'><button class='confirm'>ȷ��</button><button class='cancel'>ȡ��</button></div>";
			html += "</div>";
			$(html).appendTo($("body"));
		},
		/**
		 * @param {string} staffId
		 * @return {model.Staff}
		 */
		getStaff: function (staffId) {
			var staff;
			for (var i = 0; staff = staffs[i]; i++) {
				if (staff.getId() === staffId) {
					return staff;
				}
			}
			return null;
		},
		/**
		 * �¼���
		 */
		bind: function () {
			var self = this;

			//��¼
			var login = function () {
				var userName = $("#user_name").val();
				self.login(userName, function (staff) {
					if (staff) {
						self.renderNodes();
						$("#panel_login").hide();
						$("#panel_workflow").show();
					} else {
						alert("�û���:" + userName + " ������");
					}
				});
			};
			$("#user_name").on("keydown", function (e) {
				if (e.keyCode === 13) {
					login();
				}
			});
			$("#btn_login").click(function () {
				login();
			});
			//�˳�
			$("#btn_logout").click(function () {
				self.curStaff = null;
				$("#panel_login").show();
				$("#panel_workflow").hide();
			});

			$("#buttons")
				.on("click", "button", function () {
					var action = $(this).attr("data-node-action");
					switch (action) {
						case "agree":
							workflow.agree(self.curStaff);
							self.renderNodes();
							self.renderButtons();
							break;
						case "disagree":
							workflow.disagree(self.curStaff);
							self.renderNodes();
							self.renderButtons();
							break;
						case "goBack":
							workflow.goBack(self.curStaff);
							self.renderNodes();
							self.renderButtons();
							break;
						case "transfer":
							self.showTransferPop();
							break;
					}
				})

			$("body")
				.on("click", ".popup .confirm", function () {
					var otherIds = [];
					$("#popup input").each(function (index, el) {
						if ($(el).prop("checked")) {
							otherIds.push($(el).attr("data-staff-id"));
						}
					});
					var otherId;
					for (var i = 0; otherId = otherIds[i]; i++) {
						var staff = self.getStaff(otherId);
						if (staff) {
							workflow.transferToOther(staff);
						}
					}
					$("#popup").remove();
				})
				.on("click", ".popup .cancel", function () {
					$("#popup").remove();
				});
		}
	};

	app.App.renderDocument();
	app.App.bind();
})();