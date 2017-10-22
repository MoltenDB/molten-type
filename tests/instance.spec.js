"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var mdbInternalInstance_1 = require("./lib/mdbInternalInstance");
var createTypeInstanceTests = function (createType, typeTestOptions) {
    describe('Type instance', function () {
        var createInstanceTest = function (options) {
            describe(options.label, function () {
                options.validValues.forEach(function (value) {
                    describe(value.label, function () {
                        beforeEach(function () {
                            _this.type = createType(mdbInternalInstance_1.default(__assign({}, options.storage)));
                            var data = {};
                            data[options.fieldName] = value.storedValue;
                            _this.instance = _this.type.instance(options.fieldName, options.collection, {}, data);
                        });
                        describe('toString()', function () {
                            it('should return a string representation of the value', function () {
                                var result = _this.instance.toString();
                                expect(typeof result).toEqual('string');
                                expect(result).toEqual(value.stringValue);
                            });
                        });
                        describe('valueOf()', function () {
                            it('should return the value independent of the storage', function () {
                                var result = _this.instance.valueOf();
                                expect(result).toEqual(value.value);
                            });
                        });
                    });
                });
            });
        };
        typeTestOptions.goodOptions.forEach(function (options) {
            createInstanceTest(options);
        });
    });
};
exports.default = createTypeInstanceTests;
