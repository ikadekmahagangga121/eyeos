/**
 * ModernOS - Main Application Entry Point
 * Initializes the entire system and handles startup
 */

class ModernOSApp {
    constructor() {
        this.isLoaded = false;
        this.startupApplications = [];
    }
    
    async init() {
        console.log('Starting ModernOS...');
        
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize system components
            await this.initializeSystem();
            
            // Setup global event handlers
            this.setupGlobalEvents();
            
            // Setup keyboard shortcuts
            this.setupGlobalShortcuts();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Mark as loaded
            this.isLoaded = true;
            
            console.log('ModernOS started successfully');
            
            // Show welcome notification
            setTimeout(() => {
                ModernOS.showNotification(
                    'Welcome to ModernOS',
                    'Your modern web desktop is ready to use!'
                );
            }, 1000);
            
        } catch (error) {
            console.error('Failed to start ModernOS:', error);
            this.showErrorMessage(error);
        }
    }
    
    async initializeSystem() {
        // System is already initialized via script loading
        // Just verify all components are available
        const requiredComponents = [
            'ModernOS',
            'WindowManager', 
            'Desktop',
            'FileManager',
            'TextEditor',
            'Calculator',
            'Settings',
            'WebBrowser',
            'Terminal'
        ];
        
        const missing = requiredComponents.filter(component => !window[component]);
        if (missing.length > 0) {
            throw new Error(`Missing required components: ${missing.join(', ')}`);
        }
        
        // Wait for system to be ready
        if (!ModernOS.isInitialized) {
            await new Promise(resolve => {
                ModernOS.on('system:ready', resolve);
            });
        }
    }
    
    setupGlobalEvents() {
        // Handle system events
        ModernOS.on('shortcut:terminal', () => {
            Desktop.launchApplication('terminal');
        });
        
        ModernOS.on('shortcut:file-manager', () => {
            Desktop.launchApplication('file-manager');
        });
        
        ModernOS.on('shortcut:text-editor', () => {
            Desktop.launchApplication('text-editor');
        });
        
        ModernOS.on('shortcut:calculator', () => {
            Desktop.launchApplication('calculator');
        });
        
        ModernOS.on('shortcut:switch-window', () => {
            this.switchWindow();
        });
        
        ModernOS.on('shortcut:escape', () => {
            this.handleEscape();
        });
        
        // Handle system state changes
        ModernOS.on('system:online', () => {
            ModernOS.showNotification('Network', 'Connection restored');
        });
        
        ModernOS.on('system:offline', () => {
            ModernOS.showNotification('Network', 'Connection lost');
        });
        
        ModernOS.on('system:fullscreen-enter', () => {
            document.body.classList.add('fullscreen');
        });
        
        ModernOS.on('system:fullscreen-exit', () => {
            document.body.classList.remove('fullscreen');
        });
        
        // Handle window events
        ModernOS.on('window:created', (e) => {
            console.log('Window created:', e.detail.windowId);
        });
        
        ModernOS.on('window:closed', (e) => {
            console.log('Window closed:', e.detail.windowId);
        });
        
        // Handle application events
        ModernOS.on('application:launched', (e) => {
            console.log('Application launched:', e.detail.appName);
        });
    }
    
    setupGlobalShortcuts() {
        // Additional global shortcuts not handled by the system
        document.addEventListener('keydown', (e) => {
            // Prevent certain browser shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'r':
                        if (!e.shiftKey) {
                            e.preventDefault(); // Prevent page refresh
                            ModernOS.showNotification('ModernOS', 'Use the refresh button in applications');
                        }
                        break;
                    case 'w':
                        e.preventDefault(); // Prevent tab close
                        if (WindowManager.activeWindow) {
                            WindowManager.closeWindow(WindowManager.activeWindow);
                        }
                        break;
                    case 'q':
                        e.preventDefault(); // Prevent browser quit
                        break;
                }
            }
        });
        
        // Prevent right-click on certain elements
        document.addEventListener('contextmenu', (e) => {
            if (e.target.matches('img, video, audio')) {
                e.preventDefault();
            }
        });
        
        // Prevent drag and drop of files
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            ModernOS.showNotification('File Drop', 'File operations are handled by the File Manager');
        });
    }
    
    switchWindow() {
        const windows = WindowManager.getAllWindows();
        if (windows.length === 0) return;
        
        // Find current active window index
        const activeWindow = WindowManager.getActiveWindow();
        let currentIndex = windows.findIndex(w => w.id === (activeWindow ? activeWindow.id : null));
        
        // Switch to next window
        const nextIndex = (currentIndex + 1) % windows.length;
        const nextWindow = windows[nextIndex];
        
        if (nextWindow) {
            if (nextWindow.state === 'minimized') {
                WindowManager.restoreWindow(nextWindow.id);
            } else {
                WindowManager.focusWindow(nextWindow.id);
            }
        }
    }
    
    handleEscape() {
        // Close any open menus or dialogs
        if (Desktop.startMenuOpen) {
            Desktop.closeStartMenu();
        }
        
        if (Desktop.contextMenuOpen) {
            Desktop.closeContextMenu();
        }
        
        // Focus active window
        const activeWindow = WindowManager.getActiveWindow();
        if (activeWindow) {
            const windowElement = activeWindow.element;
            const focusableElement = windowElement.querySelector('input, textarea, button, [tabindex]');
            if (focusableElement) {
                focusableElement.focus();
            }
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }
    
    showErrorMessage(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'system-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h1><i class="fas fa-exclamation-triangle"></i> System Error</h1>
                <p>ModernOS failed to start properly.</p>
                <details>
                    <summary>Error Details</summary>
                    <pre>${error.message}\n${error.stack || ''}</pre>
                </details>
                <button onclick="window.location.reload()">Reload System</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
    
    // Public API
    launchApplication(appName) {
        if (!this.isLoaded) {
            console.warn('System not fully loaded yet');
            return;
        }
        
        Desktop.launchApplication(appName);
    }
    
    getSystemInfo() {
        return {
            name: ModernOS.name,
            version: ModernOS.version,
            isLoaded: this.isLoaded,
            windowCount: WindowManager.windows.size,
            activeWindow: WindowManager.activeWindow
        };
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            startTime: performance.now(),
            loadTime: null,
            memoryUsage: null
        };
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        // Monitor load time
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - this.metrics.startTime;
            console.log(`ModernOS loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });
        
        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }, 10000); // Update every 10 seconds
        }
        
        // Monitor frame rate
        this.monitorFrameRate();
    }
    
    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Log performance warnings
                if (fps < 30) {
                    console.warn(`Low frame rate detected: ${fps} FPS`);
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    ModernOS.showNotification('System Error', 'An unexpected error occurred. Check the console for details.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    ModernOS.showNotification('System Error', 'An async operation failed. Check the console for details.');
});

// Initialize the application
const app = new ModernOSApp();
const performanceMonitor = new PerformanceMonitor();

// Start the system
app.init().catch(error => {
    console.error('Failed to initialize ModernOS:', error);
});

// Make app globally available for debugging
window.ModernOSApp = app;
window.PerformanceMonitor = performanceMonitor;

// Development helpers (only in development)
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    window.debug = {
        system: ModernOS,
        windowManager: WindowManager,
        desktop: Desktop,
        app: app,
        performance: performanceMonitor,
        
        // Helper functions
        openAllApps: () => {
            ['file-manager', 'text-editor', 'calculator', 'web-browser', 'terminal', 'settings']
                .forEach(app => Desktop.launchApplication(app));
        },
        
        closeAllWindows: () => {
            Array.from(WindowManager.windows.keys()).forEach(id => {
                WindowManager.closeWindow(id);
            });
        },
        
        getMetrics: () => performanceMonitor.getMetrics(),
        
        resetSystem: () => {
            localStorage.clear();
            window.location.reload();
        }
    };
    
    console.log('ModernOS Debug tools available at window.debug');
}