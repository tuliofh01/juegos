import React, { useEffect, useRef, useState } from "react";
import styles from "./CrosswordView.module.css";
import CrosswordController from "./CrosswordController";
import InputBlock from "./components/InputBlock";
import BlankBlock from "./components/BlankBlock";
import GameOverModal from "./components/GameOverModal"
import LoadingImage from "./assets/loading.gif"
import { useNavigate } from "react-router-dom";

function CrosswordView() {
  
  const controller = useRef(new CrosswordController(30, 30));
  const [isLoaded, setIsLoaded] = useState(false);
  const hasCodeRun = useRef(false);
  const [inputValues, setInputValues] = useState({});
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCrosswordPuzzle(){
      try {
        hasCodeRun.current = true;
        await controller.current.populateArrays();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    }
    if(!hasCodeRun.current){
      loadCrosswordPuzzle();
    }
  }, [])

  function inputHandler(event, key){
    controller.current.checkGameStatus();

    const inputValue = event.target.value;
    const inputPosition = key.split("-");
    if(controller.current.crosswordMatrix[inputPosition[0]][inputPosition[1]] === inputValue){
      controller.current.stateMatrix[inputPosition[0]][inputPosition[1]] = controller.current.states.CORRECT;
      setScore(score + 1);
    } else {
      controller.current.stateMatrix[inputPosition[0]][inputPosition[1]] = controller.current.states.INCORRECT;
      if (score > 0){
        setScore(score - 1);
      }
    }

    const newInputValues = {...inputValues, [key]: event.target.value}
    setInputValues(newInputValues);
  }

  return (
    <div className={styles.container + " " + styles.background}>
      {isLoaded && (
        <div>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
          />
          <button className={styles.homeButton} onClick={() => navigate("/")}>
            <span class="material-symbols-outlined">home</span>
          </button>
        </div>
      )}
      <div className={styles.puzzleContainer}>
        {isLoaded ? (
          controller.current.stateMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((cell, colIndex) =>
                cell ? (
                  <InputBlock
                    key={`${rowIndex}-${colIndex}`}
                    superscript={
                      controller.current.superscriptMatrix[rowIndex][colIndex] +
                      1
                    }
                    onChange={(event) =>
                      inputHandler(event, `${rowIndex}-${colIndex}`)
                    }
                    cellState={
                      controller.current.stateMatrix[rowIndex][colIndex]
                    }
                    definition={
                      controller.current.definitions[
                        controller.current.superscriptMatrix[rowIndex][colIndex]
                      ]
                    }
                  />
                ) : (
                  <BlankBlock key={`${rowIndex}-${colIndex}`} />
                )
              )}
            </div>
          ))
        ) : (
          <div className={styles.loading}>
            <img src={LoadingImage} alt="Loading" />
          </div>
        )}
      </div>
      <p className={styles.score}>
        <strong>Score: </strong>
        {score}
      </p>
      {controller.current.isGameOver && <GameOverModal score={score} />}
    </div>
  );
}

export default CrosswordView;
