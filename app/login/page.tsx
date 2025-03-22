"use client";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logindata from "./login_settings.json";

function Login() {
      const { data: session, status } = useSession();
  const [credential, setCredential] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  if (session) {
    // console.log(session?.user);
  }else{
    // console.log("no session found");
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!credential.username) {
      setError("Please enter your username");
      return;
    }
    if (!credential.password) {
      setError("Please enter your password");
      return;
    }

    // Authenticate using NextAuth
    const result = await signIn("credentials", {
      username: credential.username,
      password: credential.password,
      redirect: false, // Prevent default redirect
    });

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/dashboard"); // Redirect to a protected page
    }
  };

  return (
    <div className="container login-variant-2">
      <div className="login-container">
        <div className="row">
        <div className="col-lg-6 col-md-12 d-flex justify-content-center">
                    <div className="login-section">
                        <div className="logo-section">
                            <img src="/logo.png" alt="login logo"/>
                        </div>
                        <h3 className="login-head">Sign in</h3>
                        <p className="login-title text-muted">{Logindata.caption}</p>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-3 mail-section text-start">
                  <label htmlFor="email" className="form-label mb-2">
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                    <input
                      onChange={(e) =>
                        setCredential({ ...credential, username: e.target.value })
                      }
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
                <div className="mb-3 pass-section text-start">
                  <label htmlFor="password" className="form-label mb-2">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      onChange={(e) =>
                        setCredential({ ...credential, password: e.target.value })
                      }
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-3 login-check-section">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">
                      {" "}
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none login-forgot">
                    Forgot Password?
                  </a>
                </div>

                {error && <p className="text-danger text-center">{error}</p>}
                <button type="submit" className="btn login-btn w-100 py-2">
                  Login
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 login-right-section">
            <div className="login-img-section">
              <img src={`/${Logindata.imgURL}`} className=" login-img" />
              <div className="login-img-content">
                <h4>signin with flex</h4>
                <p>Lorem ipsum dolor sit amet </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
