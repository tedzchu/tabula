import styles from "../../styles/button.module.scss";
import { Props } from "./button.type";

const Button = ({ children, onClickHandler, href }: Props) => {
  return (
    <a
      href={href}
      role="button"
      tabIndex={ 0 }
      className={styles.button}
      onClick={onClickHandler}
      onKeyDown={onClickHandler}
    >
      {children}
    </a>
  );
};

export default Button;