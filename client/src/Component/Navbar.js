import React from 'react'
import styles from './Navbar.module.css';
import searchIcon from './Images/search.png';
import Notifications from './Images/bell.png';
import Message from './Images/message.png';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userReducer';
const Navbar = () => {
    const userDetails = useSelector((state) => state.user);
    let user = userDetails.user;
    let id = user.other._id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <div className={styles.mainNavbar} >
            <div className={styles.LogoContainer} onClick={() => navigate('/')}>
                <p style={{ display: "flex", fontSize: "1.3rem" }}>Social <span style={{ color: "#f30683" }}>Buddies</span></p>
            </div>
            <div>
                <div className={styles.searchInputContainer}>
                    <img src={searchIcon} className={styles.searchIcon} alt=" " />
                    <input type="text" className={styles.searchInput} placeholder="seach your friends" name="" id="" />
                </div>
            </div>
            <div className={styles.IconsContainer}>
                <img src={Notifications} className={styles.Icons} alt="" />
                <div onClick={() => navigate('/chat')} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <img src={Message} className={styles.Icons} alt="" />
                    <p style={{ paddingLeft: "0.5rem", borderBottom: "1px solid white" }}>Chat</p>
                </div>
                <Link onClick={() => {
                    navigate(`/Profile/${id}`)
                    window.location.reload()
                }} to={`/Profile/${id}`}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={user.other.profile} className={styles.ProfileImage} alt="" />
                        <p style={{ marginLeft: '5px', color: "white", textDecoration: "none", borderBottom: "1px solid white", display: "flex", flexDirection: "row" }}>{user.other.username.slice(0, 10)} ...</p>
                    </div>
                </Link>
                <div style={{ marginRight: "30px", marginLeft: "20px", cursor: "pointer", color: "#f30683" }} onClick={handleLogout}>
                    <p>LogOut</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar
//bg :#0A0A0A
//REST: #272525;