import addFriends from "../Images/add-user.png";
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import styles from "./Rightbar.module.css";

const Follow = ({ userdetails, setLoad, load }) => {
  const userDetails = useSelector((state) => state.user);
  const navigate = useNavigate();
  let user = userDetails.user;
  const id = user.other._id;
  const accesstoken = user?.accessToken;

  const handleFollow = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/following/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/JSON", token: accesstoken },
      body: JSON.stringify({ user: `${userdetails._id}` }),
    }
    );
    if (load) setLoad(false);
    else setLoad(true);
  };

  return (
    <div style={{ marginTop: "-10px" }} key={userdetails._id}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
        <Link onClick={() => {
          navigate(`/Profile/${userdetails._id}`)
          window.location.reload()
        }} to={`/Profile/${userdetails._id}`} style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={userdetails.profile} className={styles.Profileimage} alt="" />
            <div>
              <p style={{ marginLeft: "10px", textAlign: "start", textDecoration: "none", color: "white", borderBottom: "1px solid white" }}>
                {userdetails.username}
              </p>
              <p style={{ marginLeft: "10px", textAlign: "start", marginTop: "-16px", fontSize: "11px", color: "#aaa", textDecoration: "none", }}>
                Suggested for you
              </p>
            </div>
          </div>
        </Link>

        <div style={{ backgroundColor: "#aaa", padding: "10px", marginRight: "13px", borderRadius: "50%", cursor: "pointer", }}
          onClick={handleFollow}
        >
          <img src={addFriends} className={styles.addfriend} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Follow;
