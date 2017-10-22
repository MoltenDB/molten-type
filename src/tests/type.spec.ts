import {testLangString} from 'molten-core/dist/spec/helpers/testers';
import testMdbInstance from 'molten-core/dist/spec/helpers/fakeMdbInstance';
import createInternalInstance from './lib/mdbInternalInstance';

import * as TypeTest from '../../typings/typeTest';
import * as Type from '../../typings/type';

const createTypeTests = (createType: Type.createType,
    typeTestOptions: TypeTest.typeTestOptions) => {
  describe('createType()', () => {
    it('should be a function taking a MoltenDB library instance as its only parameter', () => {
      expect(createType).toEqual(jasmine.any(Function));
    });

    it('should return a Type instance', () => {
      const typeInstance = createType(testMdbInstance);
      expect(typeInstance).toEqual(jasmine.any(Object));

      testLangString(typeInstance.label, 'Type label');
      testLangString(typeInstance.description, 'Type description');
      if (typeof typeInstance.options !== 'undefined') {
        expect(typeInstance.options).toEqual(jasmine.any(Object));
      }
    });
  });

  describe('MDB instance Type', () => {
    describe('options', () => {
      beforeEach(() => {
        this.type = createType(testMdbInstance);
      });

      it('should either not exist or be an object containing the available type options', () => {
        if (!this.type.options) {
          expect(this.type.options).not.toBeDefined();
        } else {
          expect(this.type.options).toEqual(jasmine.any(Object));

          /// TODO Check Option
        }
      });

      it('should not contain a option with a reserved name (label, required)', () => {
        if (this.type.options) {
          Object.keys(this.type.options).forEach((option) => {
            expect(['label', 'required']).not.toContain(option);
          });
        }
      });
    });

    const testOptionsSet = (option: TypeTest.TypeTestSet) => {
      describe(option.label, () => {
        beforeEach(() => {
          this.type = createType(createInternalInstance({
              ...option.storage
          }));
        });

        describe('schema()', () => {
          it('should be a function', () => {
            expect(this.type.schema).toEqual(jasmine.any(Function));
          });

          it('should return an object containing the fields/schema that will be used to store the field', () => {
            let schema = this.type.schema(option.fieldName, option.collection);

            expect(schema).toEqual(jasmine.any(Object));

            Object.keys(schema).forEach((field) => {
              expect(schema[field].type).toEqual(jasmine.any(String));
            });
          });

          it('should contain fields that start with the name and sub fields should in '
              + 'the format <name>_<subfield> containing only letters, numbers and _', () => {
            let schema = this.type.schema(option.fieldName, option.collection);

            Object.keys(schema).forEach((field) => {
              expect(field).toMatch(new RegExp(option.fieldName
                  + '(_[a-zA-Z0-9_]+)?'), 'start with the field name');
            });
          });
        });

        describe('store()', () => {
          it('should be a function', () => {
            expect(this.type.store).toEqual(jasmine.any(Function));
          });

          it('should return the value for storage based on the storage features and types available', () => {
            option.validValues.forEach((value) => {
              let storedValue = this.type.store(option.fieldName, option.collection, null,
                  typeof value.enteredValue !== 'undefined' ? value.enteredValue : value.value);

              if (!(value.storedValue instanceof Object)) {
                expect(storedValue).toEqual({
                  [option.fieldName]: value.storedValue
                }, 'storedValue in store Object');
              } else {
                expect(storedValue).toEqual(value.storedValue);
              }
            });
          });
        });

        describe('instance()', () => {
          it('should be a function', () => {
            expect(this.type.instance).toEqual(jasmine.any(Function));
          });

          it('should return an instance of the type', () => {
            const instance = this.type.instance(option.fieldName,
                option.collection, option.validValues[0].value);

            expect(instance).toEqual(jasmine.any(Object));
            expect(instance.toString).toEqual(jasmine.any(Function));
            expect(instance.valueOf).toEqual(jasmine.any(Function));
          });
        });

        describe('validate()', () => {
          if (option.validValues) {
            describe('valid values', () => {
              option.validValues.forEach((validValue) => {
                it(validValue.label, () => {
                  expect(this.type.validate(option.fieldName, option.collection,
                    validValue.enteredValue || validValue.value)).toEqual(null);
                });
              });
            });
          }

          if (option.invalidValues) {
            describe('invalid values', () => {
              const checkFieldError = (error) => {
                if (error === null) {
                  fail('invalid value validated');
                } else if (error instanceof Error) {
                } else if (typeof error === 'object') {
                  Object.keys(error).forEach((subError) => {
                    checkFieldError(subError);
                  });
                } else {
                  fail('error is not a FieldError');
                }
              };

              option.invalidValues.forEach((invalidValue) => {
                it(invalidValue.label, () => {
                  checkFieldError(this.type.validate(option.fieldName,
                    option.collection, invalidValue.value));

                });
              });
            });
          }
        });


        describe('test()', () => {
          it('should be a function', () => {
            expect(this.type.test).toEqual(jasmine.any(Function));
          });

          if (option.testValues) {
            option.testValues.forEach((testValue) => {
              if (testValue.testResult) {
                it (`${testValue.label} should return true`, () => {
                  expect(this.type.test(option.fieldName, option.collection,
                      testValue.item, testValue.test,
                      testValue.parameters)).toEqual(true);
                });
              } else {
                it (`${testValue.label} should return false`, () => {
                  expect(this.type.test(option.fieldName, option.collection,
                      testValue.item, testValue.test,
                      testValue.parameters)).toEqual(false);
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
export default createTypeTests;
