const express = require("express");
const router = express.Router();
const { verifytoken } = require("../controllers/verifytoken");
const {
  createPosts,
  uploadPost,
  updatePost,
  postLike,
  postComment,
  deletePost,
  userFollowing,
  userFollowers,
  deleteComment,
  messageSend,
  getMessage
} = require("../controllers/post");

router.route("/user/post").post(verifytoken, createPosts); // .
router.route("/get/post/:id").get(uploadPost);
router.route("/update/post/:id").put(verifytoken, updatePost);
router.route("/:id/like").put(verifytoken, postLike); // .
router.route("/comment/post").put(verifytoken, postComment).delete(verifytoken, deleteComment); // .
router.route("/delete/post/:id").delete(verifytoken, deletePost);
router.route("/following/:id").get(userFollowing); // .
router.route("/followers/:id").get(userFollowers);
router.route("/msg").post(verifytoken, messageSend);
router.route("/get/chat/msg/:user1Id/:user2Id").get(verifytoken, getMessage); // user1-sender user2-reciever

module.exports = router;