import { useEffect, useState } from "react";
import styles from "./InputBlock.module.css";

function InputBlock({ onChange, cellState, disabled, value }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [cellClassName, setCellClassName] = useState(styles.blankCell);

  useEffect(() => {
    if (cellState === 3) {
      setIsDisabled(true);
      setCellClassName(styles.correctCell);
    }
  }, [cellState]);

  return (
    <div>
      <input
        type="text"
        className={cellClassName}
        onChange={onChange}
        disabled={isDisabled || disabled}
        defaultValue={value}
      />
    </div>
  );
}

export default InputBlock;
