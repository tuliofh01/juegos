import React from "react";
import styles from "./Mole.module.css";

const Mole = ({ status }) => {
  return (
    <div
      className={`${styles.mole} ${
        status === 1 ? styles.filled : styles.empty
      }`}
    ></div>
  );
};

export default Mole;
