import * as MDB from 'molten-core';

export { TypeTestOptions } from './typeTest';

/**
 * An object containing the errors for a form or field
 */
export interface FieldError {
  [fieldName: string]: Error | FieldError
}

/**
 * Function to create the type for a MoltenDB instance
 *
 * @param mdb MoltenDB Instance Library
 */
export type createType = (mdb: MDB.MoltenLibraryInstance) => Type;

export interface Type {
  /**
   * Name of the type
   */
  label: MDB.LangString;

  /**
   * Description of the type
   */
  description: MDB.LangString;
  /**
   * Field type options to change the storage and behaviour of the field
   */
  options: MDB.Options;

  /**
   * Get an instance of a type in the given a collection and an item
   *
   * @param name Name of the field to create a type instance for
   * @param collectionOptions Options for the collection to create the type
   *   for
   * @param item Item to create the type instance for
   *
   * @returns The type instance
   */
  instance: (name: string, collectionOptions: MDB.CollectionOptions,
      storage: string, resultRow: MDB.ResultRow,
      item: { [field: string]: any }) => ResultTypeInstance;

  /**
   * Validates the given value
   *
   * @param name Name of the field to validate the value for
   * @param collectionOptions Options for the collection to validate the
   *   value for.
   * @param item Current item values
   * @param value Value to validate
   *
   * @return An error, an object containing the errors for the
   * sub-fields, or null if value is valid
   */
  validate: (name: string, collectionOptions: MDB.CollectionOptions,
      item: { [field: string]: any }, value: any) => Error | FieldError;

  /**
   * Test if the value matches meets a certain condition
   *
   * @param name Name of the field to validate the value for
   * @param collectionOptions Options for the collection to validate the
   *   value for.
   * @param item Current item values
   * @param test ID of test to check against
   * @param parameters Parameters for the test
   *
   * @return An error, an object containing the errors for the
   * sub-fields, or null if value is valid
   */
  test: (name: string, collectionOptions: MDB.CollectionOptions,
      item: { [field: string]: any }, test: string,
      parameters: { [parameter: string]: any}) => Error | FieldError;

  /**
   * Create the schema required to store the type value in the storage for
   * given collection
   *
   * @param name Name of the field to create the schema for
   * @param collectionOptions Options for the collection to create the
   *   schema for
   * @param storage Identification of the storage that the field will be
   *   being retrieved from
   *
   * @returns An object containing the field schemas
   */
  schema: (name: string, collectionOptions: MDB.CollectionOptions,
      storage: string) => MDB.Storage.FieldSchema;

  /**
   * Returns the list of fields that need to be retrieved for this type from
   * given storage type
   *
   * @param name Name of the field to get list of fields for
   * @param collectionOptions Options for the collection to get the fields
   *   for
   * @param storage Identification of the storage that the field will be
   *   being retrieved from
   */
  fields: (name: string, collectionOptions: MDB.CollectionOptions,
      storage: string) => Array<string>;

  /**
   * Converts the given value into a value to be stored in the storage for
   * the given collection
   *
   * @param name Name of the field to convert the value for
   * @param collectionOptions Options for the collection to create the
   *   converted value for
   * @param value Value to convert for storage
   *
   * @returns Object contain key/value pairs to store
   */
  store: (name: string, collectionOptions: MDB.CollectionOptions,
    storage: string, value: any) => any;
}

export interface ResultTypeInstance {
  /**
   * Convert the value to a string
   *
   * @returns String value
   */
  toString: () => string;

  /**
   * Returns the raw value
   *
   * @returns Raw value
   */
  valueOf: () => any;
}
