const setSession = (req, res, next) =>{
    // If session exists, keep it
    if (!req.session) {
        // Set default session values (like your PHP session)
        req.session = {
            id: 4,
            login_id: 5,
            type: "B",
            username: "7309990666",
            empCompany: 99 // add if needed
        };
    }

    next();
};

module.exports = {setSession}
