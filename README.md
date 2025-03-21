# Diamond Diary

**Diamond Diary** is a desktop application built with [Tauri](https://tauri.app/) and React/TypeScript, designed to manage diamond inventory efficiently. It provides a user-friendly interface to add, edit, delete, and print diamond entries, with automatic backups for data safety. Perfect for diamond merchants or businesses needing a lightweight, secure, and fast solution.

## Features

- **Add Entries**: Easily input diamond details like Issue Date, Kapan No., Packet No., Rough Weight, Cut, Polish Weight, Shape, Rate, Deposit Date, Total, and Remarks.
- **Edit & Delete**: Update or remove existing entries with a simple click (Edit/Delete buttons).
- **Data Persistence**: Entries are saved locally and persist across app restarts.
- **Automatic Backups**: Backups are created automatically in `C:\Users\<YourUsername>\Documents\DiamondDiary\` as JSON files (`backup_<timestamp>.json` and `merchant_backup_<timestamp>.json`).
- **Print Functionality**: Print diamond entries in a clean table format with borders (Action column excluded in print).
- **Totals Display**: View total Rough Weight and Grand Total at the bottom of the table.
- **Responsive UI**: Built with modern CSS (via `index.css`) for a sleek and intuitive experience.
- **Cross-Platform Ready**: Currently built for Windows, with potential for macOS/Linux support via Tauri.

## Screenshots
*(Add screenshots here if possible)*  
- Main table view  
- Print preview  

## Installation

1. **Download**: Get the `DiamondDiaryApp.zip` from the [Releases](https://github.com/yourusername/diamond-diary/releases) section.
2. **Extract**: Unzip the file to a folder on your PC.
3. **Run**: Double-click `DiamondDiary.exe` to launch the app—no installation required.

### Requirements
- Windows 64-bit
- No additional dependencies needed (standalone executable)

## Usage

1. **Launch**: Open `DiamondDiary.exe`.
2. **Add Entry**: Fill the form at the top and click "Submit".
3. **Edit/Delete**: Use the "E" (Edit) or "D" (Delete) buttons in the Action column.
4. **Print**: Click the "PRINT" button to generate a table printout (excludes Action column).
5. **Check Backups**: Find backups in `C:\Users\<YourUsername>\Documents\DiamondDiary\`.


### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Rust](https://www.rust-lang.org/) (for Tauri backend)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)
- 

![Screenshot 2025-03-21 160409](https://github.com/user-attachments/assets/561a4ba9-60dc-4415-859f-2cf32c523ff1)
![Screenshot 2025-03-21 160453](https://github.com/user-attachments/assets/6b0815cf-ed3b-44bb-ac1f-39b9d527685c)
![Screenshot 2025-03-21 160507](https://github.com/user-attachments/assets/8c836b11-1879-406d-93f0-b3365f28fd59)
![Screenshot 2025-03-21 160524](https://github.com/user-attachments/assets/81157161-f1bb-43ac-9d47-976b38219055)
