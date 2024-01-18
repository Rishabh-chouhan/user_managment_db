const request = require('supertest');
const assert = require('assert'); // Using the built-in assert module
const app = require('../app1');
const mongoose = require('mongoose');
const User = require('../user-schema/user'); // Adjust the path based on your project structure

describe('GET /api/users', () => {
    it('should get all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('auth', 'rishabh');

        assert.strictEqual(response.status, 200);
        assert.strictEqual(Array.isArray(response.body), true);
       
    });

    it('should return 401 if authentication fails', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('auth', 'invalid_key'); 

        assert.strictEqual(response.status, 401);
        assert.strictEqual(response.body.error, 'notallowed');
    });

    


});





describe('POST /api/users', () => {
    it('should create a new user', async () => {
        const newUser = {
            "name": "John",
            "lastName": "Doe",
            "age": 30,
            "location": "Cityville",
            "interests": ["Reading", "Gaming"],
            "income": 50000
        };

        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .set('auth', 'rishabh'); // Assuming 'rishabh' is the authentication key

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.name, 'John');
        assert.strictEqual(response.body.lastName, 'Doe');
        
    });

    it('should return 401 if authentication fails', async () => {
        const newUser = {
            "name": "John",
            "lastName": "Doe",
            "age": 30,
            "location": "Cityville",
            "interests": ["Reading", "Gaming"],
            "income": 50000
        };

        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .set('auth', 'invalid_key'); 

        assert.strictEqual(response.status, 401);
        assert.strictEqual(response.body.error, 'notallowed');
    });

});


