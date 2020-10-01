import ajv from 'ajv';

export interface IAjvKeyword {
  key: string;
  definition: ajv.KeywordDefinition;
}

type IAjvSchemaType = 'object' | 'string' | 'number' | 'array' | 'integer' | 'boolean';

export interface IAjvSchema {
  type?: IAjvSchemaType;
  required?: string[];
  properties?: {
    [key: string]: {
      type?: IAjvSchemaType;
      [key: string]: any;
    };
  };
  [key: string]: any;
}
