const PrintButton: React.FC = () => {
    const printTable = () => {
        const printContent = document.getElementById('print-table')?.outerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow?.document.write(`
      <html>
        <head><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; } .no-print { display: none; }</style></head>
        <body>${printContent}</body>
      </html>
    `);
        printWindow?.document.close();
        printWindow?.print();
    };

    return <button onClick={printTable} className="print-btn">PRINT</button>;
};

export default PrintButton;