# ModernOS - Web Desktop Environment

![ModernOS](https://img.shields.io/badge/ModernOS-v1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

ModernOS adalah sistem operasi berbasis web yang modern dan canggih, memberikan pengalaman desktop lengkap langsung di browser Anda. Dibangun dengan teknologi web terkini, ModernOS menawarkan antarmuka yang familiar dengan fitur-fitur modern.

## ✨ Fitur Utama

### 🔐 Sistem Authentication
- **Login & Register**: Sistem autentikasi lengkap dengan validasi
- **User Management**: Multi-user support dengan profile dan preferences
- **Session Management**: Persistent login dengan remember me option
- **Demo Accounts**: 3 akun demo siap pakai (admin, user, guest)

### 🖥️ Desktop Environment Lengkap
- **Window Management**: Sistem manajemen jendela dengan drag, resize, minimize, maximize, dan snap
- **Taskbar**: Taskbar modern dengan start menu, aplikasi aktif, dan system tray
- **Desktop Icons**: Ikon desktop yang dapat diklik untuk meluncurkan aplikasi
- **Context Menu**: Menu konteks dengan opsi refresh, paste, dan personalisasi
- **User Profile**: Info user di start menu dengan logout dan profile options

### 📱 Aplikasi Terintegrasi

#### 📁 File Manager
- Navigasi folder dengan sidebar dan breadcrumb
- Grid dan list view
- Operasi file dasar (buat, hapus, rename)
- Mock file system untuk demonstrasi
- Context menu untuk file dan folder

#### ✏️ Text Editor
- Editor teks lengkap dengan line numbers
- Find dan replace dengan regex support
- Syntax detection berdasarkan ekstensi file
- Keyboard shortcuts (Ctrl+S, Ctrl+F, dll.)
- Auto-save dan file management

#### 🧮 Calculator
- Kalkulator dasar dengan operasi matematika
- Mode scientific dengan fungsi trigonometri
- Memory functions (MR, MC, M+, M-)
- History perhitungan
- Keyboard support penuh

#### 🌐 Web Browser
- Browser sederhana dengan navigation controls
- Address bar dengan auto-complete
- Bookmark management
- Quick links dan start page
- Iframe untuk loading external websites

#### 💻 Terminal
- Terminal emulator dengan command line interface
- File system commands (ls, cd, pwd, cat, mkdir, dll.)
- Command history dengan arrow keys
- Auto-completion untuk commands
- Mock Unix-like environment

#### ⚙️ Settings
- Panel pengaturan untuk kustomisasi sistem
- Theme selection (light/dark/auto)
- Wallpaper picker dengan multiple options
- Accent color customization
- Performance settings dan privacy controls

### 🎨 Kustomisasi

#### Tema dan Wallpaper
- **Light/Dark Mode**: Otomatis mengikuti sistem atau manual
- **Multiple Wallpapers**: 8 gradient backgrounds yang indah
- **Custom Wallpapers**: Upload dan kelola wallpaper sendiri (max 5MB)
- **Accent Colors**: 6 pilihan warna accent yang berbeda
- **Transparency Effects**: Blur dan transparency effects
- **Per-User Settings**: Setiap user punya preferences sendiri

#### Responsive Design
- **Mobile Friendly**: Layout yang menyesuaikan untuk mobile dan tablet
- **Touch Support**: Optimasi untuk perangkat touch
- **Adaptive UI**: Interface yang menyesuaikan ukuran layar

## 🚀 Teknologi

ModernOS dibangun dengan teknologi web modern:

- **HTML5**: Struktur semantik dan accessibility
- **CSS3**: 
  - Custom Properties (CSS Variables)
  - CSS Grid dan Flexbox
  - Modern animations dan transitions
  - Media queries untuk responsive design
- **Vanilla JavaScript ES6+**:
  - Modules dan Classes
  - Async/Await
  - Event-driven architecture
  - Local storage untuk persistence
- **Font Awesome**: Icons yang konsisten
- **Google Fonts**: Typography yang modern (Inter)

## 📁 Struktur Proyek

```
modernos/
├── index.html              # Main HTML file
├── styles/                 # CSS styles
│   ├── main.css           # Core styles dan variables
│   ├── desktop.css        # Desktop environment styles
│   ├── window.css         # Window management styles
│   └── applications.css   # Application-specific styles
├── js/                    # JavaScript modules
│   ├── core/             # Core system modules
│   │   ├── system.js     # Main system class
│   │   ├── window-manager.js # Window management
│   │   └── desktop.js    # Desktop interactions
│   ├── applications/     # Application modules
│   │   ├── file-manager.js
│   │   ├── text-editor.js
│   │   ├── calculator.js
│   │   ├── settings.js
│   │   ├── web-browser.js
│   │   └── terminal.js
│   └── main.js           # Application entry point
└── README.md             # Project documentation
```

## 🎯 Cara Menggunakan

### Instalasi
1. Clone atau download repository ini
2. Buka `start.html` di browser modern untuk halaman welcome
3. Atau langsung buka `auth.html` untuk halaman login
4. Tidak diperlukan server atau dependencies tambahan

### Login
**Demo Accounts tersedia:**
- **Administrator**: `admin` / `admin123`
- **Regular User**: `user` / `user123`  
- **Guest User**: `guest` / `guest123`

Atau buat akun baru melalui form register.

### Navigasi Dasar
- **Desktop Icons**: Double-click untuk membuka aplikasi
- **Start Menu**: Click logo ModernOS di taskbar
- **Window Controls**: Minimize, maximize, close di pojok kanan atas jendela
- **Drag & Drop**: Drag title bar untuk memindahkan jendela
- **Resize**: Drag tepi atau sudut jendela untuk resize
- **Right Click**: Context menu di desktop dan aplikasi

### Keyboard Shortcuts
- `Ctrl+Alt+T` - Buka Terminal
- `Ctrl+Alt+F` - Buka File Manager
- `Ctrl+Alt+E` - Buka Text Editor
- `Ctrl+Alt+C` - Buka Calculator
- `Alt+Tab` - Switch antar jendela
- `Alt+F4` - Tutup jendela aktif
- `F11` - Toggle fullscreen
- `Escape` - Tutup menu atau dialog

## 🔧 Kustomisasi

### Mengubah Tema
1. Buka Settings dari start menu atau desktop icon
2. Pilih tab "Appearance"
3. Pilih theme (Light/Dark/Auto)
4. Pilih accent color (6 pilihan warna)
5. Pilih wallpaper dari 8 gradient preset
6. Upload wallpaper custom (max 5MB)
7. Kelola wallpaper custom (apply/delete)

### Menambah Aplikasi Baru
Untuk menambah aplikasi baru:

1. **Buat class aplikasi** di `js/applications/`:
```javascript
class MyApp {
    getContent() {
        return `<div class="my-app">Content here</div>`;
    }
    
    init(windowId) {
        this.windowId = windowId;
        // Setup event listeners
    }
}
window.MyApp = new MyApp();
```

2. **Tambah CSS** di `styles/applications.css`:
```css
.my-app {
    /* App styles */
}
```

3. **Register di desktop.js**:
```javascript
// Tambah di getAppInfo method
'my-app': {
    name: 'My App',
    icon: 'fas fa-star',
    // ... other properties
}
```

4. **Tambah icon** di `index.html`:
```html
<div class="desktop-icon" data-app="my-app">
    <div class="icon-image">
        <i class="fas fa-star"></i>
    </div>
    <div class="icon-label">My App</div>
</div>
```

## 🌟 Fitur Unggulan

### Window Management
- **Snap to edges**: Drag jendela ke tepi layar untuk auto-resize
- **Smart positioning**: Jendela baru otomatis diposisikan dengan offset
- **Z-index management**: Jendela aktif selalu di depan
- **State persistence**: Remember posisi dan ukuran jendela

### Performance Optimizations
- **Lazy loading**: Aplikasi hanya dimuat saat dibutuhkan
- **Efficient rendering**: Minimal DOM manipulation
- **Memory management**: Cleanup saat jendela ditutup
- **Smooth animations**: Hardware-accelerated CSS transitions

### Accessibility
- **Keyboard navigation**: Semua fungsi dapat diakses via keyboard
- **Focus management**: Proper focus handling untuk screen readers
- **High contrast**: Support untuk high contrast mode
- **Semantic HTML**: Proper HTML structure untuk accessibility

## 📱 Mobile Support

ModernOS fully responsive dan mendukung perangkat mobile:

- **Touch gestures**: Tap, long press, swipe
- **Mobile layout**: Optimized untuk layar kecil
- **Virtual keyboard**: Support untuk input di mobile
- **Orientation support**: Portrait dan landscape mode

## 🔒 Privacy & Security

- **Local storage only**: Semua data disimpan local di browser
- **No tracking**: Tidak ada analytics atau tracking
- **Sandboxed**: Aplikasi berjalan dalam environment yang terisolasi
- **CSP ready**: Content Security Policy compatible

## 🐛 Troubleshooting

### Performance Issues
- Disable animations di Settings > System > Reduce Motion
- Clear cache di Settings > System > Clear Cache
- Tutup aplikasi yang tidak digunakan

### Compatibility
- **Minimum browser**: Chrome 80+, Firefox 75+, Safari 13+
- **JavaScript**: Harus diaktifkan
- **Local storage**: Diperlukan untuk menyimpan settings

### Known Limitations
- External websites mungkin tidak bisa dimuat di Web Browser (CORS policy)
- File operations hanya simulasi (tidak ada akses file system nyata)
- Terminal commands terbatas pada yang sudah diimplementasi

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk berkontribusi:

1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Guidelines
- Gunakan ES6+ JavaScript
- Follow existing code style
- Add comments untuk fungsi kompleks
- Test di multiple browsers
- Maintain responsive design

## 📄 Lisensi

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail lengkap.

## 🙏 Acknowledgments

- **Font Awesome** untuk icon set yang comprehensive
- **Google Fonts** untuk typography yang indah
- **Modern CSS** specifications untuk fitur-fitur canggih
- **Web Standards** yang memungkinkan pengembangan aplikasi web modern

## 📞 Dukungan

Jika mengalami masalah atau punya pertanyaan:

1. Check dokumentasi di README ini
2. Lihat console browser untuk error messages
3. Buka issue di repository untuk bug reports
4. Gunakan debug tools: `window.debug` di console

---

**ModernOS** - Bringing desktop experience to the web! 🚀

Made with ❤️ using modern web technologies.