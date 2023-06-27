import React from 'react'
import ChatContainer from '../../Component/ChatContainer/ChatContainer'
import Contact from '../../Component/Contact/Contact'
import Navbar from '../../Component/Navbar'

const Chat = () => {
    return (
        <div>
            <Navbar />
            <div style={{ display: "flex", height: "89vh" }}>
                <Contact />
            </div>
        </div>
    )
}

export default Chat