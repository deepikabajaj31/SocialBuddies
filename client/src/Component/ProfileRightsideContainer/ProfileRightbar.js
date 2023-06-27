import React from "react";
import styles from "./ProfileRightbar.module.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import Follow from "../RightsideContainer/Follow";
import { useLocation } from "react-router-dom";

const ProfileRightbar = ({ load, setLoad }) => {
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  let idForSuggest = user?.other?._id
  //const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjBhYjk0YTI4NDZhNzY5ODRhMTQyNyIsInVzZXJuYW1lIjoidmFpYmhhdiIsImlhdCI6MTY4MDAwNjk0N30.N7UCGiJql23Z3O_gywsAL-OzU-kU-i5MZ9m1pM8FROg"
  const [followingUser, setFollowingUser] = useState([]);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/post/followers/${id}`
        );
        // console.log(res.data);
        setFollowingUser(res.data);
      } catch (error) {
        console.log("Some error occured");
      }
    };
    getFollowing();
  }, [load]);

  // console.log(followingUser, load);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/all/user/${idForSuggest}`
        );
        const result = res.data.filter((item) => {
          return item._id !== idForSuggest;
        })
        // console.log(res.data);
        setUsers(result);
      } catch (error) {
        console.log("Some error occured");
      }
    };
    getuser();
  }, [load]);
  // console.log(users);
  return (
    <div className={styles.Profilerightbar}>
      <div style={{ height: followingUser.length < 1 ? "15%" : "9%" }} className={styles.profilerightcontainer}>
        <h3>Followers</h3>
        <div>
          {followingUser.map((item, index) => {
            return (
              <div style={{ marginTop: "10px" }} key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.profile}
                    className={styles.Friendsimage}
                    alt=""
                  />
                  <a href={`/Profile/${item._id}`} style={{ textAlign: "start", marginLeft: "10px", color: "white" }}>
                    {item.username}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.rightcontainer2}>
        <h3 style={{ textAlign: "start", marginLeft: "10px" }}>
          Suggested for you
        </h3>

        {users.map((item) => {
          // console.log(item)
          return <Follow userdetails={item} setLoad={setLoad} load={load} key={item._id} />;
        })}
      </div>
    </div>
  );
};

export default ProfileRightbar;
