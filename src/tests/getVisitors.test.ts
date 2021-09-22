import server from '../index';
import request from 'supertest';
import { ErrorCodes } from '../utils/errorCodes';

describe('Get visitors test cases', () => {

    afterAll(done => {
        server.close();
        done();
    });

    it('Get visitors with no query params will give an error', async () => {
        const result = await request(server).get('/api/visitors');
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual({
            httpStatusCode: 400,
            name: ErrorCodes.AM_ERR_ParamsMissing,
            message: 'Please enter a proper query.'
        });
    });

    it('Get visitors without date will give an error', async () => {
        const result = await request(server).get('/api/visitors?someotherparam=123456789');
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual({
            httpStatusCode: 400,
            name: ErrorCodes.AM_ERR_MonthMissing,
            message: 'Please provide a date.'
        });
    });

    it('Get visitors with invalid date will give an error', async () => {
        const result = await request(server).get('/api/visitors?date=baddate');
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual({
            httpStatusCode: 400,
            name: ErrorCodes.AM_ERR_InvalidDate,
            message: 'Please enter a valid number for the date.'
        });
    });

    it('Get visitors with unavailable date will give an error', async () => {
        const result = await request(server).get('/api/visitors?date=1');
        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
            httpStatusCode: 404,
            name: ErrorCodes.AM_ERR_DataUnavailable,
            message: 'No data found for the given month.'
        });
    });


    /* Response body copied from given example in the assignment */
    it('Get visitors for July 2014', async () => {
        const result = await request(server).get('/api/visitors?date=1404198000000');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({
            attendance: {
                month: 'Jul',
                year: 2014,
                highest: { museum: 'avila_adobe', visitors: 32378 },
                lowest: { museum: 'hellman_quon', visitors: 120 },
                total: 60535
            }
        });
    });

    /* Output will be the same as if there is no ignore parameter present */
    it('Get visitors for July 2014 with ignored museum not in the list', async () => {
        const result = await request(server).get('/api/visitors?date=1404198000000&ignore=notinLA');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({
            attendance: {
                month: 'Jul',
                year: 2014,
                highest: { museum: 'avila_adobe', visitors: 32378 },
                lowest: { museum: 'hellman_quon', visitors: 120 },
                total: 60535
            }
        });
    });

    /* Response body modified from given example in the assignment as the value given in the document
      didn't match the actual output */
    it('Get visitors for July 2014 with ignored museum', async () => {
        const result = await request(server).get('/api/visitors?date=1404198000000&ignore=visitor_center_avila_adobe');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({
            attendance: {
                month: 'Jul',
                year: 2014,
                highest: { museum: 'avila_adobe', visitors: 32378 },
                lowest: { museum: 'hellman_quon', visitors: 120 },
                ignored: { museum: 'visitor_center_avila_adobe', visitors: 3527 },
                total: 57008
            }
        });
    });
});