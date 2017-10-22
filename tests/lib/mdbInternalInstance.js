"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMdbInternalInstance = function (options) {
    var instance;
    instance = {
        options: options,
        types: {},
        storageHasType: function (storage, type) { return options.types.indexOf(type) !== -1; },
        storageHasFeatures: function (storage, feature) { return options.types.indexOf(feature) !== -1; }
    };
    return instance;
};
exports.default = exports.createMdbInternalInstance;
