// controllers/authController.js
const User = require('../models/Admin'); 

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        req.session.user = { email };
        res.redirect('/admin/admin-dashboard');
    } else {
        res.render('login', { title: 'Admin Login', error: 'Invalid email or password' });
    }
};

