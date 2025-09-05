/**
 * ModernOS - Web Browser Application
 * A simple web browser with navigation and basic features
 */

class WebBrowser {
    constructor() {
        this.windowId = null;
        this.currentUrl = 'about:blank';
        this.history = [];
        this.historyIndex = -1;
        this.bookmarks = [
            { title: 'ModernOS', url: 'about:modernos' },
            { title: 'Google', url: 'https://www.google.com' },
            { title: 'GitHub', url: 'https://github.com' },
            { title: 'Stack Overflow', url: 'https://stackoverflow.com' }
        ];
    }
    
    getContent() {
        return `
            <div class="web-browser">
                <div class="browser-toolbar">
                    <div class="browser-nav">
                        <button class="toolbar-btn" id="back-btn" title="Back" disabled>
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="toolbar-btn" id="forward-btn" title="Forward" disabled>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="toolbar-btn" id="refresh-btn" title="Refresh">
                            <i class="fas fa-sync"></i>
                        </button>
                        <button class="toolbar-btn" id="home-btn" title="Home">
                            <i class="fas fa-home"></i>
                        </button>
                    </div>
                    
                    <div class="browser-address-bar">
                        <div class="address-bar-icon">
                            <i class="fas fa-lock" id="security-icon" title="Secure"></i>
                        </div>
                        <input type="text" id="address-input" placeholder="Enter URL or search..." value="about:blank">
                        <button class="address-bar-btn" id="go-btn">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    
                    <div class="browser-actions">
                        <button class="toolbar-btn" id="bookmark-btn" title="Bookmark this page">
                            <i class="far fa-star"></i>
                        </button>
                        <button class="toolbar-btn" id="menu-btn" title="Menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                
                <div class="browser-bookmarks" id="bookmarks-bar">
                    <div class="bookmark-item" data-url="about:modernos">
                        <i class="fas fa-desktop"></i>
                        <span>ModernOS</span>
                    </div>
                    <div class="bookmark-item" data-url="https://www.google.com">
                        <i class="fab fa-google"></i>
                        <span>Google</span>
                    </div>
                    <div class="bookmark-item" data-url="https://github.com">
                        <i class="fab fa-github"></i>
                        <span>GitHub</span>
                    </div>
                    <div class="bookmark-item" data-url="https://stackoverflow.com">
                        <i class="fab fa-stack-overflow"></i>
                        <span>Stack Overflow</span>
                    </div>
                </div>
                
                <div class="browser-content-container">
                    <iframe class="browser-content" id="browser-frame" src="about:blank"></iframe>
                    
                    <!-- Custom pages -->
                    <div class="browser-page" id="about-blank-page">
                        <div class="start-page">
                            <div class="start-page-header">
                                <h1><i class="fas fa-globe"></i> ModernOS Browser</h1>
                                <p>Your gateway to the web</p>
                            </div>
                            
                            <div class="start-page-content">
                                <div class="quick-links">
                                    <h3>Quick Links</h3>
                                    <div class="quick-links-grid">
                                        <div class="quick-link" data-url="https://www.google.com">
                                            <div class="quick-link-icon">
                                                <i class="fab fa-google"></i>
                                            </div>
                                            <span>Google</span>
                                        </div>
                                        <div class="quick-link" data-url="https://github.com">
                                            <div class="quick-link-icon">
                                                <i class="fab fa-github"></i>
                                            </div>
                                            <span>GitHub</span>
                                        </div>
                                        <div class="quick-link" data-url="https://stackoverflow.com">
                                            <div class="quick-link-icon">
                                                <i class="fab fa-stack-overflow"></i>
                                            </div>
                                            <span>Stack Overflow</span>
                                        </div>
                                        <div class="quick-link" data-url="https://developer.mozilla.org">
                                            <div class="quick-link-icon">
                                                <i class="fab fa-firefox"></i>
                                            </div>
                                            <span>MDN</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="search-section">
                                    <h3>Search the Web</h3>
                                    <div class="search-box">
                                        <input type="text" id="search-input" placeholder="Search Google or type a URL">
                                        <button id="search-btn">
                                            <i class="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="browser-page" id="about-modernos-page" style="display: none;">
                        <div class="about-page">
                            <div class="about-header">
                                <h1><i class="fas fa-desktop"></i> About ModernOS</h1>
                                <p>A modern web-based desktop environment</p>
                            </div>
                            
                            <div class="about-content">
                                <section>
                                    <h2>Welcome to ModernOS</h2>
                                    <p>ModernOS is a complete desktop environment that runs entirely in your web browser. It provides a familiar desktop experience with modern web technologies.</p>
                                </section>
                                
                                <section>
                                    <h2>Features</h2>
                                    <ul>
                                        <li>Complete window management system with drag, resize, and snap</li>
                                        <li>File manager with folder navigation and file operations</li>
                                        <li>Text editor with syntax highlighting and find/replace</li>
                                        <li>Scientific calculator with history and memory functions</li>
                                        <li>Web browser with bookmarks and navigation</li>
                                        <li>Terminal emulator with basic commands</li>
                                        <li>Settings panel for customization</li>
                                        <li>Responsive design that works on all devices</li>
                                    </ul>
                                </section>
                                
                                <section>
                                    <h2>Technology</h2>
                                    <p>Built with modern web technologies:</p>
                                    <ul>
                                        <li>HTML5 for structure and semantics</li>
                                        <li>CSS3 with custom properties and modern layouts</li>
                                        <li>Vanilla JavaScript ES6+ for functionality</li>
                                        <li>Font Awesome for icons</li>
                                        <li>Google Fonts for typography</li>
                                    </ul>
                                </section>
                                
                                <section>
                                    <h2>Getting Started</h2>
                                    <p>To get started with ModernOS:</p>
                                    <ol>
                                        <li>Click on desktop icons to launch applications</li>
                                        <li>Use the start menu to access all applications</li>
                                        <li>Right-click on the desktop for context options</li>
                                        <li>Customize your experience in Settings</li>
                                        <li>Use keyboard shortcuts for quick access</li>
                                    </ol>
                                </section>
                            </div>
                        </div>
                    </div>
                    
                    <div class="loading-indicator" id="loading-indicator" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
                
                <div class="browser-status" id="browser-status">
                    <span id="status-text">Ready</span>
                    <div class="status-right">
                        <span id="zoom-level">100%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    init(windowId) {
        this.windowId = windowId;
        this.setupEventListeners();
        this.showPage('about:blank');
    }
    
    setupEventListeners() {
        const windowElement = document.getElementById(this.windowId);
        
        // Navigation buttons
        windowElement.querySelector('#back-btn').addEventListener('click', () => this.goBack());
        windowElement.querySelector('#forward-btn').addEventListener('click', () => this.goForward());
        windowElement.querySelector('#refresh-btn').addEventListener('click', () => this.refresh());
        windowElement.querySelector('#home-btn').addEventListener('click', () => this.goHome());
        
        // Address bar
        const addressInput = windowElement.querySelector('#address-input');
        const goBtn = windowElement.querySelector('#go-btn');
        
        addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.navigate(addressInput.value);
            }
        });
        
        goBtn.addEventListener('click', () => {
            this.navigate(addressInput.value);
        });
        
        // Bookmark button
        windowElement.querySelector('#bookmark-btn').addEventListener('click', () => {
            this.toggleBookmark();
        });
        
        // Bookmarks bar
        const bookmarkItems = windowElement.querySelectorAll('.bookmark-item');
        bookmarkItems.forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                this.navigate(url);
            });
        });
        
        // Quick links
        const quickLinks = windowElement.querySelectorAll('.quick-link');
        quickLinks.forEach(link => {
            link.addEventListener('click', () => {
                const url = link.dataset.url;
                this.navigate(url);
            });
        });
        
        // Search functionality
        const searchInput = windowElement.querySelector('#search-input');
        const searchBtn = windowElement.querySelector('#search-btn');
        
        if (searchInput && searchBtn) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.search(searchInput.value);
                }
            });
            
            searchBtn.addEventListener('click', () => {
                this.search(searchInput.value);
            });
        }
        
        // Menu button
        windowElement.querySelector('#menu-btn').addEventListener('click', () => {
            this.showMenu();
        });
    }
    
    navigate(url) {
        if (!url || url.trim() === '') return;
        
        // Clean up the URL
        url = url.trim();
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
            if (url.includes('.') && !url.includes(' ')) {
                url = 'https://' + url;
            } else {
                // Treat as search query
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }
        
        this.currentUrl = url;
        this.addToHistory(url);
        this.updateAddressBar();
        this.updateNavigationButtons();
        this.updateBookmarkButton();
        this.showPage(url);
        
        // Update window title
        WindowManager.updateWindowTitle(this.windowId, `Web Browser - ${this.getPageTitle(url)}`);
    }
    
    showPage(url) {
        const windowElement = document.getElementById(this.windowId);
        const iframe = windowElement.querySelector('#browser-frame');
        const pages = windowElement.querySelectorAll('.browser-page');
        const loadingIndicator = windowElement.querySelector('#loading-indicator');
        
        // Hide all custom pages
        pages.forEach(page => {
            page.style.display = 'none';
        });
        
        if (url === 'about:blank') {
            iframe.style.display = 'none';
            windowElement.querySelector('#about-blank-page').style.display = 'block';
            this.updateStatus('Ready');
        } else if (url === 'about:modernos') {
            iframe.style.display = 'none';
            windowElement.querySelector('#about-modernos-page').style.display = 'block';
            this.updateStatus('About ModernOS');
        } else {
            // Show loading indicator
            loadingIndicator.style.display = 'flex';
            iframe.style.display = 'none';
            
            // Load external URL in iframe
            iframe.onload = () => {
                loadingIndicator.style.display = 'none';
                iframe.style.display = 'block';
                this.updateStatus('Page loaded');
            };
            
            iframe.onerror = () => {
                loadingIndicator.style.display = 'none';
                this.updateStatus('Failed to load page');
                ModernOS.showNotification('Web Browser', 'Failed to load page. Some sites may not allow embedding.');
            };
            
            iframe.src = url;
            this.updateStatus('Loading...');
        }
    }
    
    search(query) {
        if (!query || query.trim() === '') return;
        
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        this.navigate(searchUrl);
    }
    
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const url = this.history[this.historyIndex];
            this.currentUrl = url;
            this.updateAddressBar();
            this.updateNavigationButtons();
            this.showPage(url);
        }
    }
    
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const url = this.history[this.historyIndex];
            this.currentUrl = url;
            this.updateAddressBar();
            this.updateNavigationButtons();
            this.showPage(url);
        }
    }
    
    refresh() {
        this.showPage(this.currentUrl);
        this.updateStatus('Refreshing...');
    }
    
    goHome() {
        this.navigate('about:blank');
    }
    
    addToHistory(url) {
        // Remove any forward history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // Add new URL to history
        this.history.push(url);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 100) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    updateAddressBar() {
        const windowElement = document.getElementById(this.windowId);
        const addressInput = windowElement.querySelector('#address-input');
        addressInput.value = this.currentUrl;
        
        // Update security icon
        const securityIcon = windowElement.querySelector('#security-icon');
        if (this.currentUrl.startsWith('https://')) {
            securityIcon.className = 'fas fa-lock';
            securityIcon.title = 'Secure (HTTPS)';
        } else if (this.currentUrl.startsWith('http://')) {
            securityIcon.className = 'fas fa-exclamation-triangle';
            securityIcon.title = 'Not secure (HTTP)';
        } else {
            securityIcon.className = 'fas fa-info-circle';
            securityIcon.title = 'Internal page';
        }
    }
    
    updateNavigationButtons() {
        const windowElement = document.getElementById(this.windowId);
        const backBtn = windowElement.querySelector('#back-btn');
        const forwardBtn = windowElement.querySelector('#forward-btn');
        
        backBtn.disabled = this.historyIndex <= 0;
        forwardBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    updateBookmarkButton() {
        const windowElement = document.getElementById(this.windowId);
        const bookmarkBtn = windowElement.querySelector('#bookmark-btn');
        const icon = bookmarkBtn.querySelector('i');
        
        const isBookmarked = this.bookmarks.some(bookmark => bookmark.url === this.currentUrl);
        
        if (isBookmarked) {
            icon.className = 'fas fa-star';
            bookmarkBtn.title = 'Remove from bookmarks';
        } else {
            icon.className = 'far fa-star';
            bookmarkBtn.title = 'Add to bookmarks';
        }
    }
    
    toggleBookmark() {
        const title = this.getPageTitle(this.currentUrl);
        const existingIndex = this.bookmarks.findIndex(bookmark => bookmark.url === this.currentUrl);
        
        if (existingIndex !== -1) {
            // Remove bookmark
            this.bookmarks.splice(existingIndex, 1);
            ModernOS.showNotification('Web Browser', 'Bookmark removed');
        } else {
            // Add bookmark
            this.bookmarks.push({
                title: title,
                url: this.currentUrl
            });
            ModernOS.showNotification('Web Browser', 'Bookmark added');
        }
        
        this.updateBookmarkButton();
        this.saveBookmarks();
    }
    
    getPageTitle(url) {
        if (url === 'about:blank') return 'New Tab';
        if (url === 'about:modernos') return 'About ModernOS';
        
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return url;
        }
    }
    
    updateStatus(text) {
        const windowElement = document.getElementById(this.windowId);
        const statusText = windowElement.querySelector('#status-text');
        if (statusText) {
            statusText.textContent = text;
        }
    }
    
    showMenu() {
        const menuItems = [
            { label: 'New Tab', action: () => Desktop.launchApplication('web-browser') },
            { label: 'Bookmarks', action: () => this.showBookmarks() },
            { label: 'History', action: () => this.showHistory() },
            { label: 'Settings', action: () => Desktop.launchApplication('settings') },
            { label: 'About', action: () => this.navigate('about:modernos') }
        ];
        
        // In a real implementation, this would show a context menu
        ModernOS.showNotification('Web Browser', 'Menu opened');
    }
    
    showBookmarks() {
        let bookmarksList = this.bookmarks.map(bookmark => 
            `• ${bookmark.title} (${bookmark.url})`
        ).join('\n');
        
        if (bookmarksList === '') {
            bookmarksList = 'No bookmarks saved';
        }
        
        ModernOS.showNotification('Bookmarks', bookmarksList);
    }
    
    showHistory() {
        let historyList = this.history.slice(-10).map(url => 
            `• ${this.getPageTitle(url)}`
        ).join('\n');
        
        if (historyList === '') {
            historyList = 'No history available';
        }
        
        ModernOS.showNotification('History', 'Recent pages:\n' + historyList);
    }
    
    saveBookmarks() {
        try {
            localStorage.setItem('modernos-browser-bookmarks', JSON.stringify(this.bookmarks));
        } catch (error) {
            console.warn('Failed to save bookmarks:', error);
        }
    }
    
    loadBookmarks() {
        try {
            const saved = localStorage.getItem('modernos-browser-bookmarks');
            if (saved) {
                this.bookmarks = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load bookmarks:', error);
        }
    }
}

// Create global web browser instance
window.WebBrowser = new WebBrowser();