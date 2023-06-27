import React, { useEffect, useState } from 'react';
import classes from "./Contact.module.css";
import profile from "../Images/image2.jpg"
import ChatContainer from '../ChatContainer/ChatContainer';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Contact = () => {
    const userDetails = useSelector(state => state.user);
    let user = userDetails.user;
    let id = user.other._id;
    const accesstoken = user.accessToken;
    const [users, setUsers] = useState();
    const [currentChatUser, setCurrentChatUser] = useState("");
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/post/following/${id}`, {
                    headers: {
                        token: accesstoken
                    }
                });
                setUsers(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, []);

    const handleUser = (e) => {
        setCurrentChatUser(e);
    }
    return (
        <div className={classes.mainContactContainer}>
            <div>
                <div style={{ width: "20pc", padding: "10px" }}>
                    <input type='search' placeholder='Search Your Friends' className={classes.searchBar} />
                </div>
                <div className={classes.usersDetailContainer}>
                    {users && users.map((item, index) => {
                        return <div key={index}>
                            {item?._id !== id ?
                                <div className={classes.userContainer} onClick={(e) => handleUser(item)}>
                                    <img src={item.profile} alt='' className={classes.chatUserImage} />
                                    <div style={{ marginLeft: "10px" }}>
                                        <p style={{ color: "white", textAlign: "start", marginTop: "5px", fontSize: "15px" }}>{item.username}</p>
                                        <p style={{ color: "white", textAlign: "start", marginTop: "-16px", fontSize: "14px" }}>Open your message</p>
                                    </div>
                                </div> : ""}
                        </div>
                    })}
                </div>
            </div>
            {currentChatUser ?
                <ChatContainer currentChatUser={currentChatUser} />
                : <div style={{ marginTop: "10px", marginLeft: "40px", width: "100%" }}>
                    <p style={{ fontSize: "30px", color: "#876b70", textAlign: "center" }}>Open Your Message Tab to chat with your friend</p>
                </div>}
        </div>
    )
}

export default Contact