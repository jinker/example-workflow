goog.provide("app.model.Document");

goog.require("app.model.CountableClass");

app.model.Document = app.model.CountableClass.extend({
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
