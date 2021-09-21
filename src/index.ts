import axios from 'axios';
import express, { Request, Response } from 'express';
import { MuseumDto, ResponseDto } from './dto/responseDto';
import { AMError } from './utils/amError';
import { ErrorCodes } from './utils/errorCodes';
import { HttpStatusCode } from './utils/httpStatusCodes';
import { Util } from './utils/util';

const app = express();
const port = 3000;

app.get('/api/visitors', async (req: Request, res: Response) => {
    try {
        /* Reading the value of the query parameters */
        Util.verifyQueryParams(req);
        const dateInMilis = Number(req.query.date);
        const museumToIgnore = req.query.ignore ?? '';

        const date = new Date(dateInMilis);
        const month = date.getMonth() + 1;
        const monthName = date.toLocaleString('default', { month: 'short' });
        const year = date.getUTCFullYear();

        const getString = `https://data.lacity.org/resource/trxm-jn3c.json?month=${year}-${month}-01T00:00:00.000`;

        let resp = await axios.get(getString);

        const jsonArr = resp.data;
        if (jsonArr.length == 0)
            throw new AMError(HttpStatusCode.notFound, ErrorCodes.AM_ERR_DataUnavailable, 'No data found for the given month!');

        const museumData = jsonArr[0];

        let totalFootfall = 0;
        let highestMuseum: MuseumDto = { museum: '', visitors: 0 };
        let lowestMuseum: MuseumDto = { museum: '', visitors: Number.MAX_SAFE_INTEGER };
        let ignoredMuseum: MuseumDto | undefined;

        Object.keys(museumData).forEach(item => {
            if (item != 'month') {
                const value = Number(museumData[item]);
                if (item != museumToIgnore) {
                    if (value >= highestMuseum.visitors) {
                        highestMuseum = {
                            museum: item,
                            visitors: value
                        }
                    }
                    if (value <= lowestMuseum.visitors) {
                        lowestMuseum = {
                            museum: item,
                            visitors: value
                        }
                    }
                    totalFootfall += value;
                } else {
                    ignoredMuseum = {
                        museum: item,
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

        if (ignoredMuseum)
            returnValue.attendance.ignored = ignoredMuseum;

        res.status(200).send(returnValue);
    } catch (err) {
        if (err instanceof AMError) res.status(err.httpStatusCode).send(err);
        else {
            console.log(err);
            const amError = new AMError(HttpStatusCode.internalServerError, ErrorCodes.AM_ERR_InternalServerError,
                'Internal Server Error!');
            res.status(amError.httpStatusCode).send(amError);
        }
    }
});

const server = app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

export default server;