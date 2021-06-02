import React, { createRef, useEffect, useState } from 'react';
import styles from '../../styles/editableBlock.module.scss';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { getCaretCoordinates, setCaretToEnd } from '../../util/util';
import { SelectMenu } from '../selectMenu/selectMenu';
import { Coordinates, Props } from './editableBlock.type';
import usePrevious from '@/hooks/usePrevious';

export default function EditableBlock (props: Props) {
  const [content, setContent] = useState({ html: props.html, tag: props.tag });
  const [htmlBackup, setHtmlBackup] = useState("");
  const [prevKey, setPrevKey] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Coordinates>({x: 0, y: 0});
  const contentEditable = createRef<HTMLElement>();

  const prevTyping = usePrevious(isTyping);

  useEffect(() => {
    if (prevTyping && !isTyping && content.html.localeCompare(props.html) != 0) {
      props.updatePage({
        _id: props.id,
        html: content.html,
        tag: content.tag
      });
    }
  }, [content.html, content.tag, isTyping]);

  const handleChange = (e: ContentEditableEvent) => {
    setContent({ html: e.target.value, tag: content.tag});
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      setHtmlBackup(content.html);
    } else if (e.key === "Backspace" && content.html.length === 0) {
      props.deleteBlock({
        _id: props.id,
        html: content.html,
        tag: content.tag
      });
    } else if (e.key === "Enter" && prevKey !== "Shift" && !isMenuOpen) {
      e.preventDefault();
      props.addBlock({
        _id: props.id,
        html: content.html,
        tag: content.tag,
        ref: contentEditable.current
      });
    }
    setPrevKey(e.key);
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "/") {
      handleMenuOpen();
    }
  }

  const handleMenuOpen = () => {
    const { x, y } = getCaretCoordinates();
    setIsMenuOpen(true);
    x && y && setMenuPosition({ x: x , y: y });
    document.addEventListener("click", handleMenuClose);
  }

  const handleMenuClose = () => {
    setHtmlBackup("");
    setIsMenuOpen(false);
    setMenuPosition({ x: 0, y: 0});
    document.removeEventListener("click", handleMenuClose);
  }

  const handleTagSelect = (tag: string) => {
    setContent({ html: htmlBackup, tag: tag });
    contentEditable.current && setCaretToEnd(contentEditable.current);
    handleMenuClose();
  }

  return (
    <>
      { isMenuOpen && (
        <SelectMenu
          position={ menuPosition }
          onSelect={ handleTagSelect }
          close={ handleMenuClose }
        />
      ) }
      <ContentEditable
        className={ styles.block }
        innerRef={ contentEditable }
        data-position={ props.position }
        html={ content.html }
        tagName={ content.tag }
        onChange={ handleChange }
        onKeyDown={ (e) => handleKeyDown(e as any) }
        onKeyUp={ (e) => handleKeyUp(e as any) }
        onFocus={ () => setIsTyping(true) }
        onBlur={ () => setIsTyping(false) }
      />
    </>
  );
}
