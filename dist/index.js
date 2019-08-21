var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function plugin(options) {
        var name = options.name, postMessage = options.postMessage, onMessage = options.onMessage;
        if (!name) {
            throw 'options.name cannot be empty';
        }
        return function (root) {
            var observer = root.observer;
            if (!observer) {
                return;
            }
            observer.map(function (e) {
                var path = e.path, type = e.type, data = e.data, meta = e.meta;
                if (type === 'delete') {
                    type = 'unset';
                }
                else {
                    type = 'set';
                }
                root.postMessage({
                    source: (meta || {}).source,
                    path: path,
                    type: type,
                    data: data.unwrap()
                });
            });
            root.postMessage = function (msg) {
                var source = (msg.source || []).concat(name);
                postMessage(__assign({}, msg, { source: source }));
            };
            root.onMessage = function (msg) {
                onMessage && onMessage(msg);
                var _a = msg.source, source = _a === void 0 ? [] : _a, path = msg.path, type = msg.type, data = msg.data;
                if (source.indexOf(name) > -1) {
                    // discard self message
                    return;
                }
                switch (type) {
                    case 'set': {
                        root.observer.meta = {
                            source: source
                        };
                        root.set(path, data);
                        break;
                    }
                    case 'unset': {
                        root.unset(path);
                        break;
                    }
                }
            };
        };
    }
    exports.default = plugin;
});
//# sourceMappingURL=index.js.map