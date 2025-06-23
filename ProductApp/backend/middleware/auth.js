const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta_super_segura'; // Mismo secreto que en auth.js

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No autorizado, falta token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autorizado, token mal formado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
