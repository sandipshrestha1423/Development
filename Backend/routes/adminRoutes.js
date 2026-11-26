const express = require('express');
const router = express.Router();
const { 
    getStats,
    registerAdmin, 
    loginAdmin, 
    logoutAdmin,
    getPendingUsers,
    verifyUser,
    getPendingServices,
    verifyService
} = require('../controllers/adminController');

const requireAdmin = (req, res, next) => {
    if (req.session && req.session.adminId) {
        return next();
    }
    return res.status(401).json({ msg: "Admin access required" });
};

router.get('/stats', requireAdmin, getStats);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

router.get('/pending-users', requireAdmin, getPendingUsers);
router.post('/verify-user', requireAdmin, verifyUser);

router.get('/pending-services', requireAdmin, getPendingServices);
router.post('/verify-service', requireAdmin, verifyService);

module.exports = router;