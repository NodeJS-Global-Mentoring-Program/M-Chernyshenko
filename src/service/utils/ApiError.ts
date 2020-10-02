interface Params {
  code?: number;
  message?: string;
}

export class ApiError extends Error {
  public code: number;
  public message: string;

  public constructor(params: Params) {
    super(params.message);
    this.code = params.code ?? 500;
    this.message = params.message ?? '';
  }
}
