goog.provide("app.model.Jurisdiction");

goog.require("app.model.CountableClass");

app.model.Jurisdiction = app.model.CountableClass.extend({
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