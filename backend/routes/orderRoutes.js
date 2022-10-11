const { newOrder, getSingleOrder, myOrders, updateOrder, deleteOrder } = require('../controllers/orderController');

const {isAuthUser, authorizedRole} = require('../middleware/auth');

const router = require('express').Router();

router.route('/orders').post(isAuthUser, newOrder);
router.route('/order/:id').get(isAuthUser, getSingleOrder);
router.route('/orders/me').get(isAuthUser, myOrders);
router.route('/admin/orders').get(isAuthUser, authorizedRole('admin'), myOrders);
router.route('/admin/orders/:id')
.put(isAuthUser, authorizedRole('admin'), updateOrder)
.delete(isAuthUser, authorizedRole('admin'), deleteOrder);

module.exports = router;