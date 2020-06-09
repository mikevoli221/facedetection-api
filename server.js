const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require("knex");

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


const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => {
    console.log('FaceDectection API is listening on port 3000')
});


app.get('/', (req, res) => {
    database('users')
        .join('entries', 'users.email', '=', 'entries.email')
        .select('users.*', 'entries.entries')
        .then(data => {
            //console.log(data);
            res.json(data);
        });
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    
    /* const user = database.users.find(user => {
        if (user.email === email){
            return true;
        }
    }); */

    database('users')
    .join('entries', 'users.email', '=', 'entries.email')
    .select('users.*', 'entries.entries')
    .where('users.email', email)
    .then(data => {
        //console.log(data);
        if (data.length === 0){
            res.status(400).json('fail'); 
        }else{
            const user = data[0];
            bcrypt.compare(password, user.password, (err, result) => {
                result ? res.json(user) : res.status(400).json('fail') 
            });
        }
    });
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const newUser = {
        name : name,
        email : email,
        password: password,
        joined : new Date()
    }

    /* const isDuplicateUser = database.users.some(user => {
        if (user.email === email){
            return true;
        }
    }) */

    database('users').where('email', email).then (data =>  {
        //console.log(data);
        if (data.length === 0){
            bcrypt.hash(password, null, null, (err, hash) => {
                newUser.password = hash;
                database('users').insert(newUser).then(() => {
                    database('entries').insert(
                        {
                            email : email,
                            entries : 0
                        }
                    ).then(() => {
                        newUser.entries = 0;
                        res.json(newUser)
                    })
                });
            });    
        }else{
            res.status(400).json('User is already existed');
        }
    })
});

app.get('/profile/:email',(req, res) => {
    const userEmail = req.params.email;
    const user = database.users.find(user => {
        if (userEmail === user.email){
            return true;
        }
    });

    (user === undefined) 
    ? res.status(400).json('Cannot find the user')
    : res.json(user);
});

app.put('/score/:email', (req, res) => {
    const userEmail = req.params.email;
    //let position = 0;
    const user = database.users.find((user) => {
        if(userEmail === user.email){
            user.entries++;
            return true;
        }
    });

    (user === undefined) 
    ? res.status(400).json('Cannot find the user')
    : res.json(user);
})
