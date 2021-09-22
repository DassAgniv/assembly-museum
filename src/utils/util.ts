import { Request } from 'express';
import { QueryDto } from '../dto/queryDto';
import { AMError } from './amError';
import { ErrorCodes } from './errorCodes';
import { HttpStatusCode } from './httpStatusCodes';

export class Util {
    static verifyAndGetQueryParams(req: Request): QueryDto {
        if (Object.keys(req.query).length === 0) {
            throw new AMError(HttpStatusCode.badRequest, ErrorCodes.AM_ERR_ParamsMissing, 'Please enter a proper query.');
        }

        const dateInMilis: number = Number(req.query.date);
        const museumToIgnore: string = req.query.ignore?.toString() ?? '';

        const queryDto: QueryDto = { date: dateInMilis, ignored: museumToIgnore };
        return queryDto;
    }
}