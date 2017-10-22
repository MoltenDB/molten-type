"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_spec_1 = require("./tests/type.spec");
var instance_spec_1 = require("./tests/instance.spec");
var createTypeTest = function (name, type, typeTestOptions) {
    describe(name + ' Type', function () {
        type_spec_1.default(type, typeTestOptions);
        instance_spec_1.default(type, typeTestOptions);
    });
};
exports.default = createTypeTest;
