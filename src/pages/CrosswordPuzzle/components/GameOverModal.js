import styles from "./GameOverModal.module.css";

function Modal({score, onClose}){

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Game Over</h2>
              <p>Final Score - {score}</p>
              <button onClick={handleRefresh}>Play Again</button>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
    );
}

export default Modal;