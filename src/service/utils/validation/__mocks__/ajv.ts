interface AjvValidate {
  (mockPayload: any): boolean;
  errors?: any[];
}

export default class Ajv {
  constructor() {}

  public compile(schema: any): AjvValidate {
    const result: AjvValidate = (params: { isValid: boolean }): boolean => {
      const isValid = params?.isValid;
      if (isValid === false) {
        result.errors = [];
      }
      return isValid;
    };

    return result;
  }

  public addKeyword = jest.fn();
}
