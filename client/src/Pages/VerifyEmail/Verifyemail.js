import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { VerifyEmail } from "../../store/api";

export default function Verifyemail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [OTP, setOTP] = useState('');

  const user = useSelector((state) => state.user);
  const userDetails = user.user;
  const id = userDetails?.user;

  const handleOTP = (e) => {
    e.preventDefault();
    VerifyEmail(dispatch, navigate, { OTP: OTP, user: id });
  }

  return (
    <div style={{ color: "white", width: "100vw", height: "100vh", display: 'flex', alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0A" }}>
      <div style={{ color: "white", width: "25%", padding: "20px", margin: "auto", borderRadius: "10px", backgroundColor: "black" }}>
        <p>Enter your OTP</p>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <input type="number" placeholder="Enter Your OTP" style={{ flex: 1, minWidth: "40px", margin: "10px 0px", padding: "10px", borderRadius: "10px" }} onChange={(e) => setOTP(e.target.value)} />
          {OTP && OTP.length !== 4 && <p style={{ color: 'red' }}>OTP must be of 4 digits only</p>}
          <button disabled={OTP.length !== 4} style={{ width: "40%", border: "none", padding: "10px 20px", backgroundColor: "white", color: "black", borderRadius: "10px", margin: "20px 0px", cursor: "pointer" }} onClick={handleOTP}>Confirm OTP</button>
          <p style={{ textDecoration: "none", color: "white", cursor: "pointer", marginRight: "190px", fontSize: "14px" }}>Check your email to get a OTP</p>
        </form>
      </div>
    </div>
  )
}