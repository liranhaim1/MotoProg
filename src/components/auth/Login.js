import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { NavLink, Redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../../features/users";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        console.log(user);
        dispatch(getUser(userCredential.user.uid));
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        if (errorMessage === "Firebase: Error (auth/user-not-found).") {
          setError({ email: "User not found" });
        } else if (errorMessage === "Firebase: Error (auth/wrong-password).") {
          setError({ password: "Wrong Password" });
        }
        console.log("err => ", errorMessage);
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
          <h2>Login</h2>
          <form onSubmit={onLogin}>
            <div className="input-container">
              <input
                className="input-form"
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error.email ? <p className="error">{error.email}</p> : null}

            <div className="input-container">
              <input
                className="input-form"
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error.password ? <p className="error">{error.password}</p> : null}

            <div className="submit">
              <button type="submit" className="submit-button">
                Login
              </button>
            </div>
          </form>

          <p className="text-white text-center">
            No account yet? <NavLink to="/signup">Sign up</NavLink>
          </p>
          <p className="back" onClick={onBack}>
            Back
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
