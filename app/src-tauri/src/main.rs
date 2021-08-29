#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Manager, Menu, Submenu, SystemTray, SystemTrayEvent};

fn main() {
  let system_tray = SystemTray::new();
  let menu = Menu::new().add_submenu(Submenu::new(
    "MM Lunch",
    Menu::new().add_native_item(tauri::MenuItem::Quit),
  ));

  let app = tauri::Builder::default()
    .menu(menu)
    .on_window_event(move |event| {
      let evt = event.event();
      let window = event.window();

      if let tauri::WindowEvent::Focused(true) = evt {
      } else if let tauri::WindowEvent::Focused(false) = evt {
        window.hide().unwrap();
      }
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| {
      let window = app.get_window("main").unwrap();

      if let SystemTrayEvent::LeftClick { position, .. } = event {
        if window.is_visible().unwrap() {
          window.hide().unwrap();
        } else {
          let physical_position_center = tauri::PhysicalPosition::<i32> {
            x: position.x as i32,
            y: position.y as i32,
          };

          let position_center: tauri::Position =
            tauri::Position::Physical(physical_position_center);

          window.set_position(position_center).unwrap();
          window.set_focus().unwrap();
        }
      }
    });

  app
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
