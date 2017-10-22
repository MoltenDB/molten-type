import createTypeTests from './tests/type.spec';
import createTypeInstanceTests from './tests/instance.spec';

import * as Type from '../typings/type';
import * as TestType from '../typings/typeTest';

const createTypeTest = (name: string, type: Type.createType,
    typeTestOptions: TestType.TypeTestOptions) => {
  describe(name + ' Type', () => {
    createTypeTests(type, typeTestOptions);
    createTypeInstanceTests(type, typeTestOptions);
  });
};
export default createTypeTest;
