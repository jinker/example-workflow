goog.provide("app.model.Staff");

goog.require("app.model.CountableClass");

app.model.Staff = app.model.CountableClass.extend({
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
     * @param {app.model.Jurisdiction} jurisdiction
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
