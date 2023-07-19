import React, { useEffect, useState, useRef } from "react";
import SnakeController from "./SnakeController";
import GameOverModal from "./components/GameOverModal";
import styles from "./SnakeView.module.css";

const SnakeGame = () => {
  const [snakeController, setSnakeController] = useState(new SnakeController());
  const gameIntervalRef = useRef(null);

  useEffect(() => {
    gameIntervalRef.current = setInterval(() => {
      updateGame();
    }, 150);

    return () => {
      clearInterval(gameIntervalRef.current);
    };
  }, []);

  const updateGame = () => {
    const updatedController = { ...snakeController };
    updatedController.iterate();

    if (updatedController.isGameOver) {
      clearInterval(gameIntervalRef.current);
    }

    setSnakeController(updatedController);
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    let direction = null;

    if (key === "ArrowUp") {
      direction = "up";
    } else if (key === "ArrowDown") {
      direction = "down";
    } else if (key === "ArrowLeft") {
      direction = "left";
    } else if (key === "ArrowRight") {
      direction = "right";
    }

    if (direction) {
      snakeController.iterate(direction);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [snakeController]);

  return (
    <div className={styles.container}>
      <h1>Snake</h1>
      <div className={styles.board}>
        {snakeController.board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${styles[`state-${cell}`]}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.score}>
        <strong>Score:</strong> {snakeController.snakeSize}
      </p>
      {snakeController.isGameOver && <GameOverModal score={snakeController.snakeSize}/>}
    </div>
  );
};

export default SnakeGame;
