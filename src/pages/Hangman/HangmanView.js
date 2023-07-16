import React, { useRef, useState, useEffect } from "react";
import HangmanController from "./HangmanController";
import GameOverModal from "./components/GameOverModal"
import InputBlock from "./components/InputBlock";
import styles from "./HangmanView.module.css";
import DollDisplay from "./components/DollDisplay";
import { useNavigate } from "react-router-dom";

function HangmanView() {
  const controllerRef = useRef(new HangmanController());
  const [isLoaded, setIsLoaded] = useState(false);
  const [statesArray, setStatesArray] = useState([]);
  const [inputValues, setInputValues] = useState([])
  const hasCodeRun = useRef(false);
  const [imageCounter, setImageCounter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHangman() {
      try {
        hasCodeRun.current = true;
        await controllerRef.current.setArrays();
        setStatesArray(controllerRef.current.statesArray);
        setInputValues(controllerRef.current.inputArray)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    }
    if (!hasCodeRun.current) {
      loadHangman();
    }
  }, [isLoaded]);

  useEffect(() => {
    setImageCounter(8 - controllerRef.current.lives)
  }, [controllerRef.current.lives])

  function inputHandler(event, index) {
    const currentValue = event.target.value;
    const previousValue = controllerRef.current.inputArray[index];

    // Check if the change was due to deletion
    if (previousValue.length > currentValue.length) {
      // Change was due to deletion, do nothing
      return;
    }

    controllerRef.current.setInput(index, currentValue);
    controllerRef.current.changeStates(currentValue, index);
    setStatesArray([...controllerRef.current.statesArray]);
    setInputValues([...controllerRef.current.inputArray]);
    controllerRef.current.checkGameStatus();
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
      <div className={styles.gameContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.inputContainer}>
            {isLoaded &&
              inputValues.map((value, index) => (
                <InputBlock
                  key={`I-${index}`}
                  onChange={(event) => inputHandler(event, index)}
                  value={value}
                  cellState={statesArray[index]}
                  disabled={controllerRef.current.isGameOver}
                />
              ))}
          </div>
          <p>
            <strong>Score:</strong> {controllerRef.current.score} -{" "}
            <strong>Lives:</strong> {controllerRef.current.lives - 1}
          </p>
        </div>
        <div className={styles.imageContainer}>
          <DollDisplay number={imageCounter} />
        </div>
        {controllerRef.current.isGameOver && (
          <GameOverModal score={controllerRef.current.score} />
        )}
      </div>
    </div>
  );
}

export default HangmanView;
