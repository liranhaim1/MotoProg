import React, { useState } from "react";
import { NavLink, Redirect, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { addUser } from "../../features/users";
import { useDispatch } from "react-redux";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // Redirect("/login")
        navigate("/");
        localStorage.setItem('user', JSON.stringify({id:userCredential.user.uid, email: email, ids: []}))
        // ...
        dispatch(addUser({ email: email, uid: userCredential.user.uid }));
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
          setError({ email: "This email is already exist" });
        } else if (
          errorMessage ===
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          setError({ password: "Password should be at least 6 characters" });
        }
        console.log(errorMessage);
        // ..
      });
  };

  const onBack = (e) => {
    e.preventDefault()
    navigate("/")
  }

  return (
    <main className="auth">
      <div className="bg-blur" />
      <section>
        <div style={{ textAlign: "center" }}>
          <span className="mdi mdi-cube-outline cube"></span>
        </div>
        <div>
          <h1>Sign up</h1>
          <form onSubmit={onSubmit}>
            <div className="input-container">
              <input
                className="input-form"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
            </div>
            {error.email ? <p className="error">{error.email}</p> : null}

            <div className="input-container">
              <input
                className="input-form"
                type="password"
                label="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>
            {error.password ? <p className="error">{error.password}</p> : null}

            <div className="submit">
              <button type="submit" className="submit-button">
                Sign up
              </button>
            </div>
          </form>

          <p className="text-white text-center">
            Already have an account? <NavLink to="/login">Sign in</NavLink>
          </p>
          <p className="back" onClick={onBack}>
            Back
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
