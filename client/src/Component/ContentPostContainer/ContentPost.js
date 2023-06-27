import React, { useState } from "react";
import styles from "./ContentPost.module.css";
import imageIcon from "../Images/gallery.png";
import emojiIcon from "../Images/cat-face.png";
import videoIcon from "../Images/video.png";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebse";

const ContentPost = () => {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  const accessToken = user.accessToken;
  let id = user.other._id;
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [title, setTile] = useState("");
  const [imagePre, setImagePre] = useState(null);
  const [VideoPre, setVideoPre] = useState(null);

  const handlePost = (e) => {
    e.preventDefault();
    if (file !== null) {
      const fileName = new Date().getTime() + file?.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
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
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/user/post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/JSON",
                token: accessToken,
              },
              body: JSON.stringify({
                title: title,
                image: downloadURL,
                video: "",
              }),
            }).then((data) => {
              alert("Your Post was upload successfully");
              window.location.reload(true);
            });
          });
        }
      );
    } else if (file2 !== null) {
      const fileName = new Date().getTime() + file2?.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, file2);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
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
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/user/post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/JSON",
                token: accessToken,
              },
              body: JSON.stringify({
                title: title,
                video: downloadURL,
                image: "",
              }),
            }).then((data) => {
              alert("Your Post was upload successfully");
              window.location.reload(true);
            });
          });
        }
      );
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/user/post`, {
        method: "POST",
        headers: { "Content-Type": "application/JSON", token: accessToken },
        body: JSON.stringify({ title: title, video: "", image: "" }),
      }).then((data) => {
        alert("Your Post was upload successfully");
        window.location.reload(true);
      });
    }
  };

  return (
    <div>
      <div className={styles.ContentUploadContainer}>
        <div style={{ display: "flex", alignItems: "center", padding: 10 }}>
          <img
            src={user.other.profile}
            className={styles.profileimage}
            alt=""
          />
          <input
            type="text"
            placeholder="Write your real thought..."
            className={styles.contentWritingpart}
            onChange={(e) => setTile(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          {imagePre !== null ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={imagePre} style={{ width: "400px", height: "auto", objectFit: "cover", borderRadius: "10px", }} alt="" />
              <img onClick={() => setImagePre(null)} src="https://w7.pngwing.com/pngs/755/458/png-transparent-x-mark-red-cross-miscellaneous-angle-monochrome.png" width="30px" height="30px" style={{ marginLeft: "10px" }} alt="cancel" />
            </div>
          ) : VideoPre !== null ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <video className="PostImages" width="400" height="auto" controls>
                <source src={VideoPre} type="video/mp4" />
              </video>
              <img onClick={() => setVideoPre(null)} src="https://w7.pngwing.com/pngs/755/458/png-transparent-x-mark-red-cross-miscellaneous-angle-monochrome.png" width="30px" height="30px" alt="cancel" />
            </div>
          ) : (
            ""
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <label htmlFor="file">
                <img src={imageIcon} className={styles.icons} alt="" />
                <input
                  type="file"
                  name="file"
                  accept={[".png", ".jpg", ".jpeg"]}
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => [
                    setFile(e.target.files[0]),
                    setImagePre(URL.createObjectURL(e.target.files[0])),
                  ]}
                ></input>
              </label>

              <img src={emojiIcon} className={styles.emoji} alt="" />
              <label htmlFor="file2">
                <img src={videoIcon} className={styles.icons} alt="" />
                <input
                  type="file"
                  accept={[".mp4", ".mp3", ".mkv", ".mov"]}
                  name="file2"
                  id="file2"
                  style={{ display: "none" }}
                  onChange={(e) => [
                    setFile2(e.target.files[0]),
                    setVideoPre(URL.createObjectURL(e.target.files[0])),
                  ]}
                ></input>
              </label>
            </div>
            <button
              disabled={!title}
              style={{
                height: "30px",
                marginRight: "12px",
                marginTop: "40px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: 6,
                paddingBottom: 6,
                border: "none",
                backgroundColor: "black",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPost;