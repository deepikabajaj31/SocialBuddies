import React, { useEffect, useRef, useState } from 'react'
import classes from "./ChatContainer.module.css";
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const ChatContainer = ({ currentChatUser }) => {
  const userDetails = useSelector(state => state.user);
  let user = userDetails.user;
  let id = user.other._id;
  const accesstoken = user.accessToken;
  const [message, setMessage] = useState();
  const [inputMessage, setInputMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();
  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/post/get/chat/msg/${id}/${currentChatUser?._id}`, {
          headers: {
            token: accesstoken
          }
        });
        setMessage(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getMessage();
  }, [currentChatUser]);
  // console.log(message);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
  }, [message]);

  useEffect(() => {
    if (currentChatUser) {
      socket.current = io(`${process.env.REACT_APP_BACKEND_URL}`);
      socket.current.emit("addUser", id);
    }
  }, [id]);


  const sendMsg = async (e) => {
    e.preventDefault();
    const messages = {
      myself: true,
      message: inputMessage
    }
    await socket.current.emit("send-msg", {
      to: currentChatUser._id,
      from: id,
      message: inputMessage
    });
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/msg`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/JSON',
        token: accesstoken
      },
      body: JSON.stringify({
        from: id,
        to: currentChatUser._id,
        message: inputMessage
      })
    });
    setMessage(message.concat(messages));
    setInputMessage('');
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg);
        setArrivalMessage({
          myself: false,
          message: msg,
        })
      })
    }
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage && setMessage((pre) => [...pre, arrivalMessage]);
  }, [arrivalMessage]);


  return (
    <div className={classes.mainChatContainer}>
      <div style={{ height: "100%" }}>
        <div className={classes.msg} style={{ justifyContent: "center", border: "1.5px solid white" }}>
          <img src={currentChatUser?.profile} alt='' className={classes.userProfile} />
          <p style={{ marginTop: "10px", marginLeft: "10px" }}>{currentChatUser?.username}</p>
        </div>
        <div className={classes.msgContainer}>
          {message && message.map((item, index) => {
            return <div key={index} ref={scrollRef}>
              {item.myself === false ?
                <div className={classes.msg} style={{ display: "flex", alignItems: "center", marginLeft: "30px", backgroundColor: "#272525", padding: "3px", borderRadius: "10px", width: "40%", marginTop: "10px" }}>
                  <img src={currentChatUser?.profile} alt='' className={classes.chatUserProfile} />
                  <p className={classes.msgTxt}>{item?.message}</p>
                </div>
                : <div style={{ display: "flex", alignItems: "center", backgroundColor: "#272525", padding: "3px", borderRadius: "10px", width: "40%", marginTop: "10px", marginLeft: "650px" }}>
                  <p className={classes.msgTxt}>{item?.message}</p>
                </div>}
            </div>
          })}
        </div>

        <form className={classes.msgSenderContainer} onSubmit={sendMsg}>
          <input value={inputMessage} type='text' placeholder='Write your message' className={classes.msgInput} onChange={(e) => setInputMessage(e.target.value)} />
          <button className={classes.msgButton}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default ChatContainer