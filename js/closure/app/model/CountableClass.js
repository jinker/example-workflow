goog.provide("app.model.CountableClass");

goog.require("app.Class");

app.model.CountableClass = app.Class.extend({
    /**
     * @constructs
     */
    init: function () {
        this._index = app.model.CountableClass._index++;
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
app.model.CountableClass._index = 0;