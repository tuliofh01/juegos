import { useEffect, useState } from "react";
import styles from "./DollDisplay.module.css"
import Image0 from "../assets/images/0.gif";
import Image1 from "../assets/images/1.gif";
import Image2 from "../assets/images/2.gif";
import Image3 from "../assets/images/3.gif";
import Image4 from "../assets/images/4.gif";
import Image5 from "../assets/images/5.gif";
import Image6 from "../assets/images/6.gif";
import Image7 from "../assets/images/7.gif";

function DollDisplay({ number }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let image;
    switch (number) {
      case 0:
        image = Image0;
        break;
      case 1:
        image = Image1;
        break;
      case 2:
        image = Image2;
        break;
      case 3:
        image = Image3;
        break;
      case 4:
        image = Image4;
        break;
      case 5:
        image = Image5;
        break;
      case 6:
        image = Image6;
        break;
      case 7:
        image = Image7;
        break;
      default:
        image = null;
    }
    setSelectedImage(image);
  }, [number]);

  return (
    <div className={styles.imageContainer}>
      {selectedImage && <img className={styles.image} src={selectedImage} alt="Doll Display" />}
    </div>
  );
}

export default DollDisplay;
