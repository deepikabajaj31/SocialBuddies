import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './SignUp.module.css';
import { signup } from "../../store/api";
import app from "../../firebse";
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SignUp = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [file, setfile] = useState(null);

  const userDetails = user.user;
  const navigator = useNavigate();
  const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file?.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(StorageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default: break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          signup(dispatch, { email, password, username, phonenumber, profile: downloadURL });
        })
      });

  }

  console.log(userDetails?.Status)
  if (userDetails?.Status === 'Pending') {
    navigator("/verify/email");
  }

  return (
    <div className={styles.mainContainerForsignup}>
      <div className={styles.submainContainer}>
        <div style={{ flex: 1, marginLeft: 150, marginBottom: "170px" }}>
          <p className={styles.logoText}>Soc<span className={styles.part}>ial</span></p>
          <p className={styles.introtext}>Connect with your <span className={styles.part}>family and friends </span></p>
        </div>
        <div style={{ flex: 3 }}>
          <p className={styles.createaccountTxt}>Create New Account</p>
          <input type="file" accept={[".png", ".jpg", ".jpeg"]} name="file" id="file" onChange={(e) => setfile(e.target.files[0])} />
          <input type="text" placeholder='Username' onChange={(e) => setusername(e.target.value)} className={styles.inputText} />
          {username && username.length < 3 && <p style={{ color: 'red' }}>Username should contain minimum 3 characters</p>}
          <input type="number" placeholder='Phonenumber' onChange={(e) => setphonenumber(e.target.value)} className={styles.inputText} />
          {phonenumber && phonenumber.length !== 10 && <p style={{ color: 'red' }}>Phone no. should contain exactly 10 digits</p>}
          <input type="email" name="" placeholder='email' onChange={(e) => setEmail(e.target.value)} className={styles.inputText} />
          {email && !emailPattern.test(email) && <p style={{ color: 'red' }}>Please enter valid email address</p>}
          <input type="password" placeholder='******' name="" onChange={(e) => setpassword(e.target.value)} className={styles.inputText} />
          {password && password.length < 6 && <p style={{ color: 'red' }}>Password should contain minimum 6 characters</p>}
          <button className={styles.btnforsignup} onClick={handleClick} disabled={!file || username.length < 3 || phonenumber.length !== 10 || !emailPattern.test(email) || password.length < 6}>Signup</button>
          <br></br>
          <br></br>
          <a href='/login' className={styles.login}>Already have a account</a>
        </div>
      </div>
    </div>
  )
}
export default SignUp;