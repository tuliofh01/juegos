import styles from "./HoverTextModal.module.css";

const HoverTextModal = ({text}) => {

  return (
    <div className={styles.hoverContainer}>
      <div className={styles.hoverModal}>{text}</div>
    </div>
  );

};

export default HoverTextModal;
