import React from "react";
import styles from "./Block.module.css";

function Block({ onClick, children }) {
  return (
    <div className={styles.block} onClick={onClick}>
      {children}
    </div>
  );
}

export default Block;
