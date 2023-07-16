import { useState } from "react";
import styles from "./GameOverModal.module.css";

function Modal(){

    const [isVisible, setIsVisible] = useState({})

    const handleRefresh = () => {
        window.location.reload();
    };

    const invisibleStyle = {
      display: "none",
    };

    function onClose(){
      setIsVisible(invisibleStyle)
    }

    return (
          <div className={styles.modal} style={isVisible}>
            <div className={styles.modalContent}>
              <h2>Game Over</h2>
              <button onClick={handleRefresh}>Play Again</button>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
    );
}

export default Modal;