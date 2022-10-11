const { createPrdouct, getAdminProducts, updatePrdouct, deletePrdouct, getPrdouctDetails, getAllProducts, createProductReview, getProductReviews, deleteProductReview } = require('../controllers/productController');

const {isAuthUser, authorizedRole} = require('../middleware/auth');

const router = require('express').Router();

router.route('/products').get(getAllProducts);
router.route('/products/:id').get(getPrdouctDetails);

// product routes 
router.route('/admin/products')
  .get(isAuthUser, authorizedRole('admin'), getAdminProducts)
  .post(isAuthUser, authorizedRole('admin'), createPrdouct);
  
router.route('/admin/products/:id')
  .put(isAuthUser, authorizedRole('admin'), updatePrdouct)
  .delete(isAuthUser, authorizedRole('admin'), deletePrdouct);

router.route('/review').put(isAuthUser, createProductReview);
router.route('/reviews').get(getProductReviews).delete(deleteProductReview);

module.exports = router;