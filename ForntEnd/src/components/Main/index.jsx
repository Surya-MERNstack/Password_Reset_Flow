// import styles from "./styles.module.css";


// const Main = () => {
// 	const handleLogout = () => {
// 		localStorage.removeItem("token");
// 		window.location.reload();
// 	};

// 	return (
// 		<div className={styles.main_container}>
// 			<nav className={styles.navbar}>
// 				<h1>fakebook</h1>
// 				<button className={styles.white_btn} onClick={handleLogout}>
// 					Logout
// 				</button>
// 			</nav>
// 		</div>
// 	);
// };

// export default Main;



import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Main = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className={styles.container}>
      <h1>Main Page</h1>
      <button className={styles.red_btn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Main;

