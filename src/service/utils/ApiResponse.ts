interface Params {
  status?: number;
  data?: any;
  errors?: any[];
}

interface Result {
  status: number;
  data?: any;
  errors?: any[];
}

export class ApiResponse {
  private errors;
  private data;
  private status;

  constructor(params: Params) {
    this.status = params.status ?? 200;
    this.data = params.data;
    this.errors = params.errors;
  }

  public get result(): Result {
    return {
      status: this.status,
      errors: this.errors,
      data: this.data,
    };
  }
}
