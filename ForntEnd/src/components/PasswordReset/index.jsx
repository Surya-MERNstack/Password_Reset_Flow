// import { useEffect, useState, Fragment } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import styles from "./styles.module.css";

// const PasswordReset = () => {
// 	const [validUrl, setValidUrl] = useState(false);
// 	const [password, setPassword] = useState("");
// 	const [msg, setMsg] = useState("");
// 	const [error, setError] = useState("");
// 	const param = useParams();
// 	const url = `http://localhost:8010/api/password-reset/${param.id}/${param.token}`;

// 	useEffect(() => {
// 		const verifyUrl = async () => {
// 			try {
// 				await axios.get(url);
// 				setValidUrl(true);
// 			} catch (error) {
// 				setValidUrl(false);
// 			}
// 		};
// 		verifyUrl();
// 	}, [param, url]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		try {
// 			const { data } = await axios.post(url, { password });
// 			setMsg(data.message);
// 			setError("");
// 			window.location = "/login";
// 		} catch (error) {
// 			if (
// 				error.response &&
// 				error.response.status >= 400 &&
// 				error.response.status <= 500
// 			) {
// 				setError(error.response.data.message);
// 				setMsg("");
// 			}
// 		}
// 	};

// 	return (
// 		<Fragment>
// 			{validUrl ? (
// 				<div className={styles.container}>
// 					<form className={styles.form_container} onSubmit={handleSubmit}>
// 						<h1>Add New Password</h1>
// 						<input
// 							type="password"
// 							placeholder="Password"
// 							name="password"
// 							onChange={(e) => setPassword(e.target.value)}
// 							value={password}
// 							required
// 							className={styles.input}
// 						/>
// 						{error && <div className={styles.error_msg}>{error}</div>}
// 						{msg && <div className={styles.success_msg}>{msg}</div>}
// 						<button type="submit" className={styles.green_btn}>
// 							Submit
// 						</button>
// 					</form>
// 				</div>
// 			) : (
// 				<h1>404 Not Found</h1>
// 			)}
// 		</Fragment>
// 	);
// };

// export default PasswordReset;



import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8010/api/users/${id}/reset-password/${token}`;
      const { data } = await axios.put(url, { password });
      setMsg(data.message);
      setError("");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h1>Password Reset</h1>
        <input
          type="password"
          placeholder="New Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
        {error && <div className={styles.error_msg}>{error}</div>}
        {msg && <div className={styles.success_msg}>{msg}</div>}
        <button type="submit" className={styles.green_btn}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
