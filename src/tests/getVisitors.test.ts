import server from '../index';
import request from 'supertest';

describe('Get visitors test cases', () => {

    afterAll(done => {
        server.close();
        done();
    });

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

    it('Get visitors for July 2014 with ignored Museum', async () => {
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