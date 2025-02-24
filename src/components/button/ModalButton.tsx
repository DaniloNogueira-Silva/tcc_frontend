import React, { useState } from 'react';
import Modal from '../modal/modal';

const ModalButton = ({ buttonText, modalTitle, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        onClick={openModal}
      >
        {buttonText}
      </button>

      {isOpen && (
        <Modal title={modalTitle} onClose={closeModal}>
          {children}
        </Modal>
      )}
    </>
  );
};

export default ModalButton;
