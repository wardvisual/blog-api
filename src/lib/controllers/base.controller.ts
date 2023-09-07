import { Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Controller()
export class BaseController {
  protected send(result: Observable<any>, @Res() res?: Response) {
    return result.pipe(
      map((result) => res.status(result.statusCode).json(result)),
    );
  }
}
