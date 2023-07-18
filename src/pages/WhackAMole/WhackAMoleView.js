import { useRef, useEffect, useState } from "react";
import styles from "./WhackAMoleView.module.css";
import WhackAMoleController from "./WhackAMoleController";
import GameOverModal from "./components/GameOverModal";
import Mole from "./components/Mole";
import { useNavigate } from "react-router-dom";

function WhackAMoleView() {
  const controllerRef = useRef(new WhackAMoleController(7, 7));
  const [board, setBoard] = useState(controllerRef.current.board);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      controllerRef.current.iterate();
      setBoard([...controllerRef.current.board]);
      setTime(time - 1)
    }, 1200);

    if(time === 0){
        clearInterval(interval);
        setIsGameOver(true);
    }

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  function clickHandler(row, column){
    if(controllerRef.current.board[row][column] === 1 && time !== 0){
        setScore(score + 1);
    }
  }

  return (
    <div className={styles.container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <button className={styles.homeButton} onClick={() => navigate("/")}>
        <span class="material-symbols-outlined">home</span>
      </button>
      <p className={styles.text}>
        <strong>Time left:</strong> {time}s
      </p>
      <div className={styles.innerContainer}>
        {board.map((row, rowIndex) => (
          <div className={styles.row} key={`R-${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <div
                className={styles.cell}
                key={`C-${colIndex}`}
                onClick={() => clickHandler(rowIndex, colIndex)}
              >
                <Mole status={cell} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.text}>
        <strong>Score:</strong> {score}
      </p>
      {isGameOver && <GameOverModal score={score} />}
    </div>
  );
}

export default WhackAMoleView;
