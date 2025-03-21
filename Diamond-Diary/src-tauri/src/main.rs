use std::fs;

#[tauri::command]
fn save_data(path: String, contents: String) -> Result<(), String> {
    let doc_dir = tauri::api::path::document_dir().ok_or("Could not get document directory")?;
    let full_path = doc_dir.join(&path);
    if let Some(parent) = full_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&full_path, &contents).map_err(|e| e.to_string())?;
    println!("Saved data to: {:?}", full_path);
    Ok(())
}

#[tauri::command]
fn load_data(path: String) -> Result<String, String> {
    let doc_dir = tauri::api::path::document_dir().ok_or("Could not get document directory")?;
    let full_path = doc_dir.join(&path);
    fs::read_to_string(&full_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn backup_data(source_path: String, backup_path: String) -> Result<(), String> {
    let doc_dir = tauri::api::path::document_dir().ok_or("Could not get document directory")?;
    let source = doc_dir.join(&source_path);
    let backup = doc_dir.join(&backup_path);
    if let Some(parent) = backup.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::copy(&source, &backup).map_err(|e| e.to_string())?;
    println!("Backup created at: {:?}", backup); // Exact path
    Ok(())
}

#[tauri::command]
fn restore_data(backup_path: String, dest_path: String) -> Result<(), String> {
    let doc_dir = tauri::api::path::document_dir().ok_or("Could not get document directory")?;
    let backup = doc_dir.join(&backup_path);
    let dest = doc_dir.join(&dest_path);
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::copy(&backup, &dest).map_err(|e| e.to_string())?;
    println!("Restored from: {:?}", backup);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_data, load_data, backup_data, restore_data])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}