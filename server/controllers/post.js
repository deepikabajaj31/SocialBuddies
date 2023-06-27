const Post = require("../Models/postSchema");
const User = require("../Models/userSchema");
const Message = require("../Models/MessageSchema");

const createPosts = async (req, res) => {
  try {
    let { title, image, video } = req.body;
    let newpost = new Post({
      title,
      image,
      video,
      user: req.user.id,
    });
    const post = await newpost.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal error occured");
  }
};

const uploadPost = async (req, res) => {
  try {
    //     console.log(req.params.id);
    const mypost = await Post.find({ user: req.params.id });
    //     console.log(mypost);
    if (!mypost) {
      return res.status(200).json("You don't have any post");
    }

    res.status(200).json(mypost);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

const updatePost = async (req, res) => {
  try {
    //     console.log(req.params.id);

    let post = await Post.findById({ _id: req.params.id });
    //     console.log(post);
    if (!post) {
      return res.status(400).json("Post does not found");
    }

    post = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    //     console.log(post);
    let updatepost = await post.save();
    //     console.log(updatepost);
    res.status(200).json(updatepost);
  } catch (error) {
    return res.status(500).json("Internal error occured");
  }
};

const postLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.like.includes(req.user.id)) {
      await post.updateOne({ $push: { like: req.user.id } });
      return res.status(200).json("Post has been liked");

    } else {
      await post.updateOne({ $pull: { like: req.user.id } });
      return res.status(200).json("Post has been unliked");
    }
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};

const postComment = async (req, res) => {
  try {
    const { comment, postId, profile } = req.body;
    const comments = {
      user: req.user.id,
      username: req.user.username,
      comment,
      profile,
    };
    const post = await Post.findById(postId);
    post.comments.push(comments);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, index } = req.body;
    const post = await Post.findById(postId);

    const updatedComments = post.comments.filter((val, idx) => idx != index);
    await Post.findByIdAndUpdate(postId,
      { comments: updatedComments },
      { new: true, runValidators: true }
    );

    await post.save();
    res.status(200).json(updatedComments);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }


}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json("You post has been deleted");
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followinguser = await Promise.all(
      user.Following.map((item) => {
        return User.findById(item);
      })
    );

    let followingList = [];

    followinguser.map((person) => {
      const { email, password, phonenumber, Following, Followers, ...others } =
        person._doc;
      followingList.push(others);
    });

    res.status(200).json(followingList);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const userFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersuser = await Promise.all(
      user.Followers.map((item) => {
        return User.findById(item);
      })
    );

    let followersList = [];
    followersuser.map((person) => {
      const { email, password, phonenumber, Following, Followers, ...others } =
        person._doc;
      followersList.push(others);
    });

    res.status(200).json(followersList);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

// create message
const messageSend = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const newMessage = await Message.create({
      message: message,
      ChatUsers: { from, to },
      Sender: from
    });

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
}

// get message
const getMessage = async (req, res) => {
  try {
    const from = req.params.user1Id;
    const to = req.params.user2Id;

    const sendMessage = await Message.find({
      ChatUsers: { from, to },
    }).sort({ updatedAt: 1 });

    const recievedMessage = await Message.find({
      ChatUsers: { from: to, to: from },
    }).sort({ updatedAt: 1 });

    // newMessage.concat(recievedMessage)
    const newMessage = [...sendMessage, ...recievedMessage];
    newMessage.sort((a, b) => a.updatedAt - b.updatedAt);
    console.log(newMessage);

    const allMessage = newMessage.map((msg) => {
      return {
        myself: msg.Sender.toString() === from,
        message: msg.message
      }
    })

    return res.status(200).json(allMessage);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
}

module.exports = {
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
};
