/**
 * ModernOS - Window Manager
 * Handles window creation, management, and interactions
 */

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.snapThreshold = 20;
        this.snapIndicator = null;
        
        this.init();
    }
    
    init() {
        this.createSnapIndicator();
        this.setupGlobalEvents();
    }
    
    createSnapIndicator() {
        this.snapIndicator = document.createElement('div');
        this.snapIndicator.className = 'snap-indicator';
        document.body.appendChild(this.snapIndicator);
    }
    
    setupGlobalEvents() {
        // Global mouse events for window operations
        document.addEventListener('mousedown', (e) => {
            const window = e.target.closest('.window');
            if (window) {
                this.focusWindow(window.id);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'F4') {
                e.preventDefault();
                if (this.activeWindow) {
                    this.closeWindow(this.activeWindow);
                }
            }
        });
    }
    
    createWindow(options = {}) {
        const windowId = options.id || ModernOS.generateId();
        const windowData = {
            id: windowId,
            title: options.title || 'Untitled',
            icon: options.icon || 'fas fa-window-maximize',
            content: options.content || '',
            width: options.width || 600,
            height: options.height || 400,
            x: options.x || this.getDefaultX(),
            y: options.y || this.getDefaultY(),
            minWidth: options.minWidth || 300,
            minHeight: options.minHeight || 200,
            resizable: options.resizable !== false,
            maximizable: options.maximizable !== false,
            minimizable: options.minimizable !== false,
            closable: options.closable !== false,
            modal: options.modal || false,
            state: 'normal' // normal, minimized, maximized
        };
        
        const windowElement = this.createWindowElement(windowData);
        this.windows.set(windowId, { ...windowData, element: windowElement });
        
        // Add to container
        const container = document.getElementById('windows-container');
        container.appendChild(windowElement);
        
        // Setup window interactions
        this.setupWindowInteractions(windowElement, windowData);
        
        // Focus the new window
        this.focusWindow(windowId);
        
        // Add to taskbar
        this.addToTaskbar(windowData);
        
        // Animation
        windowElement.classList.add('opening');
        setTimeout(() => {
            windowElement.classList.remove('opening');
        }, 300);
        
        // Emit event
        ModernOS.emit('window:created', { windowId, windowData });
        
        return windowId;
    }
    
    createWindowElement(windowData) {
        const window = document.createElement('div');
        window.className = 'window';
        window.id = windowData.id;
        window.style.width = windowData.width + 'px';
        window.style.height = windowData.height + 'px';
        window.style.left = windowData.x + 'px';
        window.style.top = windowData.y + 'px';
        window.style.zIndex = ++this.zIndexCounter;
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${windowData.icon}"></i>
                    <span>${windowData.title}</span>
                </div>
                <div class="window-controls">
                    ${windowData.minimizable ? '<button class="window-control minimize" title="Minimize"><i class="fas fa-minus"></i></button>' : ''}
                    ${windowData.maximizable ? '<button class="window-control maximize" title="Maximize"><i class="fas fa-square"></i></button>' : ''}
                    ${windowData.closable ? '<button class="window-control close" title="Close"><i class="fas fa-times"></i></button>' : ''}
                </div>
            </div>
            <div class="window-content">${windowData.content}</div>
        `;
        
        // Add resize handles if resizable
        if (windowData.resizable) {
            this.addResizeHandles(window);
        }
        
        return window;
    }
    
    addResizeHandles(window) {
        const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        handles.forEach(handle => {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = `resize-handle ${handle}`;
            window.appendChild(resizeHandle);
        });
    }
    
    setupWindowInteractions(windowElement, windowData) {
        const header = windowElement.querySelector('.window-header');
        const controls = windowElement.querySelectorAll('.window-control');
        const resizeHandles = windowElement.querySelectorAll('.resize-handle');
        
        // Header drag
        this.setupDrag(header, windowElement, windowData);
        
        // Window controls
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.classList.contains('minimize') ? 'minimize' :
                              control.classList.contains('maximize') ? 'maximize' :
                              'close';
                this.handleWindowControl(windowData.id, action);
            });
        });
        
        // Double-click to maximize
        header.addEventListener('dblclick', (e) => {
            if (windowData.maximizable && e.target.closest('.window-title')) {
                this.toggleMaximize(windowData.id);
            }
        });
        
        // Resize handles
        resizeHandles.forEach(handle => {
            this.setupResize(handle, windowElement, windowData);
        });
    }
    
    setupDrag(dragHandle, windowElement, windowData) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        const startDrag = (e) => {
            if (windowData.state === 'maximized') return;
            
            isDragging = true;
            windowElement.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            initialX = parseInt(windowElement.style.left);
            initialY = parseInt(windowElement.style.top);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const newX = initialX + deltaX;
            const newY = Math.max(0, initialY + deltaY);
            
            windowElement.style.left = newX + 'px';
            windowElement.style.top = newY + 'px';
            
            // Check for snap zones
            this.checkSnapZones(e.clientX, e.clientY, windowElement);
        };
        
        const stopDrag = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            windowElement.classList.remove('dragging');
            this.hideSnapIndicator();
            
            // Handle snap
            this.handleSnap(e.clientX, e.clientY, windowData.id);
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        };
        
        dragHandle.addEventListener('mousedown', startDrag);
    }
    
    setupResize(resizeHandle, windowElement, windowData) {
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        const direction = resizeHandle.classList[1];
        
        const startResize = (e) => {
            if (windowData.state === 'maximized') return;
            
            isResizing = true;
            windowElement.classList.add('resizing');
            
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(windowElement.style.width);
            startHeight = parseInt(windowElement.style.height);
            startLeft = parseInt(windowElement.style.left);
            startTop = parseInt(windowElement.style.top);
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
            e.stopPropagation();
        };
        
        const resize = (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;
            
            // Calculate new dimensions based on direction
            if (direction.includes('e')) newWidth = Math.max(windowData.minWidth, startWidth + deltaX);
            if (direction.includes('w')) {
                newWidth = Math.max(windowData.minWidth, startWidth - deltaX);
                newLeft = startLeft + (startWidth - newWidth);
            }
            if (direction.includes('s')) newHeight = Math.max(windowData.minHeight, startHeight + deltaY);
            if (direction.includes('n')) {
                newHeight = Math.max(windowData.minHeight, startHeight - deltaY);
                newTop = startTop + (startHeight - newHeight);
            }
            
            // Apply new dimensions
            windowElement.style.width = newWidth + 'px';
            windowElement.style.height = newHeight + 'px';
            windowElement.style.left = newLeft + 'px';
            windowElement.style.top = newTop + 'px';
        };
        
        const stopResize = () => {
            if (!isResizing) return;
            
            isResizing = false;
            windowElement.classList.remove('resizing');
            
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            
            ModernOS.emit('window:resized', { windowId: windowData.id });
        };
        
        resizeHandle.addEventListener('mousedown', startResize);
    }
    
    checkSnapZones(x, y, windowElement) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 60; // Account for taskbar
        
        let snapZone = null;
        
        // Left half
        if (x < this.snapThreshold) {
            snapZone = { x: 0, y: 0, width: screenWidth / 2, height: screenHeight };
        }
        // Right half
        else if (x > screenWidth - this.snapThreshold) {
            snapZone = { x: screenWidth / 2, y: 0, width: screenWidth / 2, height: screenHeight };
        }
        // Top (maximize)
        else if (y < this.snapThreshold) {
            snapZone = { x: 0, y: 0, width: screenWidth, height: screenHeight };
        }
        
        if (snapZone) {
            this.showSnapIndicator(snapZone);
        } else {
            this.hideSnapIndicator();
        }
    }
    
    showSnapIndicator(zone) {
        this.snapIndicator.style.left = zone.x + 'px';
        this.snapIndicator.style.top = zone.y + 'px';
        this.snapIndicator.style.width = zone.width + 'px';
        this.snapIndicator.style.height = zone.height + 'px';
        this.snapIndicator.classList.add('show');
    }
    
    hideSnapIndicator() {
        this.snapIndicator.classList.remove('show');
    }
    
    handleSnap(x, y, windowId) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 60;
        const windowData = this.windows.get(windowId);
        const windowElement = windowData.element;
        
        // Left half
        if (x < this.snapThreshold) {
            this.snapWindow(windowId, { x: 0, y: 0, width: screenWidth / 2, height: screenHeight });
        }
        // Right half
        else if (x > screenWidth - this.snapThreshold) {
            this.snapWindow(windowId, { x: screenWidth / 2, y: 0, width: screenWidth / 2, height: screenHeight });
        }
        // Top (maximize)
        else if (y < this.snapThreshold) {
            this.maximizeWindow(windowId);
        }
    }
    
    snapWindow(windowId, bounds) {
        const windowData = this.windows.get(windowId);
        const windowElement = windowData.element;
        
        windowElement.style.left = bounds.x + 'px';
        windowElement.style.top = bounds.y + 'px';
        windowElement.style.width = bounds.width + 'px';
        windowElement.style.height = bounds.height + 'px';
        
        windowData.state = 'snapped';
        ModernOS.emit('window:snapped', { windowId, bounds });
    }
    
    handleWindowControl(windowId, action) {
        switch (action) {
            case 'minimize':
                this.minimizeWindow(windowId);
                break;
            case 'maximize':
                this.toggleMaximize(windowId);
                break;
            case 'close':
                this.closeWindow(windowId);
                break;
        }
    }
    
    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        const windowElement = windowData.element;
        
        windowElement.classList.add('minimized');
        windowData.state = 'minimized';
        
        // Update taskbar
        this.updateTaskbarItem(windowId, false);
        
        ModernOS.emit('window:minimized', { windowId });
    }
    
    maximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        const windowElement = windowData.element;
        
        if (windowData.state !== 'maximized') {
            // Store original dimensions
            windowData.originalBounds = {
                x: parseInt(windowElement.style.left),
                y: parseInt(windowElement.style.top),
                width: parseInt(windowElement.style.width),
                height: parseInt(windowElement.style.height)
            };
            
            windowElement.classList.add('maximized');
            windowData.state = 'maximized';
            
            // Update maximize button icon
            const maximizeBtn = windowElement.querySelector('.maximize i');
            if (maximizeBtn) {
                maximizeBtn.className = 'fas fa-window-restore';
            }
        }
        
        ModernOS.emit('window:maximized', { windowId });
    }
    
    restoreWindow(windowId) {
        const windowData = this.windows.get(windowId);
        const windowElement = windowData.element;
        
        if (windowData.state === 'minimized') {
            windowElement.classList.remove('minimized');
            this.updateTaskbarItem(windowId, true);
        } else if (windowData.state === 'maximized') {
            windowElement.classList.remove('maximized');
            
            // Restore original dimensions
            if (windowData.originalBounds) {
                windowElement.style.left = windowData.originalBounds.x + 'px';
                windowElement.style.top = windowData.originalBounds.y + 'px';
                windowElement.style.width = windowData.originalBounds.width + 'px';
                windowElement.style.height = windowData.originalBounds.height + 'px';
            }
            
            // Update maximize button icon
            const maximizeBtn = windowElement.querySelector('.maximize i');
            if (maximizeBtn) {
                maximizeBtn.className = 'fas fa-square';
            }
        }
        
        windowData.state = 'normal';
        this.focusWindow(windowId);
        
        ModernOS.emit('window:restored', { windowId });
    }
    
    toggleMaximize(windowId) {
        const windowData = this.windows.get(windowId);
        if (windowData.state === 'maximized') {
            this.restoreWindow(windowId);
        } else {
            this.maximizeWindow(windowId);
        }
    }
    
    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        const windowElement = windowData.element;
        
        // Animation
        windowElement.classList.add('closing');
        
        setTimeout(() => {
            // Remove from DOM
            windowElement.remove();
            
            // Remove from windows map
            this.windows.delete(windowId);
            
            // Remove from taskbar
            this.removeFromTaskbar(windowId);
            
            // Focus next window
            if (this.activeWindow === windowId) {
                const remainingWindows = Array.from(this.windows.keys());
                if (remainingWindows.length > 0) {
                    this.focusWindow(remainingWindows[remainingWindows.length - 1]);
                } else {
                    this.activeWindow = null;
                }
            }
            
            ModernOS.emit('window:closed', { windowId });
        }, 300);
    }
    
    focusWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;
        
        const windowElement = windowData.element;
        
        // Remove focus from all windows
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('focused');
        });
        
        // Focus this window
        windowElement.classList.add('focused');
        windowElement.style.zIndex = ++this.zIndexCounter;
        this.activeWindow = windowId;
        
        // Update taskbar
        this.updateTaskbarActive(windowId);
        
        ModernOS.emit('window:focused', { windowId });
    }
    
    addToTaskbar(windowData) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-app';
        taskbarItem.id = `taskbar-${windowData.id}`;
        taskbarItem.innerHTML = `
            <i class="${windowData.icon}"></i>
            <span>${windowData.title}</span>
        `;
        
        taskbarItem.addEventListener('click', () => {
            if (windowData.state === 'minimized' || this.activeWindow !== windowData.id) {
                this.restoreWindow(windowData.id);
            } else {
                this.minimizeWindow(windowData.id);
            }
        });
        
        taskbarApps.appendChild(taskbarItem);
    }
    
    removeFromTaskbar(windowId) {
        const taskbarItem = document.getElementById(`taskbar-${windowId}`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }
    
    updateTaskbarItem(windowId, visible) {
        const taskbarItem = document.getElementById(`taskbar-${windowId}`);
        if (taskbarItem) {
            taskbarItem.style.opacity = visible ? '1' : '0.5';
        }
    }
    
    updateTaskbarActive(windowId) {
        // Remove active class from all taskbar items
        document.querySelectorAll('.taskbar-app').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current window
        const taskbarItem = document.getElementById(`taskbar-${windowId}`);
        if (taskbarItem) {
            taskbarItem.classList.add('active');
        }
    }
    
    getDefaultX() {
        const offset = this.windows.size * 30;
        return Math.min(100 + offset, window.innerWidth - 600);
    }
    
    getDefaultY() {
        const offset = this.windows.size * 30;
        return Math.min(100 + offset, window.innerHeight - 500);
    }
    
    // Public API
    getWindow(windowId) {
        return this.windows.get(windowId);
    }
    
    getAllWindows() {
        return Array.from(this.windows.values());
    }
    
    getActiveWindow() {
        return this.activeWindow ? this.windows.get(this.activeWindow) : null;
    }
    
    updateWindowTitle(windowId, title) {
        const windowData = this.windows.get(windowId);
        if (windowData) {
            const titleElement = windowData.element.querySelector('.window-title span');
            const taskbarItem = document.getElementById(`taskbar-${windowId}`);
            
            if (titleElement) titleElement.textContent = title;
            if (taskbarItem) taskbarItem.querySelector('span').textContent = title;
            
            windowData.title = title;
            ModernOS.emit('window:title-updated', { windowId, title });
        }
    }
    
    updateWindowContent(windowId, content) {
        const windowData = this.windows.get(windowId);
        if (windowData) {
            const contentElement = windowData.element.querySelector('.window-content');
            if (contentElement) {
                contentElement.innerHTML = content;
                ModernOS.emit('window:content-updated', { windowId, content });
            }
        }
    }
}

// Create global window manager instance
window.WindowManager = new WindowManager();