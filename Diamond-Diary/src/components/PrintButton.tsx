import React from 'react';
import { Entry } from '../types';

interface PrintButtonProps {
  entries?: Entry[]; // Optional prop to pass filtered entries
}

const PrintButton: React.FC<PrintButtonProps> = ({  }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className="print-btn">
      PRINT
    </button>
  );
};

export default PrintButton;