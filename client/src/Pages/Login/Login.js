import React, { useState } from 'react'
import styles from './Login.module.css';
import { useDispatch } from 'react-redux';
import { login } from '../../store/api';

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;

  const submitHandler = (e) => {
    e.preventDefault();
    login(dispatch, { email, password });
  }

  return (
    <div className={styles.mainContainerForsignup}>
      <div className={styles.submainContainer}>
        <div style={{ flex: "1", marginLeft: "150px", marginBottom: "170px" }}>
          <p className={styles.logoText}>Social<span className={styles.part}>Buddies</span></p>
          <p className={styles.introtext}>Connect with your <span className={styles.part}>Family and Friends</span> </p>
        </div>
        <div style={{ flex: 3 }}>
          <p className={styles.createaccountTxt}>Login Account</p>
          <input type="email" name="" id="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} className={styles.inputText} />
          {email && !emailPattern.test(email) && <p style={{ color: 'red' }}>Please enter valid email address</p>}
          <input type="password" placeholder='*****' onChange={(e) => setPassword(e.target.value)} name="" id="password" className={styles.inputText} />
          {password && password.length < 6 && <p style={{ color: 'red' }}>Password should contain minimum 6 characters</p>}
          <button className={styles.btnforsignup} onClick={submitHandler} disabled={!emailPattern.test(email) || password.length < 6}>Login</button>
          <br></br>
          <br></br>
          <a href='/forgot/password' className={styles.link1}>Forgot password?</a>
          <br></br>
          <br></br>
          <a href='/signup' className={styles.link2}>Create new account?</a>
        </div>
      </div>
    </div>
  )
}

export default Login