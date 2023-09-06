import { Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Controller()
export class BaseController {
    protected responseHandler(result: Observable<any>, @Res() response?: Response) {
        return result.pipe(map(res => response.status(res.statusCode).json(res)))
    }
}
