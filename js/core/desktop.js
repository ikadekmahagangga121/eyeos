/**
 * ModernOS - Desktop Manager
 * Handles desktop interactions, start menu, and context menu
 */

class Desktop {
    constructor() {
        this.startMenuOpen = false;
        this.contextMenuOpen = false;
        this.selectedIcons = new Set();
        
        this.init();
    }
    
    init() {
        this.setupDesktopIcons();
        this.setupStartMenu();
        this.setupContextMenu();
        this.setupTaskbar();
        this.setupSearch();
    }
    
    setupDesktopIcons() {
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        
        desktopIcons.forEach(icon => {
            // Single click to select
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectIcon(icon);
            });
            
            // Double click to launch
            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const appName = icon.dataset.app;
                this.launchApplication(appName);
            });
            
            // Right click for context menu
            icon.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showIconContextMenu(e.clientX, e.clientY, icon);
            });
        });
        
        // Click on desktop to deselect icons
        document.querySelector('.desktop').addEventListener('click', (e) => {
            if (e.target.classList.contains('desktop') || e.target.classList.contains('desktop-background')) {
                this.deselectAllIcons();
            }
        });
    }
    
    setupStartMenu() {
        const startButton = document.getElementById('start-button');
        const startMenu = document.getElementById('start-menu');
        const startApps = document.querySelectorAll('.start-app');
        const powerBtns = document.querySelectorAll('.power-btn');
        
        // Toggle start menu
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });
        
        // Launch apps from start menu
        startApps.forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.dataset.app;
                this.launchApplication(appName);
                this.closeStartMenu();
            });
        });
        
        // User actions
        const userBtns = document.querySelectorAll('.user-btn');
        userBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleUserAction(action);
                this.closeStartMenu();
            });
        });

        // Power options
        powerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handlePowerAction(action);
            });
        });
        
        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('#start-button')) {
                this.closeStartMenu();
            }
        });
        
        // Close start menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.startMenuOpen) {
                this.closeStartMenu();
            }
        });
    }
    
    setupContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        const contextItems = document.querySelectorAll('.context-item');
        
        // Handle context menu items
        contextItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleContextAction(action);
                this.closeContextMenu();
            });
        });
        
        // Close context menu when clicking outside
        document.addEventListener('click', () => {
            this.closeContextMenu();
        });
        
        // Handle desktop right-click
        ModernOS.on('desktop:contextmenu', (e) => {
            this.showDesktopContextMenu(e.detail.x, e.detail.y);
        });
    }
    
    setupTaskbar() {
        const taskbar = document.querySelector('.taskbar');
        const networkStatus = document.getElementById('network-status');
        const volumeControl = document.getElementById('volume-control');
        
        // Network status click
        networkStatus.addEventListener('click', () => {
            ModernOS.showNotification('Network Status', 
                navigator.onLine ? 'Connected to the internet' : 'No internet connection');
        });
        
        // Volume control click
        volumeControl.addEventListener('click', () => {
            ModernOS.showNotification('Volume Control', 'Volume controls are not available in web environment');
        });
        
        // Prevent taskbar from losing focus to desktop
        taskbar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const results = this.performSearch(e.target.value);
                if (results.length > 0) {
                    this.launchApplication(results[0].id);
                    searchInput.value = '';
                }
            }
        });
    }
    
    // Icon management
    selectIcon(icon) {
        this.deselectAllIcons();
        icon.classList.add('selected');
        this.selectedIcons.add(icon);
    }
    
    deselectAllIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
        this.selectedIcons.clear();
    }
    
    // Start menu management
    toggleStartMenu() {
        if (this.startMenuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }
    
    openStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.classList.add('show');
        startButton.classList.add('active');
        this.startMenuOpen = true;
        
        ModernOS.emit('startmenu:opened');
    }
    
    closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.classList.remove('show');
        startButton.classList.remove('active');
        this.startMenuOpen = false;
        
        ModernOS.emit('startmenu:closed');
    }
    
    // Context menu management
    showDesktopContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        
        // Position the context menu
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('show');
        this.contextMenuOpen = true;
        
        // Adjust position if menu goes off-screen
        setTimeout(() => {
            const rect = contextMenu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                contextMenu.style.left = (x - rect.width) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                contextMenu.style.top = (y - rect.height) + 'px';
            }
        }, 0);
    }
    
    showIconContextMenu(x, y, icon) {
        // Create icon-specific context menu
        const contextMenu = document.getElementById('context-menu');
        const appName = icon.dataset.app;
        
        contextMenu.innerHTML = `
            <div class="context-item" data-action="open" data-app="${appName}">
                <i class="fas fa-external-link-alt"></i>
                Open
            </div>
            <div class="context-item" data-action="create-shortcut" data-app="${appName}">
                <i class="fas fa-link"></i>
                Create shortcut
            </div>
            <div class="context-item" data-action="properties" data-app="${appName}">
                <i class="fas fa-info-circle"></i>
                Properties
            </div>
        `;
        
        // Re-attach event listeners
        contextMenu.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                const app = item.dataset.app;
                this.handleIconContextAction(action, app);
                this.closeContextMenu();
            });
        });
        
        this.showDesktopContextMenu(x, y);
    }
    
    closeContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.classList.remove('show');
        this.contextMenuOpen = false;
        
        // Restore default context menu
        setTimeout(() => {
            contextMenu.innerHTML = `
                <div class="context-item" data-action="refresh">
                    <i class="fas fa-sync"></i>
                    Refresh
                </div>
                <div class="context-item" data-action="paste">
                    <i class="fas fa-paste"></i>
                    Paste
                </div>
                <div class="context-item" data-action="personalize">
                    <i class="fas fa-palette"></i>
                    Personalize
                </div>
            `;
            
            // Re-attach event listeners
            contextMenu.querySelectorAll('.context-item').forEach(item => {
                item.addEventListener('click', () => {
                    const action = item.dataset.action;
                    this.handleContextAction(action);
                    this.closeContextMenu();
                });
            });
        }, 300);
    }
    
    // Context actions
    handleContextAction(action) {
        switch (action) {
            case 'refresh':
                this.refreshDesktop();
                break;
            case 'paste':
                this.pasteToDesktop();
                break;
            case 'personalize':
                this.launchApplication('settings');
                break;
        }
    }
    
    handleIconContextAction(action, appName) {
        switch (action) {
            case 'open':
                this.launchApplication(appName);
                break;
            case 'create-shortcut':
                ModernOS.showNotification('Shortcut', 'Shortcut created successfully');
                break;
            case 'properties':
                this.showAppProperties(appName);
                break;
        }
    }
    
    handleUserAction(action) {
        switch (action) {
            case 'profile':
                this.launchApplication('settings');
                break;
            case 'logout':
                if (confirm('Are you sure you want to logout?')) {
                    ModernOS.logout();
                }
                break;
        }
    }

    handlePowerAction(action) {
        switch (action) {
            case 'restart':
                if (confirm('Are you sure you want to restart ModernOS?')) {
                    ModernOS.restart();
                }
                break;
            case 'shutdown':
                if (confirm('Are you sure you want to shutdown ModernOS?')) {
                    ModernOS.shutdown();
                }
                break;
        }
    }
    
    // Desktop actions
    refreshDesktop() {
        // Add refresh animation to desktop icons
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach((icon, index) => {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = `fadeInUp 0.3s ease-out ${index * 0.1}s backwards`;
            }, 100);
        });
        
        ModernOS.showNotification('Desktop', 'Desktop refreshed');
    }
    
    async pasteToDesktop() {
        try {
            const text = await ModernOS.pasteFromClipboard();
            if (text) {
                ModernOS.showNotification('Clipboard', `Pasted: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
            } else {
                ModernOS.showNotification('Clipboard', 'Clipboard is empty');
            }
        } catch (error) {
            ModernOS.showNotification('Error', 'Failed to access clipboard');
        }
    }
    
    showAppProperties(appName) {
        const appInfo = this.getAppInfo(appName);
        const content = `
            <div class="app-properties">
                <div class="app-icon-large">
                    <i class="${appInfo.icon}"></i>
                </div>
                <h3>${appInfo.name}</h3>
                <div class="property-list">
                    <div class="property-item">
                        <strong>Type:</strong> ${appInfo.type}
                    </div>
                    <div class="property-item">
                        <strong>Version:</strong> ${appInfo.version}
                    </div>
                    <div class="property-item">
                        <strong>Description:</strong> ${appInfo.description}
                    </div>
                </div>
            </div>
        `;
        
        WindowManager.createWindow({
            title: `${appInfo.name} Properties`,
            content: content,
            width: 400,
            height: 300,
            resizable: false,
            maximizable: false
        });
    }
    
    // Search functionality
    performSearch(query) {
        if (!query.trim()) return [];
        
        const apps = [
            { id: 'file-manager', name: 'File Manager', keywords: ['file', 'folder', 'explorer'] },
            { id: 'text-editor', name: 'Text Editor', keywords: ['text', 'edit', 'notepad'] },
            { id: 'calculator', name: 'Calculator', keywords: ['calc', 'math', 'calculate'] },
            { id: 'web-browser', name: 'Web Browser', keywords: ['web', 'browser', 'internet'] },
            { id: 'terminal', name: 'Terminal', keywords: ['terminal', 'console', 'command'] },
            { id: 'settings', name: 'Settings', keywords: ['settings', 'preferences', 'config'] }
        ];
        
        const results = apps.filter(app => {
            const searchTerm = query.toLowerCase();
            return app.name.toLowerCase().includes(searchTerm) ||
                   app.keywords.some(keyword => keyword.includes(searchTerm));
        });
        
        // Show search results (could be enhanced with a dropdown)
        if (results.length > 0) {
            console.log('Search results:', results);
        }
        
        return results;
    }
    
    // Application launching
    launchApplication(appName) {
        const appInfo = this.getAppInfo(appName);
        
        // Check if app is already running (for single-instance apps)
        const existingWindow = Array.from(WindowManager.windows.values())
            .find(w => w.title === appInfo.name);
        
        if (existingWindow && appInfo.singleInstance) {
            WindowManager.focusWindow(existingWindow.id);
            return;
        }
        
        // Create new window for the application
        const windowId = WindowManager.createWindow({
            title: appInfo.name,
            icon: appInfo.icon,
            width: appInfo.defaultWidth,
            height: appInfo.defaultHeight,
            content: '<div class="app-loading">Loading application...</div>'
        });
        
        // Load application content
        setTimeout(() => {
            this.loadApplicationContent(windowId, appName);
        }, 100);
        
        ModernOS.emit('application:launched', { appName, windowId });
    }
    
    loadApplicationContent(windowId, appName) {
        let content = '';
        
        switch (appName) {
            case 'file-manager':
                content = window.FileManager ? window.FileManager.getContent() : '<div>File Manager loading...</div>';
                break;
            case 'text-editor':
                content = window.TextEditor ? window.TextEditor.getContent() : '<div>Text Editor loading...</div>';
                break;
            case 'calculator':
                content = window.Calculator ? window.Calculator.getContent() : '<div>Calculator loading...</div>';
                break;
            case 'web-browser':
                content = window.WebBrowser ? window.WebBrowser.getContent() : '<div>Web Browser loading...</div>';
                break;
            case 'terminal':
                content = window.Terminal ? window.Terminal.getContent() : '<div>Terminal loading...</div>';
                break;
            case 'settings':
                content = window.Settings ? window.Settings.getContent() : '<div>Settings loading...</div>';
                break;
            default:
                content = '<div class="error">Application not found</div>';
        }
        
        WindowManager.updateWindowContent(windowId, content);
        
        // Initialize application if it has an init method
        const app = window[this.getAppClassName(appName)];
        if (app && typeof app.init === 'function') {
            app.init(windowId);
        }
    }
    
    getAppInfo(appName) {
        const apps = {
            'file-manager': {
                name: 'File Manager',
                icon: 'fas fa-folder',
                type: 'System Application',
                version: '1.0.0',
                description: 'Browse and manage files and folders',
                defaultWidth: 800,
                defaultHeight: 600,
                singleInstance: false
            },
            'text-editor': {
                name: 'Text Editor',
                icon: 'fas fa-edit',
                type: 'Productivity Application',
                version: '1.0.0',
                description: 'Create and edit text documents',
                defaultWidth: 700,
                defaultHeight: 500,
                singleInstance: false
            },
            'calculator': {
                name: 'Calculator',
                icon: 'fas fa-calculator',
                type: 'Utility Application',
                version: '1.0.0',
                description: 'Perform mathematical calculations',
                defaultWidth: 320,
                defaultHeight: 480,
                singleInstance: true
            },
            'web-browser': {
                name: 'Web Browser',
                icon: 'fas fa-globe',
                type: 'Internet Application',
                version: '1.0.0',
                description: 'Browse the world wide web',
                defaultWidth: 900,
                defaultHeight: 600,
                singleInstance: false
            },
            'terminal': {
                name: 'Terminal',
                icon: 'fas fa-terminal',
                type: 'System Application',
                version: '1.0.0',
                description: 'Command line interface',
                defaultWidth: 700,
                defaultHeight: 400,
                singleInstance: false
            },
            'settings': {
                name: 'Settings',
                icon: 'fas fa-cog',
                type: 'System Application',
                version: '1.0.0',
                description: 'Configure system settings',
                defaultWidth: 600,
                defaultHeight: 500,
                singleInstance: true
            }
        };
        
        return apps[appName] || {
            name: 'Unknown Application',
            icon: 'fas fa-question',
            type: 'Unknown',
            version: '0.0.0',
            description: 'Unknown application',
            defaultWidth: 400,
            defaultHeight: 300,
            singleInstance: false
        };
    }
    
    getAppClassName(appName) {
        const classNames = {
            'file-manager': 'FileManager',
            'text-editor': 'TextEditor',
            'calculator': 'Calculator',
            'web-browser': 'WebBrowser',
            'terminal': 'Terminal',
            'settings': 'Settings'
        };
        
        return classNames[appName] || 'Unknown';
    }
}

// Create global desktop instance
window.Desktop = new Desktop();