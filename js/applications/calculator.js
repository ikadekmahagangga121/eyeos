/**
 * ModernOS - Calculator Application
 * A modern calculator with basic and scientific operations
 */

class Calculator {
    constructor() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.history = [];
        this.windowId = null;
    }
    
    getContent() {
        return `
            <div class="calculator">
                <div class="calculator-display" id="calculator-display">0</div>
                
                <div class="calculator-buttons">
                    <!-- First row -->
                    <button class="calc-btn clear" data-action="clear">C</button>
                    <button class="calc-btn clear" data-action="clear-entry">CE</button>
                    <button class="calc-btn" data-action="backspace">⌫</button>
                    <button class="calc-btn operator" data-action="divide">÷</button>
                    
                    <!-- Second row -->
                    <button class="calc-btn" data-value="7">7</button>
                    <button class="calc-btn" data-value="8">8</button>
                    <button class="calc-btn" data-value="9">9</button>
                    <button class="calc-btn operator" data-action="multiply">×</button>
                    
                    <!-- Third row -->
                    <button class="calc-btn" data-value="4">4</button>
                    <button class="calc-btn" data-value="5">5</button>
                    <button class="calc-btn" data-value="6">6</button>
                    <button class="calc-btn operator" data-action="subtract">−</button>
                    
                    <!-- Fourth row -->
                    <button class="calc-btn" data-value="1">1</button>
                    <button class="calc-btn" data-value="2">2</button>
                    <button class="calc-btn" data-value="3">3</button>
                    <button class="calc-btn operator" data-action="add">+</button>
                    
                    <!-- Fifth row -->
                    <button class="calc-btn" data-action="sign">±</button>
                    <button class="calc-btn" data-value="0">0</button>
                    <button class="calc-btn" data-value=".">.</button>
                    <button class="calc-btn equals" data-action="equals">=</button>
                </div>
                
                <!-- Scientific mode (hidden by default) -->
                <div class="calculator-scientific" id="scientific-panel" style="display: none;">
                    <div class="scientific-buttons">
                        <button class="calc-btn" data-action="sin">sin</button>
                        <button class="calc-btn" data-action="cos">cos</button>
                        <button class="calc-btn" data-action="tan">tan</button>
                        <button class="calc-btn" data-action="log">log</button>
                        
                        <button class="calc-btn" data-action="ln">ln</button>
                        <button class="calc-btn" data-action="sqrt">√</button>
                        <button class="calc-btn" data-action="power">x²</button>
                        <button class="calc-btn" data-action="factorial">x!</button>
                        
                        <button class="calc-btn" data-value="(">(</button>
                        <button class="calc-btn" data-value=")">)</button>
                        <button class="calc-btn" data-action="pi">π</button>
                        <button class="calc-btn" data-action="e">e</button>
                    </div>
                </div>
                
                <!-- Calculator controls -->
                <div class="calculator-controls">
                    <button class="calc-btn" id="toggle-scientific" title="Toggle Scientific Mode">
                        <i class="fas fa-calculator"></i>
                    </button>
                    <button class="calc-btn" id="show-history" title="Show History">
                        <i class="fas fa-history"></i>
                    </button>
                    <button class="calc-btn" id="memory-recall" title="Memory Recall">MR</button>
                    <button class="calc-btn" id="memory-clear" title="Memory Clear">MC</button>
                    <button class="calc-btn" id="memory-plus" title="Memory Plus">M+</button>
                    <button class="calc-btn" id="memory-minus" title="Memory Minus">M-</button>
                </div>
                
                <!-- History panel -->
                <div class="calculator-history" id="history-panel" style="display: none;">
                    <div class="history-header">
                        <h4>History</h4>
                        <button class="calc-btn" id="clear-history">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="history-list" id="history-list">
                        <div class="history-empty">No calculations yet</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    init(windowId) {
        this.windowId = windowId;
        this.memory = 0;
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        const windowElement = document.getElementById(this.windowId);
        
        // Number and operator buttons
        const buttons = windowElement.querySelectorAll('.calc-btn[data-value], .calc-btn[data-action]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                const action = e.target.dataset.action;
                
                if (value !== undefined) {
                    this.inputValue(value);
                } else if (action) {
                    this.performAction(action);
                }
            });
        });
        
        // Control buttons
        windowElement.querySelector('#toggle-scientific').addEventListener('click', () => {
            this.toggleScientificMode();
        });
        
        windowElement.querySelector('#show-history').addEventListener('click', () => {
            this.toggleHistory();
        });
        
        windowElement.querySelector('#memory-recall').addEventListener('click', () => {
            this.memoryRecall();
        });
        
        windowElement.querySelector('#memory-clear').addEventListener('click', () => {
            this.memoryClear();
        });
        
        windowElement.querySelector('#memory-plus').addEventListener('click', () => {
            this.memoryPlus();
        });
        
        windowElement.querySelector('#memory-minus').addEventListener('click', () => {
            this.memoryMinus();
        });
        
        windowElement.querySelector('#clear-history').addEventListener('click', () => {
            this.clearHistory();
        });
        
        // Keyboard support
        windowElement.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Focus the calculator for keyboard input
        windowElement.tabIndex = 0;
        windowElement.focus();
    }
    
    handleKeyboard(e) {
        e.preventDefault();
        
        const key = e.key;
        
        // Numbers
        if (/[0-9]/.test(key)) {
            this.inputValue(key);
        }
        // Decimal point
        else if (key === '.') {
            this.inputValue('.');
        }
        // Operations
        else if (key === '+') {
            this.performAction('add');
        }
        else if (key === '-') {
            this.performAction('subtract');
        }
        else if (key === '*') {
            this.performAction('multiply');
        }
        else if (key === '/') {
            this.performAction('divide');
        }
        else if (key === 'Enter' || key === '=') {
            this.performAction('equals');
        }
        // Clear
        else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.performAction('clear');
        }
        // Backspace
        else if (key === 'Backspace') {
            this.performAction('backspace');
        }
        // Parentheses
        else if (key === '(') {
            this.inputValue('(');
        }
        else if (key === ')') {
            this.inputValue(')');
        }
    }
    
    inputValue(value) {
        if (this.waitingForNewValue) {
            this.display = value;
            this.waitingForNewValue = false;
        } else {
            if (this.display === '0' && value !== '.') {
                this.display = value;
            } else {
                // Prevent multiple decimal points
                if (value === '.' && this.display.includes('.')) {
                    return;
                }
                this.display += value;
            }
        }
        
        this.updateDisplay();
    }
    
    performAction(action) {
        const currentValue = parseFloat(this.display);
        
        switch (action) {
            case 'clear':
                this.clear();
                break;
                
            case 'clear-entry':
                this.display = '0';
                break;
                
            case 'backspace':
                if (this.display.length > 1) {
                    this.display = this.display.slice(0, -1);
                } else {
                    this.display = '0';
                }
                break;
                
            case 'sign':
                if (this.display !== '0') {
                    this.display = this.display.startsWith('-') ? 
                        this.display.slice(1) : '-' + this.display;
                }
                break;
                
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.performOperation(action, currentValue);
                break;
                
            case 'equals':
                this.calculate();
                break;
                
            // Scientific operations
            case 'sin':
                this.display = Math.sin(this.toRadians(currentValue)).toString();
                this.addToHistory(`sin(${currentValue})`, this.display);
                break;
                
            case 'cos':
                this.display = Math.cos(this.toRadians(currentValue)).toString();
                this.addToHistory(`cos(${currentValue})`, this.display);
                break;
                
            case 'tan':
                this.display = Math.tan(this.toRadians(currentValue)).toString();
                this.addToHistory(`tan(${currentValue})`, this.display);
                break;
                
            case 'log':
                if (currentValue > 0) {
                    this.display = Math.log10(currentValue).toString();
                    this.addToHistory(`log(${currentValue})`, this.display);
                } else {
                    this.display = 'Error';
                }
                break;
                
            case 'ln':
                if (currentValue > 0) {
                    this.display = Math.log(currentValue).toString();
                    this.addToHistory(`ln(${currentValue})`, this.display);
                } else {
                    this.display = 'Error';
                }
                break;
                
            case 'sqrt':
                if (currentValue >= 0) {
                    this.display = Math.sqrt(currentValue).toString();
                    this.addToHistory(`√(${currentValue})`, this.display);
                } else {
                    this.display = 'Error';
                }
                break;
                
            case 'power':
                this.display = Math.pow(currentValue, 2).toString();
                this.addToHistory(`${currentValue}²`, this.display);
                break;
                
            case 'factorial':
                if (currentValue >= 0 && Number.isInteger(currentValue) && currentValue <= 170) {
                    this.display = this.factorial(currentValue).toString();
                    this.addToHistory(`${currentValue}!`, this.display);
                } else {
                    this.display = 'Error';
                }
                break;
                
            case 'pi':
                this.display = Math.PI.toString();
                break;
                
            case 'e':
                this.display = Math.E.toString();
                break;
        }
        
        this.updateDisplay();
    }
    
    performOperation(operation, value) {
        if (this.previousValue !== null && this.operation && !this.waitingForNewValue) {
            this.calculate();
        } else {
            this.previousValue = value;
        }
        
        this.operation = operation;
        this.waitingForNewValue = true;
    }
    
    calculate() {
        if (this.previousValue === null || this.operation === null) {
            return;
        }
        
        const prev = this.previousValue;
        const current = parseFloat(this.display);
        let result;
        
        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.display = 'Error';
                    this.clear();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Add to history
        const operatorSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        
        this.addToHistory(`${prev} ${operatorSymbols[this.operation]} ${current}`, result.toString());
        
        this.display = result.toString();
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = true;
    }
    
    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
    }
    
    updateDisplay() {
        const displayElement = document.querySelector(`#${this.windowId} #calculator-display`);
        if (displayElement) {
            // Format large numbers with commas
            let displayValue = this.display;
            if (!isNaN(displayValue) && displayValue.length > 3) {
                const num = parseFloat(displayValue);
                if (Number.isInteger(num)) {
                    displayValue = num.toLocaleString();
                } else {
                    displayValue = num.toLocaleString(undefined, { maximumFractionDigits: 10 });
                }
            }
            
            displayElement.textContent = displayValue;
            
            // Adjust font size for long numbers
            if (displayValue.length > 12) {
                displayElement.style.fontSize = '18px';
            } else if (displayValue.length > 8) {
                displayElement.style.fontSize = '20px';
            } else {
                displayElement.style.fontSize = '24px';
            }
        }
    }
    
    // Scientific mode
    toggleScientificMode() {
        const windowElement = document.getElementById(this.windowId);
        const scientificPanel = windowElement.querySelector('#scientific-panel');
        const toggleBtn = windowElement.querySelector('#toggle-scientific');
        
        if (scientificPanel.style.display === 'none') {
            scientificPanel.style.display = 'block';
            toggleBtn.classList.add('active');
            
            // Resize window to accommodate scientific panel
            const windowData = WindowManager.getWindow(this.windowId);
            if (windowData) {
                const newHeight = 680;
                windowData.element.style.height = newHeight + 'px';
            }
        } else {
            scientificPanel.style.display = 'none';
            toggleBtn.classList.remove('active');
            
            // Resize window back to normal
            const windowData = WindowManager.getWindow(this.windowId);
            if (windowData) {
                const newHeight = 480;
                windowData.element.style.height = newHeight + 'px';
            }
        }
    }
    
    // History management
    toggleHistory() {
        const windowElement = document.getElementById(this.windowId);
        const historyPanel = windowElement.querySelector('#history-panel');
        const toggleBtn = windowElement.querySelector('#show-history');
        
        if (historyPanel.style.display === 'none') {
            historyPanel.style.display = 'block';
            toggleBtn.classList.add('active');
            this.updateHistoryDisplay();
        } else {
            historyPanel.style.display = 'none';
            toggleBtn.classList.remove('active');
        }
    }
    
    addToHistory(expression, result) {
        this.history.unshift({
            expression: expression,
            result: result,
            timestamp: new Date()
        });
        
        // Keep only last 50 calculations
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyList = document.querySelector(`#${this.windowId} #history-list`);
        if (!historyList) return;
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }
        
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `).join('');
        
        // Add click handlers to history items
        historyList.querySelectorAll('.history-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.display = this.history[index].result;
                this.updateDisplay();
                this.waitingForNewValue = true;
            });
        });
    }
    
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        ModernOS.showNotification('Calculator', 'History cleared');
    }
    
    // Memory operations
    memoryRecall() {
        this.display = this.memory.toString();
        this.updateDisplay();
        this.waitingForNewValue = true;
    }
    
    memoryClear() {
        this.memory = 0;
        ModernOS.showNotification('Calculator', 'Memory cleared');
    }
    
    memoryPlus() {
        this.memory += parseFloat(this.display);
        ModernOS.showNotification('Calculator', 'Added to memory');
    }
    
    memoryMinus() {
        this.memory -= parseFloat(this.display);
        ModernOS.showNotification('Calculator', 'Subtracted from memory');
    }
    
    // Utility functions
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}

// Create global calculator instance
window.Calculator = new Calculator();