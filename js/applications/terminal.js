/**
 * ModernOS - Terminal Application
 * A basic terminal emulator with common commands
 */

class Terminal {
    constructor() {
        this.windowId = null;
        this.currentDirectory = '/home/user';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.fileSystem = this.createFileSystem();
        this.environment = {
            USER: 'user',
            HOME: '/home/user',
            PATH: '/bin:/usr/bin:/usr/local/bin',
            PWD: '/home/user',
            SHELL: '/bin/bash'
        };
    }
    
    createFileSystem() {
        return {
            '/': {
                type: 'directory',
                contents: {
                    'home': {
                        type: 'directory',
                        contents: {
                            'user': {
                                type: 'directory',
                                contents: {
                                    'documents': {
                                        type: 'directory',
                                        contents: {
                                            'readme.txt': {
                                                type: 'file',
                                                content: 'Welcome to ModernOS Terminal!\n\nThis is a basic terminal emulator with common Unix commands.\n\nTry commands like:\n- ls (list files)\n- cd (change directory)\n- pwd (print working directory)\n- cat (display file contents)\n- help (show available commands)'
                                            }
                                        }
                                    },
                                    'projects': {
                                        type: 'directory',
                                        contents: {}
                                    }
                                }
                            }
                        }
                    },
                    'bin': {
                        type: 'directory',
                        contents: {}
                    },
                    'usr': {
                        type: 'directory',
                        contents: {
                            'bin': {
                                type: 'directory',
                                contents: {}
                            }
                        }
                    }
                }
            }
        };
    }
    
    getContent() {
        return `
            <div class="terminal">
                <div class="terminal-header">
                    <div class="terminal-title">
                        <i class="fas fa-terminal"></i>
                        Terminal - ${this.currentDirectory}
                    </div>
                    <div class="terminal-controls">
                        <button class="terminal-control" id="clear-terminal" title="Clear">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="terminal-control" id="copy-terminal" title="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="terminal-control" id="paste-terminal" title="Paste">
                            <i class="fas fa-paste"></i>
                        </button>
                    </div>
                </div>
                
                <div class="terminal-output" id="terminal-output">
                    <div class="terminal-welcome">
                        ModernOS Terminal v1.0.0<br>
                        Type 'help' for available commands.<br>
                        <br>
                    </div>
                </div>
                
                <div class="terminal-input-line">
                    <span class="terminal-prompt" id="terminal-prompt">user@modernos:${this.currentDirectory}$ </span>
                    <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        `;
    }
    
    init(windowId) {
        this.windowId = windowId;
        this.setupEventListeners();
        this.focusInput();
        
        // Update window title
        WindowManager.updateWindowTitle(windowId, `Terminal - ${this.currentDirectory}`);
    }
    
    setupEventListeners() {
        const windowElement = document.getElementById(this.windowId);
        const input = windowElement.querySelector('#terminal-input');
        const output = windowElement.querySelector('#terminal-output');
        
        // Command input
        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    this.executeCommand(input.value.trim());
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateHistory(-1);
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateHistory(1);
                    break;
                    
                case 'Tab':
                    e.preventDefault();
                    this.autocomplete(input.value);
                    break;
                    
                case 'c':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.interrupt();
                    }
                    break;
                    
                case 'l':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.clear();
                    }
                    break;
            }
        });
        
        // Control buttons
        windowElement.querySelector('#clear-terminal').addEventListener('click', () => {
            this.clear();
        });
        
        windowElement.querySelector('#copy-terminal').addEventListener('click', () => {
            this.copyOutput();
        });
        
        windowElement.querySelector('#paste-terminal').addEventListener('click', () => {
            this.pasteToInput();
        });
        
        // Keep input focused
        output.addEventListener('click', () => {
            input.focus();
        });
        
        // Auto-scroll output
        const observer = new MutationObserver(() => {
            output.scrollTop = output.scrollHeight;
        });
        observer.observe(output, { childList: true, subtree: true });
    }
    
    executeCommand(commandLine) {
        if (!commandLine) {
            this.showPrompt();
            return;
        }
        
        // Add to history
        this.commandHistory.push(commandLine);
        if (this.commandHistory.length > 100) {
            this.commandHistory.shift();
        }
        this.historyIndex = this.commandHistory.length;
        
        // Show command in output
        this.addOutput(`${this.getPrompt()}${commandLine}`);
        
        // Parse command
        const parts = commandLine.split(' ').filter(part => part.length > 0);
        const command = parts[0];
        const args = parts.slice(1);
        
        // Execute command
        this.runCommand(command, args);
        
        // Clear input and show new prompt
        const input = document.querySelector(`#${this.windowId} #terminal-input`);
        input.value = '';
        this.showPrompt();
    }
    
    runCommand(command, args) {
        switch (command) {
            case 'help':
                this.showHelp();
                break;
                
            case 'ls':
                this.listDirectory(args);
                break;
                
            case 'cd':
                this.changeDirectory(args[0] || this.environment.HOME);
                break;
                
            case 'pwd':
                this.printWorkingDirectory();
                break;
                
            case 'cat':
                this.displayFile(args[0]);
                break;
                
            case 'mkdir':
                this.makeDirectory(args[0]);
                break;
                
            case 'touch':
                this.createFile(args[0]);
                break;
                
            case 'rm':
                this.removeFile(args[0]);
                break;
                
            case 'echo':
                this.echo(args);
                break;
                
            case 'clear':
                this.clear();
                break;
                
            case 'date':
                this.showDate();
                break;
                
            case 'whoami':
                this.addOutput(this.environment.USER);
                break;
                
            case 'env':
                this.showEnvironment();
                break;
                
            case 'history':
                this.showHistory();
                break;
                
            case 'tree':
                this.showTree(args[0] || this.currentDirectory);
                break;
                
            case 'ps':
                this.showProcesses();
                break;
                
            case 'uname':
                this.showSystemInfo(args);
                break;
                
            case 'which':
                this.which(args[0]);
                break;
                
            case 'man':
                this.showManual(args[0]);
                break;
                
            case 'exit':
                this.exit();
                break;
                
            default:
                this.addOutput(`bash: ${command}: command not found`);
                break;
        }
    }
    
    showHelp() {
        const helpText = `
Available commands:

File System:
  ls [path]         - List directory contents
  cd [path]         - Change directory
  pwd               - Print working directory
  cat <file>        - Display file contents
  mkdir <dir>       - Create directory
  touch <file>      - Create empty file
  rm <file>         - Remove file
  tree [path]       - Show directory tree

System:
  help              - Show this help message
  clear             - Clear terminal screen
  date              - Show current date and time
  whoami            - Show current user
  env               - Show environment variables
  history           - Show command history
  ps                - Show running processes
  uname [-a]        - Show system information
  which <command>   - Show command location
  man <command>     - Show command manual

Utilities:
  echo <text>       - Display text
  exit              - Close terminal

Keyboard shortcuts:
  Ctrl+C            - Interrupt current command
  Ctrl+L            - Clear screen
  Up/Down arrows    - Navigate command history
  Tab               - Auto-complete (basic)
        `;
        this.addOutput(helpText.trim());
    }
    
    listDirectory(args) {
        const path = args[0] || this.currentDirectory;
        const resolvedPath = this.resolvePath(path);
        const directory = this.getFileSystemItem(resolvedPath);
        
        if (!directory) {
            this.addOutput(`ls: cannot access '${path}': No such file or directory`);
            return;
        }
        
        if (directory.type !== 'directory') {
            this.addOutput(`ls: ${path}: Not a directory`);
            return;
        }
        
        const items = Object.entries(directory.contents || {});
        if (items.length === 0) {
            return; // Empty directory
        }
        
        // Sort items: directories first, then files
        items.sort(([a, aItem], [b, bItem]) => {
            if (aItem.type === 'directory' && bItem.type !== 'directory') return -1;
            if (aItem.type !== 'directory' && bItem.type === 'directory') return 1;
            return a.localeCompare(b);
        });
        
        const output = items.map(([name, item]) => {
            const prefix = item.type === 'directory' ? '📁 ' : '📄 ';
            return prefix + name;
        }).join('  ');
        
        this.addOutput(output);
    }
    
    changeDirectory(path) {
        const resolvedPath = this.resolvePath(path);
        const directory = this.getFileSystemItem(resolvedPath);
        
        if (!directory) {
            this.addOutput(`cd: ${path}: No such file or directory`);
            return;
        }
        
        if (directory.type !== 'directory') {
            this.addOutput(`cd: ${path}: Not a directory`);
            return;
        }
        
        this.currentDirectory = resolvedPath;
        this.environment.PWD = resolvedPath;
        this.updatePrompt();
        
        // Update window title
        WindowManager.updateWindowTitle(this.windowId, `Terminal - ${this.currentDirectory}`);
    }
    
    printWorkingDirectory() {
        this.addOutput(this.currentDirectory);
    }
    
    displayFile(filename) {
        if (!filename) {
            this.addOutput('cat: missing file operand');
            return;
        }
        
        const filePath = this.resolvePath(filename);
        const file = this.getFileSystemItem(filePath);
        
        if (!file) {
            this.addOutput(`cat: ${filename}: No such file or directory`);
            return;
        }
        
        if (file.type !== 'file') {
            this.addOutput(`cat: ${filename}: Is a directory`);
            return;
        }
        
        this.addOutput(file.content || '');
    }
    
    makeDirectory(dirname) {
        if (!dirname) {
            this.addOutput('mkdir: missing operand');
            return;
        }
        
        const dirPath = this.resolvePath(dirname);
        const parentPath = dirPath.substring(0, dirPath.lastIndexOf('/')) || '/';
        const dirName = dirPath.substring(dirPath.lastIndexOf('/') + 1);
        
        const parent = this.getFileSystemItem(parentPath);
        if (!parent || parent.type !== 'directory') {
            this.addOutput(`mkdir: cannot create directory '${dirname}': No such file or directory`);
            return;
        }
        
        if (parent.contents[dirName]) {
            this.addOutput(`mkdir: cannot create directory '${dirname}': File exists`);
            return;
        }
        
        parent.contents[dirName] = {
            type: 'directory',
            contents: {}
        };
        
        this.addOutput(`Directory '${dirname}' created`);
    }
    
    createFile(filename) {
        if (!filename) {
            this.addOutput('touch: missing file operand');
            return;
        }
        
        const filePath = this.resolvePath(filename);
        const parentPath = filePath.substring(0, filePath.lastIndexOf('/')) || '/';
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        
        const parent = this.getFileSystemItem(parentPath);
        if (!parent || parent.type !== 'directory') {
            this.addOutput(`touch: cannot touch '${filename}': No such file or directory`);
            return;
        }
        
        if (!parent.contents[fileName]) {
            parent.contents[fileName] = {
                type: 'file',
                content: ''
            };
            this.addOutput(`File '${filename}' created`);
        }
    }
    
    removeFile(filename) {
        if (!filename) {
            this.addOutput('rm: missing operand');
            return;
        }
        
        const filePath = this.resolvePath(filename);
        const parentPath = filePath.substring(0, filePath.lastIndexOf('/')) || '/';
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        
        const parent = this.getFileSystemItem(parentPath);
        if (!parent || parent.type !== 'directory') {
            this.addOutput(`rm: cannot remove '${filename}': No such file or directory`);
            return;
        }
        
        if (!parent.contents[fileName]) {
            this.addOutput(`rm: cannot remove '${filename}': No such file or directory`);
            return;
        }
        
        delete parent.contents[fileName];
        this.addOutput(`File '${filename}' removed`);
    }
    
    echo(args) {
        this.addOutput(args.join(' '));
    }
    
    showDate() {
        const date = new Date();
        this.addOutput(date.toString());
    }
    
    showEnvironment() {
        const envOutput = Object.entries(this.environment)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        this.addOutput(envOutput);
    }
    
    showHistory() {
        const historyOutput = this.commandHistory
            .map((cmd, index) => `${index + 1}  ${cmd}`)
            .join('\n');
        this.addOutput(historyOutput || 'No command history');
    }
    
    showTree(path) {
        const resolvedPath = this.resolvePath(path);
        const directory = this.getFileSystemItem(resolvedPath);
        
        if (!directory) {
            this.addOutput(`tree: ${path}: No such file or directory`);
            return;
        }
        
        if (directory.type !== 'directory') {
            this.addOutput(`tree: ${path}: Not a directory`);
            return;
        }
        
        this.addOutput(path);
        this.printTree(directory.contents, '');
    }
    
    printTree(contents, prefix) {
        const items = Object.entries(contents || {});
        items.forEach(([name, item], index) => {
            const isLast = index === items.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const icon = item.type === 'directory' ? '📁 ' : '📄 ';
            
            this.addOutput(prefix + connector + icon + name);
            
            if (item.type === 'directory' && item.contents) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                this.printTree(item.contents, newPrefix);
            }
        });
    }
    
    showProcesses() {
        const processes = [
            'PID  TTY      TIME CMD',
            '1    tty1     00:00:01 init',
            '2    tty1     00:00:00 modernos',
            '3    tty1     00:00:00 desktop',
            '4    tty1     00:00:00 terminal'
        ];
        this.addOutput(processes.join('\n'));
    }
    
    showSystemInfo(args) {
        if (args.includes('-a')) {
            this.addOutput('ModernOS 1.0.0 WebOS x86_64 GNU/Linux');
        } else {
            this.addOutput('ModernOS');
        }
    }
    
    which(command) {
        if (!command) {
            this.addOutput('which: missing operand');
            return;
        }
        
        const builtinCommands = [
            'help', 'ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm',
            'echo', 'clear', 'date', 'whoami', 'env', 'history', 'tree',
            'ps', 'uname', 'which', 'man', 'exit'
        ];
        
        if (builtinCommands.includes(command)) {
            this.addOutput(`/bin/${command}`);
        } else {
            this.addOutput(`which: no ${command} in (${this.environment.PATH})`);
        }
    }
    
    showManual(command) {
        if (!command) {
            this.addOutput('What manual page do you want?');
            return;
        }
        
        const manuals = {
            ls: 'ls - list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nDESCRIPTION\n    List information about the FILEs (the current directory by default).',
            cd: 'cd - change the working directory\n\nSYNOPSIS\n    cd [DIR]\n\nDESCRIPTION\n    Change the current directory to DIR.',
            cat: 'cat - concatenate files and print on the standard output\n\nSYNOPSIS\n    cat [OPTION]... [FILE]...\n\nDESCRIPTION\n    Concatenate FILE(s) to standard output.',
            pwd: 'pwd - print name of current/working directory\n\nSYNOPSIS\n    pwd\n\nDESCRIPTION\n    Print the full filename of the current working directory.'
        };
        
        if (manuals[command]) {
            this.addOutput(manuals[command]);
        } else {
            this.addOutput(`No manual entry for ${command}`);
        }
    }
    
    exit() {
        WindowManager.closeWindow(this.windowId);
    }
    
    clear() {
        const output = document.querySelector(`#${this.windowId} #terminal-output`);
        output.innerHTML = '';
    }
    
    interrupt() {
        this.addOutput('^C');
        this.showPrompt();
        const input = document.querySelector(`#${this.windowId} #terminal-input`);
        input.value = '';
    }
    
    // Helper methods
    resolvePath(path) {
        if (!path) return this.currentDirectory;
        
        if (path.startsWith('/')) {
            return path; // Absolute path
        }
        
        if (path === '.') {
            return this.currentDirectory;
        }
        
        if (path === '..') {
            if (this.currentDirectory === '/') return '/';
            return this.currentDirectory.substring(0, this.currentDirectory.lastIndexOf('/')) || '/';
        }
        
        if (path.startsWith('./')) {
            path = path.substring(2);
        }
        
        // Relative path
        let result = this.currentDirectory;
        if (result !== '/') result += '/';
        result += path;
        
        // Handle .. in path
        const parts = result.split('/').filter(p => p);
        const resolved = [];
        
        for (const part of parts) {
            if (part === '..') {
                resolved.pop();
            } else if (part !== '.') {
                resolved.push(part);
            }
        }
        
        return '/' + resolved.join('/');
    }
    
    getFileSystemItem(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const part of parts) {
            if (!current || current.type !== 'directory' || !current.contents[part]) {
                return null;
            }
            current = current.contents[part];
        }
        
        return current;
    }
    
    getPrompt() {
        return `${this.environment.USER}@modernos:${this.currentDirectory}$ `;
    }
    
    updatePrompt() {
        const prompt = document.querySelector(`#${this.windowId} #terminal-prompt`);
        if (prompt) {
            prompt.textContent = this.getPrompt();
        }
    }
    
    addOutput(text) {
        const output = document.querySelector(`#${this.windowId} #terminal-output`);
        const div = document.createElement('div');
        div.textContent = text;
        output.appendChild(div);
    }
    
    showPrompt() {
        // Prompt is always visible in the input line
    }
    
    navigateHistory(direction) {
        const input = document.querySelector(`#${this.windowId} #terminal-input`);
        
        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--;
            input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 1) {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                input.value = '';
            }
        }
    }
    
    autocomplete(partial) {
        // Basic autocomplete for commands and files
        if (!partial.includes(' ')) {
            // Complete command
            const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'echo', 'clear', 'date', 'whoami', 'env', 'history', 'tree', 'ps', 'uname', 'which', 'man', 'exit'];
            const matches = commands.filter(cmd => cmd.startsWith(partial));
            
            if (matches.length === 1) {
                const input = document.querySelector(`#${this.windowId} #terminal-input`);
                input.value = matches[0] + ' ';
            }
        }
    }
    
    focusInput() {
        setTimeout(() => {
            const input = document.querySelector(`#${this.windowId} #terminal-input`);
            if (input) {
                input.focus();
            }
        }, 100);
    }
    
    copyOutput() {
        const output = document.querySelector(`#${this.windowId} #terminal-output`);
        const text = output.textContent;
        ModernOS.copyToClipboard(text);
        ModernOS.showNotification('Terminal', 'Output copied to clipboard');
    }
    
    async pasteToInput() {
        const input = document.querySelector(`#${this.windowId} #terminal-input`);
        const text = await ModernOS.pasteFromClipboard();
        if (text) {
            input.value += text;
        }
    }
}

// Create global terminal instance
window.Terminal = new Terminal();