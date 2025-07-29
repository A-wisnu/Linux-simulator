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
        setInterval(() => this.updateClock(), 1000);
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
                                        'readme.txt': { type: 'file', content: 'Welcome to Linux Desktop Clone!\nCreated by Wisnu Hidayat\n\nThis is a fully functional Linux desktop environment simulation.\nFeatures:\n- Complete terminal emulation\n- File management\n- System monitoring\n- Package management simulation' },
                                        'projects': { type: 'folder', children: {
                                            'web-dev': { type: 'folder', children: {
                                                'index.html': { type: 'file', content: '<!DOCTYPE html>\n<html>\n<head><title>Hello World</title></head>\n<body><h1>Hello Linux!</h1></body>\n</html>' }
                                            }}
                                        }},
                                        'notes.txt': { type: 'file', content: 'Linux Commands Notes:\n- ls: list files\n- grep: search text\n- find: locate files\n- ps: show processes' }
                                    }},
                                    'Downloads': { type: 'folder', children: {
                                        'linux-tutorial.pdf': { type: 'file', content: 'Linux Tutorial PDF Content' }
                                    }},
                                    'Pictures': { type: 'folder', children: {
                                        'wallpaper.jpg': { type: 'file', content: 'Beautiful Linux wallpaper' },
                                        'screenshots': { type: 'folder', children: {} }
                                    }},
                                    'Music': { type: 'folder', children: {
                                        'favorites': { type: 'folder', children: {} }
                                    }},
                                    'Videos': { type: 'folder', children: {} },
                                    'Desktop': { type: 'folder', children: {} },
                                    '.bashrc': { type: 'file', content: '# ~/.bashrc\n\nexport PATH=$PATH:/usr/local/bin\nalias ll="ls -la"\nalias la="ls -la"\nalias l="ls -l"\n\n# Custom prompt\nPS1="\\u@\\h:\\w\\$ "' },
                                    '.profile': { type: 'file', content: '# ~/.profile\n\nif [ "$BASH" ]; then\n    if [ -f ~/.bashrc ]; then\n        . ~/.bashrc\n    fi\nfi' }
                                }
                            }
                        }
                    },
                    'bin': { type: 'folder', children: {
                        'bash': { type: 'file', content: 'bash shell executable' },
                        'ls': { type: 'file', content: 'ls command executable' },
                        'cat': { type: 'file', content: 'cat command executable' },
                        'grep': { type: 'file', content: 'grep command executable' },
                        'ps': { type: 'file', content: 'ps command executable' }
                    }},
                    'usr': { type: 'folder', children: {
                        'bin': { type: 'folder', children: {
                            'find': { type: 'file', content: 'find command executable' },
                            'top': { type: 'file', content: 'top command executable' },
                            'vim': { type: 'file', content: 'vim editor executable' },
                            'nano': { type: 'file', content: 'nano editor executable' }
                        }},
                        'lib': { type: 'folder', children: {
                            'systemd': { type: 'folder', children: {} },
                            'x86_64-linux-gnu': { type: 'folder', children: {} }
                        }},
                        'share': { type: 'folder', children: {
                            'doc': { type: 'folder', children: {} },
                            'man': { type: 'folder', children: {
                                'man1': { type: 'folder', children: {} }
                            }}
                        }},
                        'local': { type: 'folder', children: {
                            'bin': { type: 'folder', children: {} },
                            'lib': { type: 'folder', children: {} }
                        }}
                    }},
                    'etc': { type: 'folder', children: {
                        'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nwisnu:x:1000:1000:Wisnu Hidayat:/home/wisnu:/bin/bash' },
                        'hosts': { type: 'file', content: '127.0.0.1\tlocalhost\n127.0.1.1\tlinux-clone' },
                        'fstab': { type: 'file', content: '# /etc/fstab: static file system information\n/dev/sda1 / ext4 defaults 0 1' },
                        'os-release': { type: 'file', content: 'NAME="Linux Desktop Clone"\nVERSION="1.0"\nID=linux-clone\nVERSION_ID="1.0"\nPRETTY_NAME="Linux Desktop Clone 1.0"' }
                    }},
                    'var': { type: 'folder', children: {
                        'log': { type: 'folder', children: {
                            'syslog': { type: 'file', content: 'System log entries...' },
                            'auth.log': { type: 'file', content: 'Authentication log entries...' }
                        }},
                        'lib': { type: 'folder', children: {} },
                        'tmp': { type: 'folder', children: {} }
                    }},
                    'tmp': { type: 'folder', children: {} },
                    'opt': { type: 'folder', children: {} },
                    'root': { type: 'folder', children: {
                        '.bashrc': { type: 'file', content: '# ~/.bashrc for root\n\nexport PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' }
                    }},
                    'proc': { type: 'folder', children: {
                        'cpuinfo': { type: 'file', content: 'processor\t: 0\nvendor_id\t: GenuineIntel\ncpu family\t: 6\nmodel\t\t: 142\nmodel name\t: Intel(R) Core(TM) i7-8565U CPU @ 1.80GHz' },
                        'meminfo': { type: 'file', content: 'MemTotal:        8388608 kB\nMemFree:         4194304 kB\nMemAvailable:    6291456 kB' }
                    }},
                    'sys': { type: 'folder', children: {
                        'class': { type: 'folder', children: {} },
                        'devices': { type: 'folder', children: {} }
                    }},
                    'dev': { type: 'folder', children: {
                        'null': { type: 'file', content: 'null device' },
                        'zero': { type: 'file', content: 'zero device' }
                    }},
                    'boot': { type: 'folder', children: {} },
                    'lib': { type: 'folder', children: {} },
                    'lib64': { type: 'folder', children: {} },
                    'sbin': { type: 'folder', children: {} }
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
            case 'system-monitor':
                this.createSystemMonitorWindow(windowId);
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

        // Mouse events
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(window.style.left);
            startTop = parseInt(window.style.top);
            
            this.focusWindow(window.id);
        });

        // Touch events for mobile
        header.addEventListener('touchstart', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            const touch = e.touches[0];
            isDragging = true;
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = parseInt(window.style.left);
            startTop = parseInt(window.style.top);
            
            this.focusWindow(window.id);
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const newLeft = startLeft + (e.clientX - startX);
            const newTop = startTop + (e.clientY - startY);
            
            window.style.left = Math.max(0, Math.min(newLeft, innerWidth - window.offsetWidth)) + 'px';
            window.style.top = Math.max(0, Math.min(newTop, innerHeight - window.offsetHeight - 48)) + 'px';
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const newLeft = startLeft + (touch.clientX - startX);
            const newTop = startTop + (touch.clientY - startY);
            
            window.style.left = Math.max(0, Math.min(newLeft, innerWidth - window.offsetWidth)) + 'px';
            window.style.top = Math.max(0, Math.min(newTop, innerHeight - window.offsetHeight - 48)) + 'px';
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.addEventListener('touchend', () => {
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
            // Clear any intervals for system monitor
            const interval = windowData.element.dataset.updateInterval;
            if (interval) {
                clearInterval(interval);
            }
            
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
                output.textContent += this.listDirectory(args) + '\n';
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
                    output.textContent += this.catFile(args[0]) + '\n';
                } else {
                    output.textContent += 'cat: missing operand\n';
                }
                break;
            case 'grep':
                if (args.length >= 2) {
                    output.textContent += this.grepCommand(args[0], args[1]) + '\n';
                } else {
                    output.textContent += 'grep: usage: grep pattern file\n';
                }
                break;
            case 'find':
                if (args.length > 0) {
                    output.textContent += this.findCommand(args) + '\n';
                } else {
                    output.textContent += this.findCommand(['.']) + '\n';
                }
                break;
            case 'ps':
                output.textContent += this.psCommand(args) + '\n';
                break;
            case 'top':
                output.textContent += this.topCommand() + '\n';
                break;
            case 'history':
                output.textContent += this.historyCommand() + '\n';
                break;
            case 'man':
                if (args.length > 0) {
                    output.textContent += this.manCommand(args[0]) + '\n';
                } else {
                    output.textContent += 'man: What manual page do you want?\n';
                }
                break;
            case 'uname':
                output.textContent += this.unameCommand(args) + '\n';
                break;
            case 'df':
                output.textContent += this.dfCommand() + '\n';
                break;
            case 'free':
                output.textContent += this.freeCommand() + '\n';
                break;
            case 'uptime':
                output.textContent += this.uptimeCommand() + '\n';
                break;
            case 'which':
                if (args.length > 0) {
                    output.textContent += this.whichCommand(args[0]) + '\n';
                } else {
                    output.textContent += 'which: missing operand\n';
                }
                break;
            case 'echo':
                output.textContent += args.join(' ') + '\n';
                break;
            case 'ping':
                if (args.length > 0) {
                    output.textContent += this.pingCommand(args[0]) + '\n';
                } else {
                    output.textContent += 'ping: usage: ping destination\n';
                }
                break;
            case 'wget':
                if (args.length > 0) {
                    output.textContent += this.wgetCommand(args[0]) + '\n';
                } else {
                    output.textContent += 'wget: missing URL\n';
                }
                break;
            case 'curl':
                if (args.length > 0) {
                    output.textContent += this.curlCommand(args[0]) + '\n';
                } else {
                    output.textContent += 'curl: try \'curl --help\' for more information\n';
                }
                break;
            case 'apt':
            case 'apt-get':
                output.textContent += this.aptCommand(args) + '\n';
                break;
            case 'sudo':
                if (args.length > 0) {
                    output.textContent += this.sudoCommand(args) + '\n';
                } else {
                    output.textContent += 'sudo: a command is required\n';
                }
                break;
            case 'htop':
                output.textContent += this.htopCommand() + '\n';
                break;
            case 'nano':
            case 'vim':
                if (args.length > 0) {
                    output.textContent += this.editorCommand(cmd, args[0]) + '\n';
                } else {
                    output.textContent += `${cmd}: filename required\n`;
                }
                break;
            case 'chmod':
                if (args.length >= 2) {
                    output.textContent += this.chmodCommand(args[0], args[1]) + '\n';
                } else {
                    output.textContent += 'chmod: usage: chmod mode file\n';
                }
                break;
            case 'chown':
                if (args.length >= 2) {
                    output.textContent += this.chownCommand(args[0], args[1]) + '\n';
                } else {
                    output.textContent += 'chown: usage: chown owner file\n';
                }
                break;
            case 'id':
                output.textContent += this.idCommand() + '\n';
                break;
            case 'hostname':
                output.textContent += 'linux-clone\n';
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

File & Directory Operations:
  ls [-l|-la]     - List directory contents
  pwd             - Print working directory
  cd              - Change directory
  mkdir           - Create directory
  touch           - Create file
  cat             - Display file contents
  find            - Search for files and directories
  chmod           - Change file permissions
  chown           - Change file ownership

Text Processing:
  grep            - Search for patterns in files
  echo            - Display text
  nano/vim        - Text editors

System Information:
  ps [aux]        - Display running processes
  top             - Display system processes (real-time)
  htop            - Enhanced system monitor
  uname [-a]      - System information
  df              - Display filesystem disk space usage
  free            - Display memory usage
  uptime          - Show system uptime
  whoami          - Display current user
  id              - Display user and group IDs
  hostname        - Display system hostname
  date            - Display current date and time
  history         - Show command history

Network Tools:
  ping            - Send ICMP echo requests
  wget            - Download files from web
  curl            - Transfer data from servers

Package Management:
  apt [action]    - Package manager
  sudo            - Execute commands as another user

System Tools:
  which           - Locate a command
  man             - Display manual pages
  clear           - Clear terminal
  help            - Show this help message
  neofetch        - Display detailed system information

Examples:
  ls -la                     List all files in detailed format
  grep "Linux" readme.txt    Search for "Linux" in readme.txt
  find /home -name "*.txt"   Find all .txt files in /home
  apt install vim            Install vim package
  sudo apt update            Update package lists
  ping google.com            Test network connectivity
  man ls                     Show manual for ls command
  ps aux                     Show all running processes
  chmod 755 script.sh        Make script executable`;
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

    // Enhanced terminal commands for Linux-like experience
    listDirectory(args) {
        const pathParts = this.currentPath.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (const part of pathParts) {
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            }
        }

        if (currentDir.children) {
            const items = Object.entries(currentDir.children);
            if (args.includes('-l')) {
                // Long format listing
                let result = 'total ' + items.length + '\n';
                items.forEach(([name, item]) => {
                    const permissions = item.type === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--';
                    const size = item.type === 'folder' ? '4096' : (item.content ? item.content.length : '0');
                    const date = new Date().toLocaleDateString();
                    result += `${permissions} 1 wisnu wisnu ${size.padStart(8)} ${date} ${name}\n`;
                });
                return result;
            } else if (args.includes('-la') || args.includes('-al')) {
                // Long format with hidden files
                let result = 'total ' + (items.length + 2) + '\n';
                result += 'drwxr-xr-x 1 wisnu wisnu     4096 ' + new Date().toLocaleDateString() + ' .\n';
                result += 'drwxr-xr-x 1 wisnu wisnu     4096 ' + new Date().toLocaleDateString() + ' ..\n';
                items.forEach(([name, item]) => {
                    const permissions = item.type === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--';
                    const size = item.type === 'folder' ? '4096' : (item.content ? item.content.length : '0');
                    const date = new Date().toLocaleDateString();
                    result += `${permissions} 1 wisnu wisnu ${size.padStart(8)} ${date} ${name}\n`;
                });
                return result;
            } else {
                return Object.keys(currentDir.children).join('  ');
            }
        }
        return '';
    }

    catFile(filename) {
        const pathParts = this.currentPath.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (const part of pathParts) {
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            }
        }

        if (currentDir.children && currentDir.children[filename]) {
            const file = currentDir.children[filename];
            if (file.type === 'file') {
                return file.content || 'This is a simulated file content.';
            } else {
                return `cat: ${filename}: Is a directory`;
            }
        }
        return `cat: ${filename}: No such file or directory`;
    }

    grepCommand(pattern, filename) {
        const content = this.catFile(filename);
        if (content.includes('No such file') || content.includes('Is a directory')) {
            return content;
        }
        
        const lines = content.split('\n');
        const matches = lines.filter(line => line.includes(pattern));
        return matches.length > 0 ? matches.join('\n') : '';
    }

    findCommand(args) {
        const searchPath = args[0] || '.';
        const results = [];
        
        const searchInDir = (dir, path) => {
            if (dir.children) {
                Object.entries(dir.children).forEach(([name, item]) => {
                    const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
                    results.push(fullPath);
                    if (item.type === 'folder') {
                        searchInDir(item, fullPath);
                    }
                });
            }
        };

        if (searchPath === '.') {
            results.push('.');
            const pathParts = this.currentPath.split('/').filter(part => part);
            let currentDir = this.fileSystem['/'];
            
            for (const part of pathParts) {
                if (currentDir.children && currentDir.children[part]) {
                    currentDir = currentDir.children[part];
                }
            }
            searchInDir(currentDir, '.');
        } else {
            searchInDir(this.fileSystem['/'], '');
        }

        return results.join('\n');
    }

    psCommand(args) {
        const processes = [
            '    PID TTY          TIME CMD',
            '   1234 pts/0    00:00:01 bash',
            '   1235 pts/0    00:00:00 terminal',
            '   1236 pts/0    00:00:00 file-manager',
            '   1237 pts/0    00:00:00 text-editor',
            '   1238 pts/0    00:00:00 ps'
        ];
        
        if (args.includes('aux') || args.includes('-aux')) {
            return `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
wisnu     1234  0.1  0.5  21256  4312 pts/0    Ss   10:30   0:01 bash
wisnu     1235  0.0  0.2  12456  2048 pts/0    S    10:31   0:00 terminal
wisnu     1236  0.0  0.3  15632  3072 pts/0    S    10:32   0:00 file-manager
wisnu     1237  0.0  0.2  11248  1984 pts/0    S    10:33   0:00 text-editor
wisnu     1238  0.0  0.1   8392  1024 pts/0    R+   10:34   0:00 ps aux`;
        }
        
        return processes.join('\n');
    }

    topCommand() {
        return `top - ${new Date().toLocaleTimeString()} up ${Math.floor(performance.now() / 60000)} min,  1 user,  load average: 0.15, 0.10, 0.05
Tasks:   5 total,   1 running,   4 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   8192.0 total,   4096.0 free,   2048.0 used,   2048.0 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.   6144.0 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1234 wisnu     20   0   21256   4312   3072 S   0.3   0.1   0:01.23 bash
   1235 wisnu     20   0   12456   2048   1536 S   0.0   0.0   0:00.45 terminal
   1236 wisnu     20   0   15632   3072   2304 S   0.0   0.0   0:00.12 file-manager
   1237 wisnu     20   0   11248   1984   1472 S   0.0   0.0   0:00.08 text-editor`;
    }

    historyCommand() {
        // This would require storing command history
        return `    1  ls
    2  pwd
    3  cd Documents
    4  ls -la
    5  cat readme.txt
    6  grep "Linux" readme.txt
    7  find . -name "*.txt"
    8  ps aux
    9  top
   10  history`;
    }

    manCommand(command) {
        const manPages = {
            'ls': `LS(1)                            User Commands                           LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List information about the FILEs (the current directory by default).

       -l     use a long listing format
       -a, --all
              do not ignore entries starting with .

EXAMPLES
       ls -l
              List files in long format
       ls -la
              List all files including hidden ones`,

            'cat': `CAT(1)                           User Commands                          CAT(1)

NAME
       cat - concatenate files and print on the standard output

SYNOPSIS
       cat [OPTION]... [FILE]...

DESCRIPTION
       Concatenate FILE(s) to standard output.

EXAMPLES
       cat file.txt
              Display contents of file.txt`,

            'grep': `GREP(1)                          User Commands                         GREP(1)

NAME
       grep - print lines matching a pattern

SYNOPSIS
       grep [OPTIONS] PATTERN [FILE...]

DESCRIPTION
       grep searches for PATTERN in each FILE.

EXAMPLES
       grep "hello" file.txt
              Search for "hello" in file.txt`
        };

        return manPages[command] || `No manual entry for ${command}`;
    }

    unameCommand(args) {
        if (args.includes('-a')) {
            return 'Linux linux-clone 5.15.0-web #1 SMP ' + new Date().toDateString() + ' x86_64 x86_64 x86_64 GNU/Linux';
        } else if (args.includes('-s')) {
            return 'Linux';
        } else if (args.includes('-r')) {
            return '5.15.0-web';
        } else if (args.includes('-m')) {
            return 'x86_64';
        }
        return 'Linux';
    }

    dfCommand() {
        return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1         10485760 5242880   5242880  50% /
tmpfs              4194304       0   4194304   0% /dev/shm
/dev/sda2          5242880 1048576   4194304  20% /home`;
    }

    freeCommand() {
        return `               total        used        free      shared  buff/cache   available
Mem:         8388608     2097152     4194304           0     2097152     6291456
Swap:              0           0           0`;
    }

    uptimeCommand() {
        const uptime = Math.floor(performance.now() / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        return ` ${new Date().toLocaleTimeString()}  up ${hours}:${minutes.toString().padStart(2, '0')},  1 user,  load average: 0.15, 0.10, 0.05`;
    }

    whichCommand(command) {
        const commonCommands = {
            'ls': '/bin/ls',
            'cat': '/bin/cat',
            'grep': '/bin/grep',
            'find': '/usr/bin/find',
            'ps': '/bin/ps',
            'top': '/usr/bin/top',
            'bash': '/bin/bash',
            'nano': '/usr/bin/nano',
            'vim': '/usr/bin/vim'
        };
        
        return commonCommands[command] || `${command} not found`;
    }

    // Network and system commands
    pingCommand(destination) {
        return `PING ${destination} (127.0.0.1) 56(84) bytes of data.
64 bytes from ${destination} (127.0.0.1): icmp_seq=1 ttl=64 time=0.045 ms
64 bytes from ${destination} (127.0.0.1): icmp_seq=2 ttl=64 time=0.042 ms
64 bytes from ${destination} (127.0.0.1): icmp_seq=3 ttl=64 time=0.038 ms

--- ${destination} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
round-trip min/avg/max/stddev = 0.038/0.042/0.045/0.003 ms`;
    }

    wgetCommand(url) {
        return `--${new Date().toISOString()}--  ${url}
Resolving ${url}... 127.0.0.1
Connecting to ${url}|127.0.0.1|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2048 (2.0K) [text/html]
Saving to: 'index.html'

index.html          100%[===================>]   2.00K  --.-KB/s    in 0s

${new Date().toISOString()} (--.-KB/s) - 'index.html' saved [2048/2048]`;
    }

    curlCommand(url) {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Example Response</title>
</head>
<body>
    <h1>Hello from ${url}</h1>
    <p>This is a simulated curl response.</p>
</body>
</html>`;
    }

    aptCommand(args) {
        if (args.length === 0) {
            return `apt 2.4.8 (amd64)
Usage: apt [options] command

apt is a commandline package manager and provides commands for
searching and managing as well as querying information about packages.
It provides the same functionality as the specialized APT tools,
like apt-get and apt-cache, but enables options more suitable for
interactive use by default.

Most used commands:
  list - list packages based on package names
  search - search in package descriptions
  show - show package details
  install - install packages
  remove - remove packages
  update - update list of available packages
  upgrade - upgrade the system by installing/upgrading packages
  full-upgrade - upgrade the system by removing/installing/upgrading packages`;
        }

        const action = args[0];
        switch(action) {
            case 'update':
                return `Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease
Get:2 http://security.ubuntu.com/ubuntu focal-security InRelease [114 kB]
Get:3 http://archive.ubuntu.com/ubuntu focal-updates InRelease [114 kB]
Fetched 228 kB in 1s (228 kB/s)
Reading package lists... Done`;
            
            case 'upgrade':
                return `Reading package lists... Done
Building dependency tree       
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`;
            
            case 'install':
                const packageName = args[1] || 'package';
                return `Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following NEW packages will be installed:
  ${packageName}
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 1,234 kB of archives.
After this operation, 5,678 kB of additional disk space will be used.
Get:1 http://archive.ubuntu.com/ubuntu focal/main amd64 ${packageName} amd64 1.0.0 [1,234 kB]
Fetched 1,234 kB in 1s (1,234 kB/s)
Selecting previously unselected package ${packageName}.
(Reading database ... 185432 files and directories currently installed.)
Preparing to unpack .../${packageName}_1.0.0_amd64.deb ...
Unpacking ${packageName} (1.0.0) ...
Setting up ${packageName} (1.0.0) ...
Processing triggers for man-db (2.9.1-1) ...`;
            
            case 'search':
                const query = args[1] || 'query';
                return `Sorting... Done
Full Text Search... Done
${query}/focal 1.0.0 amd64
  Sample package matching your search

${query}-dev/focal 1.0.0-dev amd64
  Development files for ${query}

lib${query}/focal 1.0.0 amd64
  Library files for ${query}`;
            
            default:
                return `E: Invalid operation ${action}`;
        }
    }

    sudoCommand(args) {
        const command = args.join(' ');
        return `[sudo] password for wisnu: 
Sorry, try again.
[sudo] password for wisnu: 
# Simulated sudo execution
# Command: ${command}
# Note: This is a simulation - no actual privileges escalated`;
    }

    htopCommand() {
        return `    PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
   1234 wisnu      20   0  21.2M  4.3M  3.0M S  2.3  0.1  0:01.23 bash
   1235 wisnu      20   0  12.4M  2.0M  1.5M S  0.0  0.0  0:00.45 terminal
   1236 wisnu      20   0  15.6M  3.0M  2.3M S  0.0  0.0  0:00.12 file-manager
   1237 wisnu      20   0  11.2M  1.9M  1.4M S  0.0  0.0  0:00.08 text-editor
   1238 wisnu      20   0   8.3M  1.0M  0.8M R  1.0  0.0  0:00.01 htop

Mem[||||||||||||||||||||||||                    2.0G/8.0G]
Swp[                                                0K/0K]

Tasks: 5, 127 thr; 1 running
Load average: 0.15 0.10 0.05 
Uptime: 00:${Math.floor(performance.now() / 60000).toString().padStart(2, '0')}:${Math.floor((performance.now() % 60000) / 1000).toString().padStart(2, '0')}`;
    }

    editorCommand(editor, filename) {
        if (editor === 'vim') {
            return `Starting vim editor for ${filename}...
# Vim simulation - file opened in text editor
# Use :wq to save and quit, :q! to quit without saving
# Note: This opens the file in the GUI text editor instead`;
        } else {
            return `GNU nano 4.8                     ${filename}

# Nano simulation - file opened in text editor
# ^X Exit  ^O Write Out  ^W Where Is  ^K Cut Text
# Note: This opens the file in the GUI text editor instead`;
        }
    }

    chmodCommand(mode, file) {
        return `Changed permissions of '${file}' to ${mode}
# Note: This is a simulation - no actual permissions changed`;
    }

    chownCommand(owner, file) {
        return `Changed ownership of '${file}' to ${owner}
# Note: This is a simulation - no actual ownership changed`;
    }

    idCommand() {
        return `uid=1000(wisnu) gid=1000(wisnu) groups=1000(wisnu),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lpadmin),131(lxd),132(sambashare)`;
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

    createSystemMonitorWindow(windowId) {
        const content = `
            <div class="system-monitor">
                <div class="monitor-header">
                    <h2><i class="fas fa-chart-line"></i> System Monitor</h2>
                    <div class="monitor-controls">
                        <button class="monitor-btn active" data-tab="overview">Overview</button>
                        <button class="monitor-btn" data-tab="processes">Processes</button>
                        <button class="monitor-btn" data-tab="resources">Resources</button>
                        <button class="monitor-btn" data-tab="filesystem">Filesystem</button>
                    </div>
                </div>
                
                <div class="monitor-content">
                    <div class="monitor-tab active" id="overview-tab">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-header">
                                    <i class="fas fa-microchip"></i>
                                    <span>CPU Usage</span>
                                </div>
                                <div class="stat-value" id="cpu-usage">25%</div>
                                <div class="progress-bar">
                                    <div class="progress-fill cpu-progress" style="width: 25%"></div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <i class="fas fa-memory"></i>
                                    <span>Memory Usage</span>
                                </div>
                                <div class="stat-value" id="memory-usage">2.1 GB / 8.0 GB</div>
                                <div class="progress-bar">
                                    <div class="progress-fill memory-progress" style="width: 26%"></div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <i class="fas fa-hdd"></i>
                                    <span>Disk Usage</span>
                                </div>
                                <div class="stat-value" id="disk-usage">45.2 GB / 100 GB</div>
                                <div class="progress-bar">
                                    <div class="progress-fill disk-progress" style="width: 45%"></div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <i class="fas fa-wifi"></i>
                                    <span>Network</span>
                                </div>
                                <div class="stat-value" id="network-usage">↓ 1.2 MB/s ↑ 245 KB/s</div>
                                <div class="network-status">
                                    <span class="status-dot connected"></span>
                                    Connected
                                </div>
                            </div>
                        </div>
                        
                        <div class="system-info">
                            <h3>System Information</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">OS:</span>
                                    <span class="info-value">Linux Desktop Clone 1.0</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Kernel:</span>
                                    <span class="info-value">5.15.0-web</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Uptime:</span>
                                    <span class="info-value" id="uptime">${Math.floor(performance.now() / 60000)} minutes</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Architecture:</span>
                                    <span class="info-value">x86_64</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="monitor-tab" id="processes-tab">
                        <div class="processes-header">
                            <h3>Running Processes</h3>
                            <button class="refresh-btn"><i class="fas fa-sync"></i> Refresh</button>
                        </div>
                        <div class="processes-table">
                            <div class="table-header">
                                <div class="col-pid">PID</div>
                                <div class="col-name">Process Name</div>
                                <div class="col-cpu">CPU %</div>
                                <div class="col-memory">Memory</div>
                                <div class="col-status">Status</div>
                            </div>
                            <div class="table-body" id="processes-list">
                                <div class="table-row">
                                    <div class="col-pid">1234</div>
                                    <div class="col-name">bash</div>
                                    <div class="col-cpu">2.3%</div>
                                    <div class="col-memory">4.3 MB</div>
                                    <div class="col-status"><span class="status-running">Running</span></div>
                                </div>
                                <div class="table-row">
                                    <div class="col-pid">1235</div>
                                    <div class="col-name">terminal</div>
                                    <div class="col-cpu">0.8%</div>
                                    <div class="col-memory">2.1 MB</div>
                                    <div class="col-status"><span class="status-running">Running</span></div>
                                </div>
                                <div class="table-row">
                                    <div class="col-pid">1236</div>
                                    <div class="col-name">file-manager</div>
                                    <div class="col-cpu">0.2%</div>
                                    <div class="col-memory">3.2 MB</div>
                                    <div class="col-status"><span class="status-sleeping">Sleeping</span></div>
                                </div>
                                <div class="table-row">
                                    <div class="col-pid">1237</div>
                                    <div class="col-name">text-editor</div>
                                    <div class="col-cpu">0.1%</div>
                                    <div class="col-memory">1.9 MB</div>
                                    <div class="col-status"><span class="status-sleeping">Sleeping</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="monitor-tab" id="resources-tab">
                        <div class="resource-charts">
                            <div class="chart-container">
                                <h3>CPU History</h3>
                                <div class="chart cpu-chart">
                                    <div class="chart-line"></div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <h3>Memory History</h3>
                                <div class="chart memory-chart">
                                    <div class="chart-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="monitor-tab" id="filesystem-tab">
                        <div class="filesystem-info">
                            <h3>Filesystem Usage</h3>
                            <div class="fs-table">
                                <div class="fs-header">
                                    <div class="fs-col">Filesystem</div>
                                    <div class="fs-col">Size</div>
                                    <div class="fs-col">Used</div>
                                    <div class="fs-col">Available</div>
                                    <div class="fs-col">Use%</div>
                                    <div class="fs-col">Mounted on</div>
                                </div>
                                <div class="fs-body">
                                    <div class="fs-row">
                                        <div class="fs-col">/dev/sda1</div>
                                        <div class="fs-col">100G</div>
                                        <div class="fs-col">45G</div>
                                        <div class="fs-col">50G</div>
                                        <div class="fs-col">
                                            <div class="usage-bar">
                                                <div class="usage-fill" style="width: 45%"></div>
                                                45%
                                            </div>
                                        </div>
                                        <div class="fs-col">/</div>
                                    </div>
                                    <div class="fs-row">
                                        <div class="fs-col">/dev/sda2</div>
                                        <div class="fs-col">50G</div>
                                        <div class="fs-col">10G</div>
                                        <div class="fs-col">38G</div>
                                        <div class="fs-col">
                                            <div class="usage-bar">
                                                <div class="usage-fill" style="width: 20%"></div>
                                                20%
                                            </div>
                                        </div>
                                        <div class="fs-col">/home</div>
                                    </div>
                                    <div class="fs-row">
                                        <div class="fs-col">tmpfs</div>
                                        <div class="fs-col">4.0G</div>
                                        <div class="fs-col">0</div>
                                        <div class="fs-col">4.0G</div>
                                        <div class="fs-col">
                                            <div class="usage-bar">
                                                <div class="usage-fill" style="width: 0%"></div>
                                                0%
                                            </div>
                                        </div>
                                        <div class="fs-col">/tmp</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const window = this.createWindow(windowId, 'System Monitor', 'fas fa-chart-line', content, 800, 600);
        this.setupSystemMonitor(window);
    }

    setupSystemMonitor(window) {
        const tabs = window.querySelectorAll('.monitor-btn');
        const tabContents = window.querySelectorAll('.monitor-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                tab.classList.add('active');
                const targetTab = window.querySelector(`#${tab.dataset.tab}-tab`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });

        // Simulate real-time updates
        const updateStats = () => {
            const cpuUsage = Math.floor(Math.random() * 40 + 10); // 10-50%
            const memoryUsed = (Math.random() * 2 + 1.5).toFixed(1); // 1.5-3.5 GB
            const memoryPercent = Math.floor((memoryUsed / 8) * 100);
            
            const cpuElement = window.querySelector('#cpu-usage');
            const memoryElement = window.querySelector('#memory-usage');
            const cpuProgress = window.querySelector('.cpu-progress');
            const memoryProgress = window.querySelector('.memory-progress');
            const uptimeElement = window.querySelector('#uptime');
            
            if (cpuElement) cpuElement.textContent = `${cpuUsage}%`;
            if (memoryElement) memoryElement.textContent = `${memoryUsed} GB / 8.0 GB`;
            if (cpuProgress) cpuProgress.style.width = `${cpuUsage}%`;
            if (memoryProgress) memoryProgress.style.width = `${memoryPercent}%`;
            if (uptimeElement) uptimeElement.textContent = `${Math.floor(performance.now() / 60000)} minutes`;
        };

        // Update every 2 seconds
        const interval = setInterval(updateStats, 2000);
        
        // Store interval ID to clear it when window is closed
        window.dataset.updateInterval = interval;
        
        // Initial update
        updateStats();
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