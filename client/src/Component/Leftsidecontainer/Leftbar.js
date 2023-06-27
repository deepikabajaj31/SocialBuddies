import styles from "./Leftbar.module.css";
import image from "../Images/Profile.png";
import image1 from "../Images/image1.jpg";
import image2 from "../Images/image2.jpg";
import image3 from "../Images/image3.jpg";
import image4 from "../Images/image4.jpg";
import image5 from "../Images/image5.jpg";
import image6 from "../Images/image6.jpg";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Leftbar = ({ load, setLoad }) => {
  const userDetails = useSelector((state) => state.user);
  const [post, setPost] = useState([]);
  let user = userDetails.user;
  let id = user.other._id;
  const accesstoken = user.accessToken;

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/flw/${id}`, {
          headers: {
            token: accesstoken
          }
        });
        setPost(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getPost();
  }, []);

  return (
    <div className={styles.Leftbar}>
      <div className={styles.NotificationsContainer}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <p style={{ marginLeft: "-14px" }}>Notifications</p>
          <p style={{ color: "#aaa", marginLeft: "40px" }}>See all</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <img src={image} className={styles.notificationimg} alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start", }}>
            Madan like your post
          </p>
          <img src={image1} className={styles.likeimage} alt="" />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <img src={image} className={styles.notificationimg} alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, textAlign: "start", width: "120px", }}>
            Suman started to following you
          </p>
          <img src={image2} className={styles.followinguserimage} alt="" />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <img src={image2} className={styles.notificationimg} alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start", }}>
            Madan like your post
          </p>
          <img src={image3} className={styles.likeimage} alt="" />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <img src={image} className={styles.notificationimg} alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start", }}>
            Suman started to following you
          </p>
          <img src={image4} className={styles.followinguserimage} alt="" />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <img src={image6} className={styles.notificationimg} alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start", }}>
            Suman started to following you
          </p>
          <img src={image5} className={styles.followinguserimage} alt="" />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <img src={image3} className={styles.notificationimg} alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start", }}>
            Madan like your post
          </p>
          <img src={image6} className={styles.likeimage} alt="" />
        </div>
      </div>

      <div className={styles.NotificationsContainer}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <p style={{ marginLeft: "-20px" }}>Explore</p>
          <p style={{ color: "#aaa", marginLeft: "40px" }}>See all</p>
        </div>
        <div>
          {post.map((item, index) => {
            return [item.image === '' ? '' :
              <img src={item.image} className={styles.exploreimage} alt="" key={index} />
            ]
          })}
        </div>
      </div>
    </div>
  );
};
export default Leftbar;