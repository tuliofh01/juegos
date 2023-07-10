import { useEffect, useState } from "react";
import styles from "./InputBlock.module.css"
import HoverTextModal from "./HoverTextModal";

function InputBlock({superscript, onChange, definition, cellState}){

    const [isDisabled, setIsDisabled] = useState(false);
    const [cellClassName, setCellClassName] = useState(styles.blankCell);
    const [isHoverModalVisible, setIsHoverModalVisible] = useState(false);

    const handleInputMouseEnter = () => {
      setIsHoverModalVisible(true);
      console.log("Modal in");
    };

    const handleInputMouseLeave = () => {
      setIsHoverModalVisible(false);
      console.log("Modal out");
    };

    useEffect(() => {
      if(cellState === 3){
        setIsDisabled(true);
        setCellClassName(styles.correctCell);
      }
    }, [cellState])

    return (
      <div>
        <input
          type="text"
          className={cellClassName}
          onChange={onChange}
          placeholder={superscript}
          disabled={isDisabled}
          onMouseEnter={handleInputMouseEnter}
          onMouseLeave={handleInputMouseLeave}
        />
        {isHoverModalVisible && (
          <HoverTextModal text={definition}/>
        )}
      </div>
    );
}

export default InputBlock;