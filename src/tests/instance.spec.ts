import {testMdbInstance} from 'molten-core/dist/spec/helpers/fakeMdbInstance';
import createInternalInstance from './lib/mdbInternalInstance';

import * as Type from '../../typings/type';
import * as TypeTest from '../../typings/typeTest';

const createTypeInstanceTests = (createType: Type.createType,
    typeTestOptions: TypeTest.TypeTestOptions) => {
  describe('Type instance', () => {
    const createInstanceTest = (options) => {
      describe(options.label, () => {
        options.validValues.forEach((value) => {
          describe(value.label, () => {
            beforeEach(() => {
              this.type = createType(createInternalInstance({
                ...options.storage
              }));
              let data = {};
              data[options.fieldName] = value.storedValue;
              this.instance = this.type.instance(options.fieldName,
                  options.collection, {}, data);
            });

            describe('toString()', () => {
              it('should return a string representation of the value', () => {
                const result = this.instance.toString();

                expect(typeof result).toEqual('string');
                expect(result).toEqual(value.stringValue);
              });
            });

            describe('valueOf()', () => {
              it('should return the value independent of the storage', () => {
                const result = this.instance.valueOf();

                expect(result).toEqual(value.value);
              });
            });
          });
        });
      });
    };

    typeTestOptions.goodOptions.forEach((options) => {
      createInstanceTest(options);
    });
  });
};
export default createTypeInstanceTests;
