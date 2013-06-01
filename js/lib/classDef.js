(function () {
	var isFunction = function (functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
	};

	/* Simple JavaScript Inheritance
	 * By John Resig http://ejohn.org/
	 * MIT Licensed.
	 */
	// Inspired by base2 and Prototype
	var initializing = false;
	// The base Class implementation (does nothing)
	var Class = function () {
	};

	// Create a new Class that inherits from this class
	Class.extend = function (prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructs)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" ?
				(function (name, fn) {
					return function () {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}

		// The dummy class constructs
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructs to be what we expect
		Class.prototype.constructs = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
	/**
	 * 判定是否相等
	 * @param obj
	 * @return {Boolean}
	 */
	Class.prototype.equals = function (obj) {
		return this === obj;
	};
	/**
	 * 克隆
	 * @param {Object} other
	 * @param {Boolean} cloneMethod 是否克隆方法
	 */
	Class.prototype.clone = function (other, cloneMethod) {
		for (var key in other) {
			var prop = other[key];
			if (prop !== undefined) {
				if (!isFunction(prop)) {
					this[key] = prop;
				} else {
					if (cloneMethod) {
						this[key] = prop;
					}
				}
			}
		}
	};

	var _package = util.namespace("util");
	_package.Class = Class;
})();