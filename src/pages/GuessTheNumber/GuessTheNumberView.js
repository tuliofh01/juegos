import { useEffect, useRef, useState } from 'react';
import styles from './GuessTheNumberView.module.css';
import GuessTheNumberController from "./GuessTheNumberController"
import { useNavigate } from 'react-router-dom';

function GuessTheNumberView(){

    const controller = useRef(new GuessTheNumberController());
    const [inputValue, setInputValue] = useState(null);
    const [submittedValue, setSubmittedValue] = useState(null);
    const [numberDisplay, setNumberDisplay] = useState("?");
    const [textDisplay, setTextDisplay] = useState(null);
    const [inputStatus, setInputStatus] = useState(false);
    const [lives, setLives] = useState(controller.current.lives);
    const navigate = useNavigate();

    const handleChange = (event) => {
      setInputValue(event.target.value);
    };

    const handleSubmit = () => {
      setSubmittedValue(inputValue);
    };

    useEffect(() => {
        if(submittedValue !== null){
            controller.current.guess(submittedValue);
        } else {
            setTextDisplay("Please enter a number.");
        }

        if (controller.current.isGameOver && controller.current.victory) {
          setNumberDisplay(submittedValue);
          setTextDisplay("You win!");
          setInputStatus(true);
        } else if (controller.current.isGameOver) {
          setNumberDisplay(controller.current.drawnNumber);
          setTextDisplay("You lose...");
          setInputStatus(true);
          setLives(controller.current.lives);
        } else if (
          controller.current.currentState === controller.current.states.TOO_HIGH
        ) {
          setTextDisplay("Too high, please try again...");
          setLives(controller.current.lives);
        } else if (
          controller.current.currentState === controller.current.states.TOO_LOW
        ) {
          setTextDisplay("Too low, please try again...");
          setLives(controller.current.lives);
        }

    }, [submittedValue])

    return (
      <div className={styles.background}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
        <button className={styles.homeButton} onClick={() => navigate("/")}>
          <span class="material-symbols-outlined">home</span>
        </button>
        <div className={styles.container}>
          <div className={styles.inputDiv}>
            <h2>Guess the Number</h2>
            <input
              type="number"
              placeholder='Number'
              min={1}
              onChange={handleChange}
              className={styles.input}
            />
            <button
              onClick={handleSubmit}
              disabled={inputStatus}
              className={styles.button}
            >
              Submit
            </button>
          </div>
          <div className={styles.displayDiv}>
            <h1>{numberDisplay}</h1>
            <h4>{textDisplay}</h4>
            <h5>Lives - {lives}</h5>
          </div>
        </div>
      </div>
    );

}

export default GuessTheNumberView;