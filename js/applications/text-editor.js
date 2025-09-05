/**
 * ModernOS - Text Editor Application
 * A modern text editor with syntax highlighting and file operations
 */

class TextEditor {
    constructor() {
        this.currentFile = null;
        this.content = '';
        this.isModified = false;
        this.windowId = null;
        this.lineNumbers = true;
        this.wordWrap = true;
        this.fontSize = 14;
        this.theme = 'light';
    }
    
    getContent() {
        return `
            <div class="text-editor">
                <div class="editor-toolbar">
                    <div class="toolbar-group">
                        <button class="btn btn-sm" id="new-file" title="New File">
                            <i class="fas fa-file"></i>
                            New
                        </button>
                        <button class="btn btn-sm" id="open-file" title="Open File">
                            <i class="fas fa-folder-open"></i>
                            Open
                        </button>
                        <button class="btn btn-sm" id="save-file" title="Save File">
                            <i class="fas fa-save"></i>
                            Save
                        </button>
                        <button class="btn btn-sm" id="save-as-file" title="Save As">
                            <i class="fas fa-save"></i>
                            Save As
                        </button>
                    </div>
                    
                    <div class="toolbar-separator"></div>
                    
                    <div class="toolbar-group">
                        <button class="btn btn-sm" id="undo-btn" title="Undo">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="btn btn-sm" id="redo-btn" title="Redo">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-separator"></div>
                    
                    <div class="toolbar-group">
                        <button class="btn btn-sm" id="cut-btn" title="Cut">
                            <i class="fas fa-cut"></i>
                        </button>
                        <button class="btn btn-sm" id="copy-btn" title="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm" id="paste-btn" title="Paste">
                            <i class="fas fa-paste"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-separator"></div>
                    
                    <div class="toolbar-group">
                        <button class="btn btn-sm" id="find-btn" title="Find">
                            <i class="fas fa-search"></i>
                            Find
                        </button>
                        <button class="btn btn-sm" id="replace-btn" title="Replace">
                            <i class="fas fa-exchange-alt"></i>
                            Replace
                        </button>
                    </div>
                    
                    <div class="toolbar-separator"></div>
                    
                    <div class="toolbar-group">
                        <button class="btn btn-sm" id="line-numbers-btn" title="Toggle Line Numbers">
                            <i class="fas fa-list-ol"></i>
                        </button>
                        <button class="btn btn-sm" id="word-wrap-btn" title="Toggle Word Wrap">
                            <i class="fas fa-align-justify"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-right">
                        <div class="file-info" id="file-info">
                            <span id="file-name">Untitled</span>
                            <span id="file-status"></span>
                        </div>
                    </div>
                </div>
                
                <div class="editor-content">
                    <div class="editor-line-numbers" id="line-numbers"></div>
                    <textarea 
                        class="editor-textarea with-line-numbers" 
                        id="editor-textarea" 
                        placeholder="Start typing your text here..."
                        spellcheck="false"
                    ></textarea>
                </div>
                
                <div class="editor-statusbar">
                    <div class="statusbar-left">
                        <span id="cursor-position">Line 1, Column 1</span>
                        <span id="selection-info"></span>
                    </div>
                    <div class="statusbar-right">
                        <span id="file-encoding">UTF-8</span>
                        <span id="file-type">Plain Text</span>
                        <span id="zoom-level">100%</span>
                    </div>
                </div>
                
                <!-- Find/Replace Dialog -->
                <div class="find-dialog" id="find-dialog">
                    <div class="find-controls">
                        <div class="find-input-group">
                            <input type="text" id="find-input" placeholder="Find">
                            <button class="btn btn-sm" id="find-prev">
                                <i class="fas fa-chevron-up"></i>
                            </button>
                            <button class="btn btn-sm" id="find-next">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                        <div class="find-input-group" id="replace-group" style="display: none;">
                            <input type="text" id="replace-input" placeholder="Replace">
                            <button class="btn btn-sm" id="replace-btn-dialog">Replace</button>
                            <button class="btn btn-sm" id="replace-all-btn">Replace All</button>
                        </div>
                        <button class="btn btn-sm" id="close-find">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="find-options">
                        <label><input type="checkbox" id="match-case"> Match case</label>
                        <label><input type="checkbox" id="whole-word"> Whole word</label>
                        <label><input type="checkbox" id="regex-search"> Regular expression</label>
                    </div>
                </div>
            </div>
        `;
    }
    
    init(windowId) {
        this.windowId = windowId;
        this.setupEventListeners();
        this.updateLineNumbers();
        this.updateStatusBar();
        
        // Focus the textarea
        setTimeout(() => {
            const textarea = document.getElementById('editor-textarea');
            if (textarea) {
                textarea.focus();
            }
        }, 100);
    }
    
    setupEventListeners() {
        const windowElement = document.getElementById(this.windowId);
        const textarea = windowElement.querySelector('#editor-textarea');
        
        // File operations
        windowElement.querySelector('#new-file').addEventListener('click', () => this.newFile());
        windowElement.querySelector('#open-file').addEventListener('click', () => this.openFile());
        windowElement.querySelector('#save-file').addEventListener('click', () => this.saveFile());
        windowElement.querySelector('#save-as-file').addEventListener('click', () => this.saveAsFile());
        
        // Edit operations
        windowElement.querySelector('#undo-btn').addEventListener('click', () => this.undo());
        windowElement.querySelector('#redo-btn').addEventListener('click', () => this.redo());
        windowElement.querySelector('#cut-btn').addEventListener('click', () => this.cut());
        windowElement.querySelector('#copy-btn').addEventListener('click', () => this.copy());
        windowElement.querySelector('#paste-btn').addEventListener('click', () => this.paste());
        
        // Find/Replace
        windowElement.querySelector('#find-btn').addEventListener('click', () => this.showFindDialog());
        windowElement.querySelector('#replace-btn').addEventListener('click', () => this.showReplaceDialog());
        
        // View options
        windowElement.querySelector('#line-numbers-btn').addEventListener('click', () => this.toggleLineNumbers());
        windowElement.querySelector('#word-wrap-btn').addEventListener('click', () => this.toggleWordWrap());
        
        // Text area events
        textarea.addEventListener('input', (e) => {
            this.onTextChange(e);
        });
        
        textarea.addEventListener('scroll', () => {
            this.syncLineNumbers();
        });
        
        textarea.addEventListener('selectionchange', () => {
            this.updateStatusBar();
        });
        
        // Keyboard shortcuts
        textarea.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Find dialog events
        this.setupFindDialogEvents(windowElement);
        
        // Update cursor position and selection
        textarea.addEventListener('click', () => this.updateStatusBar());
        textarea.addEventListener('keyup', () => this.updateStatusBar());
    }
    
    setupFindDialogEvents(windowElement) {
        const findDialog = windowElement.querySelector('#find-dialog');
        const findInput = windowElement.querySelector('#find-input');
        const replaceInput = windowElement.querySelector('#replace-input');
        const replaceGroup = windowElement.querySelector('#replace-group');
        
        windowElement.querySelector('#find-next').addEventListener('click', () => this.findNext());
        windowElement.querySelector('#find-prev').addEventListener('click', () => this.findPrevious());
        windowElement.querySelector('#replace-btn-dialog').addEventListener('click', () => this.replace());
        windowElement.querySelector('#replace-all-btn').addEventListener('click', () => this.replaceAll());
        windowElement.querySelector('#close-find').addEventListener('click', () => this.closeFindDialog());
        
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    this.findPrevious();
                } else {
                    this.findNext();
                }
            } else if (e.key === 'Escape') {
                this.closeFindDialog();
            }
        });
        
        replaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.replace();
            } else if (e.key === 'Escape') {
                this.closeFindDialog();
            }
        });
    }
    
    handleKeyboard(e) {
        // Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'n':
                    e.preventDefault();
                    this.newFile();
                    break;
                case 'o':
                    e.preventDefault();
                    this.openFile();
                    break;
                case 's':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.saveAsFile();
                    } else {
                        this.saveFile();
                    }
                    break;
                case 'f':
                    e.preventDefault();
                    this.showFindDialog();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showReplaceDialog();
                    break;
                case 'g':
                    e.preventDefault();
                    this.goToLine();
                    break;
                case 'a':
                    // Allow default select all
                    break;
                case 'z':
                    // Allow default undo
                    break;
                case 'y':
                    // Allow default redo
                    break;
            }
        }
        
        // Tab key handling
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            if (e.shiftKey) {
                // Unindent
                this.unindentSelection();
            } else {
                // Insert tab or indent
                const value = textarea.value;
                textarea.value = value.substring(0, start) + '\t' + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
                this.onTextChange();
            }
        }
        
        // Update status bar on arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            setTimeout(() => this.updateStatusBar(), 0);
        }
    }
    
    onTextChange(e) {
        this.content = document.getElementById('editor-textarea').value;
        this.isModified = true;
        this.updateLineNumbers();
        this.updateStatusBar();
        this.updateFileStatus();
    }
    
    updateLineNumbers() {
        if (!this.lineNumbers) return;
        
        const windowElement = document.getElementById(this.windowId);
        const textarea = windowElement.querySelector('#editor-textarea');
        const lineNumbersElement = windowElement.querySelector('#line-numbers');
        
        if (!textarea || !lineNumbersElement) return;
        
        const lines = textarea.value.split('\n').length;
        const lineNumbersHtml = Array.from({ length: lines }, (_, i) => i + 1)
            .map(num => `<div>${num}</div>`)
            .join('');
        
        lineNumbersElement.innerHTML = lineNumbersHtml;
        this.syncLineNumbers();
    }
    
    syncLineNumbers() {
        const windowElement = document.getElementById(this.windowId);
        const textarea = windowElement.querySelector('#editor-textarea');
        const lineNumbersElement = windowElement.querySelector('#line-numbers');
        
        if (textarea && lineNumbersElement) {
            lineNumbersElement.scrollTop = textarea.scrollTop;
        }
    }
    
    updateStatusBar() {
        const windowElement = document.getElementById(this.windowId);
        const textarea = windowElement.querySelector('#editor-textarea');
        const cursorPosition = windowElement.querySelector('#cursor-position');
        const selectionInfo = windowElement.querySelector('#selection-info');
        
        if (!textarea) return;
        
        const text = textarea.value;
        const cursorPos = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        
        // Calculate line and column
        const textBeforeCursor = text.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        cursorPosition.textContent = `Line ${line}, Column ${column}`;
        
        // Selection info
        if (cursorPos !== selectionEnd) {
            const selectedText = text.substring(cursorPos, selectionEnd);
            const selectedLines = selectedText.split('\n').length;
            const selectedChars = selectedText.length;
            selectionInfo.textContent = `(${selectedChars} characters, ${selectedLines} lines selected)`;
        } else {
            selectionInfo.textContent = '';
        }
    }
    
    updateFileStatus() {
        const windowElement = document.getElementById(this.windowId);
        const fileStatus = windowElement.querySelector('#file-status');
        const fileName = windowElement.querySelector('#file-name');
        
        if (this.isModified) {
            fileStatus.textContent = '•';
            fileStatus.title = 'Modified';
            
            // Update window title
            const currentTitle = WindowManager.getWindow(this.windowId).title;
            if (!currentTitle.includes('•')) {
                WindowManager.updateWindowTitle(this.windowId, '• ' + currentTitle);
            }
        } else {
            fileStatus.textContent = '';
            fileStatus.title = '';
            
            // Update window title
            const currentTitle = WindowManager.getWindow(this.windowId).title;
            if (currentTitle.includes('•')) {
                WindowManager.updateWindowTitle(this.windowId, currentTitle.replace('• ', ''));
            }
        }
    }
    
    // File operations
    newFile() {
        if (this.isModified) {
            const save = confirm('Do you want to save the current file before creating a new one?');
            if (save) {
                this.saveFile();
            }
        }
        
        const textarea = document.getElementById('editor-textarea');
        textarea.value = '';
        this.content = '';
        this.currentFile = null;
        this.isModified = false;
        
        const fileName = document.querySelector(`#${this.windowId} #file-name`);
        fileName.textContent = 'Untitled';
        
        WindowManager.updateWindowTitle(this.windowId, 'Text Editor - Untitled');
        this.updateLineNumbers();
        this.updateStatusBar();
        this.updateFileStatus();
    }
    
    openFile() {
        // In a real implementation, this would show a file picker
        const fileName = prompt('Enter filename to open:', 'example.txt');
        if (fileName) {
            // Simulate loading file content
            const content = `// This is a simulated file: ${fileName}\n\nWelcome to ModernOS Text Editor!\n\nThis is a demonstration of the text editor functionality.\nYou can:\n- Create new files\n- Edit text with syntax highlighting\n- Use keyboard shortcuts\n- Find and replace text\n- Toggle line numbers and word wrap\n\nEnjoy using ModernOS!`;
            
            this.loadFile(fileName, content);
        }
    }
    
    loadFile(fileName, content) {
        const textarea = document.getElementById('editor-textarea');
        textarea.value = content;
        this.content = content;
        this.currentFile = fileName;
        this.isModified = false;
        
        const fileNameElement = document.querySelector(`#${this.windowId} #file-name`);
        fileNameElement.textContent = fileName;
        
        WindowManager.updateWindowTitle(this.windowId, `Text Editor - ${fileName}`);
        this.updateLineNumbers();
        this.updateStatusBar();
        this.updateFileStatus();
        
        // Detect file type
        this.detectFileType(fileName);
    }
    
    saveFile() {
        if (!this.currentFile) {
            this.saveAsFile();
            return;
        }
        
        const textarea = document.getElementById('editor-textarea');
        this.content = textarea.value;
        this.isModified = false;
        
        // In a real implementation, this would save to the file system
        ModernOS.showNotification('Text Editor', `File saved: ${this.currentFile}`);
        this.updateFileStatus();
    }
    
    saveAsFile() {
        const fileName = prompt('Enter filename:', this.currentFile || 'untitled.txt');
        if (fileName) {
            this.currentFile = fileName;
            this.saveFile();
            
            const fileNameElement = document.querySelector(`#${this.windowId} #file-name`);
            fileNameElement.textContent = fileName;
            
            WindowManager.updateWindowTitle(this.windowId, `Text Editor - ${fileName}`);
            this.detectFileType(fileName);
        }
    }
    
    detectFileType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const fileTypeElement = document.querySelector(`#${this.windowId} #file-type`);
        
        const typeMap = {
            'txt': 'Plain Text',
            'js': 'JavaScript',
            'html': 'HTML',
            'css': 'CSS',
            'json': 'JSON',
            'xml': 'XML',
            'md': 'Markdown',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'cs': 'C#',
            'php': 'PHP',
            'rb': 'Ruby',
            'go': 'Go',
            'rs': 'Rust'
        };
        
        fileTypeElement.textContent = typeMap[extension] || 'Plain Text';
    }
    
    // Edit operations
    undo() {
        document.execCommand('undo');
        this.onTextChange();
    }
    
    redo() {
        document.execCommand('redo');
        this.onTextChange();
    }
    
    cut() {
        document.execCommand('cut');
        this.onTextChange();
    }
    
    copy() {
        document.execCommand('copy');
    }
    
    async paste() {
        try {
            const text = await ModernOS.pasteFromClipboard();
            if (text) {
                const textarea = document.getElementById('editor-textarea');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                
                textarea.value = value.substring(0, start) + text + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
                this.onTextChange();
            }
        } catch (error) {
            document.execCommand('paste');
            this.onTextChange();
        }
    }
    
    // Find and replace
    showFindDialog() {
        const windowElement = document.getElementById(this.windowId);
        const findDialog = windowElement.querySelector('#find-dialog');
        const findInput = windowElement.querySelector('#find-input');
        const replaceGroup = windowElement.querySelector('#replace-group');
        
        findDialog.style.display = 'block';
        replaceGroup.style.display = 'none';
        findInput.focus();
        findInput.select();
    }
    
    showReplaceDialog() {
        const windowElement = document.getElementById(this.windowId);
        const findDialog = windowElement.querySelector('#find-dialog');
        const findInput = windowElement.querySelector('#find-input');
        const replaceGroup = windowElement.querySelector('#replace-group');
        
        findDialog.style.display = 'block';
        replaceGroup.style.display = 'flex';
        findInput.focus();
        findInput.select();
    }
    
    closeFindDialog() {
        const windowElement = document.getElementById(this.windowId);
        const findDialog = windowElement.querySelector('#find-dialog');
        findDialog.style.display = 'none';
        
        // Focus back to textarea
        const textarea = windowElement.querySelector('#editor-textarea');
        textarea.focus();
    }
    
    findNext() {
        const findInput = document.querySelector(`#${this.windowId} #find-input`);
        const searchTerm = findInput.value;
        if (!searchTerm) return;
        
        const textarea = document.getElementById('editor-textarea');
        const text = textarea.value;
        const startPos = textarea.selectionEnd;
        
        let index = text.indexOf(searchTerm, startPos);
        if (index === -1) {
            index = text.indexOf(searchTerm, 0); // Wrap around
        }
        
        if (index !== -1) {
            textarea.selectionStart = index;
            textarea.selectionEnd = index + searchTerm.length;
            textarea.focus();
        } else {
            ModernOS.showNotification('Text Editor', 'Text not found');
        }
    }
    
    findPrevious() {
        const findInput = document.querySelector(`#${this.windowId} #find-input`);
        const searchTerm = findInput.value;
        if (!searchTerm) return;
        
        const textarea = document.getElementById('editor-textarea');
        const text = textarea.value;
        const startPos = textarea.selectionStart - 1;
        
        let index = text.lastIndexOf(searchTerm, startPos);
        if (index === -1) {
            index = text.lastIndexOf(searchTerm); // Wrap around
        }
        
        if (index !== -1) {
            textarea.selectionStart = index;
            textarea.selectionEnd = index + searchTerm.length;
            textarea.focus();
        } else {
            ModernOS.showNotification('Text Editor', 'Text not found');
        }
    }
    
    replace() {
        const windowElement = document.getElementById(this.windowId);
        const findInput = windowElement.querySelector('#find-input');
        const replaceInput = windowElement.querySelector('#replace-input');
        const textarea = windowElement.querySelector('#editor-textarea');
        
        const searchTerm = findInput.value;
        const replaceTerm = replaceInput.value;
        
        if (!searchTerm) return;
        
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selectedText === searchTerm) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            
            textarea.value = value.substring(0, start) + replaceTerm + value.substring(end);
            textarea.selectionStart = start;
            textarea.selectionEnd = start + replaceTerm.length;
            this.onTextChange();
        }
        
        // Find next occurrence
        this.findNext();
    }
    
    replaceAll() {
        const windowElement = document.getElementById(this.windowId);
        const findInput = windowElement.querySelector('#find-input');
        const replaceInput = windowElement.querySelector('#replace-input');
        const textarea = windowElement.querySelector('#editor-textarea');
        
        const searchTerm = findInput.value;
        const replaceTerm = replaceInput.value;
        
        if (!searchTerm) return;
        
        const originalText = textarea.value;
        const newText = originalText.replace(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceTerm);
        
        if (newText !== originalText) {
            textarea.value = newText;
            this.onTextChange();
            
            const count = (originalText.match(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            ModernOS.showNotification('Text Editor', `Replaced ${count} occurrences`);
        } else {
            ModernOS.showNotification('Text Editor', 'No occurrences found');
        }
    }
    
    goToLine() {
        const lineNumber = prompt('Go to line number:');
        if (lineNumber && !isNaN(lineNumber)) {
            const textarea = document.getElementById('editor-textarea');
            const lines = textarea.value.split('\n');
            const targetLine = Math.max(1, Math.min(parseInt(lineNumber), lines.length));
            
            let charCount = 0;
            for (let i = 0; i < targetLine - 1; i++) {
                charCount += lines[i].length + 1; // +1 for newline
            }
            
            textarea.selectionStart = textarea.selectionEnd = charCount;
            textarea.focus();
            this.updateStatusBar();
        }
    }
    
    // View options
    toggleLineNumbers() {
        this.lineNumbers = !this.lineNumbers;
        const windowElement = document.getElementById(this.windowId);
        const lineNumbersElement = windowElement.querySelector('#line-numbers');
        const textarea = windowElement.querySelector('#editor-textarea');
        const btn = windowElement.querySelector('#line-numbers-btn');
        
        if (this.lineNumbers) {
            lineNumbersElement.style.display = 'block';
            textarea.classList.add('with-line-numbers');
            btn.classList.add('active');
            this.updateLineNumbers();
        } else {
            lineNumbersElement.style.display = 'none';
            textarea.classList.remove('with-line-numbers');
            btn.classList.remove('active');
        }
    }
    
    toggleWordWrap() {
        this.wordWrap = !this.wordWrap;
        const windowElement = document.getElementById(this.windowId);
        const textarea = windowElement.querySelector('#editor-textarea');
        const btn = windowElement.querySelector('#word-wrap-btn');
        
        if (this.wordWrap) {
            textarea.style.whiteSpace = 'pre-wrap';
            btn.classList.add('active');
        } else {
            textarea.style.whiteSpace = 'pre';
            btn.classList.remove('active');
        }
    }
    
    indentSelection() {
        const textarea = document.getElementById('editor-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        const beforeSelection = text.substring(0, start);
        const selection = text.substring(start, end);
        const afterSelection = text.substring(end);
        
        const indentedSelection = selection.replace(/^/gm, '\t');
        
        textarea.value = beforeSelection + indentedSelection + afterSelection;
        textarea.selectionStart = start;
        textarea.selectionEnd = end + (indentedSelection.length - selection.length);
        
        this.onTextChange();
    }
    
    unindentSelection() {
        const textarea = document.getElementById('editor-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        const beforeSelection = text.substring(0, start);
        const selection = text.substring(start, end);
        const afterSelection = text.substring(end);
        
        const unindentedSelection = selection.replace(/^\t/gm, '');
        
        textarea.value = beforeSelection + unindentedSelection + afterSelection;
        textarea.selectionStart = start;
        textarea.selectionEnd = end - (selection.length - unindentedSelection.length);
        
        this.onTextChange();
    }
}

// Create global text editor instance
window.TextEditor = new TextEditor();