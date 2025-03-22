'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logindata from "./login_settings.json";  // Assuming you have a JSON file for static data

function Login() {
  const [credential, setCredential] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!credential.username) {
      setError("Please enter your username");
      return;
    }

    if (!credential.password) {
      setError("Please enter your password");
      return;
    }

    try {
      // API request to authenticate the user
      const response = await fetch("http://183.82.7.208:3002/anyapp/authentication/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credential.username,
          password: credential.password,
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj", // Your app secret
          device_id: "device_unique_id", // Provide the device ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Store token or user information in localStorage or cookies
      localStorage.setItem("token", data.token);  // Assuming the response contains a token
      localStorage.setItem("user", JSON.stringify(data.user));  // Assuming the response contains user data

      // Redirect to the dashboard
      router.push("/dashboard");

    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container login-variant-2">
      <div className="login-container">
        <div className="row">
          <div className="col-lg-6 col-md-12 d-flex justify-content-center">
            <div className="login-section">
              <div className="logo-section">
                <img src="/logo.png" alt="login logo" />
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
                      onChange={(e) => setCredential({ ...credential, username: e.target.value })}
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
                      onChange={(e) => setCredential({ ...credential, password: e.target.value })}
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
                <h4>Sign in with Flex</h4>
                <p>Lorem ipsum dolor sit amet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
