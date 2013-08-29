goog.provide("app.entryPoint");

goog.require("app.controller.Workflow");
goog.require("app.view.LoginView");
goog.require("app.view.WorkflowView");

app.entryPoint.App = app.Class.extend({
    /**
     * 入口
     * @constructs
     */
    init: function () {
        //nothing
    },
    run: function () {
        var jurisdiction0 = new app.model.Jurisdiction("node0");
        var jurisdiction1 = new app.model.Jurisdiction("node1");
        var jurisdiction2 = new app.model.Jurisdiction("node2");

        var staff0 = new app.model.Staff("张三", [jurisdiction0, jurisdiction1]);
        var staff1 = new app.model.Staff("李四", [jurisdiction1]);
        var staff2 = new app.model.Staff("王二", [jurisdiction2]);

        var node0 = new app.model.Node("流程1", jurisdiction0);
        var node1 = new app.model.Node("流程2", jurisdiction1);
        var node2 = new app.model.Node("流程3", jurisdiction2);
        var node3 = new app.model.Node("流程4", jurisdiction2);
        var node4 = new app.model.Node("流程5", jurisdiction2);
        var node5 = new app.model.Node("流程6", jurisdiction2);
        var node6 = new app.model.Node("流程7", jurisdiction2);
        var node7 = new app.model.Node("流程8", jurisdiction2);

        var staffs = this._staffs = [staff0, staff1, staff2];
        var nodes = [node0, node1, node2, node3, node4, node5 ];

        var document = new app.model.Document("单据", "Make coding easy. At least, make it look easy. Over time, I’ve learned that programming is the most straightforward and simple part of being an engineer. I often use the phrase “a simple matter of programming” because I believe the harder parts of being an engineer is before and after most of the coding takes place. For example, designing what you’re about to code and ensuring what you’ve already coded is shippable and production ready. Make your interviewer understand that you know that programming is just a means to an end.	Note, coding in front of others can be daunting. Find a way to practice both white-boarding and pair-programming. Google is basically all about coding at a whiteboard, whereas Square is effectively all pair-programming at a real machine with your language and IDE of choice. Read this article from my friend and former colleague Dan.");

        var workflow = new app.controller.Workflow(staffs, nodes, document);

        var loginView = new app.view.LoginView(workflow);
        var workflowView = new app.view.WorkflowView(workflow);

        workflow.setLoginView(loginView);
        workflow.setWorkflowView(workflowView);
    }
});

new app.entryPoint.App().run();