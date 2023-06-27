import styles from "./Profileleftbar.module.css";
import bg from '../Images/bg.jpeg'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "../UI/Modal";
import { logout } from "../../store/userReducer";
const ProfileLeftbar = ({ load, setLoad }) => {
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);
  const myId = userDetails.user.other._id;
  let user = userDetails.user;
  const accessToken = user.accessToken;
  const [Follow, setUnFollow] = useState([user.other.Following.includes(id) ? "Unfollow" : "Follow"]);
  const [followingUser, setFollowingUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setuser] = useState([]);

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/post/user/details/${id}`)
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [id])

  let followersCounter = users?.Followers?.length;
  let followingsCounter = users?.Following?.length;

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/post/following/${id}`
        );
        setFollowingUser(res.data);
      } catch (error) {
        console.log("Some error occured");
      }
    };
    getFollowing();
  }, [load, id]);

  useEffect(() => {
    const func = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/post/user/details/${myId}`
      );
      if (response.data.Following.includes(id)) setUnFollow("UnFollow");
    }
    func();
  }, [load, myId, id]);

  const handleFollow = async (e) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/following/${myId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/JSON", token: accessToken },
      body: JSON.stringify({ user: `${id}` }),
    }
    );

    if (Follow === "Follow") setUnFollow("UnFollow");
    else setUnFollow("Follow");

    if (load) setLoad(false);
    else setLoad(true);
    // window.location.reload();
  }

  const deleteAccount = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/delete/${myId}`, {
      method: 'DELETE'
    });
    dispatch(logout());
    navigate('/login');
  }

  return (
    <div className={styles.ProfileLeftbar}>
      <div style={{ overflow: "hidden", height: "auto" }} className={styles.NotificationsContainer}>
        <img src={bg} alt="" className={styles.ProfilepageCover} />
        <div style={{ display: "flex", alignItems: "center", marginTop: "-30px" }}>
          <img src={users.profile} alt="" className={styles.Profilepageimage} />
          <div>
            <p style={{ marginLeft: 6, marginTop: 20, color: "white", textAlign: "start", }}>
              {users.username}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ color: "white", marginLeft: "20px", fontSize: "14px" }}>
            Followings
          </p>
          <p style={{ color: "white", marginRight: "20px", fontSize: "12px", marginTop: "17px", }}>
            {followingsCounter}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-20px", }}>
          <p style={{ color: "white", marginLeft: 20, fontSize: "14px" }}>
            Followers
          </p>
          <p style={{ color: "white", marginRight: 20, fontSize: "12px", marginTop: 17, }}>
            {followersCounter}
          </p>
        </div>
        {user.other._id !== id ?
          <div onClick={handleFollow}>
            <button style={{ width: "100%", paddingTop: 7, paddingBottom: 7, border: "none", backgroundColor: "green", color: "white", cursor: "pointer" }}>
              {Follow}
            </button></div>
          : <div>
            <button style={{ backgroundColor: "#d72f2f", padding: "10px 15px", borderRadius: "7px", width: "100%", marginBottom: "1rem", marginTop: "0.5rem", cursor: "pointer", color: "white" }} onClick={() => setShowModal(true)}>Delete Account</button>
            {showModal && <Modal onClose={() => setShowModal(false)} onDelete={deleteAccount} text="account" email={user.other.email} />}
            <button
              style={{ width: "100%", paddingTop: 7, paddingBottom: 7, border: "none", backgroundColor: "green", color: "white", cursor: "pointer" }}
              onClick={() => navigate('/forgot/password')}
            >
              Update Passowrd
            </button></div>}
      </div>

      <div className={styles.NotificationsContainer}>
        <h3>Followings</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ marginLeft: "10px" }}>Friends</p>
          <p style={{ marginRight: "10px", color: "#aaa" }}>See all</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "5px" }}>
          {followingUser.map((item, index) => {
            return (
              <Link onClick={() => {
                navigate(`/Profile/${item._id}`)
                window.location.reload()
              }} to={`/Profile/${item._id}`} key={index} style={{ textDecoration: "none" }}>
                <div style={{ marginLeft: "4px", cursor: "pointer" }}>
                  <img src={item.profile} className={styles.friendimage} alt="" />
                  <p style={{ marginTop: "-2px", color: "white", borderBottom: "1px solid white" }}>{item.username} </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftbar;