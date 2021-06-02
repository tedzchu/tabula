import { matchSorter } from 'match-sorter';
import { useEffect, useState } from 'react';
import { Props } from './selectMenu.type';
import styles from '../../styles/selectMenu.module.scss';

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title"
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading"
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading"
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph"
  }
];

export function SelectMenu ({ onSelect, close, position }: Props) {
  const [command, setCommand] = useState("");
  const [items, setItems] = useState(allowedTags);
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        items[selectedItem]
        ? onSelect(items[selectedItem].tag)
        : close();
      } else if (e.key === "Tab" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextSelected = selectedItem === items.length - 1 ? 0 : selectedItem + 1;
        setSelectedItem(nextSelected);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevSelected = selectedItem === 0 ? items.length - 1: selectedItem - 1;
        setSelectedItem(prevSelected);
      } else if (e.key === "Backspace") {
        if (command) {
          setCommand(command.slice(0, -1));
        } else {
          close();
        }
      } else {
        setCommand(command + e.key);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, selectedItem])

  useEffect(() => {
    const items = matchSorter(allowedTags, command, { keys: ["tag"] });
    setItems(items);
  }, [command])

  const isMenuOutsideOfTopViewport = position.y - MENU_HEIGHT < 0;
  const y = !isMenuOutsideOfTopViewport 
    ? position.y - MENU_HEIGHT
    : position.y + MENU_HEIGHT / 3;
  const x = position.x;

  return (
    <div className={ styles.component } style={{
      top: y,
      left: x,
      justifyContent: isMenuOutsideOfTopViewport ? "flex-start" : "flex-end"
    }}>
      <div className={ styles.items }>
        {items.map((item, key) => (
            <div
              className={
                items.indexOf(item) === selectedItem
                ? [styles.item, styles.selectedTag].join(" ")
                : styles.item }
              key={ key }
              role="button"
              tabIndex={ 0 }
              onClick={() => onSelect(item.tag)}
            >
              {item.label}
            </div>
          ))}
      </div>
    </div>
  )
}