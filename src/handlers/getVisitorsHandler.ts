import axios from 'axios';
import { Request, Response } from 'express';
import { MuseumDto, ResponseDto } from '../dto/responseDto';
import { AMError } from '../utils/amError';
import { ErrorCodes } from '../utils/errorCodes';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { Util } from '../utils/util';

export async function getVisitors(req: Request, res: Response) {
    try {
        Util.verifyQueryParams(req);
        const date = new Date(Number(req.query.date));
        const museumToIgnore = req.query.ignore ?? '';

        const month = date.getMonth() + 1; // Adding 1 because January returns 0
        const monthName = date.toLocaleString('default', { month: 'short' }); //required in response
        const year = date.getUTCFullYear();

        const dataUrl = `https://data.lacity.org/resource/trxm-jn3c.json?month=${year}-${month}-01T00:00:00.000`;

        let apiResponse = await axios.get(dataUrl);
        const museumDataArray = apiResponse.data;
        if (museumDataArray.length == 0)
            throw new AMError(HttpStatusCode.notFound, ErrorCodes.AM_ERR_DataUnavailable,
                'No data found for the given month.');

        const museumData = museumDataArray[0]; // Only 1 element is returned due to our request

        let totalFootfall = 0;
        let highestMuseum: MuseumDto = { museum: '', visitors: 0 };
        let lowestMuseum: MuseumDto = { museum: '', visitors: Number.MAX_SAFE_INTEGER };
        let ignoredMuseum: MuseumDto | undefined;

        /* Calculating the highest, lowest and total footfalls */
        Object.keys(museumData).forEach(key => {
            // Ignoring the key-value pair for the `month`
            if (key != 'month') {
                const value = Number(museumData[key]);
                if (key != museumToIgnore) {
                    if (value >= highestMuseum.visitors) {
                        highestMuseum = {
                            museum: key,
                            visitors: value
                        }
                    }
                    if (value <= lowestMuseum.visitors) {
                        lowestMuseum = {
                            museum: key,
                            visitors: value
                        }
                    }
                    totalFootfall += value;
                } else {
                    ignoredMuseum = {
                        museum: key,
                        visitors: value
                    }
                }
            }
        });

        let returnValue: ResponseDto = {
            attendance: {
                month: monthName,
                year: year,
                highest: highestMuseum,
                lowest: lowestMuseum,
                total: totalFootfall
            }
        };

        // Populating ignored museum if given
        if (ignoredMuseum)
            returnValue.attendance.ignored = ignoredMuseum;

        res.status(HttpStatusCode.success).send(returnValue);
    } catch (err) {
        if (err instanceof AMError) res.status(err.httpStatusCode).send(err);
        else {
            const amError = new AMError(HttpStatusCode.internalServerError, ErrorCodes.AM_ERR_InternalServerError,
                'Internal Server Error!');
            res.status(amError.httpStatusCode).send(amError);
        }
    }
}