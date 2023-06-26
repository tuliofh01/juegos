import React, { useRef, useState } from "react";
import { Minefield } from "./MinefieldController";
import Block from "./components/Block";
import styles from "./MinefieldView.module.css";

function MinefieldView() {
  const controller = useRef(new Minefield(7, 7));
  const [clickedCells, setClickedCells] = useState([]);
  const [score, setScore] = useState(controller.current.currentScore);

  // Update the score whenever it changes in the controller
  React.useEffect(() => {
    setScore(controller.current.currentScore);
  }, [controller.current.currentScore]);

  const handleCellClick = (rowIndex, columnIndex) => {
    if (!clickedCells.includes(`${rowIndex}-${columnIndex}`)) {
      const clickedCell = `${rowIndex}-${columnIndex}`;
      let adjacentCells = [clickedCell];

      if (controller.current.minefield[rowIndex][columnIndex] === 2) {
        const adjacentPositions = [
          { row: rowIndex - 1, column: columnIndex - 1 }, // Top left
          { row: rowIndex - 1, column: columnIndex }, // Up
          { row: rowIndex - 1, column: columnIndex + 1 }, // Top right
          { row: rowIndex, column: columnIndex - 1 }, // Left
          { row: rowIndex, column: columnIndex + 1 }, // Right
          { row: rowIndex + 1, column: columnIndex - 1 }, // Bottom left
          { row: rowIndex + 1, column: columnIndex }, // Down
          { row: rowIndex + 1, column: columnIndex + 1 }, // Bottom right
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

  const renderCellValue = (rowIndex, columnIndex) => {
    const cell = controller.current.minefield[rowIndex][columnIndex];
    const isClicked = clickedCells.includes(`${rowIndex}-${columnIndex}`);

    if (isClicked) {
      if (cell === 1) {
        return "💣";
      } else if (cell === 3 || cell === 2) {
        const nearestMineDistance = controller.current.calculateNearestMine(
          rowIndex,
          columnIndex
        );
        return nearestMineDistance !== 0 ? nearestMineDistance : ""; // Display nearest mine distance or empty string
      } else if (cell === 4) {
        return "⚑";
      }
    }
    return "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.minefield}>
        {controller.current.minefield.map((row, rowIndex) => (
          <div className={styles.row} key={rowIndex}>
            {row.map((_, columnIndex) => (
              <Block
                key={columnIndex}
                onClick={() => handleCellClick(rowIndex, columnIndex)}
              >
                {renderCellValue(rowIndex, columnIndex)}
              </Block>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.score}>
        <strong>Score:</strong> {score}
      </div>
    </div>
  );
}

export default MinefieldView;
