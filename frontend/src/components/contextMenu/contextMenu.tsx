import { useRef } from "react";
import styles from "../../styles/contextMenu.module.scss";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { Position, Props } from "./contextMenu.type";

export default function ContextMenu ({ menuItems, closeAction, isTopNavigation = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close the menu if there are any clicks outside the menu
  useOnClickOutside(ref, closeAction);

  let position: Position = { bottom: "3rem", right: "0" };
  if (isTopNavigation) {
    position = { top: "2rem", right: "0" };
  }

  return (
    <div ref={ref} className={styles.menuWrapper} style={{ ...position }}>
      <div className={styles.menu}>
        {menuItems.map((item, key) => {
          return (
            <div
              key={key}
              className={styles.item}
              role="button"
              tabIndex={ 0 }
              onClick={item.action}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};