import React from 'react';

const Modal = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-black absolute inset-0 opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-md rounded bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-700">
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
