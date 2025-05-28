const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(403).json({ message: 'No token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Unauthorized! Token has expired.' });
                }
                return res.status(401).json({ message: 'Unauthorized! Invalid token.' });
            }
            req.userId = decoded.id; // Asumiendo que el payload del token tiene un campo 'id'
            req.userRole = decoded.role; // Asumiendo que el payload del token tiene un campo 'role'
            next();
        });
    } else {
        return res.status(403).json({ message: 'No authorization header provided.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole === 'admin') { // O el nombre del rol de administrador que uses
        next();
    } else {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
};

module.exports = { verifyToken, isAdmin };