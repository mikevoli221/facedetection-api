const getProfile = (req, res, database) => {
    const userEmail = req.params.email;
    
    /* const user = database.users.find(user => {
        if (userEmail === user.email){
            return true;
        }
    });
    */

    database('users')
    .join('entries','users.email','=','entries.email')
    .select('users.*','entries')
    .where('users.email','=', userEmail)
    .then (users => {
        //console.log(users);
        (users.length !== 0)? res.json(users[0]) : res.status(400).json('Cannot find the user');
    })
    .catch(err => res.status(400).json(err));
}


const getAllProfiles = (req, res, database) => {
    database('users')
        .join('entries', 'users.email', '=', 'entries.email')
        .select('users.*', 'entries.entries')
        .then(data => {
            //console.log(data);
            res.json(data);
        });
}

module.exports = {
    getProfile : getProfile,
    getAllProfiles : getAllProfiles
};