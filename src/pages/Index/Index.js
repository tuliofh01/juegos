import styles from "./Index.module.css";
import { useNavigate } from "react-router-dom";

function Index(){

    const navigate = useNavigate();

    return(
        <div className={styles.container + " " + styles.background}>
            <h1 className={styles.title}>juegos</h1>
            <h3 className={styles.h3}>Available titles:</h3>
            <ul className={styles.ul}>
                <li className={styles.li} onClick={() => {navigate("/minefield")}}>Minefield</li>
                <li className={styles.li} onClick={() => {navigate("/guessTheNumber")}}>Guess the Number</li>
                <li className={styles.li} onClick={() => {navigate("/crosswordPuzzle")}}>Crossword Puzzle</li>
            </ul>
        </div>
    );
}

export default Index;