import { Request } from 'express';
import { AMError } from './amError';
import { ErrorCodes } from './errorCodes';
import { HttpStatusCode } from './httpStatusCodes';

export class Util {
    static verifyQueryParams(req: Request) {
        if (Object.keys(req.query).length === 0) {
            throw new AMError(HttpStatusCode.badRequest, ErrorCodes.AM_ERR_ParamsMissing,
                'Please enter a proper query.');
        }

        if (!Object.keys(req.query).includes('date')) {
            throw new AMError(HttpStatusCode.badRequest, ErrorCodes.AM_ERR_MonthMissing,
                'Please provide a date.');
        }

        if (Number.isNaN(Number(req.query.date))) {
            throw new AMError(HttpStatusCode.badRequest, ErrorCodes.AM_ERR_InvalidDate,
                'Please enter a valid number for the date.');
        }
    }
}