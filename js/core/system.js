/**
 * ModernOS - Core System Module
 * Handles system initialization, state management, and core utilities
 */

class ModernOS {
    constructor() {
        this.version = '1.0.0';
        this.name = 'ModernOS';
        this.isInitialized = false;
        this.settings = this.loadSettings();
        this.clipboard = '';
        
        // System state
        this.state = {
            theme: this.settings.theme || 'light',
            wallpaper: this.settings.wallpaper || 'default',
            animations: this.settings.animations !== false,
            sounds: this.settings.sounds !== false
        };
        
        // Event system
        this.events = new EventTarget();
        
        // Initialize system
        this.init();
    }
    
    async init() {
        console.log(`Initializing ${this.name} v${this.version}...`);
        
        try {
            // Apply theme
            this.applyTheme(this.state.theme);
            
            // Apply wallpaper
            this.applyWallpaper(this.state.wallpaper);
            
            // Initialize clock
            this.initClock();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup system events
            this.setupSystemEvents();
            
            this.isInitialized = true;
            this.emit('system:ready');
            
            console.log('System initialized successfully');
        } catch (error) {
            console.error('System initialization failed:', error);
            this.emit('system:error', { error });
        }
    }
    
    // Settings management
    loadSettings() {
        try {
            const settings = localStorage.getItem('modernos-settings');
            return settings ? JSON.parse(settings) : {};
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return {};
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('modernos-settings', JSON.stringify(this.settings));
            this.emit('settings:saved');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.emit('settings:error', { error });
        }
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.state[key] = value;
        this.saveSettings();
        this.emit('settings:updated', { key, value });
    }
    
    // Theme management
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.theme = theme;
        this.emit('theme:changed', { theme });
    }
    
    // Wallpaper management
    applyWallpaper(wallpaper) {
        const desktop = document.querySelector('.desktop-background');
        if (desktop) {
            switch (wallpaper) {
                case 'gradient-blue':
                    desktop.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    break;
                case 'gradient-purple':
                    desktop.style.background = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
                    break;
                case 'gradient-orange':
                    desktop.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
                    break;
                case 'gradient-green':
                    desktop.style.background = 'linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)';
                    break;
                default:
                    desktop.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
        }
        this.state.wallpaper = wallpaper;
        this.emit('wallpaper:changed', { wallpaper });
    }
    
    // Clock initialization
    initClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    
    updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Alt shortcuts
            if ((e.ctrlKey || e.metaKey) && e.altKey) {
                switch (e.key.toLowerCase()) {
                    case 't':
                        e.preventDefault();
                        this.emit('shortcut:terminal');
                        break;
                    case 'f':
                        e.preventDefault();
                        this.emit('shortcut:file-manager');
                        break;
                    case 'e':
                        e.preventDefault();
                        this.emit('shortcut:text-editor');
                        break;
                    case 'c':
                        e.preventDefault();
                        this.emit('shortcut:calculator');
                        break;
                }
            }
            
            // Alt + Tab (window switching)
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.emit('shortcut:switch-window');
            }
            
            // F11 (fullscreen)
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // Escape key
            if (e.key === 'Escape') {
                this.emit('shortcut:escape');
            }
        });
    }
    
    // System events
    setupSystemEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.emit('system:resize');
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.emit('system:online');
            this.updateNetworkStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.emit('system:offline');
            this.updateNetworkStatus(false);
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.emit('system:visibility-change', { 
                hidden: document.hidden 
            });
        });
        
        // Prevent context menu on desktop
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.desktop') && !e.target.closest('.window')) {
                e.preventDefault();
                this.emit('desktop:contextmenu', { x: e.clientX, y: e.clientY });
            }
        });
    }
    
    // Network status
    updateNetworkStatus(online) {
        const networkIcon = document.getElementById('network-status');
        if (networkIcon) {
            const icon = networkIcon.querySelector('i');
            if (online) {
                icon.className = 'fas fa-wifi';
                networkIcon.title = 'Connected';
            } else {
                icon.className = 'fas fa-wifi-slash';
                networkIcon.title = 'Disconnected';
            }
        }
    }
    
    // Fullscreen management
    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                this.emit('system:fullscreen-enter');
            } else {
                await document.exitFullscreen();
                this.emit('system:fullscreen-exit');
            }
        } catch (error) {
            console.warn('Fullscreen operation failed:', error);
        }
    }
    
    // Clipboard management
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                this.clipboard = text;
            }
            this.emit('clipboard:copy', { text });
        } catch (error) {
            console.warn('Failed to copy to clipboard:', error);
            this.clipboard = text; // Fallback to internal clipboard
        }
    }
    
    async pasteFromClipboard() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                const text = await navigator.clipboard.readText();
                this.emit('clipboard:paste', { text });
                return text;
            } else {
                // Fallback to internal clipboard
                this.emit('clipboard:paste', { text: this.clipboard });
                return this.clipboard;
            }
        } catch (error) {
            console.warn('Failed to paste from clipboard:', error);
            return this.clipboard;
        }
    }
    
    // Notification system
    showNotification(title, message, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                ...options
            });
        } else {
            // Fallback to custom notification
            this.showCustomNotification(title, message, options);
        }
    }
    
    showCustomNotification(title, message, options = {}) {
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <strong>${title}</strong>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after delay
        setTimeout(() => {
            notification.remove();
        }, options.duration || 5000);
        
        // Close button
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
    }
    
    // Power management
    restart() {
        this.emit('system:restart');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    shutdown() {
        this.emit('system:shutdown');
        setTimeout(() => {
            window.close();
        }, 1000);
    }
    
    // Event system
    on(event, callback) {
        this.events.addEventListener(event, callback);
    }
    
    off(event, callback) {
        this.events.removeEventListener(event, callback);
    }
    
    emit(event, data) {
        this.events.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
    
    // Utility methods
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Create global system instance
window.ModernOS = new ModernOS();