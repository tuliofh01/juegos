import React, { useRef, useState } from "react";
import { Minefield } from "./MinefieldController";
import Block from "./components/Block";
import Modal from "./components/Modal";
import styles from "./MinefieldView.module.css";
import { useNavigate } from "react-router-dom";

function MinefieldView() {
  
  // Function variables
  const controller = useRef(new Minefield(7, 7));
  const [clickedCells, setClickedCells] = useState([]);
  const [score, setScore] = useState(controller.current.currentScore);
  const [gameOver, setGameOver] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // Updates the score and game over status whenever they change in the controller
  React.useEffect(() => {
    setScore(controller.current.currentScore);
    setGameOver(controller.current.isGameOver);
    if(controller.current.isGameOver){
      setModalVisible(true);
    }
  }, [controller.current.currentScore, controller.current.isGameOver]);

  // Handles the cells when clicked for different cell types
  const handleCellClick = (rowIndex, columnIndex) => {
    if (!gameOver && !clickedCells.includes(`${rowIndex}-${columnIndex}`)) {
      const clickedCell = `${rowIndex}-${columnIndex}`;
      let adjacentCells = [clickedCell];

      // Clears adjacent cells
      if (controller.current.minefield[rowIndex][columnIndex] === 2) {
        const adjacentPositions = [
          { row: rowIndex - 1, column: columnIndex - 1 },
          { row: rowIndex - 1, column: columnIndex },
          { row: rowIndex - 1, column: columnIndex + 1 },
          { row: rowIndex, column: columnIndex - 1 },
          { row: rowIndex, column: columnIndex + 1 },
          { row: rowIndex + 1, column: columnIndex - 1 },
          { row: rowIndex + 1, column: columnIndex },
          { row: rowIndex + 1, column: columnIndex + 1 },
        ];

        adjacentPositions.forEach((position) => {
          const { row, column } = position;
          if (
            row >= 0 &&
            row < controller.current.rows &&
            column >= 0 &&
            column < controller.current.columns
          ) {
            adjacentCells.push(`${row}-${column}`);
          }
        });
      }

      setClickedCells([...clickedCells, ...adjacentCells]);
      controller.current.step(rowIndex, columnIndex);
    }
  };

  // Marks cell for possible mine
  const handleCellContextMenu = (event, rowIndex, columnIndex) => {
    event.preventDefault();
    if (!gameOver) {
      const clickedCell = `${rowIndex}-${columnIndex}`;
      const isClicked = clickedCells.includes(clickedCell);

      if (isClicked) {
        // Unmarks the cell if it is already marked
        setClickedCells(clickedCells.filter((cell) => cell !== clickedCell));
        controller.current.unmark(rowIndex, columnIndex);
      } else {
        setClickedCells([...clickedCells, clickedCell]);
        controller.current.mark(rowIndex, columnIndex);
      }
    }
  };

  // Renders cell graphical content
  const renderCellValue = (rowIndex, columnIndex) => {
    const cell = controller.current.minefield[rowIndex][columnIndex];
    const isClicked = clickedCells.includes(`${rowIndex}-${columnIndex}`);
    const isMarked = isClicked && (cell === 4 || cell === 6);

    if (gameOver || isClicked) {
      if (cell === 1) {
        return "💣";
      } else if (cell === 3 || cell === 2) {
        const nearestMineDistance = controller.current.calculateNearestMine(
          rowIndex,
          columnIndex
        );
        controller.current.distanceArray[rowIndex][columnIndex] = nearestMineDistance;
        controller.current.minefield[rowIndex][columnIndex] = 5;
        return nearestMineDistance !== 0 ? nearestMineDistance : "";
      } else if (cell === 5){
        return controller.current.distanceArray[rowIndex][columnIndex];
      } else if (isMarked) {
        return "⚑";
      }
    }
    return "";
  };

  // Renders modal when the game is over
  const renderModal = () => {
    if (gameOver && modalVisible) {
      return <Modal score={score} onClose={() => setModalVisible(false)} />;
    }
    return null;
  };

  // Gets cell current status so it is disabled after clicked (avoids distance recalculation)
  const getCellStatus = (rowIndex, columnIndex) => {
    if (controller.current.minefield[rowIndex][columnIndex] === 5){
      return "disabled";
    } else {
      return "enabled";
    }
  }

  return (
    <div className={styles.container + " " + styles.background}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <button className={styles.homeButton} onClick={() => navigate("/")}>
        <span class="material-symbols-outlined">home</span>
      </button>
      <h1 className={styles.title}>Minefield</h1>
      <div className={styles.minefield}>
        {controller.current.minefield.map((row, rowIndex) => (
          <div className={styles.row} key={rowIndex}>
            {row.map((_, columnIndex) => (
              <Block
                key={columnIndex}
                onClick={() => handleCellClick(rowIndex, columnIndex)}
                onContextMenu={(event) =>
                  handleCellContextMenu(event, rowIndex, columnIndex)
                }
                cellStatus={getCellStatus(rowIndex, columnIndex)}
              >
                {renderCellValue(rowIndex, columnIndex)}
              </Block>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.score}>
        <strong>Score -</strong> {score}
      </div>
      {renderModal()}
    </div>
  );
}

export default MinefieldView;
