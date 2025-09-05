// ModernOS Applications - Advanced Features

// Initialize data structures
ModernOS.prototype.initializeFileSystem = function() {
    return {
        currentPath: '/',
        files: {
            '/': {
                type: 'folder',
                name: 'Root',
                children: ['/Documents', '/Pictures', '/Music', '/Videos', '/Downloads']
            },
            '/Documents': {
                type: 'folder',
                name: 'Documents',
                children: ['/Documents/sample.txt', '/Documents/readme.md', '/Documents/project.docx']
            },
            '/Pictures': {
                type: 'folder',
                name: 'Pictures',
                children: ['/Pictures/photo1.jpg', '/Pictures/photo2.png', '/Pictures/photo3.gif']
            },
            '/Music': {
                type: 'folder',
                name: 'Music',
                children: ['/Music/song1.mp3', '/Music/song2.wav', '/Music/playlist.m3u']
            },
            '/Videos': {
                type: 'folder',
                name: 'Videos',
                children: ['/Videos/video1.mp4', '/Videos/video2.avi', '/Videos/movie.mkv']
            },
            '/Downloads': {
                type: 'folder',
                name: 'Downloads',
                children: []
            },
            '/Documents/sample.txt': {
                type: 'file',
                name: 'sample.txt',
                size: '1.2 KB',
                modified: '2024-01-15 10:30:00',
                content: 'This is a sample text file.\n\nIt contains some example content for demonstration purposes.'
            },
            '/Documents/readme.md': {
                type: 'file',
                name: 'readme.md',
                size: '2.1 KB',
                modified: '2024-01-14 15:45:00',
                content: '# ModernOS\n\nA modern web-based desktop environment.\n\n## Features\n- File management\n- Text editing\n- Calculator\n- And more!'
            },
            '/Pictures/photo1.jpg': {
                type: 'file',
                name: 'photo1.jpg',
                size: '2.5 MB',
                modified: '2024-01-13 09:15:00',
                url: 'https://picsum.photos/800/600?random=1'
            },
            '/Pictures/photo2.png': {
                type: 'file',
                name: 'photo2.png',
                size: '1.8 MB',
                modified: '2024-01-12 14:20:00',
                url: 'https://picsum.photos/800/600?random=2'
            },
            '/Music/song1.mp3': {
                type: 'file',
                name: 'song1.mp3',
                size: '4.2 MB',
                modified: '2024-01-11 16:30:00',
                duration: '3:45'
            }
        }
    };
};

ModernOS.prototype.initializeNotes = function() {
    return [
        {
            id: 1,
            title: 'Welcome to ModernOS',
            content: 'Welcome to ModernOS! This is your first note. You can create, edit, and organize your notes here.\n\nFeatures:\n- Rich text editing\n- Search functionality\n- Organization tools\n- Auto-save',
            created: '2024-01-15 10:00:00',
            modified: '2024-01-15 10:00:00'
        },
        {
            id: 2,
            title: 'Meeting Notes',
            content: 'Project Planning Meeting\n\nAttendees: John, Sarah, Mike\n\nAgenda:\n1. Review project requirements\n2. Discuss timeline\n3. Assign tasks\n\nAction Items:\n- John: Create wireframes\n- Sarah: Set up development environment\n- Mike: Research third-party APIs',
            created: '2024-01-14 14:30:00',
            modified: '2024-01-14 14:30:00'
        },
        {
            id: 3,
            title: 'Ideas for New Features',
            content: 'Ideas for ModernOS v2.0:\n\n1. Plugin system\n2. Cloud synchronization\n3. Multi-user support\n4. Advanced theming\n5. Mobile app\n6. Voice commands\n7. AI assistant integration\n8. Real-time collaboration',
            created: '2024-01-13 09:15:00',
            modified: '2024-01-13 09:15:00'
        }
    ];
};

ModernOS.prototype.initializeCalendar = function() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return {
        currentMonth: currentMonth,
        currentYear: currentYear,
        events: [
            {
                id: 1,
                title: 'Team Meeting',
                date: new Date(currentYear, currentMonth, 15),
                time: '10:00 AM',
                duration: 60,
                type: 'meeting'
            },
            {
                id: 2,
                title: 'Project Deadline',
                date: new Date(currentYear, currentMonth, 20),
                time: '5:00 PM',
                duration: 0,
                type: 'deadline'
            },
            {
                id: 3,
                title: 'Lunch with Client',
                date: new Date(currentYear, currentMonth, 18),
                time: '12:00 PM',
                duration: 90,
                type: 'appointment'
            }
        ]
    };
};

ModernOS.prototype.initializeSystemStats = function() {
    return {
        cpu: 25,
        memory: 60,
        disk: 45,
        network: 12,
        processes: [
            { id: 1, name: 'ModernOS Desktop', cpu: 5, memory: 120, status: 'running' },
            { id: 2, name: 'File Manager', cpu: 2, memory: 45, status: 'running' },
            { id: 3, name: 'Text Editor', cpu: 1, memory: 30, status: 'running' },
            { id: 4, name: 'Web Browser', cpu: 8, memory: 200, status: 'running' },
            { id: 5, name: 'System Monitor', cpu: 1, memory: 25, status: 'running' }
        ]
    };
};

// Login System
ModernOS.prototype.showLoginModal = function() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'flex';
};

ModernOS.prototype.hideLoginModal = function() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'none';
};

ModernOS.prototype.login = function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin') {
        this.isLoggedIn = true;
        this.currentUser = { username: 'admin', name: 'Administrator' };
        this.hideLoginModal();
        this.showNotification('success', 'Login Successful', 'Welcome back, ' + this.currentUser.name + '!');
        this.updateSystemTray();
    } else {
        this.showNotification('error', 'Login Failed', 'Invalid username or password');
    }
};

// Notification System
ModernOS.prototype.setupNotificationSystem = function() {
    const notificationBell = document.getElementById('notification-bell');
    notificationBell.addEventListener('click', () => {
        this.toggleNotificationPanel();
    });
};

ModernOS.prototype.showNotification = function(type, title, message) {
    const notification = {
        id: ++this.notificationCounter,
        type: type,
        title: title,
        message: message,
        time: new Date(),
        read: false
    };
    
    this.notifications.unshift(notification);
    this.updateNotificationBadge();
    this.renderNotifications();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        this.removeNotification(notification.id);
    }, 5000);
};

ModernOS.prototype.toggleNotificationPanel = function() {
    const panel = document.getElementById('notification-panel');
    panel.classList.toggle('show');
};

ModernOS.prototype.renderNotifications = function() {
    const list = document.getElementById('notification-list');
    list.innerHTML = '';
    
    this.notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'notification-item';
        item.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${this.formatTime(notification.time)}</div>
            </div>
        `;
        list.appendChild(item);
    });
};

ModernOS.prototype.getNotificationIcon = function(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'info-circle';
};

ModernOS.prototype.updateNotificationBadge = function() {
    const badge = document.getElementById('notification-count');
    const unreadCount = this.notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
};

ModernOS.prototype.removeNotification = function(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.updateNotificationBadge();
    this.renderNotifications();
};

ModernOS.prototype.clearAllNotifications = function() {
    this.notifications = [];
    this.updateNotificationBadge();
    this.renderNotifications();
};

// System Tray
ModernOS.prototype.setupSystemTray = function() {
    this.updateSystemTray();
};

ModernOS.prototype.updateSystemTray = function() {
    const wifiStatus = document.getElementById('wifi-status');
    const volumeControl = document.getElementById('volume-control');
    const batteryStatus = document.getElementById('battery-status');
    
    // Update WiFi status
    wifiStatus.innerHTML = '<i class="fas fa-wifi"></i>';
    
    // Update volume
    volumeControl.innerHTML = '<i class="fas fa-volume-up"></i>';
    
    // Update battery
    batteryStatus.innerHTML = '<i class="fas fa-battery-full"></i>';
};

// Snap Zones for Advanced Window Management
ModernOS.prototype.setupSnapZones = function() {
    // Snap zones will be created dynamically when dragging windows
};

ModernOS.prototype.createSnapZones = function() {
    this.removeSnapZones();
    
    const zones = [
        { class: 'left', left: 0, top: 0, width: '50%', height: '100%' },
        { class: 'right', right: 0, top: 0, width: '50%', height: '100%' },
        { class: 'top', left: 0, top: 0, width: '100%', height: '50%' },
        { class: 'bottom', left: 0, bottom: 0, width: '100%', height: '50%' }
    ];
    
    zones.forEach(zone => {
        const snapZone = document.createElement('div');
        snapZone.className = `snap-zone ${zone.class}`;
        snapZone.style.position = 'fixed';
        snapZone.style.zIndex = '50';
        snapZone.style.pointerEvents = 'none';
        document.body.appendChild(snapZone);
        this.snapZones.push(snapZone);
    });
};

ModernOS.prototype.removeSnapZones = function() {
    this.snapZones.forEach(zone => zone.remove());
    this.snapZones = [];
};

// System Monitoring
ModernOS.prototype.startSystemMonitoring = function() {
    setInterval(() => {
        this.updateSystemStats();
    }, 2000);
};

ModernOS.prototype.updateSystemStats = function() {
    // Simulate changing system stats
    this.systemStats.cpu = Math.max(10, Math.min(90, this.systemStats.cpu + (Math.random() - 0.5) * 10));
    this.systemStats.memory = Math.max(20, Math.min(95, this.systemStats.memory + (Math.random() - 0.5) * 5));
    this.systemStats.disk = Math.max(10, Math.min(80, this.systemStats.disk + (Math.random() - 0.5) * 2));
    this.systemStats.network = Math.max(0, Math.min(100, this.systemStats.network + (Math.random() - 0.5) * 20));
};

// Utility Functions
ModernOS.prototype.formatTime = function(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
};

ModernOS.prototype.formatDate = function(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Enhanced App Content Methods
ModernOS.prototype.getAppTitle = function(appName) {
    const titles = {
        'file-manager': 'File Manager',
        'text-editor': 'Text Editor',
        'calculator': 'Calculator',
        'browser': 'Web Browser',
        'image-viewer': 'Image Viewer',
        'media-player': 'Media Player',
        'terminal': 'Terminal',
        'task-manager': 'Task Manager',
        'calendar': 'Calendar',
        'notes': 'Notes',
        'settings': 'Settings'
    };
    return titles[appName] || appName;
};

ModernOS.prototype.getAppIcon = function(appName) {
    const icons = {
        'file-manager': 'fas fa-folder',
        'text-editor': 'fas fa-file-alt',
        'calculator': 'fas fa-calculator',
        'browser': 'fas fa-globe',
        'image-viewer': 'fas fa-image',
        'media-player': 'fas fa-play-circle',
        'terminal': 'fas fa-terminal',
        'task-manager': 'fas fa-tasks',
        'calendar': 'fas fa-calendar',
        'notes': 'fas fa-sticky-note',
        'settings': 'fas fa-cog'
    };
    return icons[appName] || 'fas fa-window-maximize';
};