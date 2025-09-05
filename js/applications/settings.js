/**
 * ModernOS - Settings Application
 * System configuration and customization panel
 */

class Settings {
    constructor() {
        this.windowId = null;
        this.currentSection = 'appearance';
    }
    
    getContent() {
        return `
            <div class="settings">
                <div class="settings-sidebar">
                    <div class="settings-nav">
                        <div class="settings-nav-item active" data-section="appearance">
                            <i class="fas fa-palette"></i>
                            <span>Appearance</span>
                        </div>
                        <div class="settings-nav-item" data-section="system">
                            <i class="fas fa-cog"></i>
                            <span>System</span>
                        </div>
                        <div class="settings-nav-item" data-section="applications">
                            <i class="fas fa-th"></i>
                            <span>Applications</span>
                        </div>
                        <div class="settings-nav-item" data-section="privacy">
                            <i class="fas fa-shield-alt"></i>
                            <span>Privacy</span>
                        </div>
                        <div class="settings-nav-item" data-section="about">
                            <i class="fas fa-info-circle"></i>
                            <span>About</span>
                        </div>
                    </div>
                </div>
                
                <div class="settings-content">
                    <div class="settings-section active" id="appearance-section">
                        <div class="settings-title">Appearance</div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Theme</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Color Theme</h4>
                                    <p>Choose between light and dark mode</p>
                                </div>
                                <div class="settings-control">
                                    <select id="theme-select" class="settings-select">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto (System)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Accent Color</h4>
                                    <p>Choose your preferred accent color</p>
                                </div>
                                <div class="settings-control">
                                    <div class="color-picker" id="accent-color-picker">
                                        <div class="color-option" data-color="#2563eb" style="background-color: #2563eb;"></div>
                                        <div class="color-option" data-color="#dc2626" style="background-color: #dc2626;"></div>
                                        <div class="color-option" data-color="#16a34a" style="background-color: #16a34a;"></div>
                                        <div class="color-option" data-color="#ca8a04" style="background-color: #ca8a04;"></div>
                                        <div class="color-option" data-color="#9333ea" style="background-color: #9333ea;"></div>
                                        <div class="color-option" data-color="#c2410c" style="background-color: #c2410c;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Wallpaper</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Background</h4>
                                    <p>Choose your desktop wallpaper</p>
                                </div>
                                <div class="settings-control">
                                    <div class="wallpaper-picker" id="wallpaper-picker">
                                        <div class="wallpaper-option selected" data-wallpaper="gradient-blue">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                                            <span>Blue Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-purple">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);"></div>
                                            <span>Purple Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-orange">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);"></div>
                                            <span>Orange Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-green">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%);"></div>
                                            <span>Green Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-pink">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);"></div>
                                            <span>Pink Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-sunset">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);"></div>
                                            <span>Sunset Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-ocean">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);"></div>
                                            <span>Ocean Gradient</span>
                                        </div>
                                        <div class="wallpaper-option" data-wallpaper="gradient-forest">
                                            <div class="wallpaper-preview" style="background: linear-gradient(135deg, #134e5e 0%, #71b280 100%);"></div>
                                            <span>Forest Gradient</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Custom Wallpaper</h4>
                                    <p>Upload your own background image</p>
                                </div>
                                <div class="settings-control">
                                    <div class="wallpaper-upload">
                                        <input type="file" id="wallpaper-upload" accept="image/*" style="display: none;">
                                        <button class="btn btn-secondary" id="upload-wallpaper-btn">
                                            <i class="fas fa-upload"></i>
                                            Upload Image
                                        </button>
                                        <div class="custom-wallpapers" id="custom-wallpapers"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Interface</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Animations</h4>
                                    <p>Enable smooth animations and transitions</p>
                                </div>
                                <div class="settings-control">
                                    <div class="toggle-switch" id="animations-toggle"></div>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Transparency Effects</h4>
                                    <p>Enable blur and transparency effects</p>
                                </div>
                                <div class="settings-control">
                                    <div class="toggle-switch active" id="transparency-toggle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="system-section">
                        <div class="settings-title">System</div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Performance</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Reduce Motion</h4>
                                    <p>Minimize animations for better performance</p>
                                </div>
                                <div class="settings-control">
                                    <div class="toggle-switch" id="reduce-motion-toggle"></div>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Hardware Acceleration</h4>
                                    <p>Use GPU acceleration when available</p>
                                </div>
                                <div class="settings-control">
                                    <div class="toggle-switch active" id="hardware-acceleration-toggle"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Storage</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Clear Cache</h4>
                                    <p>Clear temporary files and cache</p>
                                </div>
                                <div class="settings-control">
                                    <button class="btn btn-secondary" id="clear-cache-btn">Clear Cache</button>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Reset Settings</h4>
                                    <p>Reset all settings to default values</p>
                                </div>
                                <div class="settings-control">
                                    <button class="btn btn-secondary" id="reset-settings-btn">Reset Settings</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="applications-section">
                        <div class="settings-title">Applications</div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Default Applications</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Text Editor</h4>
                                    <p>Default application for text files</p>
                                </div>
                                <div class="settings-control">
                                    <select class="settings-select">
                                        <option value="text-editor" selected>Text Editor</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Web Browser</h4>
                                    <p>Default application for web links</p>
                                </div>
                                <div class="settings-control">
                                    <select class="settings-select">
                                        <option value="web-browser" selected>Web Browser</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Startup</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Auto-start Applications</h4>
                                    <p>Applications to start automatically</p>
                                </div>
                                <div class="settings-control">
                                    <div class="startup-apps">
                                        <label class="startup-app">
                                            <input type="checkbox" id="startup-file-manager">
                                            <span>File Manager</span>
                                        </label>
                                        <label class="startup-app">
                                            <input type="checkbox" id="startup-terminal">
                                            <span>Terminal</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="privacy-section">
                        <div class="settings-title">Privacy & Security</div>
                        
                        <div class="settings-group">
                            <div class="settings-subtitle">Data & Privacy</div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Save Settings</h4>
                                    <p>Save preferences in browser storage</p>
                                </div>
                                <div class="settings-control">
                                    <div class="toggle-switch active" id="save-settings-toggle"></div>
                                </div>
                            </div>
                            
                            <div class="settings-item">
                                <div class="settings-label">
                                    <h4>Usage Analytics</h4>
                                    <p>Help improve ModernOS by sharing usage data</p>
                                </div>
                                <div class="settings-control">
                                    <div class="toggle-switch" id="analytics-toggle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="about-section">
                        <div class="settings-title">About ModernOS</div>
                        
                        <div class="about-content">
                            <div class="about-logo">
                                <i class="fas fa-desktop"></i>
                                <h2>ModernOS</h2>
                                <p class="version">Version 1.0.0</p>
                            </div>
                            
                            <div class="about-info">
                                <div class="info-item">
                                    <strong>Build Date:</strong>
                                    <span>${new Date().toLocaleDateString()}</span>
                                </div>
                                <div class="info-item">
                                    <strong>Browser:</strong>
                                    <span id="browser-info">Loading...</span>
                                </div>
                                <div class="info-item">
                                    <strong>Platform:</strong>
                                    <span id="platform-info">Loading...</span>
                                </div>
                            </div>
                            
                            <div class="about-description">
                                <h3>About</h3>
                                <p>ModernOS is a modern web-based desktop environment that brings the familiar desktop experience to your browser. Built with modern web technologies, it provides a complete operating system interface with applications, file management, and customization options.</p>
                                
                                <h3>Features</h3>
                                <ul>
                                    <li>Complete window management system</li>
                                    <li>File manager with folder navigation</li>
                                    <li>Text editor with syntax highlighting</li>
                                    <li>Scientific calculator</li>
                                    <li>Web browser integration</li>
                                    <li>Terminal emulator</li>
                                    <li>Customizable themes and wallpapers</li>
                                    <li>Responsive design for all devices</li>
                                </ul>
                                
                                <h3>Keyboard Shortcuts</h3>
                                <div class="shortcuts-list">
                                    <div class="shortcut-item">
                                        <kbd>Ctrl+Alt+T</kbd> <span>Open Terminal</span>
                                    </div>
                                    <div class="shortcut-item">
                                        <kbd>Ctrl+Alt+F</kbd> <span>Open File Manager</span>
                                    </div>
                                    <div class="shortcut-item">
                                        <kbd>Ctrl+Alt+E</kbd> <span>Open Text Editor</span>
                                    </div>
                                    <div class="shortcut-item">
                                        <kbd>Alt+Tab</kbd> <span>Switch Windows</span>
                                    </div>
                                    <div class="shortcut-item">
                                        <kbd>F11</kbd> <span>Toggle Fullscreen</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    init(windowId) {
        this.windowId = windowId;
        this.setupEventListeners();
        this.loadCurrentSettings();
        this.updateBrowserInfo();
    }
    
    setupEventListeners() {
        const windowElement = document.getElementById(this.windowId);
        
        // Navigation
        const navItems = windowElement.querySelectorAll('.settings-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
                this.updateNavigation(item);
            });
        });
        
        // Theme settings
        const themeSelect = windowElement.querySelector('#theme-select');
        themeSelect.addEventListener('change', (e) => {
            ModernOS.updateSetting('theme', e.target.value);
            ModernOS.applyTheme(e.target.value);
        });
        
        // Accent color
        const colorOptions = windowElement.querySelectorAll('#accent-color-picker .color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                this.setAccentColor(color);
                this.updateColorSelection(option);
            });
        });
        
        // Wallpaper upload
        const uploadBtn = windowElement.querySelector('#upload-wallpaper-btn');
        const uploadInput = windowElement.querySelector('#wallpaper-upload');
        
        uploadBtn.addEventListener('click', () => {
            uploadInput.click();
        });
        
        uploadInput.addEventListener('change', (e) => {
            this.handleWallpaperUpload(e.target.files[0]);
        });
        
        // Wallpaper
        const wallpaperOptions = windowElement.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(option => {
            option.addEventListener('click', () => {
                const wallpaper = option.dataset.wallpaper;
                ModernOS.updateSetting('wallpaper', wallpaper);
                ModernOS.applyWallpaper(wallpaper);
                this.updateWallpaperSelection(option);
            });
        });
        
        // Toggle switches
        this.setupToggleSwitches(windowElement);
        
        // Action buttons
        windowElement.querySelector('#clear-cache-btn').addEventListener('click', () => {
            this.clearCache();
        });
        
        windowElement.querySelector('#reset-settings-btn').addEventListener('click', () => {
            this.resetSettings();
        });
    }
    
    setupToggleSwitches(windowElement) {
        const toggles = windowElement.querySelectorAll('.toggle-switch');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const settingName = toggle.id.replace('-toggle', '');
                const isActive = toggle.classList.contains('active');
                
                switch (settingName) {
                    case 'animations':
                        ModernOS.updateSetting('animations', isActive);
                        this.toggleAnimations(isActive);
                        break;
                    case 'transparency':
                        ModernOS.updateSetting('transparency', isActive);
                        this.toggleTransparency(isActive);
                        break;
                    case 'reduce-motion':
                        ModernOS.updateSetting('reduceMotion', isActive);
                        this.toggleReduceMotion(isActive);
                        break;
                    case 'hardware-acceleration':
                        ModernOS.updateSetting('hardwareAcceleration', isActive);
                        break;
                    case 'save-settings':
                        ModernOS.updateSetting('saveSettings', isActive);
                        break;
                    case 'analytics':
                        ModernOS.updateSetting('analytics', isActive);
                        break;
                }
            });
        });
    }
    
    switchSection(sectionName) {
        const windowElement = document.getElementById(this.windowId);
        const sections = windowElement.querySelectorAll('.settings-section');
        
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = windowElement.querySelector(`#${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    }
    
    updateNavigation(activeItem) {
        const windowElement = document.getElementById(this.windowId);
        const navItems = windowElement.querySelectorAll('.settings-nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        activeItem.classList.add('active');
    }
    
    loadCurrentSettings() {
        const windowElement = document.getElementById(this.windowId);
        
        // Load theme
        const themeSelect = windowElement.querySelector('#theme-select');
        themeSelect.value = ModernOS.settings.theme || 'light';
        
        // Load wallpaper
        const currentWallpaper = ModernOS.settings.wallpaper || 'gradient-blue';
        const wallpaperOption = windowElement.querySelector(`[data-wallpaper="${currentWallpaper}"]`);
        if (wallpaperOption) {
            this.updateWallpaperSelection(wallpaperOption);
        }
        
        // Load accent color
        const currentColor = ModernOS.settings.accentColor || '#2563eb';
        const colorOption = windowElement.querySelector(`[data-color="${currentColor}"]`);
        if (colorOption) {
            this.updateColorSelection(colorOption);
        }
        
        // Load custom wallpapers
        this.loadCustomWallpapers();
        
        // Load toggles
        this.updateToggle('animations', ModernOS.settings.animations !== false);
        this.updateToggle('transparency', ModernOS.settings.transparency !== false);
        this.updateToggle('reduce-motion', ModernOS.settings.reduceMotion === true);
        this.updateToggle('hardware-acceleration', ModernOS.settings.hardwareAcceleration !== false);
        this.updateToggle('save-settings', ModernOS.settings.saveSettings !== false);
        this.updateToggle('analytics', ModernOS.settings.analytics === true);
    }
    
    updateToggle(name, isActive) {
        const windowElement = document.getElementById(this.windowId);
        const toggle = windowElement.querySelector(`#${name}-toggle`);
        if (toggle) {
            if (isActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        }
    }
    
    setAccentColor(color) {
        ModernOS.updateSetting('accentColor', color);
        ModernOS.applyAccentColor(color);
    }
    
    async handleWallpaperUpload(file) {
        if (!file) return;
        
        try {
            const wallpaperId = await ModernOS.uploadWallpaper(file);
            ModernOS.updateSetting('wallpaper', wallpaperId);
            ModernOS.applyWallpaper(wallpaperId);
            
            // Refresh custom wallpapers display
            this.loadCustomWallpapers();
            
            // Update selection
            this.clearWallpaperSelection();
            
            ModernOS.showNotification('Settings', 'Wallpaper uploaded successfully!');
        } catch (error) {
            ModernOS.showNotification('Settings', `Failed to upload wallpaper: ${error.message}`);
        }
    }
    
    loadCustomWallpapers() {
        const windowElement = document.getElementById(this.windowId);
        const customWallpapersContainer = windowElement.querySelector('#custom-wallpapers');
        
        if (!customWallpapersContainer) return;
        
        const customWallpapers = ModernOS.getCustomWallpapers();
        
        if (Object.keys(customWallpapers).length === 0) {
            customWallpapersContainer.innerHTML = '';
            return;
        }
        
        customWallpapersContainer.innerHTML = '<h5>Your Custom Wallpapers</h5>';
        
        const wallpaperGrid = document.createElement('div');
        wallpaperGrid.className = 'custom-wallpaper-grid';
        
        Object.values(customWallpapers).forEach(wallpaper => {
            const wallpaperItem = document.createElement('div');
            wallpaperItem.className = 'custom-wallpaper-item';
            if (ModernOS.settings.wallpaper === wallpaper.id) {
                wallpaperItem.classList.add('selected');
            }
            
            wallpaperItem.innerHTML = `
                <div class="custom-wallpaper-preview" style="background-image: url(${wallpaper.dataUrl});"></div>
                <div class="custom-wallpaper-actions">
                    <button class="btn btn-sm apply-wallpaper" data-wallpaper="${wallpaper.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm delete-wallpaper" data-wallpaper="${wallpaper.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            wallpaperGrid.appendChild(wallpaperItem);
        });
        
        customWallpapersContainer.appendChild(wallpaperGrid);
        
        // Setup event listeners for custom wallpapers
        wallpaperGrid.querySelectorAll('.apply-wallpaper').forEach(btn => {
            btn.addEventListener('click', () => {
                const wallpaperId = btn.dataset.wallpaper;
                ModernOS.updateSetting('wallpaper', wallpaperId);
                ModernOS.applyWallpaper(wallpaperId);
                this.clearWallpaperSelection();
                this.loadCustomWallpapers(); // Refresh to update selection
            });
        });
        
        wallpaperGrid.querySelectorAll('.delete-wallpaper').forEach(btn => {
            btn.addEventListener('click', () => {
                const wallpaperId = btn.dataset.wallpaper;
                if (confirm('Are you sure you want to delete this wallpaper?')) {
                    ModernOS.deleteCustomWallpaper(wallpaperId);
                    
                    // If this was the current wallpaper, switch to default
                    if (ModernOS.settings.wallpaper === wallpaperId) {
                        ModernOS.updateSetting('wallpaper', 'gradient-blue');
                        ModernOS.applyWallpaper('gradient-blue');
                        this.updateWallpaperSelection(document.querySelector('[data-wallpaper="gradient-blue"]'));
                    }
                    
                    this.loadCustomWallpapers(); // Refresh display
                }
            });
        });
    }
    
    clearWallpaperSelection() {
        const windowElement = document.getElementById(this.windowId);
        const wallpaperOptions = windowElement.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(option => {
            option.classList.remove('selected');
        });
    }
    
    updateColorSelection(selectedOption) {
        const windowElement = document.getElementById(this.windowId);
        const colorOptions = windowElement.querySelectorAll('#accent-color-picker .color-option');
        
        colorOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        selectedOption.classList.add('selected');
    }
    
    updateWallpaperSelection(selectedOption) {
        const windowElement = document.getElementById(this.windowId);
        const wallpaperOptions = windowElement.querySelectorAll('.wallpaper-option');
        
        wallpaperOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        selectedOption.classList.add('selected');
    }
    
    toggleAnimations(enabled) {
        if (enabled) {
            document.documentElement.style.removeProperty('--transition-fast');
            document.documentElement.style.removeProperty('--transition-medium');
            document.documentElement.style.removeProperty('--transition-slow');
        } else {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-medium', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }
    
    toggleTransparency(enabled) {
        const elements = document.querySelectorAll('.taskbar, .start-menu, .context-menu, .window');
        elements.forEach(el => {
            if (enabled) {
                el.style.backdropFilter = 'blur(20px)';
            } else {
                el.style.backdropFilter = 'none';
            }
        });
    }
    
    toggleReduceMotion(enabled) {
        if (enabled) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }
    
    clearCache() {
        if (confirm('Are you sure you want to clear the cache? This will remove temporary files and may affect performance temporarily.')) {
            // Clear various caches
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
            
            ModernOS.showNotification('Settings', 'Cache cleared successfully');
        }
    }
    
    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
            // Clear localStorage
            localStorage.removeItem('modernos-settings');
            
            ModernOS.showNotification('Settings', 'Settings reset successfully. Please refresh the page.');
            
            // Optionally reload the page
            setTimeout(() => {
                if (confirm('Would you like to reload the page to apply default settings?')) {
                    window.location.reload();
                }
            }, 2000);
        }
    }
    
    updateBrowserInfo() {
        const windowElement = document.getElementById(this.windowId);
        const browserInfo = windowElement.querySelector('#browser-info');
        const platformInfo = windowElement.querySelector('#platform-info');
        
        if (browserInfo) {
            browserInfo.textContent = this.getBrowserInfo();
        }
        
        if (platformInfo) {
            platformInfo.textContent = navigator.platform;
        }
    }
    
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        
        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
        } else if (userAgent.includes('Safari')) {
            browser = 'Safari';
        } else if (userAgent.includes('Edge')) {
            browser = 'Edge';
        } else if (userAgent.includes('Opera')) {
            browser = 'Opera';
        }
        
        return browser;
    }
}

// Create global settings instance
window.Settings = new Settings();