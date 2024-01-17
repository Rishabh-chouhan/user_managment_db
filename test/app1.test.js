const request = require('supertest');
const app = require('../app1'); 
describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
        const userId = 'USER_ID';
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('auth', 'rishabh'); 
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user'); 

    });

    it('should return 404 if user ID is not found', async () => {
        const invalidUserId = 'INVALID_ID';
        const response = await request(app)
            .get(`/api/users/${invalidUserId}`)
            .set('auth', 'rishabh');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'obj is not available in our mongo');
    });

});
