/**
 * ModernOS - Core System Module
 * Handles system initialization, state management, and core utilities
 */

class ModernOS {
    constructor() {
        this.version = '1.0.0';
        this.name = 'ModernOS';
        this.isInitialized = false;
        this.currentUser = null;
        this.settings = this.loadSettings();
        this.clipboard = '';
        
        // System state
        this.state = {
            theme: this.settings.theme || 'light',
            wallpaper: this.settings.wallpaper || 'gradient-blue',
            animations: this.settings.animations !== false,
            sounds: this.settings.sounds !== false,
            accentColor: this.settings.accentColor || '#2563eb'
        };
        
        // Event system
        this.events = new EventTarget();
        
        // Check authentication before initializing
        this.checkAuthentication();
    }
    
    checkAuthentication() {
        // Check if user is authenticated
        const session = this.getCurrentSession();
        
        if (!session) {
            // No valid session, redirect to auth page
            window.location.href = 'auth.html';
            return;
        }
        
        // Set current user and load their preferences
        this.currentUser = session;
        this.loadUserPreferences();
        
        // Initialize system
        this.init();
    }
    
    getCurrentSession() {
        try {
            const session = JSON.parse(localStorage.getItem('modernos-session')) ||
                           JSON.parse(sessionStorage.getItem('modernos-session-temp'));
            
            if (session && new Date(session.expiresAt) > new Date()) {
                return session;
            }
        } catch (error) {
            console.error('Failed to get current session:', error);
        }
        
        return null;
    }
    
    loadUserPreferences() {
        if (this.currentUser && this.currentUser.preferences) {
            this.settings = { ...this.settings, ...this.currentUser.preferences };
            this.state = {
                theme: this.settings.theme || 'light',
                wallpaper: this.settings.wallpaper || 'gradient-blue',
                animations: this.settings.animations !== false,
                sounds: this.settings.sounds !== false,
                accentColor: this.settings.accentColor || '#2563eb'
            };
        }
    }

    async init() {
        console.log(`Initializing ${this.name} v${this.version} for user: ${this.currentUser.firstName} ${this.currentUser.lastName}`);
        
        try {
            // Apply theme
            this.applyTheme(this.state.theme);
            
            // Apply wallpaper
            this.applyWallpaper(this.state.wallpaper);
            
            // Apply accent color
            this.applyAccentColor(this.state.accentColor);
            
            // Initialize clock
            this.initClock();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup system events
            this.setupSystemEvents();
            
            // Update user info in UI
            this.updateUserInfo();
            
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
        
        // Also update user preferences if user is logged in
        if (this.currentUser) {
            this.updateUserPreference(key, value);
        }
        
        this.emit('settings:updated', { key, value });
    }
    
    updateUserPreference(key, value) {
        if (!this.currentUser) return;
        
        // Update user preferences in localStorage
        try {
            const users = JSON.parse(localStorage.getItem('modernos-users') || '{}');
            if (users[this.currentUser.userId]) {
                users[this.currentUser.userId].preferences[key] = value;
                localStorage.setItem('modernos-users', JSON.stringify(users));
                
                // Update current session
                this.currentUser.preferences[key] = value;
                const sessionKey = localStorage.getItem('modernos-session') ? 'modernos-session' : 'modernos-session-temp';
                const storage = localStorage.getItem('modernos-session') ? localStorage : sessionStorage;
                storage.setItem(sessionKey, JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Failed to update user preferences:', error);
        }
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
            // Check if it's a custom wallpaper (starts with 'custom-')
            if (wallpaper.startsWith('custom-')) {
                const customWallpaper = this.getCustomWallpaper(wallpaper);
                if (customWallpaper) {
                    desktop.style.background = `url(${customWallpaper}) center/cover`;
                }
            } else {
                // Predefined gradients
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
                    case 'gradient-pink':
                        desktop.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
                        break;
                    case 'gradient-sunset':
                        desktop.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
                        break;
                    case 'gradient-ocean':
                        desktop.style.background = 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)';
                        break;
                    case 'gradient-forest':
                        desktop.style.background = 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)';
                        break;
                    default:
                        desktop.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            }
        }
        this.state.wallpaper = wallpaper;
        this.emit('wallpaper:changed', { wallpaper });
    }
    
    // Accent color management
    applyAccentColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        // Generate hover color (slightly darker)
        const hoverColor = this.adjustBrightness(color, -20);
        document.documentElement.style.setProperty('--primary-hover', hoverColor);
        this.state.accentColor = color;
        this.emit('accent-color:changed', { color });
    }
    
    adjustBrightness(hex, percent) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse RGB
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    // Custom wallpaper management
    uploadWallpaper(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Please select a valid image file'));
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                reject(new Error('File size must be less than 5MB'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const wallpaperId = 'custom-' + Date.now();
                this.saveCustomWallpaper(wallpaperId, e.target.result);
                resolve(wallpaperId);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    
    saveCustomWallpaper(id, dataUrl) {
        try {
            const customWallpapers = JSON.parse(localStorage.getItem('modernos-wallpapers') || '{}');
            customWallpapers[id] = {
                id: id,
                dataUrl: dataUrl,
                createdAt: new Date().toISOString(),
                userId: this.currentUser ? this.currentUser.userId : 'guest'
            };
            localStorage.setItem('modernos-wallpapers', JSON.stringify(customWallpapers));
        } catch (error) {
            console.error('Failed to save custom wallpaper:', error);
        }
    }
    
    getCustomWallpaper(id) {
        try {
            const customWallpapers = JSON.parse(localStorage.getItem('modernos-wallpapers') || '{}');
            return customWallpapers[id] ? customWallpapers[id].dataUrl : null;
        } catch (error) {
            console.error('Failed to get custom wallpaper:', error);
            return null;
        }
    }
    
    getCustomWallpapers() {
        try {
            const customWallpapers = JSON.parse(localStorage.getItem('modernos-wallpapers') || '{}');
            // Filter by current user
            const userWallpapers = {};
            Object.entries(customWallpapers).forEach(([id, wallpaper]) => {
                if (!this.currentUser || wallpaper.userId === this.currentUser.userId) {
                    userWallpapers[id] = wallpaper;
                }
            });
            return userWallpapers;
        } catch (error) {
            console.error('Failed to get custom wallpapers:', error);
            return {};
        }
    }
    
    deleteCustomWallpaper(id) {
        try {
            const customWallpapers = JSON.parse(localStorage.getItem('modernos-wallpapers') || '{}');
            delete customWallpapers[id];
            localStorage.setItem('modernos-wallpapers', JSON.stringify(customWallpapers));
            this.emit('wallpaper:deleted', { id });
        } catch (error) {
            console.error('Failed to delete custom wallpaper:', error);
        }
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
    
    // User info management
    updateUserInfo() {
        if (!this.currentUser) return;
        
        // Update user info in start menu or taskbar if elements exist
        const userElements = document.querySelectorAll('.user-name, .user-info');
        userElements.forEach(element => {
            element.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        });
        
        // Update user avatar if element exists
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(element => {
            if (this.currentUser.avatar) {
                element.src = this.currentUser.avatar;
            } else {
                // Use initials as fallback
                element.textContent = `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`;
            }
        });
    }
    
    // Logout functionality
    logout() {
        // Clear sessions
        localStorage.removeItem('modernos-session');
        sessionStorage.removeItem('modernos-session-temp');
        
        // Emit logout event
        this.emit('user:logout');
        
        // Show notification
        this.showNotification('Logout', 'You have been logged out successfully');
        
        // Redirect to auth page
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
    
    // Power management
    restart() {
        this.emit('system:restart');
        this.showNotification('System', 'Restarting ModernOS...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    shutdown() {
        this.emit('system:shutdown');
        this.showNotification('System', 'Shutting down ModernOS...');
        setTimeout(() => {
            this.logout();
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