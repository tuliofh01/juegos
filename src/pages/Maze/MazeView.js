import { useRef, useEffect, useState } from "react";
import styles from "./MazeView.module.css";
import MazeController from "./MazeController";
import GameOverModal from "./components/GameOverModal";
import { useNavigate } from "react-router-dom";

function MazeView() {
  const controllerRef = useRef(new MazeController(40, 18));
  const [maze, setMaze] = useState(controllerRef.current.maze);
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event) {
      // Check if the game is over
      if (controllerRef.current.isGameOver) {
        return; // Don't handle keydown events if the game is over
      }

      const { key } = event;
      let x = controllerRef.current.playerPosition[0];
      let y = controllerRef.current.playerPosition[1];

      // Update player position based on arrow keys
      if (key === "ArrowUp") {
        x -= 1;
      } else if (key === "ArrowDown") {
        x += 1;
      } else if (key === "ArrowLeft") {
        y -= 1;
      } else if (key === "ArrowRight") {
        y += 1;
      }

      controllerRef.current.setPlayerPosition(x, y);
      controllerRef.current.checkGameStatus();
      setMaze([...controllerRef.current.maze]);
    }

    // Attach or remove event listener based on the game status
    if (!controllerRef.current.isGameOver) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [controllerRef.current.isGameOver]);

  const mazeBlocks = maze.map((row, rowIndex) => (
    <div key={rowIndex}>
      {row.map((cell, colIndex) => {
        let blockColor;
        if (cell === 0) {
          blockColor = "white"; // Path
        } else if (cell === 1) {
          blockColor = "black"; // Wall
        } else if (cell === 2) {
          blockColor = "blue"; // Player
        } else if (cell === 3) {
          blockColor = "green"; // Final
        }

        const blockStyle = {
          backgroundColor: blockColor,
        };

        return (
          <div key={colIndex} style={blockStyle} className={styles.block}></div>
        );
      })}
    </div>
  ));

  return (
    <div className={styles.container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <button className={styles.homeButton} onClick={() => navigate("/")}>
        <span className="material-symbols-outlined">home</span>
      </button>
      <div className={styles.mazeContainer}>{mazeBlocks}</div>
      {controllerRef.current.isGameOver && <GameOverModal />}
    </div>
  );
}

export default MazeView;
