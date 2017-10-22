import * as MDB from 'molten-core';

export type TestInternalInstanceOptions = {
  types: Array<string>,
  features: Array<string>
};

export const createMdbInternalInstance = (options: TestInternalInstanceOptions): MDB.MoltenInternalInstance => {
  let instance;

  instance = {
    options: options,
    types: {},
    storageHasType: (storage: string, type: string): boolean => options.types.indexOf(type) !== -1,
    storageHasFeatures: (storage: string, feature: string): boolean => options.types.indexOf(feature) !== -1
  };

  return instance;
};
export default createMdbInternalInstance;
