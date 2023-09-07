export class APIResponseHelper {
  static success<T = any>(
    statusCode: number,
    message: string = 'Success',
    data?: T,
  ) {
    return {
      isSuccess: true,
      statusCode,
      message,
      data,
    };
  }

  static error(statusCode: number, message: string = 'Error', other?: any) {
    return {
      isSuccess: false,
      statusCode,
      message,
      dev: other,
    };
  }
}
