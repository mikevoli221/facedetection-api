const express = require('express');

const database = {
    users : [
        {
            id : 123,
            name : 'hiep',
            email : 'hiep@yahoo.com',
            password : '12345',
            entries : 0,
            joined : new Date()
        },
        {
            id : 124,
            name : 'kim',
            email : 'kim@yahoo.com',
            password : '12345',
            entries : 0,
            joined : new Date()
        },
        {
            id : 125,
            name : 'binh',
            email : 'binh@yahoo.com',
            password : '12345',
            entries : 0,
            joined : new Date()
        },
        {
            id : 126,
            name : 'an',
            email : 'an@yahoo.com',
            password : '12345',
            entries : 0,
            joined : new Date()
        }
    ]
};


const app = express();
app.use(express.json());
app.listen(3000, () => {
    console.log('FaceDectection API is listening on port 3000')
});

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    const isValidUser = database.users.some(user => {
        if (user.email === email && user.password === password){
            return true;
        }
    })
    
    isValidUser ? res.json('Signed in succesfully') : res.status(400).json('Signed in failed') 
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
        database.users.push(newUser);
        res.json('Registered user succesfully');
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
    let position = 0;
    const user = database.users.find((user, index) => {
        if(userEmail === user.email){
            position = index;
            return true;
        }
    });

    if (user === undefined){
        res.status(400).json('Cannot find the user')
    }else{
        user.entries = user.entries + 1
        database.users[position] = user;
        res.json('Add 1 score to entries succesfully');
    }
})

/*

/ res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/score --> PUT --> user

*/