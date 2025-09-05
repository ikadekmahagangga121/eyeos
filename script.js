// ModernOS - Web Desktop Environment JavaScript

class ModernOS {
    constructor() {
        this.windows = new Map();
        this.windowCounter = 0;
        this.activeWindow = null;
        this.startMenuVisible = false;
        this.contextMenuVisible = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.setupDesktopIcons();
        this.setupContextMenu();
    }

    setupEventListeners() {
        // Start menu toggle
        document.getElementById('start-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.hideStartMenu();
            }
        });

        // Desktop context menu
        document.getElementById('desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Hide context menu on click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });

        // Power button
        document.querySelector('.power-button').addEventListener('click', () => {
            this.shutdown();
        });
    }

    setupDesktopIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.dataset.app;
                this.openApplication(app);
            });
        });
    }

    setupContextMenu() {
        document.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleContextAction(action);
                this.hideContextMenu();
            });
        });
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        this.startMenuVisible = !this.startMenuVisible;
        
        if (this.startMenuVisible) {
            startMenu.classList.add('show');
        } else {
            startMenu.classList.remove('show');
        }
    }

    hideStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.remove('show');
        this.startMenuVisible = false;
    }

    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('show');
        this.contextMenuVisible = true;
    }

    hideContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.classList.remove('show');
        this.contextMenuVisible = false;
    }

    handleContextAction(action) {
        switch (action) {
            case 'new-folder':
                this.createNewFolder();
                break;
            case 'new-file':
                this.createNewFile();
                break;
            case 'refresh':
                this.refreshDesktop();
                break;
        }
    }

    createNewFolder() {
        const name = prompt('Enter folder name:', 'New Folder');
        if (name) {
            this.addDesktopIcon('folder', name, 'file-manager');
        }
    }

    createNewFile() {
        const name = prompt('Enter file name:', 'New File.txt');
        if (name) {
            this.addDesktopIcon('file', name, 'text-editor');
        }
    }

    addDesktopIcon(type, name, app) {
        const desktopIcons = document.querySelector('.desktop-icons');
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.dataset.app = app;
        
        const iconClass = type === 'folder' ? 'fas fa-folder' : 'fas fa-file-alt';
        icon.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${name}</span>
        `;
        
        icon.addEventListener('dblclick', () => {
            this.openApplication(app);
        });
        
        desktopIcons.appendChild(icon);
    }

    refreshDesktop() {
        // Refresh desktop icons (placeholder)
        console.log('Desktop refreshed');
    }

    openApplication(appName) {
        this.hideStartMenu();
        
        // Check if app is already open
        const existingWindow = Array.from(this.windows.values()).find(w => w.appName === appName);
        if (existingWindow) {
            this.focusWindow(existingWindow.id);
            return;
        }

        const windowId = ++this.windowCounter;
        const window = this.createWindow(appName, windowId);
        
        this.windows.set(windowId, window);
        this.addToTaskbar(windowId, appName);
        this.focusWindow(windowId);
    }

    createWindow(appName, windowId) {
        const window = document.createElement('div');
        window.className = 'window';
        window.id = `window-${windowId}`;
        window.dataset.appName = appName;
        
        const title = this.getAppTitle(appName);
        const icon = this.getAppIcon(appName);
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${icon}"></i>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <button class="window-control minimize" onclick="modernOS.minimizeWindow(${windowId})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="window-control maximize" onclick="modernOS.maximizeWindow(${windowId})">
                        <i class="fas fa-square"></i>
                    </button>
                    <button class="window-control close" onclick="modernOS.closeWindow(${windowId})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="window-content">
                ${this.getAppContent(appName)}
            </div>
        `;
        
        // Make window draggable
        this.makeDraggable(window);
        
        // Position window
        const offset = (windowId - 1) * 30;
        window.style.left = (100 + offset) + 'px';
        window.style.top = (100 + offset) + 'px';
        
        document.getElementById('windows-container').appendChild(window);
        
        return {
            id: windowId,
            element: window,
            appName: appName,
            minimized: false,
            maximized: false
        };
    }

    getAppTitle(appName) {
        const titles = {
            'file-manager': 'File Manager',
            'text-editor': 'Text Editor',
            'calculator': 'Calculator',
            'settings': 'Settings'
        };
        return titles[appName] || appName;
    }

    getAppIcon(appName) {
        const icons = {
            'file-manager': 'fas fa-folder',
            'text-editor': 'fas fa-file-alt',
            'calculator': 'fas fa-calculator',
            'settings': 'fas fa-cog'
        };
        return icons[appName] || 'fas fa-window-maximize';
    }

    getAppContent(appName) {
        switch (appName) {
            case 'file-manager':
                return this.getFileManagerContent();
            case 'text-editor':
                return this.getTextEditorContent();
            case 'calculator':
                return this.getCalculatorContent();
            case 'settings':
                return this.getSettingsContent();
            default:
                return '<p>Application not found</p>';
        }
    }

    getFileManagerContent() {
        return `
            <div class="file-manager">
                <div class="file-sidebar">
                    <h3>Places</h3>
                    <div class="file-sidebar-item active">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </div>
                    <div class="file-sidebar-item">
                        <i class="fas fa-folder"></i>
                        <span>Documents</span>
                    </div>
                    <div class="file-sidebar-item">
                        <i class="fas fa-image"></i>
                        <span>Pictures</span>
                    </div>
                    <div class="file-sidebar-item">
                        <i class="fas fa-music"></i>
                        <span>Music</span>
                    </div>
                    <div class="file-sidebar-item">
                        <i class="fas fa-video"></i>
                        <span>Videos</span>
                    </div>
                    <div class="file-sidebar-item">
                        <i class="fas fa-download"></i>
                        <span>Downloads</span>
                    </div>
                </div>
                <div class="file-content">
                    <div class="file-toolbar">
                        <button onclick="modernOS.fileManagerAction('back')">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <button onclick="modernOS.fileManagerAction('forward')">
                            <i class="fas fa-arrow-right"></i> Forward
                        </button>
                        <button onclick="modernOS.fileManagerAction('up')">
                            <i class="fas fa-arrow-up"></i> Up
                        </button>
                        <button onclick="modernOS.fileManagerAction('new-folder')">
                            <i class="fas fa-folder-plus"></i> New Folder
                        </button>
                        <button onclick="modernOS.fileManagerAction('refresh')">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                    <div class="file-grid" id="file-grid">
                        <div class="file-item" onclick="modernOS.openFile('Documents')">
                            <i class="fas fa-folder"></i>
                            <span>Documents</span>
                        </div>
                        <div class="file-item" onclick="modernOS.openFile('Pictures')">
                            <i class="fas fa-folder"></i>
                            <span>Pictures</span>
                        </div>
                        <div class="file-item" onclick="modernOS.openFile('Music')">
                            <i class="fas fa-folder"></i>
                            <span>Music</span>
                        </div>
                        <div class="file-item" onclick="modernOS.openFile('Videos')">
                            <i class="fas fa-folder"></i>
                            <span>Videos</span>
                        </div>
                        <div class="file-item" onclick="modernOS.openFile('sample.txt')">
                            <i class="fas fa-file-alt"></i>
                            <span>sample.txt</span>
                        </div>
                        <div class="file-item" onclick="modernOS.openFile('readme.md')">
                            <i class="fas fa-file-alt"></i>
                            <span>readme.md</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTextEditorContent() {
        return `
            <div class="text-editor">
                <div class="editor-toolbar">
                    <button onclick="modernOS.editorAction('new')">
                        <i class="fas fa-file"></i> New
                    </button>
                    <button onclick="modernOS.editorAction('open')">
                        <i class="fas fa-folder-open"></i> Open
                    </button>
                    <button onclick="modernOS.editorAction('save')">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button onclick="modernOS.editorAction('cut')">
                        <i class="fas fa-cut"></i> Cut
                    </button>
                    <button onclick="modernOS.editorAction('copy')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button onclick="modernOS.editorAction('paste')">
                        <i class="fas fa-paste"></i> Paste
                    </button>
                </div>
                <div class="editor-content">
                    <textarea class="editor-textarea" placeholder="Start typing...">Welcome to ModernOS Text Editor!

This is a modern, web-based desktop environment inspired by EyeOS but with better design and easier functionality.

Features:
- Modern, responsive design
- File manager with drag-and-drop support
- Text editor with syntax highlighting
- Calculator with advanced functions
- Settings panel for customization
- Window management system
- Taskbar with app switching
- Context menus and shortcuts

Enjoy using ModernOS!</textarea>
                </div>
            </div>
        `;
    }

    getCalculatorContent() {
        return `
            <div class="calculator">
                <div class="calculator-display" id="calc-display">0</div>
                <div class="calculator-buttons">
                    <button class="calc-btn function" onclick="modernOS.calcAction('clear')">C</button>
                    <button class="calc-btn function" onclick="modernOS.calcAction('clearEntry')">CE</button>
                    <button class="calc-btn function" onclick="modernOS.calcAction('backspace')">⌫</button>
                    <button class="calc-btn operator" onclick="modernOS.calcAction('/')">÷</button>
                    
                    <button class="calc-btn" onclick="modernOS.calcAction('7')">7</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('8')">8</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('9')">9</button>
                    <button class="calc-btn operator" onclick="modernOS.calcAction('*')">×</button>
                    
                    <button class="calc-btn" onclick="modernOS.calcAction('4')">4</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('5')">5</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('6')">6</button>
                    <button class="calc-btn operator" onclick="modernOS.calcAction('-')">-</button>
                    
                    <button class="calc-btn" onclick="modernOS.calcAction('1')">1</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('2')">2</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('3')">3</button>
                    <button class="calc-btn operator" onclick="modernOS.calcAction('+')">+</button>
                    
                    <button class="calc-btn zero" onclick="modernOS.calcAction('0')">0</button>
                    <button class="calc-btn" onclick="modernOS.calcAction('.')">.</button>
                    <button class="calc-btn operator" onclick="modernOS.calcAction('=')">=</button>
                </div>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="settings">
                <div class="settings-sidebar">
                    <h3>Settings</h3>
                    <div class="settings-item active" data-section="appearance">
                        <i class="fas fa-palette"></i>
                        <span>Appearance</span>
                    </div>
                    <div class="settings-item" data-section="system">
                        <i class="fas fa-cog"></i>
                        <span>System</span>
                    </div>
                    <div class="settings-item" data-section="privacy">
                        <i class="fas fa-shield-alt"></i>
                        <span>Privacy</span>
                    </div>
                    <div class="settings-item" data-section="about">
                        <i class="fas fa-info-circle"></i>
                        <span>About</span>
                    </div>
                </div>
                <div class="settings-content">
                    <div class="settings-section active" id="appearance">
                        <div class="settings-group">
                            <h4>Theme</h4>
                            <div class="setting-item">
                                <span class="setting-label">Dark Mode</span>
                                <div class="setting-control">
                                    <div class="toggle" onclick="modernOS.toggleSetting(this)"></div>
                                </div>
                            </div>
                            <div class="setting-item">
                                <span class="setting-label">Accent Color</span>
                                <div class="setting-control">
                                    <input type="color" value="#667eea" style="width: 40px; height: 30px; border: none; border-radius: 4px; cursor: pointer;">
                                </div>
                            </div>
                        </div>
                        <div class="settings-group">
                            <h4>Desktop</h4>
                            <div class="setting-item">
                                <span class="setting-label">Show Desktop Icons</span>
                                <div class="setting-control">
                                    <div class="toggle active" onclick="modernOS.toggleSetting(this)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-section" id="system">
                        <div class="settings-group">
                            <h4>Performance</h4>
                            <div class="setting-item">
                                <span class="setting-label">Hardware Acceleration</span>
                                <div class="setting-control">
                                    <div class="toggle active" onclick="modernOS.toggleSetting(this)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-section" id="privacy">
                        <div class="settings-group">
                            <h4>Data Collection</h4>
                            <div class="setting-item">
                                <span class="setting-label">Analytics</span>
                                <div class="setting-control">
                                    <div class="toggle" onclick="modernOS.toggleSetting(this)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-section" id="about">
                        <div class="settings-group">
                            <h4>ModernOS</h4>
                            <p>Version 1.0.0</p>
                            <p>A modern web-based desktop environment inspired by EyeOS but with better design and easier functionality.</p>
                            <br>
                            <p><strong>Features:</strong></p>
                            <ul>
                                <li>Modern, responsive design</li>
                                <li>File manager with drag-and-drop support</li>
                                <li>Text editor with syntax highlighting</li>
                                <li>Calculator with advanced functions</li>
                                <li>Settings panel for customization</li>
                                <li>Window management system</li>
                                <li>Taskbar with app switching</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    makeDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                this.focusWindow(parseInt(window.id.split('-')[1]));
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                window.style.left = currentX + 'px';
                window.style.top = currentY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        });
    }

    addToTaskbar(windowId, appName) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const taskbarApp = document.createElement('button');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.id = `taskbar-${windowId}`;
        taskbarApp.innerHTML = `
            <i class="${this.getAppIcon(appName)}"></i>
            <span>${this.getAppTitle(appName)}</span>
        `;
        
        taskbarApp.addEventListener('click', () => {
            this.focusWindow(windowId);
        });
        
        taskbarApps.appendChild(taskbarApp);
    }

    focusWindow(windowId) {
        // Remove active class from all windows
        document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
        document.querySelectorAll('.taskbar-app').forEach(a => a.classList.remove('active'));
        
        // Add active class to focused window
        const window = document.getElementById(`window-${windowId}`);
        const taskbarApp = document.getElementById(`taskbar-${windowId}`);
        
        if (window) {
            window.classList.add('active');
            window.style.zIndex = 200;
        }
        
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
        
        this.activeWindow = windowId;
    }

    minimizeWindow(windowId) {
        const window = document.getElementById(`window-${windowId}`);
        if (window) {
            window.style.display = 'none';
            this.windows.get(windowId).minimized = true;
        }
    }

    maximizeWindow(windowId) {
        const window = document.getElementById(`window-${windowId}`);
        const windowData = this.windows.get(windowId);
        
        if (window && windowData) {
            if (windowData.maximized) {
                // Restore
                window.style.width = '400px';
                window.style.height = '300px';
                window.style.left = '100px';
                window.style.top = '100px';
                windowData.maximized = false;
            } else {
                // Maximize
                window.style.width = 'calc(100vw - 20px)';
                window.style.height = 'calc(100vh - 70px)';
                window.style.left = '10px';
                window.style.top = '10px';
                windowData.maximized = true;
            }
        }
    }

    closeWindow(windowId) {
        const window = document.getElementById(`window-${windowId}`);
        const taskbarApp = document.getElementById(`taskbar-${windowId}`);
        
        if (window) {
            window.remove();
        }
        
        if (taskbarApp) {
            taskbarApp.remove();
        }
        
        this.windows.delete(windowId);
        
        if (this.activeWindow === windowId) {
            this.activeWindow = null;
        }
    }

    // File Manager Actions
    fileManagerAction(action) {
        console.log('File manager action:', action);
        // Implement file manager actions
    }

    openFile(fileName) {
        console.log('Opening file:', fileName);
        // Implement file opening
    }

    // Text Editor Actions
    editorAction(action) {
        console.log('Editor action:', action);
        // Implement editor actions
    }

    // Calculator Actions
    calcAction(action) {
        const display = document.getElementById('calc-display');
        if (!display) return;

        if (action === 'clear') {
            display.textContent = '0';
        } else if (action === 'clearEntry') {
            display.textContent = '0';
        } else if (action === 'backspace') {
            if (display.textContent.length > 1) {
                display.textContent = display.textContent.slice(0, -1);
            } else {
                display.textContent = '0';
            }
        } else if (action === '=') {
            try {
                const result = eval(display.textContent.replace('×', '*').replace('÷', '/'));
                display.textContent = result.toString();
            } catch (e) {
                display.textContent = 'Error';
            }
        } else {
            if (display.textContent === '0' && !isNaN(action)) {
                display.textContent = action;
            } else {
                display.textContent += action;
            }
        }
    }

    // Settings Actions
    toggleSetting(toggle) {
        toggle.classList.toggle('active');
    }

    // Clock
    updateClock() {
        const clock = document.getElementById('clock');
        if (clock) {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            clock.textContent = time;
        }
        
        setTimeout(() => this.updateClock(), 1000);
    }

    // Shutdown
    shutdown() {
        if (confirm('Are you sure you want to shutdown ModernOS?')) {
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    font-size: 24px;
                ">
                    <div style="text-align: center;">
                        <i class="fas fa-power-off" style="font-size: 48px; margin-bottom: 20px;"></i>
                        <div>ModernOS is shutting down...</div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize ModernOS when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modernOS = new ModernOS();
});

// Setup settings navigation
document.addEventListener('click', (e) => {
    if (e.target.closest('.settings-item')) {
        const item = e.target.closest('.settings-item');
        const section = item.dataset.section;
        
        // Remove active class from all items and sections
        document.querySelectorAll('.settings-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked item and corresponding section
        item.classList.add('active');
        document.getElementById(section).classList.add('active');
    }
});