(function () {
	/**
	 * 定义命名空间。如‘test.test’
	 * @param {string} ns
	 */
	var namespace = function (ns) {
		if (typeof(ns) != "string")return;
		ns = ns.split(".");
		var o, ni;
		for (var i = 0, len = ns.length; i < len, ni = ns[i]; i++) {
			try {
				o = (o ? (o[ni] = o[ni] || {}) : (eval(ni + "=" + ni + "||{}")));
			} catch (e) {
				o = eval(ni + "={}");
			}
		}
		return o;
	};
	namespace("util").namespace = namespace;
})();