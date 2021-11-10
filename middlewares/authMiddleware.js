const User = require('../models/User');

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (err, user) => {
        if (err || !user) {
            req.flash('error', 'You must be logged in to view this page');
            return res.redirect('/');
        } else {
            next();
        }
    });
}