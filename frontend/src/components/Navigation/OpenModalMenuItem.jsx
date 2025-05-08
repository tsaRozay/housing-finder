import React from 'react';
import { useModal } from '../../context/modal';

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item
  onItemClick, // function to call on click
  onModalClose // function to call when modal closes
}) {
    const { setModalContent, setOnModalClose } = useModal();
  
    const onClick = () => {
      if (onModalClose) setOnModalClose(onModalClose);
      setModalContent(modalComponent);
      if (typeof onItemClick === 'function') onItemClick();
    };
  
    return <li onClick={onClick}>{itemText}</li>;
  }
export default OpenModalMenuItem;
  