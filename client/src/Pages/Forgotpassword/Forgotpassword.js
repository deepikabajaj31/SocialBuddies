import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;

  const handleclick = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/forgot/password`, {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({ email: email })
    }).then(() => {
      alert("We sent you a token email. Please check your email");
      navigate('/login');
    }).catch(() => {
      alert("Fail to proccess")
    })
  }

  return (
    <div style={{ color: "white", width: "100vw", height: "100vh", display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0A" }}>
      <div style={{ width: "25%", padding: "20px", margin: "auto", borderRadius: "10px", backgroundColor: "black" }}>
        <p style={{ color: "white" }}>Enter your Email</p>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <input type={"text"} placeholder="Email" style={{ flex: 1, minWidth: "40px", margin: "10px 0px", padding: "10px", borderRadius: "10px" }} onChange={(e) => setEmail(e.target.value)} />
          {email && !emailPattern.test(email) && <p style={{ color: 'red' }}>Please enter valid email address</p>}
          <button disabled={!emailPattern.test(email)} style={{ width: "40%", border: "none", padding: "10px 20px", backgroundColor: "white", color: "black", borderRadius: "10px", margin: "20px 0px", cursor: "pointer" }} onClick={handleclick}>Send</button>
        </form>
      </div>
    </div>
  )
}
export default Forgotpassword;