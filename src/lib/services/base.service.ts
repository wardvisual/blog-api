import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  protected send<T = any>(message: string = 'Success', data?: T) {
    return {
      isSuccess: true,
      message,
      data,
    };
  }
}
