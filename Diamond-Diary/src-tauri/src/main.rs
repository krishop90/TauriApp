use std::fs;

#[tauri::command]
fn save_data(filename: String, contents: String) -> Result<(), String> {
    let doc_dir = tauri::api::path::document_dir().ok_or("Could not get document directory")?;
    let path = doc_dir.join("DiamondDiary").join(filename);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(path, contents).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_data(filename: String) -> Result<String, String> {
    let doc_dir = tauri::api::path::document_dir().ok_or("Could not get document directory")?;
    let path = doc_dir.join("DiamondDiary").join(filename);
    fs::read_to_string(path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_data, load_data])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}