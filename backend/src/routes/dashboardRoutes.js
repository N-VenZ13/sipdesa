const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

router.use(verifyToken);
router.get('/', getDashboardStats);

module.exports = router;