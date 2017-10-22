import * as MDB from 'molten-core';

/**
 * Options to pass to createTypeTest() for testing a type
 */
export type TypeTestOptions = {
  /// Option sets to test the type against
  goodOptions: Array<TypeTestSet>
};

export type TypeTestSet = {
  /// Label for the test set
  label: string,
  /// Storage features and types for the test set
  storage: {
    types: MDB.Storage.FieldTypes[],
    features: MDB.Storage.Features[]
  },
  /// Collection options for the test set
  collection: MDB.CollectionOptions,
  /// Field name of test field
  fieldName: string,
  /// Value values to use for testing
  validValues: {
    label: string,
    enteredValue?: any,
    stringValue: string,
    value: any,
    storedValue: any
  }[],
  /// Invalid values to test validate() with
  invalidValues: {
    label: string,
    value: any
  }[],
  /// Test values to test test() with
  testValues: {
    label: string,
    item: { [field: string]: any },
    test: string,
    parameters: { [parameter: string]: any },
    testResult: boolean
  }[]
};
