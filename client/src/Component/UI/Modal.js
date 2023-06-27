import { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css';

const Backdrop = props => {
    return <div className={classes.backdrop} onClick={props.onClose} />
}

const ModalOverlay = props => {
    return <div className={classes.modal}>
        <div className={classes.content}>{props.children}</div>
    </div>
}

const Modal = props => {
    const [clicked, setClicked] = useState(false);
    const [val, setVal] = useState('');

    const passwordCheck = async (e) => {
        e.preventDefault();
        console.log(props.email, val);
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/password/match`, {
            method: "POST",
            headers: { "Content-Type": "application/Json" },
            body: JSON.stringify({
                email: props.email,
                password: val,
            }),
        });
        const response = await res.json();
        console.log(response);
        if (response === false) alert("Incorrect Password!!");
        else props.onDelete();
        setVal('');
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, document.getElementById('overlays'))};
            {ReactDOM.createPortal(<ModalOverlay >
                <p>Are you sure you want to delete this {props.text}?</p>
                <button className={classes.btn} onClick={props.onClose}>Cancel</button>
                <button className={classes.btn} onClick={() => {
                    setClicked(true);
                    if (props.text === "post") props.onDelete();
                }}>Yes</button>
                {props.text === "account" && clicked && <>
                    <form onSubmit={passwordCheck} className={classes.form}>
                        <label>Please enter your password to delete your account permanently!</label>
                        <input type='password' placeholder='Enter your password' value={val} onChange={(e) => setVal(e.target.value)} min="6" />
                        {val && val.length < 6 && <p style={{ marginBottom: 0, color: "red", fontWeight: "600" }}>Password should contain minimum 6 characters</p>}
                        <button className={classes.btn} disabled={val.length < 6}>Submit</button>
                    </form>
                </>}
            </ModalOverlay>, document.getElementById('overlays'))}
        </Fragment>
    );
};

export default Modal;