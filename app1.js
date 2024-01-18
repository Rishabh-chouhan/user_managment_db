// app.js
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const fs = require('fs');
const User = require('./user-schema/user'); 
const app = express();
const { userSchemaValidation, validatePayload } = require('./joi-vaidation/schema');
const AUTH_KEY = 'rishabh';
const PORT = 3002;
app.use(express.json());



mongoose.connect('mongodb+srv://Rishabh:root@root.gcr49rw.mongodb.net/?retryWrites=true&w=majority', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});


const authenticate = (req, res, next) => {
    const authHeader = req.headers['auth'];

    if (!authHeader || authHeader !== AUTH_KEY) {
        return res.status(401).json({ error: 'notallowed' });
    }

    next();
};

const redis=require('redis');
const redisclient=redis.createClient();
redisclient.connect()
// redisclient.on('ready',()=>{
//     console.log("redis ok");
// })
// redisclient.on('error',(err)=>{
//     console.log("redis closed");
// })



app.post('/api/users', authenticate, validatePayload(userSchemaValidation), async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        // redisclient.set("100","rishabh");
        redisclient.set(user._id.toString(),JSON.stringify(user));
        
        res.status(200).json(user); 
    } catch (error) {
        console.error('db down:', error);
        res.status(500).json({ error: 'db err' });
    }
});

app.get('/api/users', authenticate, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'db err' });
    }
});




app.get('/api/users/:id', authenticate, async (req, res) => {
    try {
        const data_from_redis = await redisclient.get(req.params.id.toString());

        if (!data_from_redis) {
            const data_by_mongo = await User.findById(req.params.id);
            if (!data_by_mongo) {
                return res.status(404).json({ error: 'obj is not available in our mongo' });
            }
            await redisclient.set(user._id.toString(), JSON.stringify(data_by_mongo));
            return res.status(200).json({ data_by_mongo });
        } else {
            const user = JSON.parse(data_from_redis);
            return res.status(201).json({ user });
            
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Idb err' });
    }
});

app.delete('/api/users/:id', authenticate, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'user not avail' });
        }
        await User.findByIdAndDelete(userId);
        await redisclient.del(user._id.toString(), function(err, response) {
            if(response){
                console.log("also deleted from redis");
            }else{
                console.log("user is not present in redis");
            }
         })
        res.json({ message: 'deletion done' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

      


app.put('/api/users/:id', authenticate, validatePayload(userSchemaValidation), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = app;