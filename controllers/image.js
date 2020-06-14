const updateEntries = (req, res, database) => {
    const userEmail = req.params.email;
    const currentEntries = req.params.entries;
    //console.log('userEmail', userEmail);
    //console.log('currentEntries', currentEntries);
    //let position = 0;

    database('entries')
    .returning('entries')
    .increment('entries',1)
    .where('email', '=', userEmail)
    .then(data => {
        if (data.length !== 0){
            database('users')
            .join('entries','users.email', '=', 'entries.email')
            .select('users.*', 'entries.entries')
            .where('users.email','=',userEmail)
            .then(data => {
                res.json(data[0]);
            })
        }else{
            res.status(400).json('Cannot find the user')
        }
    })
    .catch(err => res.status(400).json(err));

    /* const user = database.users.find((user) => {
        if(userEmail === user.email){
            user.entries++;
            return true;
        }
    });
     */
}

module.exports = {updateEntries : updateEntries};