import React from 'react'
import styles from './Profile.module.css';
import Navbar from '../../Component/Navbar';
import ProfileLeftbar from '../../Component/ProfileLeftsidecontainer/ProfileLeftbar';
import ProfileRightbar from '../../Component/ProfileRightsideContainer/ProfileRightbar';
import ProfileMainPost from '../../Component/ProfileMainPostContainer/ProfileMainPost';
import { useState } from 'react';

const Profile = () => {
  const [load, setLoad] = useState(false);

  return (
    <div className={styles.ProfileContainer}>
      <Navbar />
      <div className={styles.subProfileContainer}>
        <ProfileLeftbar load={load} setLoad={setLoad} />
        <ProfileMainPost load={load} setLoad={setLoad} />
        <ProfileRightbar load={load} setLoad={setLoad} />
      </div>
    </div>
  )
}

export default Profile;