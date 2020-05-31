const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const database = {
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
};


const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => {
    console.log('FaceDectection API is listening on port 3000')
});

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    const user = database.users.find(user => {
        if (user.email === email){
            return true;
        }
    });
    
    if (user === null || user === undefined){
        res.status(400).json('fail') 
    }else{
        bcrypt.compare(password, user.password, (err, result) => {
            result ? res.json(user) : res.status(400).json('fail') 
        });
    }    
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const newUser = {
        id : 111,
        name : name,
        email : email,
        password: password,
        entries : 0,
        joined : new Date()
    }

    const isDuplicateUser = database.users.some(user => {
        if (user.email === email){
            return true;
        }
    })

    if (isDuplicateUser){
        res.status(400).json('User is already existed');
    }else{
        bcrypt.hash(password, null, null, (err, hash) => {
            newUser.password = hash;
            database.users.push(newUser);
            res.json(newUser);
        });
    }
    //console.log(database);
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
    const user = database.users.find((user, index) => {
        if(userEmail === user.email){
            //position = index;
            user.entries++;
            return true;
        }
    });

    (user === undefined) 
    ? res.status(400).json('Cannot find the user')
    : res.json('Add 1 score to entries succesfully');
})
