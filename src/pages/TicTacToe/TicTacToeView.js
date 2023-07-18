import React, { useState, useRef, useEffect } from "react";
import TicTacToeController from "./TicTacToeController";
import GameOverModal from "./components/GameOverModal";
import styles from "./TicTacToeView.module.css";
import { useNavigate } from "react-router-dom";

const TicTacToeView = () => {
  const controllerRef = useRef(new TicTacToeController());
  const [board, setBoard] = useState(controllerRef.current.board);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPlayerTurn && !isGameOver) {
      controllerRef.current.adversaryPlay();
      setBoard(controllerRef.current.board);
      setIsGameOver(controllerRef.current.isGameOver);
      setIsPlayerTurn(true);
      checkGameOver();
    }
  }, [isPlayerTurn, isGameOver]);

  const handleCellClick = (row, col) => {
    if (isGameOver || board[row][col] !== controllerRef.current.states.EMPTY) {
      return;
    }

    const updatedBoard = [...board];
    updatedBoard[row][col] = controllerRef.current.states.X;
    setBoard(updatedBoard);
    setIsPlayerTurn(false);
    checkGameOver();
  };

  const checkWin = () => {
    const winner = controllerRef.current.checkWin();
    if (winner !== null) {
      setIsGameOver(true);
      setWinner(winner);
    }
  };

  const checkGameOver = () => {
    if (!board.flat().includes(controllerRef.current.states.EMPTY)) {
      setIsGameOver(true);
      setWinner(null);
    } else {
      checkWin();
    }
  };

  return (
    <div className={styles.container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <button className={styles.homeButton} onClick={() => navigate("/")}>
        <span class="material-symbols-outlined">home</span>
      </button>
      <h2>Tic-Tac-Toe</h2>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${
                  cell === controllerRef.current.states.X
                    ? styles.x
                    : cell === controllerRef.current.states.O
                    ? styles.o
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={
                  isGameOver || cell !== controllerRef.current.states.EMPTY
                }
              >
                {cell === controllerRef.current.states.X
                  ? "X"
                  : cell === controllerRef.current.states.O
                  ? "O"
                  : ""}
              </div>
            ))}
          </div>
        ))}
        {isGameOver && (
          <GameOverModal
            winner={winner === 1 ? "X" : winner === 2 ? "O" : "Nobody!"}
          />
        )}
      </div>
    </div>
  );
};

export default TicTacToeView;
