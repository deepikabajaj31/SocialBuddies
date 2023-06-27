import React from "react";
import { useState, useEffect } from "react";
import styles from "./Post.module.css";
import profileimage from "../Images/Profile.png";
import likeImage from "../Images/like.png";
import commentIcon from "../Images/speech-bubble.png";
import shareIcon from "../Images/share.png";
import anotherLikeIcon from "../Images/setLike.png";
import { useSelector } from "react-redux";
import axios from "axios";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import removeFriend from '../Images/remove-user.png';
import Modal from "../UI/Modal";

const Post = ({ post, load, setLoad }) => {
  const userDetails = useSelector((state) => state.user);
  let users = userDetails.user;
  const [user, setuser] = useState([]); // uss user ki details jiska ye post h
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [count, setCount] = useState(post.like.length);
  const [comments, setComments] = useState(post.comments);
  const [commentWriting, setCommentWriting] = useState("");
  const [show, setShow] = useState(false);
  const userId = users.other._id;
  const accessToken = users.accessToken;

  const [like, setLike] = useState(
    post.like.includes(userId) ? anotherLikeIcon : likeImage
  );

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/post/user/details/${post.user}`);
        // post.user is id of user whose post is being showed
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured");
      }
    };
    getuser();
  }, []);

  const handleLike = async () => {
    if (like === likeImage) {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${post._id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/Json", token: accessToken },
      });
      setLike(anotherLikeIcon);
      setCount(count + 1);
    } else {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${post._id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/Json", token: accessToken },
      });
      setLike(likeImage);
      setCount(count - 1);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const comment = {
      postId: `${post._id}`,
      username: `${users.other.username}`,
      comment: `${commentWriting}`,
      profile: `${users.other?.profile}`,
    };
    setCommentWriting("");
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/comment/post`, {
      method: "PUT",
      headers: { "Content-Type": "application/Json", token: accessToken },
      body: JSON.stringify(comment),
    });
    setComments(comments.concat(comment));
  };

  const deleteComment = async (index) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/comment/post`, {
      method: "DELETE",
      headers: { "Content-Type": "application/Json", token: accessToken },
      body: JSON.stringify({ postId: post._id, index }),
    });

    const updatedComments = await response.json();
    console.log(updatedComments);
    setComments(updatedComments);
  }

  const unFollowUser = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/following/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/JSON", token: accessToken },
      body: JSON.stringify({ user: `${user._id}` }),
    });

    setLoad(prev => !prev);
  }

  const deletePost = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/delete/post/${post._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/JSON", token: accessToken },
    });

    setShowModal(false);
    setLoad(prev => !prev);
  }

  const handleShow = () => {
    if (show === false) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div className={styles.PostContainer}>
      <div className={styles.SubPostContainer}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "0.6rem", paddingTop: "0.6rem", paddingRight: "1.4rem" }}>
            <div style={{ display: "flex", alignItems: "center" }} onClick={() => navigate(`/profile/${user._id}`)}>
              {user.profile === "" ? (
                <img src={profileimage} className={styles.PostImage} alt="" />
              ) : (
                <img src={user.profile} className={styles.PostImage} alt="" />
              )}

              <div>
                <p style={{ marginLeft: "5px", textAlign: "start", borderBottom: "1px solid white" }}>
                  {" "}
                  {user.username}
                </p>
              </div>
            </div>
            {users.other.username !== user.username ?
              <div style={{ backgroundColor: "#aaa", padding: "12px", borderRadius: "50%", cursor: "pointer" }}
                onClick={unFollowUser}>
                <img src={removeFriend} className={styles.removeFriend} alt="" />
              </div>
              : <>
                <button style={{ padding: "10px 15px", borderRadius: "7px", backgroundColor: "#d72f2f", color: "white", cursor: "pointer" }} onClick={() => setShowModal(true)}>Delete Post</button>
                {showModal && <Modal onClose={() => setShowModal(false)} onDelete={deletePost} text="post" />}
              </>
            }

          </div>
          <p style={{ textAlign: "start", width: "96%", marginLeft: "20px", marginTop: "0px", }}>
            {post.title}
          </p>
          {post.image !== "" ? (
            <img src={`${post.image}`} className={styles.PostImages} alt="" />
          ) : post.video !== "" ? (
            <video className={styles.PostImages} width="500" height="500" controls>
              <source src={`${post.video}`} type="video/mp4" />
            </video>
          ) : (
            ""
          )}

          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer", }}>
                <img src={like} onClick={handleLike} className={`${styles.likeIcon} ${like === likeImage ? styles.white : ""}`} alt="" />
                <p style={{ marginLeft: "10px" }}>{count}</p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", marginLeft: "20px", cursor: "pointer", }}
                onClick={handleShow}
              >
                <img src={commentIcon} className={styles.iconsforPost} alt="" />
                <p style={{ marginLeft: "10px" }}>{comments.length} Comments</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginLeft: "4.5rem", cursor: "pointer", }}>
              <img src={shareIcon} style={{ marginLeft: "11rem" }} className={styles.iconsforPost} alt="" />
              <p style={{ marginLeft: "10px" }}>Share</p>
            </div>
          </div>
          {show === true ? (
            <div style={{ padding: "10px" }}>
              <form style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", marginLeft: "0.1rem" }} onSubmit={addComment}>
                <img src={users.other.profile} className={styles.PostImage} alt="" />
                <input
                  type="text"
                  placeholder="Write your thought"
                  onChange={(e) => setCommentWriting(e.target.value)}
                  className={styles.commentinput}
                  value={commentWriting}
                />
                <button className={styles.addCommentbtn} >
                  Post
                </button>
              </form>
              <div style={{ height: comments.length > 2 ? "8rem" : "auto", overflowY: "scroll" }}>
                {comments.map((item, index) => (
                  <div style={{ alignItems: "center", display: "flex" }} key={index}>
                    <div style={{ display: "flex", flexDirection: "column", overflowX: "scroll", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate(`/profile/${item.user}`)}>
                        <img src={item.profile} className={styles.PostImage} alt="" />
                        <p style={{ marginLeft: "6px", fontSize: 18, marginTop: 6, borderBottom: "1px solid white" }}>
                          {item.username}
                        </p>
                      </div>
                      <p style={{ marginLeft: "55px", textAlign: "start", marginTop: -16, overflowX: item.comment.length > 35 ? "scroll" : "", width: "80%", marginBottom: 0, whiteSpace: "nowrap" }}>
                        {item.comment}
                      </p>
                    </div>
                    {users.other.username === item.username &&
                      <IconButton
                        aria-label="delete"
                        size="small"
                        color="white"
                        onClick={() => deleteComment(index)}
                      >
                        <DeleteRoundedIcon sx={{ color: "white" }} />
                      </IconButton>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
