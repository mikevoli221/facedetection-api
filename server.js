const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require("knex");
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const database = knex(
    {
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
        }
    }
);

/*
const database = knex(
    {
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          user : 'hiepho',
          password : '',
          database : 'smart-brain'
        }
    }
);
*/


/* const database = {
    users : [
        {
            id : 123,
            name : 'hiep',
            email : 'hiep@yahoo.com',
            password : '$2a$10$hjXiep0hVoQhc5.fOxN31OF5MD/MLkJeFK0shCX6VZ7OvDEmgGv/C',
            entries : 0,
            joined : new Date()
        },
        {
            id : 124,
            name : 'kim',
            email : 'kim@yahoo.com',
            password : '$2a$10$hjXiep0hVoQhc5.fOxN31OF5MD/MLkJeFK0shCX6VZ7OvDEmgGv/C',
            entries : 0,
            joined : new Date()
        },
        {
            id : 125,
            name : 'binh',
            email : 'binh@yahoo.com',
            password : '$2a$10$hjXiep0hVoQhc5.fOxN31OF5MD/MLkJeFK0shCX6VZ7OvDEmgGv/C',
            entries : 0,
            joined : new Date()
        },
        {
            id : 126,
            name : 'an',
            email : 'an@yahoo.com',
            password : '$2a$10$hjXiep0hVoQhc5.fOxN31OF5MD/MLkJeFK0shCX6VZ7OvDEmgGv/C',
            entries : 0,
            joined : new Date()
        }
    ]
}; */

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.listen(port, () => {
    console.log(`FaceDectection API is listening on port ${port}`)
});


//app.get('/', (req, res) => profile.getAllProfiles(req, res, database));

app.get('/', (req, res) => res.send('Hello from FaceDetection EndPoints'));

app.post('/signin', (req, res) => signin.handleSignIn(req, res, database, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, database, bcrypt));

app.get('/profile/:email',(req, res) => profile.getProfile(req, res, database));

app.put('/score/:email', (req, res) => image.updateEntries(req, res, database));

app.post('/callClarifaiAPI', (req, res) => image.callClarifaiAPI(req, res));
