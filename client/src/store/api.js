import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "./userReducer";

export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/login`, user);
        dispatch(loginSuccess(res.data));
    } catch (error) {
        alert(error.response.data);
        dispatch(loginFailure());
    }
}

export const VerifyEmail = async (dispatch, navigate, { user, OTP }) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/verify/email`, {
            user, OTP
        });

        if (res.data === "User already verifed") navigate('/login');
        else dispatch(loginSuccess(res.data));
    } catch (error) {
        if (error?.response?.data === "User not found") alert("User not found")
        else if (error?.response?.data === "Sorry token not found") alert("Some error occured! Please try creating account again")
        else alert("Please enter correct otp!");
    }
}

export const signup = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/create/user`, user);
        console.log(res.data);
        await dispatch(loginSuccess(res.data));
    } catch (error) {
        console.log(error);
        dispatch(loginFailure());
    }
}