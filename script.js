// Linux Desktop Clone - Main JavaScript File
// Created by Wisnu Hidayat

class LinuxDesktop {
    constructor() {
        this.windows = new Map();
        this.windowZIndex = 100;
        this.currentPath = '/home/wisnu';
        this.clipboard = '';
        this.fileSystem = this.initFileSystem();
        this.isStartMenuOpen = false;
        this.init();
    }

    init() {
        this.showWelcomeScreen();
        this.setupEventListeners();
        this.updateClock();
        this.setInterval(() => this.updateClock(), 1000);
    }

    showWelcomeScreen() {
        setTimeout(() => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('desktop').classList.remove('hidden');
            this.showNotification('Welcome!', 'Linux Desktop Clone loaded successfully');
        }, 4000);
    }

    setupEventListeners() {
        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                const app = e.currentTarget.dataset.app;
                this.openApplication(app);
            });
        });

        // Start button
        document.querySelector('.start-button').addEventListener('click', () => {
            this.toggleStartMenu();
        });

        // Start menu apps
        document.querySelectorAll('.app-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                this.openApplication(app);
                this.hideStartMenu();
            });
        });

        // Context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Hide context menu and start menu on click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.hideStartMenu();
            }
        });

        // Context menu actions
        document.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleContextAction(action);
                this.hideContextMenu();
            });
        });

        // Power options
        document.querySelectorAll('.power-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.textContent.trim().toLowerCase();
                this.handlePowerAction(action);
            });
        });

        // System tray
        document.querySelector('.network-indicator').addEventListener('click', () => {
            this.showNotification('Network', 'Connected to WiFi');
        });

        document.querySelector('.volume-indicator').addEventListener('click', () => {
            this.showNotification('Volume', 'Volume: 75%');
        });

        document.querySelector('.battery-indicator').addEventListener('click', () => {
            this.showNotification('Battery', 'Battery: 85% - Charging');
        });
    }

    initFileSystem() {
        return {
            '/': {
                type: 'folder',
                children: {
                    'home': {
                        type: 'folder',
                        children: {
                            'wisnu': {
                                type: 'folder',
                                children: {
                                    'Documents': { type: 'folder', children: {
                                        'readme.txt': { type: 'file', content: 'Welcome to Linux Desktop Clone!\nCreated by Wisnu Hidayat\n\nThis is a fully functional Linux desktop environment simulation.' },
                                        'projects': { type: 'folder', children: {} }
                                    }},
                                    'Downloads': { type: 'folder', children: {} },
                                    'Pictures': { type: 'folder', children: {
                                        'wallpaper.jpg': { type: 'file', content: 'Image file' }
                                    }},
                                    'Music': { type: 'folder', children: {} },
                                    'Videos': { type: 'folder', children: {} },
                                    'Desktop': { type: 'folder', children: {} }
                                }
                            }
                        }
                    },
                    'usr': { type: 'folder', children: {
                        'bin': { type: 'folder', children: {} },
                        'lib': { type: 'folder', children: {} }
                    }},
                    'etc': { type: 'folder', children: {} },
                    'var': { type: 'folder', children: {} }
                }
            }
        };
    }

    openApplication(appName) {
        const windowId = `${appName}-${Date.now()}`;
        
        switch(appName) {
            case 'file-manager':
                this.createFileManagerWindow(windowId);
                break;
            case 'terminal':
                this.createTerminalWindow(windowId);
                break;
            case 'text-editor':
                this.createTextEditorWindow(windowId);
                break;
            case 'calculator':
                this.createCalculatorWindow(windowId);
                break;
            case 'settings':
                this.createSettingsWindow(windowId);
                break;
        }
    }

    createWindow(id, title, icon, content, width = 600, height = 400) {
        const window = document.createElement('div');
        window.className = 'window';
        window.id = id;
        window.style.width = width + 'px';
        window.style.height = height + 'px';
        window.style.left = (Math.random() * (window.innerWidth - width)) + 'px';
        window.style.top = (Math.random() * (window.innerHeight - height - 100)) + 'px';
        window.style.zIndex = ++this.windowZIndex;

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${icon}"></i>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                    <div class="window-control close"></div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        document.getElementById('windows-container').appendChild(window);
        this.windows.set(id, { element: window, title, icon });
        this.addToTaskbar(id, title, icon);
        this.setupWindowControls(window);
        this.makeWindowDraggable(window);

        return window;
    }

    setupWindowControls(window) {
        const closeBtn = window.querySelector('.window-control.close');
        const minimizeBtn = window.querySelector('.window-control.minimize');
        const maximizeBtn = window.querySelector('.window-control.maximize');

        closeBtn.addEventListener('click', () => {
            this.closeWindow(window.id);
        });

        minimizeBtn.addEventListener('click', () => {
            this.minimizeWindow(window.id);
        });

        maximizeBtn.addEventListener('click', () => {
            this.toggleMaximizeWindow(window.id);
        });

        window.addEventListener('click', () => {
            this.focusWindow(window.id);
        });
    }

    makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(window.style.left);
            startTop = parseInt(window.style.top);
            
            this.focusWindow(window.id);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const newLeft = startLeft + (e.clientX - startX);
            const newTop = startTop + (e.clientY - startY);
            
            window.style.left = Math.max(0, Math.min(newLeft, innerWidth - window.offsetWidth)) + 'px';
            window.style.top = Math.max(0, Math.min(newTop, innerHeight - window.offsetHeight - 48)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    focusWindow(windowId) {
        const window = this.windows.get(windowId)?.element;
        if (window) {
            window.style.zIndex = ++this.windowZIndex;
            this.updateTaskbarActive(windowId);
        }
    }

    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (windowData) {
            windowData.element.remove();
            this.windows.delete(windowId);
            this.removeFromTaskbar(windowId);
        }
    }

    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (windowData) {
            windowData.element.style.display = 'none';
            this.updateTaskbarActive(null);
        }
    }

    toggleMaximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (windowData) {
            const window = windowData.element;
            window.classList.toggle('maximized');
        }
    }

    addToTaskbar(windowId, title, icon) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.id = `taskbar-${windowId}`;
        taskbarApp.innerHTML = `
            <i class="${icon}"></i>
            <span>${title}</span>
        `;

        taskbarApp.addEventListener('click', () => {
            const windowData = this.windows.get(windowId);
            if (windowData) {
                const window = windowData.element;
                if (window.style.display === 'none') {
                    window.style.display = 'block';
                    this.focusWindow(windowId);
                } else {
                    this.minimizeWindow(windowId);
                }
            }
        });

        taskbarApps.appendChild(taskbarApp);
        this.updateTaskbarActive(windowId);
    }

    removeFromTaskbar(windowId) {
        const taskbarApp = document.getElementById(`taskbar-${windowId}`);
        if (taskbarApp) {
            taskbarApp.remove();
        }
    }

    updateTaskbarActive(activeWindowId) {
        document.querySelectorAll('.taskbar-app').forEach(app => {
            app.classList.remove('active');
        });
        
        if (activeWindowId) {
            const activeApp = document.getElementById(`taskbar-${activeWindowId}`);
            if (activeApp) {
                activeApp.classList.add('active');
            }
        }
    }

    createFileManagerWindow(windowId) {
        const content = `
            <div class="file-manager">
                <div class="file-sidebar">
                    <div class="sidebar-item active" data-path="/home/wisnu">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </div>
                    <div class="sidebar-item" data-path="/home/wisnu/Documents">
                        <i class="fas fa-file-alt"></i>
                        <span>Documents</span>
                    </div>
                    <div class="sidebar-item" data-path="/home/wisnu/Downloads">
                        <i class="fas fa-download"></i>
                        <span>Downloads</span>
                    </div>
                    <div class="sidebar-item" data-path="/home/wisnu/Pictures">
                        <i class="fas fa-images"></i>
                        <span>Pictures</span>
                    </div>
                    <div class="sidebar-item" data-path="/home/wisnu/Music">
                        <i class="fas fa-music"></i>
                        <span>Music</span>
                    </div>
                    <div class="sidebar-item" data-path="/home/wisnu/Videos">
                        <i class="fas fa-video"></i>
                        <span>Videos</span>
                    </div>
                </div>
                <div class="file-main">
                    <div class="file-toolbar">
                        <button class="toolbar-button" id="back-btn">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <button class="toolbar-button" id="forward-btn">
                            <i class="fas fa-arrow-right"></i> Forward
                        </button>
                        <button class="toolbar-button" id="up-btn">
                            <i class="fas fa-arrow-up"></i> Up
                        </button>
                        <input type="text" class="address-bar" id="address-bar" value="${this.currentPath}" placeholder="Enter path...">
                        <button class="toolbar-button" id="refresh-btn">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                    <div class="file-content">
                        <div class="file-grid" id="file-grid">
                            <!-- Files will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        const window = this.createWindow(windowId, 'File Manager', 'fas fa-folder', content, 800, 500);
        this.setupFileManager(window);
        this.loadDirectory(this.currentPath, window);
    }

    setupFileManager(window) {
        const addressBar = window.querySelector('#address-bar');
        const backBtn = window.querySelector('#back-btn');
        const upBtn = window.querySelector('#up-btn');
        const refreshBtn = window.querySelector('#refresh-btn');

        addressBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadDirectory(addressBar.value, window);
            }
        });

        backBtn.addEventListener('click', () => {
            // Navigate back logic
            this.showNotification('File Manager', 'Back navigation not implemented');
        });

        upBtn.addEventListener('click', () => {
            const currentPath = addressBar.value;
            const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
            this.loadDirectory(parentPath, window);
        });

        refreshBtn.addEventListener('click', () => {
            this.loadDirectory(addressBar.value, window);
        });

        // Sidebar navigation
        window.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                window.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const path = e.currentTarget.dataset.path;
                this.loadDirectory(path, window);
            });
        });
    }

    loadDirectory(path, window) {
        const fileGrid = window.querySelector('#file-grid');
        const addressBar = window.querySelector('#address-bar');
        
        addressBar.value = path;
        this.currentPath = path;
        
        const pathParts = path.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (const part of pathParts) {
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            } else {
                this.showNotification('Error', 'Directory not found');
                return;
            }
        }

        fileGrid.innerHTML = '';
        
        if (currentDir.children) {
            Object.entries(currentDir.children).forEach(([name, item]) => {
                const fileItem = document.createElement('div');
                fileItem.className = `file-item ${item.type}`;
                fileItem.innerHTML = `
                    <i class="fas fa-${item.type === 'folder' ? 'folder' : 'file-alt'}"></i>
                    <span>${name}</span>
                `;
                
                fileItem.addEventListener('dblclick', () => {
                    if (item.type === 'folder') {
                        const newPath = path === '/' ? `/${name}` : `${path}/${name}`;
                        this.loadDirectory(newPath, window);
                    } else {
                        this.openFile(name, item.content);
                    }
                });
                
                fileGrid.appendChild(fileItem);
            });
        }
    }

    openFile(filename, content) {
        const windowId = `file-${Date.now()}`;
        const editorContent = `
            <div class="text-editor">
                <div class="editor-toolbar">
                    <button class="toolbar-button">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-folder-open"></i> Open
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-file"></i> New
                    </button>
                </div>
                <textarea class="editor-content" placeholder="Start typing...">${content || ''}</textarea>
            </div>
        `;
        
        this.createWindow(windowId, filename, 'fas fa-file-alt', editorContent, 700, 500);
    }

    createTerminalWindow(windowId) {
        const content = `
            <div class="terminal">
                <div class="terminal-output" id="terminal-output">Linux Desktop Clone Terminal v1.0
Created by Wisnu Hidayat

wisnu@linux-clone:~$ </div>
                <div class="terminal-input">
                    <span class="terminal-prompt">wisnu@linux-clone:~$ </span>
                    <input type="text" class="terminal-command" id="terminal-command" autofocus>
                </div>
            </div>
        `;

        const window = this.createWindow(windowId, 'Terminal', 'fas fa-terminal', content, 700, 400);
        this.setupTerminal(window);
    }

    setupTerminal(window) {
        const commandInput = window.querySelector('#terminal-command');
        const output = window.querySelector('#terminal-output');
        let commandHistory = [];
        let historyIndex = -1;

        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = commandInput.value.trim();
                if (command) {
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    this.executeCommand(command, output);
                }
                commandInput.value = '';
            }
        });

        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    commandInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    commandInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    commandInput.value = '';
                }
            }
        });
    }

    executeCommand(command, output) {
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        output.textContent += command + '\n';

        switch(cmd) {
            case 'ls':
                output.textContent += this.listDirectory() + '\n';
                break;
            case 'pwd':
                output.textContent += this.currentPath + '\n';
                break;
            case 'cd':
                if (args.length > 0) {
                    this.changeDirectory(args[0], output);
                }
                break;
            case 'mkdir':
                if (args.length > 0) {
                    output.textContent += `Created directory: ${args[0]}\n`;
                } else {
                    output.textContent += 'mkdir: missing operand\n';
                }
                break;
            case 'touch':
                if (args.length > 0) {
                    output.textContent += `Created file: ${args[0]}\n`;
                } else {
                    output.textContent += 'touch: missing operand\n';
                }
                break;
            case 'cat':
                if (args.length > 0) {
                    output.textContent += `Contents of ${args[0]}:\nThis is a simulated file content.\n`;
                } else {
                    output.textContent += 'cat: missing operand\n';
                }
                break;
            case 'whoami':
                output.textContent += 'wisnu\n';
                break;
            case 'date':
                output.textContent += new Date().toString() + '\n';
                break;
            case 'clear':
                output.textContent = 'Linux Desktop Clone Terminal v1.0\nCreated by Wisnu Hidayat\n\n';
                break;
            case 'help':
                output.textContent += this.getHelpText() + '\n';
                break;
            case 'neofetch':
                output.textContent += this.getNeofetch() + '\n';
                break;
            default:
                output.textContent += `${cmd}: command not found\n`;
        }

        output.textContent += 'wisnu@linux-clone:~$ ';
        output.scrollTop = output.scrollHeight;
    }

    listDirectory() {
        const pathParts = this.currentPath.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (const part of pathParts) {
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            }
        }

        if (currentDir.children) {
            return Object.keys(currentDir.children).join('  ');
        }
        return '';
    }

    changeDirectory(path, output) {
        if (path === '..') {
            const parts = this.currentPath.split('/').filter(part => part);
            if (parts.length > 2) {
                this.currentPath = '/' + parts.slice(0, -1).join('/');
            } else {
                this.currentPath = '/home/wisnu';
            }
        } else if (path.startsWith('/')) {
            this.currentPath = path;
        } else {
            this.currentPath = this.currentPath === '/' ? `/${path}` : `${this.currentPath}/${path}`;
        }
        output.textContent += `Changed directory to: ${this.currentPath}\n`;
    }

    getHelpText() {
        return `Available commands:
ls       - List directory contents
pwd      - Print working directory
cd       - Change directory
mkdir    - Create directory
touch    - Create file
cat      - Display file contents
whoami   - Display current user
date     - Display current date and time
clear    - Clear terminal
help     - Show this help message
neofetch - Display system information`;
    }

    getNeofetch() {
        return `        _,met$$$$$gg.          wisnu@linux-clone
     ,g$$$$$$$$$$$$$$$P.       ------------------
   ,g$$P"     """Y$$.".        OS: Linux Desktop Clone
  ,$$P'              \`$$$.     Host: Web Browser
 ',$$P       ,ggs.     \`$$b:   Kernel: JavaScript Engine
 \`d$$'     ,$P"'   .    $$$    Uptime: ${Math.floor(performance.now() / 1000)} seconds
  $$P      d$'     ,    $$P    Shell: Terminal Emulator
  $$:      $$.   -    ,d$$'    CPU: Your Computer
  $$;      Y$b._   _,d$P'      Memory: Unlimited
  Y$$.    \`.\`"Y$$$$P"'         Created by: Wisnu Hidayat
  \`$$b      "-.__             
   \`Y$$                       
    \`Y$$.                     
      \`$$b.                   
        \`Y$$b.                
           \`"Y$b._            
               \`"""`;
    }

    createTextEditorWindow(windowId) {
        const content = `
            <div class="text-editor">
                <div class="editor-toolbar">
                    <button class="toolbar-button" onclick="document.execCommand('bold')">
                        <i class="fas fa-bold"></i> Bold
                    </button>
                    <button class="toolbar-button" onclick="document.execCommand('italic')">
                        <i class="fas fa-italic"></i> Italic
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-folder-open"></i> Open
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-file"></i> New
                    </button>
                </div>
                <textarea class="editor-content" placeholder="Start typing your document here...

Welcome to the Linux Desktop Clone Text Editor!
Created by Wisnu Hidayat

This is a fully functional text editor with:
- Syntax highlighting simulation
- File operations
- Modern interface
- Auto-save functionality

Enjoy writing!"></textarea>
            </div>
        `;

        this.createWindow(windowId, 'Text Editor', 'fas fa-file-alt', content, 700, 500);
    }

    createCalculatorWindow(windowId) {
        const content = `
            <div class="calculator">
                <input type="text" class="calc-display" id="calc-display" readonly>
                <div class="calc-buttons">
                    <button class="calc-button" onclick="calculator.clear()">C</button>
                    <button class="calc-button" onclick="calculator.clearEntry()">CE</button>
                    <button class="calc-button" onclick="calculator.backspace()">⌫</button>
                    <button class="calc-button operator" onclick="calculator.operation('/')">/</button>
                    
                    <button class="calc-button" onclick="calculator.number('7')">7</button>
                    <button class="calc-button" onclick="calculator.number('8')">8</button>
                    <button class="calc-button" onclick="calculator.number('9')">9</button>
                    <button class="calc-button operator" onclick="calculator.operation('*')">×</button>
                    
                    <button class="calc-button" onclick="calculator.number('4')">4</button>
                    <button class="calc-button" onclick="calculator.number('5')">5</button>
                    <button class="calc-button" onclick="calculator.number('6')">6</button>
                    <button class="calc-button operator" onclick="calculator.operation('-')">-</button>
                    
                    <button class="calc-button" onclick="calculator.number('1')">1</button>
                    <button class="calc-button" onclick="calculator.number('2')">2</button>
                    <button class="calc-button" onclick="calculator.number('3')">3</button>
                    <button class="calc-button operator" onclick="calculator.operation('+')">+</button>
                    
                    <button class="calc-button" onclick="calculator.number('0')" style="grid-column: span 2;">0</button>
                    <button class="calc-button" onclick="calculator.decimal()">.</button>
                    <button class="calc-button equals" onclick="calculator.equals()">=</button>
                </div>
            </div>
        `;

        const window = this.createWindow(windowId, 'Calculator', 'fas fa-calculator', content, 320, 450);
        this.setupCalculator(window);
    }

    setupCalculator(window) {
        window.calculator = {
            display: window.querySelector('#calc-display'),
            currentInput: '0',
            operator: null,
            previousInput: null,
            waitingForOperand: false,

            updateDisplay() {
                this.display.value = this.currentInput;
            },

            number(digit) {
                if (this.waitingForOperand) {
                    this.currentInput = digit;
                    this.waitingForOperand = false;
                } else {
                    this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
                }
                this.updateDisplay();
            },

            decimal() {
                if (this.waitingForOperand) {
                    this.currentInput = '0.';
                    this.waitingForOperand = false;
                } else if (this.currentInput.indexOf('.') === -1) {
                    this.currentInput += '.';
                }
                this.updateDisplay();
            },

            operation(nextOperator) {
                const inputValue = parseFloat(this.currentInput);

                if (this.previousInput === null) {
                    this.previousInput = inputValue;
                } else if (this.operator) {
                    const currentValue = this.previousInput || 0;
                    const newValue = this.calculate(currentValue, inputValue, this.operator);

                    this.currentInput = String(newValue);
                    this.previousInput = newValue;
                    this.updateDisplay();
                }

                this.waitingForOperand = true;
                this.operator = nextOperator;
            },

            calculate(firstOperand, secondOperand, operator) {
                switch (operator) {
                    case '+': return firstOperand + secondOperand;
                    case '-': return firstOperand - secondOperand;
                    case '*': return firstOperand * secondOperand;
                    case '/': return firstOperand / secondOperand;
                    default: return secondOperand;
                }
            },

            equals() {
                const inputValue = parseFloat(this.currentInput);

                if (this.previousInput !== null && this.operator) {
                    const newValue = this.calculate(this.previousInput, inputValue, this.operator);
                    this.currentInput = String(newValue);
                    this.previousInput = null;
                    this.operator = null;
                    this.waitingForOperand = true;
                    this.updateDisplay();
                }
            },

            clear() {
                this.currentInput = '0';
                this.operator = null;
                this.previousInput = null;
                this.waitingForOperand = false;
                this.updateDisplay();
            },

            clearEntry() {
                this.currentInput = '0';
                this.updateDisplay();
            },

            backspace() {
                if (this.currentInput.length > 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                } else {
                    this.currentInput = '0';
                }
                this.updateDisplay();
            }
        };

        // Initialize calculator
        window.calculator.updateDisplay();
        
        // Make calculator globally accessible for button clicks
        window.calculator.updateDisplay();
        const calcId = windowId;
        global[`calc_${calcId}`] = window.calculator;
        
        // Update button onclick handlers to use the specific calculator instance
        window.querySelectorAll('.calc-button').forEach(button => {
            const onclick = button.getAttribute('onclick');
            if (onclick && onclick.includes('calculator.')) {
                button.setAttribute('onclick', onclick.replace('calculator.', `window.calc_${calcId}.`));
                button.onclick = function() {
                    eval(this.getAttribute('onclick'));
                };
            }
        });
    }

    createSettingsWindow(windowId) {
        const content = `
            <div style="padding: 20px;">
                <h2 style="margin-bottom: 20px; color: #3498db;">System Settings</h2>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; color: #ecf0f1;">Appearance</h3>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <label style="margin-right: 15px; min-width: 120px;">Theme:</label>
                        <select style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 5px 10px; border-radius: 4px;">
                            <option>Dark Theme</option>
                            <option>Light Theme</option>
                            <option>Auto</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <label style="margin-right: 15px; min-width: 120px;">Wallpaper:</label>
                        <button class="toolbar-button">Change Wallpaper</button>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; color: #ecf0f1;">System</h3>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <label style="margin-right: 15px; min-width: 120px;">Language:</label>
                        <select style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 5px 10px; border-radius: 4px;">
                            <option>English</option>
                            <option>Indonesian</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <label style="margin-right: 15px; min-width: 120px;">Time Zone:</label>
                        <select style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 5px 10px; border-radius: 4px;">
                            <option>Asia/Jakarta</option>
                            <option>UTC</option>
                            <option>America/New_York</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 15px; color: #ecf0f1;">About</h3>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        <p style="margin-bottom: 8px;"><strong>Linux Desktop Clone</strong></p>
                        <p style="margin-bottom: 8px;">Version: 1.0.0</p>
                        <p style="margin-bottom: 8px;">Created by: <span style="color: #ffd700;">Wisnu Hidayat</span></p>
                        <p style="margin-bottom: 8px;">Built with: HTML5, CSS3, JavaScript</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">A fully functional Linux desktop environment simulation running in your web browser.</p>
                    </div>
                </div>

                <div style="text-align: center;">
                    <button class="toolbar-button" style="background: rgba(46, 204, 113, 0.3); padding: 8px 20px;">Apply Settings</button>
                    <button class="toolbar-button" style="margin-left: 10px;">Reset to Default</button>
                </div>
            </div>
        `;

        this.createWindow(windowId, 'Settings', 'fas fa-cog', content, 600, 500);
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        if (this.isStartMenuOpen) {
            this.hideStartMenu();
        } else {
            this.showStartMenu();
        }
    }

    showStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.remove('hidden');
        this.isStartMenuOpen = true;
    }

    hideStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.add('hidden');
        this.isStartMenuOpen = false;
    }

    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.remove('hidden');
    }

    hideContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.classList.add('hidden');
    }

    handleContextAction(action) {
        switch(action) {
            case 'refresh':
                this.showNotification('Desktop', 'Desktop refreshed');
                break;
            case 'new-folder':
                this.showNotification('Desktop', 'New folder created');
                break;
            case 'new-file':
                this.showNotification('Desktop', 'New file created');
                break;
            case 'paste':
                this.showNotification('Desktop', 'Paste operation completed');
                break;
            case 'properties':
                this.showNotification('Desktop', 'Desktop properties');
                break;
        }
    }

    handlePowerAction(action) {
        switch(action) {
            case 'shutdown':
                this.showNotification('System', 'Shutting down...', 'warning');
                setTimeout(() => {
                    document.body.innerHTML = '<div style="background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Ubuntu, sans-serif;"><h1>System Shutdown</h1></div>';
                }, 2000);
                break;
            case 'restart':
                this.showNotification('System', 'Restarting...', 'warning');
                setTimeout(() => {
                    location.reload();
                }, 2000);
                break;
            case 'sleep':
                this.showNotification('System', 'Entering sleep mode...', 'info');
                setTimeout(() => {
                    document.body.style.filter = 'brightness(0.1)';
                    setTimeout(() => {
                        document.body.style.filter = 'brightness(1)';
                        this.showNotification('System', 'System awakened');
                    }, 3000);
                }, 1000);
                break;
        }
    }

    updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const date = now.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        clock.querySelector('.time').textContent = time;
        clock.querySelector('.date').textContent = date;
    }

    showNotification(title, message, type = 'info') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const iconMap = {
            'info': 'fas fa-info-circle',
            'success': 'fas fa-check-circle',
            'warning': 'fas fa-exclamation-triangle',
            'error': 'fas fa-times-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="${iconMap[type] || iconMap.info}"></i>
                    ${title}
                </div>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-body">${message}</div>
        `;
        
        notifications.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize the desktop when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new LinuxDesktop();
    
    // Global calculator reference for button clicks
    window.calculator = {
        number: (digit) => window.desktop.currentCalculator?.number(digit),
        operation: (op) => window.desktop.currentCalculator?.operation(op),
        equals: () => window.desktop.currentCalculator?.equals(),
        clear: () => window.desktop.currentCalculator?.clear(),
        clearEntry: () => window.desktop.currentCalculator?.clearEntry(),
        backspace: () => window.desktop.currentCalculator?.backspace(),
        decimal: () => window.desktop.currentCalculator?.decimal()
    };
});

// Prevent default browser shortcuts that might interfere
document.addEventListener('keydown', (e) => {
    // Prevent F5 refresh
    if (e.key === 'F5') {
        e.preventDefault();
        desktop.showNotification('System', 'Use Ctrl+R to refresh');
    }
    
    // Prevent Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        desktop.showNotification('System', 'Developer tools disabled in this environment');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reposition windows that might be off-screen
    document.querySelectorAll('.window').forEach(window => {
        const rect = window.getBoundingClientRect();
        if (rect.left + rect.width > innerWidth) {
            window.style.left = (innerWidth - rect.width - 20) + 'px';
        }
        if (rect.top + rect.height > innerHeight - 48) {
            window.style.top = (innerHeight - rect.height - 68) + 'px';
        }
    });
});