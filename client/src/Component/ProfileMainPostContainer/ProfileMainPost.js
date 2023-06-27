import React, { useState, useEffect } from 'react'
import styles from './ProfileMainPost.module.css'
import ContentPost from '../ContentPostContainer/ContentPost';
import Post from '../PostContainer/Post';
import cover from '../Images/cover.jpeg'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
const ProfileMainPost = ({ load, setLoad }) => {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  let userId = user.other._id;
  let location = useLocation();
  let id = location.pathname.split("/")[2];

  const [post, setPost] = useState([]);
  const [flag, setFlag] = useState(false);
  const [users, setuser] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/get/post/${id}`)
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/post/user/details/${id}`)

        setuser(response.data);
        setPost(res.data);
      } catch (error) {
        console.log("Some Error Occured");
      }
    }
    getPost();
  }, [id]);

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/all/user/${userId}`
        );
        const result = res.data.filter((item) => {
          return item._id !== userId;
        })
        for (let user of result) {
          if (user._id === id) setFlag(true);
        }
      } catch (error) {
        console.log("Some error occured");
      }
    };
    getuser();
  }, [load, id, userId]);
  // console.log(load);

  return (
    <div className={styles.ProfilemainPostContainer}>
      <div>
        <img src={cover} className={styles.profileCoverimage} alt="" />
        {/* <h2 style={{ marginTop: "-43px", color: "white", textAlign: "start", marginLeft: "34px" }}>Your Profile</h2> */}
      </div>
      {id === userId && <ContentPost />}
      {!flag ?
        (post.length > 0 ? post.map((item, index) => {
          return <Post post={item} key={index} load={load} setLoad={setLoad} />
        }) : <p style={{ color: "white", fontSize: "1.5rem" }}>{users.username} hasn't posted anything yet!</p>)
        : <p style={{ color: "white", fontSize: "1.5rem" }}>Follow {users.username} to see their posts!</p>}
    </div>
  )
}

export default ProfileMainPost