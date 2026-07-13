const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: "Not authorised, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: "Not authorised, token failed" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Not authorised as an admin" });
    }
};

module.exports = { protect, admin };