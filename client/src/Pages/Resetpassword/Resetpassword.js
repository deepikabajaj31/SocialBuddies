import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const Resetpassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const code = location.search.split("?")[1];
  const [password, setpassword] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/reset/password?${code}`, {
      method: "PUT",
      headers: { 'Content-Type': "application/JSON" },
      body: JSON.stringify({ password: password })
    }).then((data) => {
      alert("Your password has been reset successfully")
      navigate("/login");
    });
  };

  return (
    <div style={{ color: "white", width: "100vw", height: "100vh", display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0A" }}>
      <div style={{ width: "25%", padding: "20px", margin: "auto", borderRadius: "10px", backgroundColor: "black" }}>
        <p style={{ color: "white" }}>Enter Your New Password</p>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <input type={"password"} placeholder="**********" style={{ flex: 1, minWidth: "40px", margin: "10px 0px", padding: "10px", borderRadius: "10px" }} onChange={(e) => setpassword(e.target.value)} />
          {password && password.length < 6 && <p style={{ color: 'red' }}>Password should contain minimum 6 characters</p>}
          <button disabled={password.length < 6} style={{ width: "40%", border: "none", padding: "10px 20px", backgroundColor: "white", color: "black", borderRadius: "10px", margin: "20px 0px", cursor: "pointer" }} onClick={handleClick}>Set Password</button>
        </form>
      </div>
    </div>
  )
}
export default Resetpassword;