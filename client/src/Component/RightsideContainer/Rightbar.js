import React, { useState, useEffect } from "react";
import styles from "./Rightbar.module.css";
import ads from "../Images/ads.jpg";
import image1 from "../Images/image3.jpg";
import image2 from "../Images/image2.jpg";
import axios from "axios";
import Follow from "./Follow";
import { useSelector } from "react-redux";

const Rightbar = ({ load, setLoad }) => {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  const id = user.other._id;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/all/user/${id}`)
        const result = res.data.filter(item => item._id !== id)
        setUsers(result);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [load])

  return (
    <div className={styles.rightbar}>
      <div className={styles.rightcontainer}>
        <div className={styles.adsContainer}>
          <img src={ads} className={styles.adsimg} alt="" />
          <div>
            <p style={{ textAlign: "start", marginLeft: "10px", marginTop: -20 }}>CodeDemy</p>
            <p style={{ textAlign: "start", marginLeft: "10px", fontSize: "12px", marginTop: "-16px", }}>
              Buy CodeDemy Course
            </p>
          </div>
        </div>
        <div className={styles.adsContainer}>
          <img src={image1} className={styles.adsimg} alt="" />
          <div>
            <p style={{ textAlign: "start", marginLeft: "10px", marginTop: -20 }}>
              CodeDemy
            </p>
            <p style={{ textAlign: "start", marginLeft: "10px", fontSize: "12px", marginTop: "-16px", }}>
              Buy CodeDemy Course
            </p>
          </div>
        </div>
        <div className={styles.adsContainer}>
          <img src={image2} className={styles.adsimg} alt="" />
          <div>
            <p style={{ textAlign: "start", marginLeft: "10px", marginTop: -20 }}>
              CodeDemy
            </p>
            <p style={{ textAlign: "start", marginLeft: "10px", fontSize: "12px", marginTop: "-16px", }}>
              Buy CodeDemy Course
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightcontainer2}>
        <h3 style={{ textAlign: "start", marginLeft: "10px" }}>Suggested for you</h3>
        {users.map((item, index) => {
          return <Follow userdetails={item} key={index} setLoad={setLoad} load={load} />
        })}

      </div>
    </div>
  );
};

export default Rightbar;
