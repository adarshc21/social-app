const { resgister, login, logout, forgotPassword, resetPassword, updatePassword, updateProfile, getUserDetails, getAllUsers, getSingleUser, updateSingleUser, deleteSingleUser } = require('../controllers/userController');
const {isAuthUser, authorizedRole} = require('../middleware/auth');

const router = require('express').Router();

// user routes
router.route("/register").post(resgister);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/password/forgot").get(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthUser, updatePassword);
router.route("/me/update").put(isAuthUser, updateProfile);
router.route("/me").get(isAuthUser, getUserDetails);

// admin routes
router.route("/admin/users").get(isAuthUser, authorizedRole("admin"), getAllUsers);
router.route("/admin/users/:id")
  .get(isAuthUser, authorizedRole("admin"), getSingleUser)
  .put(isAuthUser, authorizedRole("admin"), updateSingleUser)
  .delete(isAuthUser, authorizedRole("admin"), deleteSingleUser)

module.exports = router;