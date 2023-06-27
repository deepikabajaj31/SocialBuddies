import "./App.css";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/Register/SignUp";
import Verifyemail from "./Pages/VerifyEmail/Verifyemail";
import Forgotpassword from "./Pages/Forgotpassword/Forgotpassword";
import Resetpassword from "./Pages/Resetpassword/Resetpassword";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Chat from "./Pages/Chat/Chat";

function App() {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  // console.log(user);
  // console.log(user?.Status);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user?.other?.verifed === true ? (
                <Home />
              ) : (
                <Navigate to={"/login"} replace={true} />
              )
            }
          />
          <Route path="/Profile/:id" element={
            user?.other?.verifed === true ? (
              <Profile />
            ) : (
              <Navigate to={"/login"} replace={true} />)} />
          <Route
            path="/login"
            element={
              user?.other?.verifed === true ? (
                <Navigate to={"/"} replace={true} />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/signup" element={<SignUp />}></Route>
          <Route
            path="/verify/email"
            element={
              user?.Status === "Pending" ? (
                <Verifyemail />
              ) : user?.other?.verifed === true ? (
                <Navigate to={"/"} replace={true} />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/forgot/password" element={<Forgotpassword />} />
          <Route path="/reset/password" element={<Resetpassword />} />
          <Route path="/chat" element={user?.other?.verifed === true ? (
            <Chat />
          ) : (
            <Navigate to={"/login"} replace={true} />)} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// light mode dark mode - done
// change images - done
// liking color should remain there after reloading - khud hi ho gya 😂
// jab tk saari fields enter na kru button should be disabled - done
// galat otp par ek popup alert ka - done
// validations on input field - done
// acount create mei image ka type image hi hona chahiye - done
// reset after 1 hour was annoying so removed it - done
// scrollbar customized - done
// meri profile pr meri video ni aari - done
// profile visit krne pr like - done
// app ka logo aur naam chahiye - done
// sabki cover pic is same on profile - done
// edit bio is static ya fir static chize hata do usme se aur edit bio remove or as it is - done
// login krne ke baaad reset password - done
// galat otp se bhi verify khulra h - done
// like button white - done
// comment mei bg black - done
// post krte time pre mei full height and cross - done
// glt password dalne pr kuch msg show ho login mei - done
// follow krte hi home page reload - done
// auro ki profile pr box na dikhe - done
// update things/post  private/public notifications search image secuirty of drag - future
// mai khudki suggestion mei ara hu - done
// if not friend - done
// anuj ki profile

// delete comment - done
// unfollow post mei - done
// post mei profile visit - done
// delete account / post - done
// delete account krte time password dalwana h - done
// text overflow - done
// your profile ki jgh kya at cover page? - done
// new user create ni hora after hosting -done