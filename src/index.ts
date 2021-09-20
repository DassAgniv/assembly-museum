import axios from 'axios';
import express, { Request, Response } from 'express';
import { MuseumDto, ResponseDto } from './dto/responseDto';

const app = express()
const port = 3000

app.get('/api/visitors', async (req: Request, res: Response) => {
    console.log(req.query.date);
    const dateInMilis = Number(req.query.date);
    const museumToIgnore = req.query.ignore ?? '';

    const date = new Date(dateInMilis);
    const month = date.getMonth() + 1;
    const monthName = date.toLocaleString('default', { month: 'short' });
    const year = date.getUTCFullYear();

    const getString = `https://data.lacity.org/resource/trxm-jn3c.json?month=${year}-${month}-01T00:00:00.000`;
    console.log('getString ', getString);

    let resp = await axios.get(getString);

    const jsonArr = resp.data;

    const museumData = jsonArr[0];

    let totalFootfall = 0;
    let highestMuseum: MuseumDto = { museum: '', visitors: Number.MIN_SAFE_INTEGER };
    let lowestMuseum: MuseumDto = { museum: '', visitors: Number.MAX_SAFE_INTEGER };
    let ignoredMuseum: MuseumDto | undefined;

    Object.keys(museumData).forEach(item => {
        if (item != 'month') {
            if (item != museumToIgnore) {
                const value = Number(museumData[item]);
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
                totalFootfall += Number(museumData[item]);
            } else {
                ignoredMuseum = {
                    museum: item,
                    visitors: Number(museumData[item])
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
    }

    if (ignoredMuseum)
        returnValue.attendance.ignored = ignoredMuseum;

    console.log(returnValue);
    res.status(200).send(returnValue);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});