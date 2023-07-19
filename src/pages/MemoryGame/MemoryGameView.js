import React, { useState, useRef, useEffect } from "react";
import styles from "./MemoryGameView.module.css";
import MemoryGameController from "./MemoryGameController";
import GameOverModal from "./components/GameOverModal";
import { useNavigate } from "react-router-dom";

function MemoryGameView() {
  const controllerRef = useRef(new MemoryGameController());
  const [board, setBoard] = useState(controllerRef.current.board);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isGameOver, setIsGameOver] = useState(controllerRef.current.isGameOver);
  const navigate = useNavigate();

  useEffect(() => {
    setIsGameOver(controllerRef.current.isGameOver);
  }, [controllerRef.current.isGameOver]);

  const handleCellClick = (x, y) => {
    // Ignore clicks on already uncovered or correct cells
    if (
      controllerRef.current.stateMatrix[x][y] !==
      controllerRef.current.states.COVERED
    ) {
      return;
    }

    // Update the state matrix with the clicked cell as uncovered
    const updatedStateMatrix = controllerRef.current.stateMatrix.map((row) => [
      ...row,
    ]);
    updatedStateMatrix[x][y] = controllerRef.current.states.UNCOVERED;

    // Update the selected cells
    const updatedSelectedCells = [...selectedCells, { x, y }];

    if (updatedSelectedCells.length === 2) {
      // Compare the values of the selected cells
      const [cell1, cell2] = updatedSelectedCells;
      controllerRef.current.guess(cell1, cell2);
      controllerRef.current.checkWin();
      setSelectedCells([]);

      // Check if cells match
      if (
        controllerRef.current.stateMatrix[cell1.x][cell1.y] ===
        controllerRef.current.states.CORRECT
      ) {
        return;
      }

      // Restore cells after a delay if they don't match
      setTimeout(() => {
        const updatedStateMatrix = controllerRef.current.stateMatrix.map(
          (row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (
                (cell === controllerRef.current.states.UNCOVERED &&
                  !updatedSelectedCells.some(
                    ({ x, y }) => x === rowIndex && y === colIndex
                  )) ||
                cell === controllerRef.current.states.CORRECT
              ) {
                return cell;
              }
              return controllerRef.current.states.COVERED;
            })
        );
        controllerRef.current.stateMatrix = updatedStateMatrix;
        setBoard([...controllerRef.current.board]);
      }, 1000);
    } else {
      setSelectedCells(updatedSelectedCells);
    }

    // Update the board and state matrix state
    setBoard([...controllerRef.current.board]);
    controllerRef.current.stateMatrix = updatedStateMatrix;
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
      <h3 className={styles.title}>Memory Game</h3>
      <div className={styles.gameBoard}>
        {board.map((row, rowIndex) => (
          <div key={`R-${rowIndex}`} className={styles.row}>
            {row.map((cell, columnIndex) => (
              <div
                key={`C-${columnIndex}`}
                className={`${styles.cell} ${
                  controllerRef.current.stateMatrix[rowIndex][columnIndex] ===
                  controllerRef.current.states.COVERED
                    ? styles.covered
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, columnIndex)}
              >
                {controllerRef.current.stateMatrix[rowIndex][columnIndex] ===
                controllerRef.current.states.COVERED
                  ? "?"
                  : cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p>
        <strong>Score: </strong> {controllerRef.current.score}
      </p>
      {isGameOver && <GameOverModal score={controllerRef.current.score} />}
    </div>
  );
}

export default MemoryGameView;
