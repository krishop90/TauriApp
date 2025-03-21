import React from 'react';

const PrintButton: React.FC = () => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printTable = document.getElementById('print-table');
    if (!printTable) return;

    // Get data from the table
    const headers: string[] = [];
    const rows: string[][] = [];

    // Get headers (excluding Action column)
    const headerElements = printTable.querySelectorAll('thead tr th');
    headerElements.forEach((header, index) => {
      if (index < headerElements.length - 1) { // Skip last column (Action)
        headers.push(header.textContent || '');
      }
    });

    // Get row data (excluding Action column)
    const rowElements = printTable.querySelectorAll('tbody tr');
    rowElements.forEach(row => {
      const rowData: string[] = [];
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (index < cells.length - 1) { // Skip last column (Action)
          rowData.push(cell.textContent || '-');
        }
      });
      rows.push(rowData);
    });

    // Get totals
    const totals = printTable.querySelector('.totals');
    const totalsText = totals ? totals.textContent || '' : '';

    // Build HTML with explicit TABLE attributes for border
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Table</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #2c3e50; color: white; font-weight: bold; }
          td, th { padding: 8px; text-align: left; }
          .totals { margin-top: 15px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>DIAMOND DIARY</h1>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>`;

    // Add headers
    headers.forEach(header => {
      html += `<th>${header}</th>`;
    });

    html += `</tr>
          </thead>
          <tbody>`;

    // Add rows
    rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    });

    html += `</tbody>
        </table>
        <div class="totals">${totalsText}</div>
      </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    // Use a timeout to ensure the document is fully loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <button onClick={handlePrint} className="print-btn">
      PRINT
    </button>
  );
};

export default PrintButton;