import React, { useEffect, useState } from 'react'
import styles from './MainPost.module.css'
import ContentPost from '../ContentPostContainer/ContentPost';
import Post from '../PostContainer/Post';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MainPost = ({ load, setLoad }) => {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  let id = user.other._id;
  const accesstoken = user.accessToken;
  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/flw/${id}`, {
          headers: {
            token: accesstoken,
          }
        })
        setPost(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getPost();
  }, [load]);

  return (
    <div className={styles.mainPostContainer}>
      <ContentPost />
      {post.map((item, index) => {
        return <Post post={item} key={index} load={load} setLoad={setLoad} />
      })}
    </div>
  )
}
export default MainPost