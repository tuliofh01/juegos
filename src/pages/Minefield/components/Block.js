import React from "react";
import styles from "./Block.module.css";

function Block({ cellStatus, onClick, onContextMenu, children }) {
  
  return (
    <div
      className={cellStatus === "disabled" ? styles.disabled + " " + styles.block: styles.block}
      onClick={cellStatus === "disabled"?  null : onClick}
      onContextMenu={cellStatus === "disabled"?  null : onContextMenu}
      disabled={cellStatus === "disabled"?  true : false}
    >
      {children}
    </div>
  );
}

export default Block;
