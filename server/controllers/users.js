const User = require("../Models/userSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWTSEC = process.env.JWTSEC;
const Post = require("../Models/postSchema");
const VerificationToken = require("../Models/VerificationToken");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const createPost = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json("some error occured");
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json("Please login with correct password");
    }

    // hashing of password by bcypt
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: secpass,
      profile: req.body.profile,
      phonenumber: req.body.phonenumber,
    });

    // send mail to entered e-mail id for registration otp
    const response = await fetch(`https://socialbuddies-backend.onrender.com/api/user/verifymail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.username,
        email: req.body.email,
      })
    });

    const OTP = await response.json();

    // saving our generated otp in token string which will be hasshed by bcypt
    const verificationToken = await VerificationToken.create({
      user: user._id,
      token: OTP,
    });

    await verificationToken.save();
    await user.save();

    res.status(200).json({
      Status: "Pending",
      msg: "Please check your email",
      user: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Internal error occured");
  }
};

const login = async (req, res) => {
  const error = validationResult(req);
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json("User doesn't exist");
    }

    const Comparepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!Comparepassword) {
      return res.status(400).json("Incorrect Password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWTSEC
    );
    const { password, ...other } = user._doc;
    res.status(200).json({ other, accessToken });
  } catch (error) {
    res.status(500).json("Internal error occured");
  }
};

const passwordMatch = async (req, res) => {
  try {
    // console.log(req.body);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).json(false);
    }

    const Comparepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!Comparepassword) {
      return res.status(200).json(false);
    }

    return res.status(200).json(true);
  } catch (error) {
    res.status(500).json("Internal error occured");
  }
}

const userFollowing = async (req, res) => {

  if (req.params.id !== req.body.user) {
    const user = await User.findById(req.params.id); // me
    const otheruser = await User.findById(req.body.user); // the one i just followed

    if (!user.Following.includes(req.body.user)) {
      user.Following.push(req.body.user);
      await User.findOneAndUpdate({ _id: req.params.id }, {
        ...user,
      }
      );

      otheruser.Followers.push(req.params.id);
      await User.findOneAndUpdate({ _id: req.body.user }, {
        ...otheruser,
      }
      );
      await user.save();
      await otheruser.save();
      console.log("oops");
      return res.status(200).json("User has followed");
    } else {
      const user = await User.findById(req.params.id); // me
      const otheruser = await User.findById(req.body.user); // samne wala

      let pos = user.Following.indexOf(req.body.user);
      user.Following.splice(pos, 1);

      let posi = otheruser.Followers.indexOf(req.params.id);
      otheruser.Followers.splice(posi, 1);

      await User.findOneAndUpdate({ _id: req.params.id }, {
        ...user,
      }
      );
      await User.findOneAndUpdate({ _id: req.body.user }, {
        ...otheruser,
      }
      );
      await user.save();
      await otheruser.save();
      console.log("done");
      return res.status(200).json("User has Unfollowed");
    }
  } else {
    return res.status(400).json("You can't follow yourself");
  }
};

const userFollowingPost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const followersPost = await Promise.all(
      user.Following.map((item) => {
        return Post.find({ user: item });
      })
    );

    const userPost = await Post.find({ user: user._id });

    res.status(200).json(userPost.concat(...followersPost));
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      // i can make updations
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        req.body.password = secpass;
        const updateuser = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        await updateuser.save();
        res.status(200).json(updateuser);
      }
    } else {
      return res
        .status(400)
        .json("Your are not allow to update this user details ");
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const allUsers = await User.find({})
    for (let user of allUsers) {
      const index = user.Followers.indexOf(`${req.params.id}`);
      if (index !== -1) {
        console.log(user);
        user.Followers.splice(index, 1); // removed from followers list of other users
      }
      await user.save();
    }

    const allPosts = await Post.find({});
    for (let post of allPosts) {
      const likeIndex = post.like.indexOf(`${req.params.id}`);
      if (likeIndex !== -1) {
        // console.log(post);
        post.like.splice(likeIndex, 1); // removed from like list of other users post
      }

      for (let i = post.comments.length - 1; i >= 0; i--) {
        if (post.comments[i].user == req.params.id) {
          post.comments.splice(i, 1); // remove comments from others post
        }
      }

      await post.save();
    }

    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User account has been deleted");

  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json("User not found");
    }
    const { email, password, phonenumber, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const followUser = async (req, res) => {
  try {
    const allUser = await User.find(); // all users
    const user = await User.findById(req.params.id); // mai khud

    const followinguser = await Promise.all(
      user.Following.map((item) => {
        return item;
      })
    ); // my following list: id's of all users whom i follow

    let UserToFollow = allUser.filter((val) => {
      return !followinguser.find(item => val._id.toString() === item);
    }); // id's of those users which are not in my following list
    // allusers - followingUsers

    let filteruser = await Promise.all(
      UserToFollow.map((item) => {
        const {
          email,
          phonenumber,
          Followers,
          Following,
          password,
          ...others
        } = item._doc;
        return others;
      })
    );

    res.status(200).json(filteruser);
  } catch (error) { }
};

module.exports = {
  createPost,
  login,
  userFollowing,
  userFollowingPost,
  updateUser,
  deleteUser,
  userDetails,
  followUser,
  passwordMatch,
};
