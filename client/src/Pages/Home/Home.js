import React, { useState } from 'react'
import Navbar from '../../Component/Navbar';
import styles from './Home.module.css';
import Leftbar from '../../Component/Leftsidecontainer/Leftbar';
import MainPost from '../../Component/MainPostContainer/MainPost';
import Rightbar from '../../Component/RightsideContainer/Rightbar';
const Home = () => {
  const [load, setLoad] = useState(false);
  console.log(load);
  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.ComponentContainer}>
        <Leftbar load={load} setLoad={setLoad} />
        <MainPost load={load} setLoad={setLoad} />
        <Rightbar load={load} setLoad={setLoad} />
      </div>
    </div>
  )
}

export default Home