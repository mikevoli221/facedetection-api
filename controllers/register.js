const handleRegister = (req, res, database, bcrypt) => {
    
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
                database.transaction(tnx => {
                    tnx('users').insert(newUser).then(() => {
                        tnx('entries').insert(
                            {
                                email : email,
                                entries : 0
                            }
                        )
                        .then(() => {
                            newUser.entries = 0;
                            res.json(newUser)
                        })
                        .then(tnx.commit)
                        .catch(tnx.rollback)
                    })
                })
            });    
        }else{
            res.status(400).json('User is already existed');
        }
    })
};

module.exports = {handleRegister : handleRegister};

