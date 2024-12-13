const authorize = (req, res, next) => {
if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
}

next();
};

module.exports = authorize;