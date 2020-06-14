const handleSignIn = (req, res, database, bcrypt) => {
    
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
}

module.exports = {handleSignIn : handleSignIn};