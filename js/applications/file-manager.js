/**
 * ModernOS - File Manager Application
 * A modern file browser with folder navigation and file operations
 */

class FileManager {
    constructor() {
        this.currentPath = '/';
        this.fileSystem = this.createMockFileSystem();
        this.selectedFiles = new Set();
        this.viewMode = 'grid'; // grid or list
        this.sortBy = 'name'; // name, size, date, type
        this.sortOrder = 'asc'; // asc or desc
        this.windowId = null;
    }
    
    createMockFileSystem() {
        // Create a mock file system for demonstration
        return {
            '/': {
                type: 'folder',
                name: 'Root',
                children: {
                    'Documents': {
                        type: 'folder',
                        name: 'Documents',
                        size: 0,
                        modified: new Date('2024-01-15'),
                        children: {
                            'readme.txt': {
                                type: 'file',
                                name: 'readme.txt',
                                size: 1024,
                                modified: new Date('2024-01-15'),
                                content: 'Welcome to ModernOS File Manager!\n\nThis is a demonstration file system.'
                            },
                            'Projects': {
                                type: 'folder',
                                name: 'Projects',
                                size: 0,
                                modified: new Date('2024-01-10'),
                                children: {
                                    'project1.txt': {
                                        type: 'file',
                                        name: 'project1.txt',
                                        size: 2048,
                                        modified: new Date('2024-01-10'),
                                        content: 'Project 1 notes and documentation.'
                                    }
                                }
                            }
                        }
                    },
                    'Pictures': {
                        type: 'folder',
                        name: 'Pictures',
                        size: 0,
                        modified: new Date('2024-01-12'),
                        children: {
                            'wallpaper.jpg': {
                                type: 'file',
                                name: 'wallpaper.jpg',
                                size: 512000,
                                modified: new Date('2024-01-12'),
                                content: 'Binary image data...'
                            },
                            'screenshot.png': {
                                type: 'file',
                                name: 'screenshot.png',
                                size: 256000,
                                modified: new Date('2024-01-11'),
                                content: 'Binary image data...'
                            }
                        }
                    },
                    'Downloads': {
                        type: 'folder',
                        name: 'Downloads',
                        size: 0,
                        modified: new Date('2024-01-14'),
                        children: {
                            'installer.exe': {
                                type: 'file',
                                name: 'installer.exe',
                                size: 10485760,
                                modified: new Date('2024-01-14'),
                                content: 'Binary executable data...'
                            }
                        }
                    },
                    'Music': {
                        type: 'folder',
                        name: 'Music',
                        size: 0,
                        modified: new Date('2024-01-13'),
                        children: {
                            'song1.mp3': {
                                type: 'file',
                                name: 'song1.mp3',
                                size: 4194304,
                                modified: new Date('2024-01-13'),
                                content: 'Binary audio data...'
                            }
                        }
                    }
                }
            }
        };
    }
    
    getContent() {
        return `
            <div class="file-manager">
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-title">Quick Access</div>
                        <div class="sidebar-item active" data-path="/">
                            <i class="fas fa-home"></i>
                            <span>Home</span>
                        </div>
                        <div class="sidebar-item" data-path="/Documents">
                            <i class="fas fa-file-alt"></i>
                            <span>Documents</span>
                        </div>
                        <div class="sidebar-item" data-path="/Pictures">
                            <i class="fas fa-images"></i>
                            <span>Pictures</span>
                        </div>
                        <div class="sidebar-item" data-path="/Downloads">
                            <i class="fas fa-download"></i>
                            <span>Downloads</span>
                        </div>
                        <div class="sidebar-item" data-path="/Music">
                            <i class="fas fa-music"></i>
                            <span>Music</span>
                        </div>
                    </div>
                </div>
                
                <div class="file-manager-main">
                    <div class="file-manager-toolbar">
                        <div class="toolbar-left">
                            <button class="toolbar-btn" id="back-btn" title="Back" disabled>
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <button class="toolbar-btn" id="forward-btn" title="Forward" disabled>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="toolbar-btn" id="up-btn" title="Up">
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <button class="toolbar-btn" id="refresh-btn" title="Refresh">
                                <i class="fas fa-sync"></i>
                            </button>
                        </div>
                        
                        <div class="path-bar" id="path-bar">
                            <div class="path-item" data-path="/">
                                <i class="fas fa-home"></i>
                            </div>
                        </div>
                        
                        <div class="toolbar-right">
                            <button class="toolbar-btn" id="view-grid" title="Grid View">
                                <i class="fas fa-th"></i>
                            </button>
                            <button class="toolbar-btn" id="view-list" title="List View">
                                <i class="fas fa-list"></i>
                            </button>
                            <button class="toolbar-btn" id="new-folder" title="New Folder">
                                <i class="fas fa-folder-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="file-grid" id="file-grid">
                        <!-- Files will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }
    
    init(windowId) {
        this.windowId = windowId;
        this.setupEventListeners();
        this.loadDirectory('/');
    }
    
    setupEventListeners() {
        const windowElement = document.getElementById(this.windowId);
        
        // Sidebar navigation
        const sidebarItems = windowElement.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const path = item.dataset.path;
                this.navigateTo(path);
                this.updateSidebarActive(item);
            });
        });
        
        // Toolbar buttons
        const backBtn = windowElement.querySelector('#back-btn');
        const forwardBtn = windowElement.querySelector('#forward-btn');
        const upBtn = windowElement.querySelector('#up-btn');
        const refreshBtn = windowElement.querySelector('#refresh-btn');
        const viewGridBtn = windowElement.querySelector('#view-grid');
        const viewListBtn = windowElement.querySelector('#view-list');
        const newFolderBtn = windowElement.querySelector('#new-folder');
        
        backBtn.addEventListener('click', () => this.goBack());
        forwardBtn.addEventListener('click', () => this.goForward());
        upBtn.addEventListener('click', () => this.goUp());
        refreshBtn.addEventListener('click', () => this.refresh());
        viewGridBtn.addEventListener('click', () => this.setViewMode('grid'));
        viewListBtn.addEventListener('click', () => this.setViewMode('list'));
        newFolderBtn.addEventListener('click', () => this.createNewFolder());
        
        // Path bar navigation
        const pathBar = windowElement.querySelector('#path-bar');
        pathBar.addEventListener('click', (e) => {
            const pathItem = e.target.closest('.path-item');
            if (pathItem) {
                const path = pathItem.dataset.path;
                this.navigateTo(path);
            }
        });
    }
    
    navigateTo(path) {
        this.currentPath = path;
        this.loadDirectory(path);
        this.updatePathBar();
        this.updateToolbarState();
    }
    
    loadDirectory(path) {
        const directory = this.getDirectoryContents(path);
        const fileGrid = document.getElementById(this.windowId).querySelector('#file-grid');
        
        if (!directory) {
            fileGrid.innerHTML = '<div class="error">Directory not found</div>';
            return;
        }
        
        const files = Object.values(directory.children || {});
        const sortedFiles = this.sortFiles(files);
        
        fileGrid.innerHTML = '';
        
        sortedFiles.forEach(file => {
            const fileItem = this.createFileItem(file);
            fileGrid.appendChild(fileItem);
        });
        
        // Setup file item event listeners
        this.setupFileItemListeners();
    }
    
    createFileItem(file) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.dataset.name = file.name;
        item.dataset.type = file.type;
        
        const icon = this.getFileIcon(file);
        const size = file.type === 'folder' ? '' : ModernOS.formatFileSize(file.size);
        const modified = file.modified ? file.modified.toLocaleDateString() : '';
        
        item.innerHTML = `
            <div class="file-icon">
                <i class="${icon}"></i>
            </div>
            <div class="file-name">${file.name}</div>
            ${size ? `<div class="file-size">${size}</div>` : ''}
            ${modified ? `<div class="file-date">${modified}</div>` : ''}
        `;
        
        return item;
    }
    
    setupFileItemListeners() {
        const windowElement = document.getElementById(this.windowId);
        const fileItems = windowElement.querySelectorAll('.file-item');
        
        fileItems.forEach(item => {
            // Single click to select
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectFile(item);
            });
            
            // Double click to open
            item.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.openFile(item);
            });
            
            // Right click for context menu
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showFileContextMenu(e.clientX, e.clientY, item);
            });
        });
        
        // Click on empty space to deselect
        const fileGrid = windowElement.querySelector('#file-grid');
        fileGrid.addEventListener('click', (e) => {
            if (e.target === fileGrid) {
                this.deselectAllFiles();
            }
        });
    }
    
    selectFile(item) {
        // Clear previous selection if not holding Ctrl
        if (!event.ctrlKey && !event.metaKey) {
            this.deselectAllFiles();
        }
        
        item.classList.toggle('selected');
        
        if (item.classList.contains('selected')) {
            this.selectedFiles.add(item.dataset.name);
        } else {
            this.selectedFiles.delete(item.dataset.name);
        }
    }
    
    deselectAllFiles() {
        const windowElement = document.getElementById(this.windowId);
        const selectedItems = windowElement.querySelectorAll('.file-item.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
        });
        this.selectedFiles.clear();
    }
    
    openFile(item) {
        const fileName = item.dataset.name;
        const fileType = item.dataset.type;
        const filePath = this.currentPath + (this.currentPath.endsWith('/') ? '' : '/') + fileName;
        
        if (fileType === 'folder') {
            this.navigateTo(filePath);
        } else {
            this.openFileInApplication(fileName, filePath);
        }
    }
    
    openFileInApplication(fileName, filePath) {
        const file = this.getFileAtPath(filePath);
        if (!file) return;
        
        const extension = fileName.split('.').pop().toLowerCase();
        
        // Determine which application to use
        let appName = 'text-editor'; // default
        
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            ModernOS.showNotification('File Manager', 'Image viewer not available');
            return;
        } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
            ModernOS.showNotification('File Manager', 'Audio player not available');
            return;
        } else if (['mp4', 'avi', 'mov'].includes(extension)) {
            ModernOS.showNotification('File Manager', 'Video player not available');
            return;
        } else if (['exe', 'msi'].includes(extension)) {
            ModernOS.showNotification('File Manager', 'Cannot execute files in web environment');
            return;
        }
        
        // Open in text editor
        Desktop.launchApplication(appName);
        
        // Wait a moment for the application to load, then set content
        setTimeout(() => {
            const textEditorWindow = Array.from(WindowManager.windows.values())
                .find(w => w.title === 'Text Editor');
            
            if (textEditorWindow && window.TextEditor) {
                window.TextEditor.loadFile(fileName, file.content);
            }
        }, 500);
    }
    
    getFileIcon(file) {
        if (file.type === 'folder') {
            return 'fas fa-folder';
        }
        
        const extension = file.name.split('.').pop().toLowerCase();
        const iconMap = {
            'txt': 'fas fa-file-alt',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'pdf': 'fas fa-file-pdf',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'png': 'fas fa-file-image',
            'gif': 'fas fa-file-image',
            'mp3': 'fas fa-file-audio',
            'wav': 'fas fa-file-audio',
            'mp4': 'fas fa-file-video',
            'avi': 'fas fa-file-video',
            'zip': 'fas fa-file-archive',
            'rar': 'fas fa-file-archive',
            'exe': 'fas fa-file-code',
            'js': 'fas fa-file-code',
            'html': 'fas fa-file-code',
            'css': 'fas fa-file-code',
            'json': 'fas fa-file-code'
        };
        
        return iconMap[extension] || 'fas fa-file';
    }
    
    getDirectoryContents(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        
        return current;
    }
    
    getFileAtPath(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        
        return current;
    }
    
    sortFiles(files) {
        return files.sort((a, b) => {
            // Folders first
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            
            let comparison = 0;
            
            switch (this.sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'size':
                    comparison = (a.size || 0) - (b.size || 0);
                    break;
                case 'date':
                    comparison = (a.modified || new Date(0)) - (b.modified || new Date(0));
                    break;
                case 'type':
                    const extA = a.name.split('.').pop() || '';
                    const extB = b.name.split('.').pop() || '';
                    comparison = extA.localeCompare(extB);
                    break;
            }
            
            return this.sortOrder === 'asc' ? comparison : -comparison;
        });
    }
    
    updatePathBar() {
        const windowElement = document.getElementById(this.windowId);
        const pathBar = windowElement.querySelector('#path-bar');
        const parts = this.currentPath.split('/').filter(p => p);
        
        pathBar.innerHTML = `
            <div class="path-item" data-path="/">
                <i class="fas fa-home"></i>
            </div>
        `;
        
        let currentPath = '';
        parts.forEach((part, index) => {
            currentPath += '/' + part;
            pathBar.innerHTML += `
                <span class="path-separator">/</span>
                <div class="path-item" data-path="${currentPath}">${part}</div>
            `;
        });
    }
    
    updateSidebarActive(activeItem) {
        const windowElement = document.getElementById(this.windowId);
        const sidebarItems = windowElement.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
    
    updateToolbarState() {
        const windowElement = document.getElementById(this.windowId);
        const upBtn = windowElement.querySelector('#up-btn');
        
        // Enable/disable up button
        upBtn.disabled = this.currentPath === '/';
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
        const windowElement = document.getElementById(this.windowId);
        const fileGrid = windowElement.querySelector('#file-grid');
        const viewGridBtn = windowElement.querySelector('#view-grid');
        const viewListBtn = windowElement.querySelector('#view-list');
        
        if (mode === 'grid') {
            fileGrid.className = 'file-grid';
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
        } else {
            fileGrid.className = 'file-list';
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
        }
    }
    
    goBack() {
        // Navigation history would be implemented here
        ModernOS.showNotification('File Manager', 'Back navigation not implemented');
    }
    
    goForward() {
        // Navigation history would be implemented here
        ModernOS.showNotification('File Manager', 'Forward navigation not implemented');
    }
    
    goUp() {
        if (this.currentPath === '/') return;
        
        const parentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/')) || '/';
        this.navigateTo(parentPath);
    }
    
    refresh() {
        this.loadDirectory(this.currentPath);
        ModernOS.showNotification('File Manager', 'Directory refreshed');
    }
    
    createNewFolder() {
        const folderName = prompt('Enter folder name:', 'New Folder');
        if (folderName) {
            ModernOS.showNotification('File Manager', `Created folder: ${folderName}`);
            // In a real implementation, this would create the folder
        }
    }
    
    showFileContextMenu(x, y, item) {
        const fileName = item.dataset.name;
        const fileType = item.dataset.type;
        
        // Create context menu for file operations
        ModernOS.showNotification('File Manager', `Context menu for ${fileName}`);
        // In a real implementation, this would show a context menu with file operations
    }
}

// Create global file manager instance
window.FileManager = new FileManager();