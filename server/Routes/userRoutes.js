const express = require("express");
const router = express.Router();
const { verifytoken } = require("../controllers/verifytoken");
const { body } = require("express-validator");
const {
  createPost,
  login,
  userFollowing,
  userFollowingPost,
  updateUser,
  deleteUser,
  userDetails,
  followUser,
  passwordMatch,
} = require("../controllers/users");
const {
  verifyMail,
  forgotPassowrdMail,
  resetPasswordMail,
  verifiedSuccessfullMail
} = require("../controllers/sendMail");

router
  .route("/create/user")
  .post(
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("username").isLength({ min: 3 }),
    body("phonenumber").isLength({ min: 10 }),
    createPost
  ); // .

router.route("/verify/email").post(verifiedSuccessfullMail); // .
router
  .route("/login")
  .post(body("email").isEmail(), body("password").isLength({ min: 6 }), login); //.
router.route("/forgot/password").post(forgotPassowrdMail); //.
router.route("/reset/password").put(resetPasswordMail); //.
router.route("/following/:id").put(verifytoken, userFollowing); // .
router.route("/flw/:id").get(verifytoken, userFollowingPost); // .
router.route("/update/:id").put(verifytoken, updateUser);
router.route("/delete/:id").delete(deleteUser);
router.route("/post/user/details/:id").get(userDetails); // .
router.route("/all/user/:id").get(followUser); // .
router.route("/verifymail").post(verifyMail); // .
router.route("/password/match").post(passwordMatch);

module.exports = router;