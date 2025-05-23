 
// backend/middleware/roleMiddleware.js
exports.checkIsAdmin = () => {
  return (req, res, next) => {
    if (!req.lecturer) {
      return res.status(401).json({ message: 'Unauthorized - Lecturer not found' });
    }

    if (!req.lecturer.is_admin) {
      return res.status(403).json({ message: 'Forbidden - Admins only' });
    }

    next();
  };
};

exports.requireLecturer = () => {
  return (req, res, next) => {
    if (!req.lecturer) {
      return res.status(401).json({ message: 'Unauthorized - Lecturer required' });
    }
    next();
  };
};
