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
var testers_1 = require("molten-core/dist/spec/helpers/testers");
var fakeMdbInstance_1 = require("molten-core/dist/spec/helpers/fakeMdbInstance");
var mdbInternalInstance_1 = require("./lib/mdbInternalInstance");
var createTypeTests = function (createType, typeTestOptions) {
    describe('createType()', function () {
        it('should be a function taking a MoltenDB library instance as its only parameter', function () {
            expect(createType).toEqual(jasmine.any(Function));
        });
        it('should return a Type instance', function () {
            var typeInstance = createType(fakeMdbInstance_1.default);
            expect(typeInstance).toEqual(jasmine.any(Object));
            testers_1.testLangString(typeInstance.label, 'Type label');
            testers_1.testLangString(typeInstance.description, 'Type description');
            if (typeof typeInstance.options !== 'undefined') {
                expect(typeInstance.options).toEqual(jasmine.any(Object));
            }
        });
    });
    describe('MDB instance Type', function () {
        describe('options', function () {
            beforeEach(function () {
                _this.type = createType(fakeMdbInstance_1.default);
            });
            it('should either not exist or be an object containing the available type options', function () {
                if (!_this.type.options) {
                    expect(_this.type.options).not.toBeDefined();
                }
                else {
                    expect(_this.type.options).toEqual(jasmine.any(Object));
                    /// TODO Check Option
                }
            });
            it('should not contain a option with a reserved name (label, required)', function () {
                if (_this.type.options) {
                    Object.keys(_this.type.options).forEach(function (option) {
                        expect(['label', 'required']).not.toContain(option);
                    });
                }
            });
        });
        var testOptionsSet = function (option) {
            describe(option.label, function () {
                beforeEach(function () {
                    _this.type = createType(mdbInternalInstance_1.default(__assign({}, option.storage)));
                });
                describe('schema()', function () {
                    it('should be a function', function () {
                        expect(_this.type.schema).toEqual(jasmine.any(Function));
                    });
                    it('should return an object containing the fields/schema that will be used to store the field', function () {
                        var schema = _this.type.schema(option.fieldName, option.collection);
                        expect(schema).toEqual(jasmine.any(Object));
                        Object.keys(schema).forEach(function (field) {
                            expect(schema[field].type).toEqual(jasmine.any(String));
                        });
                    });
                    it('should contain fields that start with the name and sub fields should in '
                        + 'the format <name>_<subfield> containing only letters, numbers and _', function () {
                        var schema = _this.type.schema(option.fieldName, option.collection);
                        Object.keys(schema).forEach(function (field) {
                            expect(field).toMatch(new RegExp(option.fieldName
                                + '(_[a-zA-Z0-9_]+)?'), 'start with the field name');
                        });
                    });
                });
                describe('store()', function () {
                    it('should be a function', function () {
                        expect(_this.type.store).toEqual(jasmine.any(Function));
                    });
                    it('should return the value for storage based on the storage features and types available', function () {
                        option.validValues.forEach(function (value) {
                            var storedValue = _this.type.store(option.fieldName, option.collection, null, typeof value.enteredValue !== 'undefined' ? value.enteredValue : value.value);
                            if (!(value.storedValue instanceof Object)) {
                                expect(storedValue).toEqual((_a = {},
                                    _a[option.fieldName] = value.storedValue,
                                    _a), 'storedValue in store Object');
                            }
                            else {
                                expect(storedValue).toEqual(value.storedValue);
                            }
                            var _a;
                        });
                    });
                });
                describe('instance()', function () {
                    it('should be a function', function () {
                        expect(_this.type.instance).toEqual(jasmine.any(Function));
                    });
                    it('should return an instance of the type', function () {
                        var instance = _this.type.instance(option.fieldName, option.collection, option.validValues[0].value);
                        expect(instance).toEqual(jasmine.any(Object));
                        expect(instance.toString).toEqual(jasmine.any(Function));
                        expect(instance.valueOf).toEqual(jasmine.any(Function));
                    });
                });
                describe('validate()', function () {
                    if (option.validValues) {
                        describe('valid values', function () {
                            option.validValues.forEach(function (validValue) {
                                it(validValue.label, function () {
                                    expect(_this.type.validate(option.fieldName, option.collection, validValue.enteredValue || validValue.value)).toEqual(null);
                                });
                            });
                        });
                    }
                    if (option.invalidValues) {
                        describe('invalid values', function () {
                            var checkFieldError = function (error) {
                                if (error === null) {
                                    fail('invalid value validated');
                                }
                                else if (error instanceof Error) {
                                }
                                else if (typeof error === 'object') {
                                    Object.keys(error).forEach(function (subError) {
                                        checkFieldError(subError);
                                    });
                                }
                                else {
                                    fail('error is not a FieldError');
                                }
                            };
                            option.invalidValues.forEach(function (invalidValue) {
                                it(invalidValue.label, function () {
                                    checkFieldError(_this.type.validate(option.fieldName, option.collection, invalidValue.value));
                                });
                            });
                        });
                    }
                });
                describe('test()', function () {
                    it('should be a function', function () {
                        expect(_this.type.test).toEqual(jasmine.any(Function));
                    });
                    if (option.testValues) {
                        option.testValues.forEach(function (testValue) {
                            if (testValue.testResult) {
                                it(testValue.label + " should return true", function () {
                                    expect(_this.type.test(option.fieldName, option.collection, testValue.item, testValue.test, testValue.parameters)).toEqual(true);
                                });
                            }
                            else {
                                it(testValue.label + " should return false", function () {
                                    expect(_this.type.test(option.fieldName, option.collection, testValue.item, testValue.test, testValue.parameters)).toEqual(false);
                                });
                            }
                        });
                    }
                });
            });
        };
        typeTestOptions.goodOptions.forEach(testOptionsSet);
    });
};
exports.default = createTypeTests;
