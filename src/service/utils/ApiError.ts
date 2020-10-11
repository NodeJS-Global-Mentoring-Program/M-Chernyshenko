interface Params {
  code?: number;
  message?: string;
}

export class ApiError extends Error {
  public code: number;

  public constructor(params: Params) {
    super(params.message);
    this.code = params.code ?? 500;
  }

  public getCode(): number {
    return this.code;
  }
}
