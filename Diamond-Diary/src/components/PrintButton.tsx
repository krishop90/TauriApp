import React from 'react';

const PrintButton: React.FC = () => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = document.getElementById('print-table')?.innerHTML;
    if (!printContent) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            /* Match index.css .data-table styles */
            .data-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
            }
            .data-table th, .data-table td {
              padding: 8px;
              border: 1px solid black !important;
              text-align: left;
            }
            .data-table th {
              background:rgb(243, 244, 246); 
              color: black;
            }
            /* Generic table fallback */
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black !important;
              padding: 8px;
              text-align: left;
            }
            /* Print-specific rules */
            @media print {
              body * { visibility: hidden; }
              #print-table, #print-table * { visibility: visible; }
              #print-table { position: absolute; top: 0; left: 0; width: 100%; }
              .data-table th, .data-table td, table, th, td {
                border: 1px solid black !important; /* Lines ensure */
              }
              /* Hide Action column */
              .data-table th:last-child, .data-table td:last-child {
                display: none !important; /* Last column hide */
              }
              .action-buttons {
                display: none !important; /* Agar class hai toh yeh bhi */
              }
            }
          </style>
        </head>
        <body>
          <div id="print-table">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <button onClick={handlePrint} className="print-btn">
      PRINT
    </button>
  );
};

export default PrintButton;