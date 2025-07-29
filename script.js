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
        this.currentUser = 'wisnu';
        this.processes = new Map();
        this.processIdCounter = 1000;
        this.systemInfo = {
            kernel: 'Linux Desktop Clone 5.15.0',
            architecture: 'x86_64',
            hostname: 'linux-clone',
            uptime: Date.now(),
            memory: { total: 8192, used: 2048, free: 6144 },
            cpu: { cores: 4, model: 'Virtual CPU @ 2.4GHz' },
            network: { interface: 'eth0', ip: '192.168.1.100', status: 'connected' }
        };
        this.environmentVars = {
            'HOME': '/home/wisnu',
            'USER': 'wisnu',
            'PATH': '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            'SHELL': '/bin/bash',
            'TERM': 'xterm-256color',
            'LANG': 'en_US.UTF-8',
            'PWD': '/home/wisnu'
        };
        this.aliases = {
            'll': 'ls -la',
            'la': 'ls -A',
            'l': 'ls -CF',
            'grep': 'grep --color=auto',
            'fgrep': 'fgrep --color=auto',
            'egrep': 'egrep --color=auto'
        };
        this.packageManager = new PackageManager();
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
                permissions: 'drwxr-xr-x',
                owner: 'root',
                group: 'root',
                size: 4096,
                modified: new Date('2024-01-01'),
                children: {
                    'home': {
                        type: 'folder',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date('2024-01-15'),
                        children: {
                            'wisnu': {
                                type: 'folder',
                                permissions: 'drwxr-xr-x',
                                owner: 'wisnu',
                                group: 'wisnu',
                                size: 4096,
                                modified: new Date(),
                                children: {
                                    'Documents': { 
                                        type: 'folder', 
                                        permissions: 'drwxr-xr-x',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 4096,
                                        modified: new Date(),
                                        children: {
                                            'readme.txt': { 
                                                type: 'file', 
                                                permissions: '-rw-r--r--',
                                                owner: 'wisnu',
                                                group: 'wisnu',
                                                size: 156,
                                                modified: new Date(),
                                                content: 'Welcome to Linux Desktop Clone!\nCreated by Wisnu Hidayat\n\nThis is a fully functional Linux desktop environment simulation with advanced features:\n- Complete filesystem simulation\n- Process management\n- Package manager\n- Network tools\n- System monitoring\n\nEnjoy exploring!' 
                                            },
                                            'projects': { 
                                                type: 'folder', 
                                                permissions: 'drwxr-xr-x',
                                                owner: 'wisnu',
                                                group: 'wisnu',
                                                size: 4096,
                                                modified: new Date(),
                                                children: {
                                                    'website.html': {
                                                        type: 'file',
                                                        permissions: '-rw-r--r--',
                                                        owner: 'wisnu',
                                                        group: 'wisnu',
                                                        size: 245,
                                                        modified: new Date(),
                                                        content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Project</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my web project.</p>\n</body>\n</html>'
                                                    },
                                                    'script.py': {
                                                        type: 'file',
                                                        permissions: '-rwxr-xr-x',
                                                        owner: 'wisnu',
                                                        group: 'wisnu',
                                                        size: 89,
                                                        modified: new Date(),
                                                        content: '#!/usr/bin/env python3\n\ndef main():\n    print("Hello from Python!")\n    print("Linux Desktop Clone")\n\nif __name__ == "__main__":\n    main()'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    'Downloads': { 
                                        type: 'folder', 
                                        permissions: 'drwxr-xr-x',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 4096,
                                        modified: new Date(),
                                        children: {
                                            'linux-manual.pdf': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'wisnu',
                                                group: 'wisnu',
                                                size: 2048576,
                                                modified: new Date(),
                                                content: 'PDF: Linux System Administration Manual'
                                            }
                                        }
                                    },
                                    'Pictures': { 
                                        type: 'folder', 
                                        permissions: 'drwxr-xr-x',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 4096,
                                        modified: new Date(),
                                        children: {
                                            'wallpaper.jpg': { 
                                                type: 'file', 
                                                permissions: '-rw-r--r--',
                                                owner: 'wisnu',
                                                group: 'wisnu',
                                                size: 1024768,
                                                modified: new Date(),
                                                content: 'JPEG Image: Desktop Wallpaper' 
                                            },
                                            'screenshot.png': {
                                                type: 'file',
                                                permissions: '-rw-r--r--',
                                                owner: 'wisnu',
                                                group: 'wisnu',
                                                size: 512384,
                                                modified: new Date(),
                                                content: 'PNG Image: Desktop Screenshot'
                                            }
                                        }
                                    },
                                    'Music': { 
                                        type: 'folder', 
                                        permissions: 'drwxr-xr-x',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 4096,
                                        modified: new Date(),
                                        children: {} 
                                    },
                                    'Videos': { 
                                        type: 'folder', 
                                        permissions: 'drwxr-xr-x',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 4096,
                                        modified: new Date(),
                                        children: {} 
                                    },
                                    'Desktop': { 
                                        type: 'folder', 
                                        permissions: 'drwxr-xr-x',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 4096,
                                        modified: new Date(),
                                        children: {} 
                                    },
                                    '.bashrc': {
                                        type: 'file',
                                        permissions: '-rw-r--r--',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 1024,
                                        modified: new Date(),
                                        content: '# ~/.bashrc: executed by bash(1) for non-login shells\n\n# User specific aliases and functions\nalias ll="ls -la"\nalias la="ls -A"\nalias l="ls -CF"\n\n# Custom prompt\nPS1="\\u@\\h:\\w\\$ "\n\n# History settings\nHISTSIZE=1000\nHISTFILESIZE=2000\n\necho "Welcome to Linux Desktop Clone Terminal!"'
                                    },
                                    '.profile': {
                                        type: 'file',
                                        permissions: '-rw-r--r--',
                                        owner: 'wisnu',
                                        group: 'wisnu',
                                        size: 512,
                                        modified: new Date(),
                                        content: '# ~/.profile: executed by the command interpreter for login shells\n\n# Set PATH\nPATH="$HOME/bin:$HOME/.local/bin:$PATH"\nexport PATH\n\n# Default editor\nexport EDITOR=nano\n\n# Load .bashrc if it exists\nif [ -f "$HOME/.bashrc" ]; then\n    . "$HOME/.bashrc"\nfi'
                                    }
                                }
                            },
                            'root': {
                                type: 'folder',
                                permissions: 'drwx------',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date('2024-01-01'),
                                children: {}
                            }
                        }
                    },
                    'usr': { 
                        type: 'folder', 
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date('2024-01-01'),
                        children: {
                            'bin': { 
                                type: 'folder', 
                                permissions: 'drwxr-xr-x',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date('2024-01-01'),
                                children: {
                                    'python3': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 14328, modified: new Date('2024-01-01'), content: 'Python 3.9.2 interpreter' },
                                    'node': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 32768, modified: new Date('2024-01-01'), content: 'Node.js runtime' },
                                    'git': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 2048, modified: new Date('2024-01-01'), content: 'Git version control' },
                                    'nano': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 245760, modified: new Date('2024-01-01'), content: 'Nano text editor' },
                                    'vim': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 3096576, modified: new Date('2024-01-01'), content: 'Vim text editor' }
                                }
                            },
                            'lib': { 
                                type: 'folder', 
                                permissions: 'drwxr-xr-x',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date('2024-01-01'),
                                children: {}
                            },
                            'share': {
                                type: 'folder',
                                permissions: 'drwxr-xr-x',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date('2024-01-01'),
                                children: {
                                    'applications': {
                                        type: 'folder',
                                        permissions: 'drwxr-xr-x',
                                        owner: 'root',
                                        group: 'root',
                                        size: 4096,
                                        modified: new Date('2024-01-01'),
                                        children: {}
                                    }
                                }
                            }
                        }
                    },
                    'etc': { 
                        type: 'folder', 
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date('2024-01-01'),
                        children: {
                            'passwd': {
                                type: 'file',
                                permissions: '-rw-r--r--',
                                owner: 'root',
                                group: 'root',
                                size: 1024,
                                modified: new Date('2024-01-01'),
                                content: 'root:x:0:0:root:/root:/bin/bash\nwisnu:x:1000:1000:Wisnu Hidayat,,,:/home/wisnu:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin'
                            },
                            'hosts': {
                                type: 'file',
                                permissions: '-rw-r--r--',
                                owner: 'root',
                                group: 'root',
                                size: 256,
                                modified: new Date('2024-01-01'),
                                content: '127.0.0.1\tlocalhost\n127.0.1.1\tlinux-clone\n\n# IPv6\n::1\tip6-localhost ip6-loopback\nfe00::0\tip6-localnet\nff00::0\tip6-mcastprefix\nff02::1\tip6-allnodes\nff02::2\tip6-allrouters'
                            },
                            'os-release': {
                                type: 'file',
                                permissions: '-rw-r--r--',
                                owner: 'root',
                                group: 'root',
                                size: 512,
                                modified: new Date('2024-01-01'),
                                content: 'PRETTY_NAME="Linux Desktop Clone 22.04 LTS"\nNAME="Linux Desktop Clone"\nVERSION_ID="22.04"\nVERSION="22.04 (Jammy Jellyfish)"\nVERSION_CODENAME=jammy\nID=linux-clone\nID_LIKE=debian\nHOME_URL="https://linux-clone.com/"\nSUPPORT_URL="https://help.linux-clone.com/"\nBUG_REPORT_URL="https://bugs.linux-clone.com/"'
                            }
                        }
                    },
                    'var': { 
                        type: 'folder', 
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date('2024-01-01'),
                        children: {
                            'log': {
                                type: 'folder',
                                permissions: 'drwxr-xr-x',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date(),
                                children: {
                                    'syslog': {
                                        type: 'file',
                                        permissions: '-rw-r--r--',
                                        owner: 'syslog',
                                        group: 'adm',
                                        size: 8192,
                                        modified: new Date(),
                                        content: `${new Date().toISOString()} linux-clone systemd[1]: Started Linux Desktop Clone.\n${new Date().toISOString()} linux-clone kernel: Linux Desktop Clone initialized\n${new Date().toISOString()} linux-clone NetworkManager: device (eth0): state change: activated\n${new Date().toISOString()} linux-clone systemd[1]: Reached target Graphical Interface.`
                                    }
                                }
                            },
                            'cache': {
                                type: 'folder',
                                permissions: 'drwxr-xr-x',
                                owner: 'root',
                                group: 'root',
                                size: 4096,
                                modified: new Date(),
                                children: {}
                            }
                        }
                    },
                    'tmp': {
                        type: 'folder',
                        permissions: 'drwxrwxrwt',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date(),
                        children: {}
                    },
                    'bin': {
                        type: 'folder',
                        permissions: 'drwxr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 4096,
                        modified: new Date('2024-01-01'),
                        children: {
                            'bash': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 1183448, modified: new Date('2024-01-01'), content: 'Bash shell' },
                            'ls': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 147176, modified: new Date('2024-01-01'), content: 'List directory contents' },
                            'cat': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 43816, modified: new Date('2024-01-01'), content: 'Concatenate files' },
                            'grep': { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 232472, modified: new Date('2024-01-01'), content: 'Search text patterns' }
                        }
                    },
                    'proc': {
                        type: 'folder',
                        permissions: 'dr-xr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 0,
                        modified: new Date(),
                        children: {}
                    },
                    'sys': {
                        type: 'folder',
                        permissions: 'dr-xr-xr-x',
                        owner: 'root',
                        group: 'root',
                        size: 0,
                        modified: new Date(),
                        children: {}
                    }
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
            case 'code-editor':
                this.createCodeEditorWindow(windowId);
                break;
            case 'package-manager':
                this.createPackageManagerWindow(windowId);
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
        const originalCommand = command;
        const parts = command.split(' ').filter(part => part.trim());
        if (parts.length === 0) {
            output.textContent += 'wisnu@linux-clone:~$ ';
            output.scrollTop = output.scrollHeight;
            return;
        }

        let cmd = parts[0];
        let args = parts.slice(1);

        // Handle aliases
        if (this.aliases[cmd]) {
            const aliasCommand = this.aliases[cmd];
            const aliasParts = aliasCommand.split(' ');
            cmd = aliasParts[0];
            args = [...aliasParts.slice(1), ...args];
        }

        output.textContent += originalCommand + '\n';

        try {
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
                    } else {
                        this.changeDirectory('/home/wisnu', output);
                    }
                    break;
                case 'mkdir':
                    if (args.length > 0) {
                        this.createDirectory(args[0], output);
                    } else {
                        output.textContent += 'mkdir: missing operand\n';
                    }
                    break;
                case 'touch':
                    if (args.length > 0) {
                        this.createFile(args[0], output);
                    } else {
                        output.textContent += 'touch: missing operand\n';
                    }
                    break;
                case 'cat':
                    if (args.length > 0) {
                        this.displayFileContent(args[0], output);
                    } else {
                        output.textContent += 'cat: missing operand\n';
                    }
                    break;
                case 'whoami':
                    output.textContent += this.currentUser + '\n';
                    break;
                case 'date':
                    output.textContent += new Date().toString() + '\n';
                    break;
                case 'clear':
                    output.textContent = 'Linux Desktop Clone Terminal v2.0\nCreated by Wisnu Hidayat\n\n';
                    break;
                case 'help':
                    output.textContent += this.getHelpText() + '\n';
                    break;
                case 'neofetch':
                    output.textContent += this.getNeofetch() + '\n';
                    break;
                case 'ps':
                    output.textContent += this.listProcesses(args) + '\n';
                    break;
                case 'top':
                    output.textContent += this.showSystemMonitor() + '\n';
                    break;
                case 'df':
                    output.textContent += this.showDiskUsage() + '\n';
                    break;
                case 'free':
                    output.textContent += this.showMemoryUsage() + '\n';
                    break;
                case 'uname':
                    output.textContent += this.showSystemInfo(args) + '\n';
                    break;
                case 'env':
                    output.textContent += this.showEnvironmentVars() + '\n';
                    break;
                case 'echo':
                    output.textContent += this.echoCommand(args) + '\n';
                    break;
                case 'grep':
                    output.textContent += this.grepCommand(args) + '\n';
                    break;
                case 'find':
                    output.textContent += this.findCommand(args) + '\n';
                    break;
                case 'which':
                    output.textContent += this.whichCommand(args) + '\n';
                    break;
                case 'history':
                    output.textContent += this.showHistory() + '\n';
                    break;
                case 'alias':
                    output.textContent += this.showAliases() + '\n';
                    break;
                case 'chmod':
                    output.textContent += this.changePermissions(args) + '\n';
                    break;
                case 'chown':
                    output.textContent += this.changeOwnership(args) + '\n';
                    break;
                case 'cp':
                    output.textContent += this.copyFile(args) + '\n';
                    break;
                case 'mv':
                    output.textContent += this.moveFile(args) + '\n';
                    break;
                case 'rm':
                    output.textContent += this.removeFile(args) + '\n';
                    break;
                case 'nano':
                case 'vim':
                    this.openTextEditor(args[0] || 'untitled.txt');
                    output.textContent += `Opening ${cmd} editor...\n`;
                    break;
                case 'python3':
                case 'python':
                    output.textContent += this.runPython(args) + '\n';
                    break;
                case 'node':
                    output.textContent += this.runNode(args) + '\n';
                    break;
                case 'git':
                    output.textContent += this.runGit(args) + '\n';
                    break;
                case 'apt':
                case 'apt-get':
                    output.textContent += this.packageManager.handleCommand(args) + '\n';
                    break;
                case 'systemctl':
                    output.textContent += this.systemControl(args) + '\n';
                    break;
                case 'journalctl':
                    output.textContent += this.showSystemLogs(args) + '\n';
                    break;
                case 'ifconfig':
                case 'ip':
                    output.textContent += this.showNetworkInfo() + '\n';
                    break;
                case 'ping':
                    output.textContent += this.pingCommand(args) + '\n';
                    break;
                case 'wget':
                case 'curl':
                    output.textContent += this.downloadCommand(cmd, args) + '\n';
                    break;
                case 'tar':
                    output.textContent += this.tarCommand(args) + '\n';
                    break;
                case 'kill':
                    output.textContent += this.killProcess(args) + '\n';
                    break;
                case 'su':
                    output.textContent += this.switchUser(args) + '\n';
                    break;
                case 'sudo':
                    output.textContent += this.sudoCommand(args) + '\n';
                    break;
                case 'man':
                    output.textContent += this.showManual(args) + '\n';
                    break;
                case 'lscpu':
                    output.textContent += this.showCpuInfo() + '\n';
                    break;
                case 'lsblk':
                    output.textContent += this.showBlockDevices() + '\n';
                    break;
                case 'mount':
                    output.textContent += this.showMounts() + '\n';
                    break;
                case 'uptime':
                    output.textContent += this.showUptime() + '\n';
                    break;
                case 'w':
                case 'who':
                    output.textContent += this.showLoggedUsers() + '\n';
                    break;
                case 'id':
                    output.textContent += this.showUserInfo() + '\n';
                    break;
                case 'groups':
                    output.textContent += this.showUserGroups() + '\n';
                    break;
                case 'exit':
                case 'logout':
                    output.textContent += 'Goodbye!\n';
                    setTimeout(() => this.closeWindow(output.closest('.window').id), 1000);
                    break;
                default:
                    // Check if it's an executable file
                    if (this.isExecutable(cmd)) {
                        output.textContent += this.executeFile(cmd, args) + '\n';
                    } else {
                        output.textContent += `${cmd}: command not found\n`;
                        output.textContent += `Try 'help' for available commands.\n`;
                    }
            }
        } catch (error) {
            output.textContent += `Error: ${error.message}\n`;
        }

        output.textContent += `${this.currentUser}@linux-clone:${this.currentPath}$ `;
        output.scrollTop = output.scrollHeight;
        
        // Update environment variable
        this.environmentVars.PWD = this.currentPath;
    }

    listDirectory(args = []) {
        const pathParts = this.currentPath.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (const part of pathParts) {
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            }
        }

        if (!currentDir.children) {
            return '';
        }

        // Parse options
        const showAll = args.includes('-a') || args.includes('-A');
        const longFormat = args.includes('-l');
        const showHidden = args.includes('-a');

        let entries = Object.entries(currentDir.children);
        
        if (!showAll) {
            entries = entries.filter(([name]) => !name.startsWith('.'));
        }

        if (longFormat) {
            let result = `total ${entries.length}\n`;
            entries.forEach(([name, item]) => {
                const permissions = item.permissions || '-rw-r--r--';
                const owner = item.owner || 'wisnu';
                const group = item.group || 'wisnu';
                const size = item.size || 0;
                const modified = item.modified ? item.modified.toLocaleDateString() : new Date().toLocaleDateString();
                const time = item.modified ? item.modified.toLocaleTimeString().slice(0, 5) : new Date().toLocaleTimeString().slice(0, 5);
                
                result += `${permissions} 1 ${owner} ${group} ${size.toString().padStart(8)} ${modified} ${time} ${name}\n`;
            });
            return result.trim();
        } else {
            return entries.map(([name]) => name).join('  ');
        }
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

File Operations:
ls [-la]    - List directory contents
pwd         - Print working directory  
cd [dir]    - Change directory
mkdir <dir> - Create directory
touch <file>- Create file
cat <file>  - Display file contents
cp <src> <dst> - Copy file/directory
mv <src> <dst> - Move/rename file
rm [-rf] <file> - Remove file/directory
find <path> - Find files and directories
grep <pattern> - Search text patterns
chmod <mode> <file> - Change file permissions
chown <user> <file> - Change file ownership

System Information:
whoami      - Display current user
date        - Display current date and time
uname [-a]  - System information
uptime      - System uptime
free        - Memory usage
df          - Disk usage
ps [aux]    - Running processes
top         - System monitor
lscpu       - CPU information
lsblk       - Block devices
mount       - Mounted filesystems
w/who       - Logged in users
id          - User ID information
groups      - User groups

Network:
ifconfig/ip - Network interface info
ping <host> - Ping network host
wget/curl <url> - Download files

Package Management:
apt update     - Update package list
apt install <pkg> - Install package
apt remove <pkg>  - Remove package
apt list       - List packages

System Control:
systemctl <action> <service> - Control services
journalctl     - View system logs
sudo <command> - Run as superuser
su [user]      - Switch user

Programming:
python3 <file> - Run Python script
node <file>    - Run Node.js script
git <command>  - Git version control
nano/vim <file> - Text editors

Utilities:
echo <text>    - Display text
env            - Environment variables
alias          - Command aliases
history        - Command history
which <cmd>    - Locate command
man <cmd>      - Manual pages
tar <options>  - Archive files
kill <pid>     - Kill process

clear       - Clear terminal
help        - Show this help message
neofetch    - Display system information
exit/logout - Exit terminal`;
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

    createSystemMonitorWindow(windowId) {
        const content = `
            <div style="padding: 15px; height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #3498db;">CPU Usage</h3>
                        <div style="font-size: 2rem; color: #27ae60;">2.3%</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">4 cores @ 2.4GHz</div>
                    </div>
                    <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #e74c3c;">Memory</h3>
                        <div style="font-size: 2rem; color: #f39c12;">25%</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">2.0 GB / 8.0 GB</div>
                    </div>
                    <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #9b59b6;">Network</h3>
                        <div style="font-size: 1.2rem; color: #27ae60;">↓ 1.2 MB/s</div>
                        <div style="font-size: 1.2rem; color: #e74c3c;">↑ 0.3 MB/s</div>
                    </div>
                </div>
                
                <div style="flex: 1; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; overflow: auto;">
                    <h3 style="margin-bottom: 15px; color: #ecf0f1;">Running Processes</h3>
                    <table style="width: 100%; font-size: 0.9rem; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                                <th style="text-align: left; padding: 8px; color: #bdc3c7;">PID</th>
                                <th style="text-align: left; padding: 8px; color: #bdc3c7;">Name</th>
                                <th style="text-align: left; padding: 8px; color: #bdc3c7;">CPU%</th>
                                <th style="text-align: left; padding: 8px; color: #bdc3c7;">Memory</th>
                                <th style="text-align: left; padding: 8px; color: #bdc3c7;">User</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 8px;">1</td>
                                <td style="padding: 8px;">systemd</td>
                                <td style="padding: 8px; color: #27ae60;">0.1</td>
                                <td style="padding: 8px;">13.2 MB</td>
                                <td style="padding: 8px;">root</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 8px;">1000</td>
                                <td style="padding: 8px;">bash</td>
                                <td style="padding: 8px; color: #27ae60;">0.0</td>
                                <td style="padding: 8px;">5.1 MB</td>
                                <td style="padding: 8px;">wisnu</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 8px;">1001</td>
                                <td style="padding: 8px;">desktop-clone</td>
                                <td style="padding: 8px; color: #f39c12;">2.3</td>
                                <td style="padding: 8px;">45.8 MB</td>
                                <td style="padding: 8px;">wisnu</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 8px;">1002</td>
                                <td style="padding: 8px;">firefox</td>
                                <td style="padding: 8px; color: #e74c3c;">8.7</td>
                                <td style="padding: 8px;">234.5 MB</td>
                                <td style="padding: 8px;">wisnu</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 8px;">1003</td>
                                <td style="padding: 8px;">code</td>
                                <td style="padding: 8px; color: #f39c12;">3.2</td>
                                <td style="padding: 8px;">156.3 MB</td>
                                <td style="padding: 8px;">wisnu</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="toolbar-button" style="background: rgba(231, 76, 60, 0.3);">
                        <i class="fas fa-stop"></i> End Process
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-sync"></i> Refresh
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-chart-bar"></i> Details
                    </button>
                </div>
            </div>
        `;
        
        this.createWindow(windowId, 'System Monitor', 'fas fa-chart-line', content, 700, 500);
    }

    createCodeEditorWindow(windowId) {
        const content = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px; align-items: center;">
                    <button class="toolbar-button">
                        <i class="fas fa-file"></i> New
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-folder-open"></i> Open
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <div style="width: 1px; height: 20px; background: rgba(255,255,255,0.2); margin: 0 5px;"></div>
                    <button class="toolbar-button">
                        <i class="fas fa-play"></i> Run
                    </button>
                    <button class="toolbar-button">
                        <i class="fas fa-bug"></i> Debug
                    </button>
                    <div style="flex: 1;"></div>
                    <select style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 5px; border-radius: 4px;">
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>HTML</option>
                        <option>CSS</option>
                        <option>JSON</option>
                    </select>
                </div>
                
                <div style="display: flex; flex: 1;">
                    <div style="width: 200px; background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.1); padding: 10px;">
                        <h4 style="margin-bottom: 10px; color: #bdc3c7; font-size: 0.9rem;">EXPLORER</h4>
                        <div style="font-size: 0.8rem;">
                            <div style="margin-bottom: 5px; cursor: pointer; padding: 3px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                <i class="fas fa-folder" style="color: #f39c12; margin-right: 5px;"></i>projects
                            </div>
                            <div style="margin-left: 15px; margin-bottom: 3px; cursor: pointer; padding: 3px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                <i class="fas fa-file-code" style="color: #3498db; margin-right: 5px;"></i>index.html
                            </div>
                            <div style="margin-left: 15px; margin-bottom: 3px; cursor: pointer; padding: 3px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                <i class="fas fa-file-code" style="color: #e74c3c; margin-right: 5px;"></i>style.css
                            </div>
                            <div style="margin-left: 15px; margin-bottom: 3px; cursor: pointer; padding: 3px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                <i class="fas fa-file-code" style="color: #f1c40f; margin-right: 5px;"></i>script.js
                            </div>
                            <div style="margin-left: 15px; margin-bottom: 3px; cursor: pointer; padding: 3px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                <i class="fas fa-file-code" style="color: #9b59b6; margin-right: 5px;"></i>app.py
                            </div>
                        </div>
                    </div>
                    
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <div style="background: rgba(0,0,0,0.2); padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem;">
                            <span style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 3px; margin-right: 5px;">
                                <i class="fas fa-file-code" style="margin-right: 5px; color: #f1c40f;"></i>script.js
                                <i class="fas fa-times" style="margin-left: 8px; cursor: pointer; opacity: 0.7;"></i>
                            </span>
                        </div>
                        
                        <div style="flex: 1; position: relative;">
                            <div style="position: absolute; left: 0; top: 0; width: 40px; height: 100%; background: rgba(0,0,0,0.3); border-right: 1px solid rgba(255,255,255,0.1); font-family: 'Courier New', monospace; font-size: 0.8rem; padding: 10px 5px; color: #7f8c8d;">
                                1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20
                            </div>
                            <textarea style="position: absolute; left: 40px; top: 0; width: calc(100% - 40px); height: 100%; background: rgba(0,0,0,0.4); border: none; color: white; font-family: 'Courier New', monospace; font-size: 14px; padding: 10px; resize: none; outline: none; line-height: 1.4;" placeholder="// Welcome to Linux Code Editor
// Start coding here...

class LinuxDesktop {
    constructor() {
        this.initialized = false;
        console.log('Linux Desktop Clone - Advanced Edition');
    }
    
    init() {
        this.setupEnvironment();
        this.loadModules();
        this.startServices();
    }
    
    setupEnvironment() {
        // Initialize desktop environment
        console.log('Setting up Linux environment...');
    }
}

// Initialize the desktop
const desktop = new LinuxDesktop();
desktop.init();"></textarea>
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(0,0,0,0.3); padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; color: #bdc3c7;">
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <span style="margin-right: 15px;">Ln 12, Col 25</span>
                            <span style="margin-right: 15px;">JavaScript</span>
                            <span style="margin-right: 15px;">UTF-8</span>
                        </div>
                        <div>
                            <span style="margin-left: 15px;"><i class="fas fa-check-circle" style="color: #27ae60; margin-right: 5px;"></i>Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.createWindow(windowId, 'Code Editor', 'fas fa-code', content, 900, 600);
    }

    createPackageManagerWindow(windowId) {
        const content = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                        <input type="text" placeholder="Search for software..." style="flex: 1; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.9rem;">
                        <button class="toolbar-button" style="background: rgba(52, 152, 219, 0.3); padding: 8px 15px;">
                            <i class="fas fa-search"></i> Search
                        </button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="toolbar-button active" style="background: rgba(52, 152, 219, 0.3);">All</button>
                        <button class="toolbar-button">Installed</button>
                        <button class="toolbar-button">Available</button>
                        <button class="toolbar-button">Updates</button>
                    </div>
                </div>
                
                <div style="flex: 1; padding: 20px; overflow: auto;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3498db, #2980b9); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas fa-code" style="color: white; font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #ecf0f1;">Visual Studio Code</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #bdc3c7;">Microsoft</p>
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 15px;">Code editing. Redefined. Free. Built on open source.</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #27ae60;"><i class="fas fa-check-circle"></i> Installed</span>
                                <button class="toolbar-button" style="background: rgba(231, 76, 60, 0.3);">Remove</button>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #e74c3c, #c0392b); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas fa-fire" style="color: white; font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #ecf0f1;">Firefox</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #bdc3c7;">Mozilla</p>
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 15px;">Free and open source web browser developed by Mozilla.</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #27ae60;"><i class="fas fa-check-circle"></i> Installed</span>
                                <button class="toolbar-button" style="background: rgba(231, 76, 60, 0.3);">Remove</button>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f39c12, #e67e22); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas fa-chart-bar" style="color: white; font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #ecf0f1;">htop</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #bdc3c7;">System Tools</p>
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 15px;">Interactive process viewer for Unix systems.</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #95a5a6;">Not installed</span>
                                <button class="toolbar-button" style="background: rgba(46, 204, 113, 0.3);">Install</button>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #9b59b6, #8e44ad); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas fa-download" style="color: white; font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #ecf0f1;">wget</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #bdc3c7;">Network Tools</p>
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 15px;">Network downloader for retrieving files from web servers.</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #95a5a6;">Not installed</span>
                                <button class="toolbar-button" style="background: rgba(46, 204, 113, 0.3);">Install</button>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #1abc9c, #16a085); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas fa-tree" style="color: white; font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #ecf0f1;">tree</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #bdc3c7;">File Tools</p>
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 15px;">Display directories as trees (with optional color/HTML output).</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #95a5a6;">Not installed</span>
                                <button class="toolbar-button" style="background: rgba(46, 204, 113, 0.3);">Install</button>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #34495e, #2c3e50); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas fa-archive" style="color: white; font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: #ecf0f1;">zip</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #bdc3c7;">Archive Tools</p>
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 15px;">Create and extract ZIP archives.</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #95a5a6;">Not installed</span>
                                <button class="toolbar-button" style="background: rgba(46, 204, 113, 0.3);">Install</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 0.9rem; color: #bdc3c7;">
                            <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                            6 packages available, 3 installed
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="toolbar-button">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                            <button class="toolbar-button" style="background: rgba(52, 152, 219, 0.3);">
                                <i class="fas fa-download"></i> Update All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.createWindow(windowId, 'Software Center', 'fas fa-box', content, 800, 600);
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
    // Advanced command implementations
    displayFileContent(filename, output) {
        const file = this.getFileAtPath(filename);
        if (file && file.type === 'file') {
            return file.content || 'File is empty';
        } else {
            return `cat: ${filename}: No such file or directory`;
        }
    }

    createDirectory(dirname, output) {
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir.children) {
            if (currentDir.children[dirname]) {
                return `mkdir: cannot create directory '${dirname}': File exists`;
            } else {
                currentDir.children[dirname] = {
                    type: 'folder',
                    permissions: 'drwxr-xr-x',
                    owner: this.currentUser,
                    group: this.currentUser,
                    size: 4096,
                    modified: new Date(),
                    children: {}
                };
                return `Created directory: ${dirname}`;
            }
        }
        return `mkdir: cannot create directory '${dirname}': Permission denied`;
    }

    createFile(filename, output) {
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir.children) {
            currentDir.children[filename] = {
                type: 'file',
                permissions: '-rw-r--r--',
                owner: this.currentUser,
                group: this.currentUser,
                size: 0,
                modified: new Date(),
                content: ''
            };
            return `Created file: ${filename}`;
        }
        return `touch: cannot touch '${filename}': Permission denied`;
    }

    listProcesses(args) {
        const showAll = args.includes('aux') || args.includes('a');
        let result = 'PID  TTY      TIME     CMD\n';
        
        // Add some system processes
        const processes = [
            { pid: 1, tty: '?', time: '00:00:01', cmd: 'systemd' },
            { pid: 2, tty: '?', time: '00:00:00', cmd: '[kthreadd]' },
            { pid: 100, tty: 'tty1', time: '00:00:00', cmd: 'login' },
            { pid: 1000, tty: 'pts/0', time: '00:00:00', cmd: 'bash' },
            { pid: 1001, tty: 'pts/0', time: '00:00:00', cmd: 'terminal' }
        ];

        processes.forEach(proc => {
            result += `${proc.pid.toString().padStart(4)} ${proc.tty.padEnd(8)} ${proc.time} ${proc.cmd}\n`;
        });

        return result.trim();
    }

    showSystemMonitor() {
        const uptime = Math.floor((Date.now() - this.systemInfo.uptime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        return `top - ${new Date().toTimeString().slice(0, 8)} up ${hours}:${minutes.toString().padStart(2, '0')}, 1 user, load average: 0.15, 0.10, 0.05

Tasks: 5 total, 1 running, 4 sleeping, 0 stopped, 0 zombie
%Cpu(s): 2.3 us, 1.2 sy, 0.0 ni, 96.5 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st
MiB Mem: ${this.systemInfo.memory.total} total, ${this.systemInfo.memory.free} free, ${this.systemInfo.memory.used} used, 0 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0  169364  13584   8716 S   0.0   0.2   0:01.23 systemd
 1000 wisnu     20   0   21292   5180   3264 S   0.0   0.1   0:00.05 bash
 1001 wisnu     20   0   12345   2048   1024 R   2.3   0.0   0:00.01 terminal`;
    }

    showDiskUsage() {
        return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       20971520 8388608  11534336  43% /
tmpfs            4194304       0   4194304   0% /dev/shm
tmpfs            4194304    1024   4193280   1% /run
/dev/sda2       10485760 2097152   7864320  22% /home`;
    }

    showMemoryUsage() {
        return `              total        used        free      shared  buff/cache   available
Mem:           ${this.systemInfo.memory.total}        ${this.systemInfo.memory.used}        ${this.systemInfo.memory.free}           0           0        ${this.systemInfo.memory.free}
Swap:             0           0           0`;
    }

    showSystemInfo(args) {
        if (args.includes('-a')) {
            return `${this.systemInfo.kernel} linux-clone ${this.systemInfo.kernel} #1 SMP ${new Date().toDateString()} ${this.systemInfo.architecture} ${this.systemInfo.architecture} ${this.systemInfo.architecture} GNU/Linux`;
        }
        return 'Linux';
    }

    showEnvironmentVars() {
        return Object.entries(this.environmentVars)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
    }

    echoCommand(args) {
        return args.join(' ');
    }

    grepCommand(args) {
        if (args.length < 1) {
            return 'grep: missing pattern';
        }
        return `grep: searching for "${args[0]}" (simulated)`;
    }

    findCommand(args) {
        const path = args[0] || '.';
        return `find: searching in ${path} (simulated)\n./file1.txt\n./directory1/\n./directory1/file2.txt`;
    }

    whichCommand(args) {
        if (args.length < 1) {
            return 'which: missing command';
        }
        const command = args[0];
        const commonCommands = {
            'ls': '/bin/ls',
            'cat': '/bin/cat',
            'grep': '/bin/grep',
            'python3': '/usr/bin/python3',
            'node': '/usr/bin/node',
            'git': '/usr/bin/git',
            'nano': '/usr/bin/nano',
            'vim': '/usr/bin/vim'
        };
        return commonCommands[command] || `which: no ${command} in (${this.environmentVars.PATH})`;
    }

    showHistory() {
        return `1  ls -la
2  cd Documents
3  cat readme.txt
4  python3 script.py
5  git status
6  help
7  neofetch
8  history`;
    }

    showAliases() {
        return Object.entries(this.aliases)
            .map(([alias, command]) => `alias ${alias}='${command}'`)
            .join('\n');
    }

    changePermissions(args) {
        if (args.length < 2) {
            return 'chmod: missing operand';
        }
        const mode = args[0];
        const filename = args[1];
        const file = this.getFileAtPath(filename);
        if (file) {
            // Simulate permission change
            return `chmod: changed permissions of '${filename}' to ${mode}`;
        }
        return `chmod: cannot access '${filename}': No such file or directory`;
    }

    changeOwnership(args) {
        if (args.length < 2) {
            return 'chown: missing operand';
        }
        return `chown: ownership change simulated for ${args[1]}`;
    }

    copyFile(args) {
        if (args.length < 2) {
            return 'cp: missing destination file operand';
        }
        return `cp: copied '${args[0]}' to '${args[1]}'`;
    }

    moveFile(args) {
        if (args.length < 2) {
            return 'mv: missing destination file operand';
        }
        return `mv: moved '${args[0]}' to '${args[1]}'`;
    }

    removeFile(args) {
        if (args.length < 1) {
            return 'rm: missing operand';
        }
        return `rm: removed '${args[0]}'`;
    }

    runPython(args) {
        if (args.length === 0) {
            return 'Python 3.9.2 (default, Feb 28 2021, 17:03:44)\n[GCC 10.2.1 20210110] on linux\nType "help", "copyright", "credits" or "license" for more information.\n>>> (Interactive mode not available in web terminal)';
        }
        const filename = args[0];
        const file = this.getFileAtPath(filename);
        if (file && file.type === 'file' && filename.endsWith('.py')) {
            // Simulate Python execution
            return 'Hello from Python!\nLinux Desktop Clone';
        }
        return `python3: can't open file '${filename}': [Errno 2] No such file or directory`;
    }

    runNode(args) {
        if (args.length === 0) {
            return 'Welcome to Node.js v16.14.0.\nType ".help" for more information.\n> (Interactive mode not available in web terminal)';
        }
        return `node: executing ${args[0]} (simulated)`;
    }

    runGit(args) {
        if (args.length === 0) {
            return 'usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]\n           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]\n           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]\n           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]\n           <command> [<args>]';
        }
        
        const command = args[0];
        switch(command) {
            case 'status':
                return 'On branch main\nnothing to commit, working tree clean';
            case 'log':
                return 'commit abc123def456 (HEAD -> main)\nAuthor: Wisnu Hidayat <wisnu@example.com>\nDate:   ' + new Date().toDateString() + '\n\n    Initial commit';
            case 'branch':
                return '* main';
            case 'version':
                return 'git version 2.34.1';
            default:
                return `git: '${command}' is not a git command. See 'git --help'.`;
        }
    }

    systemControl(args) {
        if (args.length < 1) {
            return 'systemctl: missing action';
        }
        const action = args[0];
        const service = args[1] || 'unknown';
        
        switch(action) {
            case 'status':
                return `● ${service}.service - ${service} service\n   Loaded: loaded (/lib/systemd/system/${service}.service; enabled)\n   Active: active (running) since ${new Date().toDateString()}`;
            case 'start':
                return `Started ${service}.service`;
            case 'stop':
                return `Stopped ${service}.service`;
            case 'restart':
                return `Restarted ${service}.service`;
            case 'enable':
                return `Enabled ${service}.service`;
            case 'disable':
                return `Disabled ${service}.service`;
            default:
                return `systemctl: unknown operation '${action}'`;
        }
    }

    showSystemLogs(args) {
        return `-- Logs begin at ${new Date().toDateString()} --
${new Date().toISOString()} linux-clone systemd[1]: Started Linux Desktop Clone.
${new Date().toISOString()} linux-clone kernel: Linux Desktop Clone initialized
${new Date().toISOString()} linux-clone NetworkManager: device (eth0): state change: activated
${new Date().toISOString()} linux-clone systemd[1]: Reached target Graphical Interface.`;
    }

    showNetworkInfo() {
        return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet ${this.systemInfo.network.ip}  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 1234  bytes 123456 (120.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 567  bytes 56789 (55.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)`;
    }

    pingCommand(args) {
        if (args.length < 1) {
            return 'ping: missing host operand';
        }
        const host = args[0];
        return `PING ${host} (192.168.1.1) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=64 time=1.23 ms
64 bytes from ${host}: icmp_seq=2 ttl=64 time=1.45 ms
64 bytes from ${host}: icmp_seq=3 ttl=64 time=1.12 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 1.120/1.267/1.450/0.140 ms`;
    }

    downloadCommand(cmd, args) {
        if (args.length < 1) {
            return `${cmd}: missing URL`;
        }
        const url = args[0];
        return `${cmd}: downloading from ${url}...\n${cmd}: download completed (simulated)`;
    }

    tarCommand(args) {
        if (args.length < 1) {
            return 'tar: missing operation';
        }
        return `tar: archive operation simulated with options: ${args.join(' ')}`;
    }

    killProcess(args) {
        if (args.length < 1) {
            return 'kill: missing process ID';
        }
        const pid = args[0];
        return `kill: terminated process ${pid}`;
    }

    switchUser(args) {
        const user = args[0] || 'root';
        if (user === 'root') {
            return 'su: Authentication required (simulated)';
        }
        return `su: switched to user ${user} (simulated)`;
    }

    sudoCommand(args) {
        if (args.length < 1) {
            return 'sudo: missing command';
        }
        return `[sudo] password for ${this.currentUser}: (simulated)\nExecuting: ${args.join(' ')} (as root)`;
    }

    showManual(args) {
        if (args.length < 1) {
            return 'man: missing command';
        }
        const command = args[0];
        return `Manual page for ${command}:

NAME
       ${command} - Linux command

SYNOPSIS
       ${command} [OPTION]... [FILE]...

DESCRIPTION
       This is a simulated manual page for ${command}.
       In a real Linux system, this would show detailed documentation.

SEE ALSO
       help(1), info(1)

Linux Desktop Clone                    ${new Date().toDateString()}                    ${command.toUpperCase()}(1)`;
    }

    showCpuInfo() {
        return `Architecture:                    ${this.systemInfo.architecture}
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
Address sizes:                   39 bits physical, 48 bits virtual
CPU(s):                          ${this.systemInfo.cpu.cores}
On-line CPU(s) list:             0-${this.systemInfo.cpu.cores - 1}
Thread(s) per core:              1
Core(s) per socket:              ${this.systemInfo.cpu.cores}
Socket(s):                       1
Vendor ID:                       GenuineIntel
CPU family:                      6
Model:                           142
Model name:                      ${this.systemInfo.cpu.model}
Stepping:                        10
CPU MHz:                         2400.000
BogoMIPS:                        4800.00
Hypervisor vendor:               Microsoft
Virtualization type:             full`;
    }

    showBlockDevices() {
        return `NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   20G  0 disk 
├─sda1   8:1    0   19G  0 part /
└─sda2   8:2    0    1G  0 part [SWAP]
sr0     11:0    1 1024M  0 rom`;
    }

    showMounts() {
        return `/dev/sda1 on / type ext4 (rw,relatime,errors=remount-ro)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)
tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=819200k,mode=755)`;
    }

    showUptime() {
        const uptime = Math.floor((Date.now() - this.systemInfo.uptime) / 1000);
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        return ` ${new Date().toTimeString().slice(0, 8)} up ${days} days, ${hours}:${minutes.toString().padStart(2, '0')}, 1 user, load average: 0.15, 0.10, 0.05`;
    }

    showLoggedUsers() {
        return `USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
wisnu    pts/0    192.168.1.100    ${new Date().toTimeString().slice(0, 5)}    0.00s  0.01s  0.00s w`;
    }

    showUserInfo() {
        return `uid=1000(${this.currentUser}) gid=1000(${this.currentUser}) groups=1000(${this.currentUser}),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lpadmin),131(lxd),132(sambashare)`;
    }

    showUserGroups() {
        return `${this.currentUser} adm cdrom sudo dip plugdev lpadmin lxd sambashare`;
    }

    isExecutable(command) {
        // Check if command exists in filesystem
        const binPaths = ['/bin', '/usr/bin', '/usr/local/bin'];
        for (const binPath of binPaths) {
            const pathParts = binPath.split('/').filter(part => part);
            let currentDir = this.fileSystem['/'];
            
            for (const part of pathParts) {
                if (currentDir.children && currentDir.children[part]) {
                    currentDir = currentDir.children[part];
                } else {
                    currentDir = null;
                    break;
                }
            }
            
            if (currentDir && currentDir.children && currentDir.children[command]) {
                return true;
            }
        }
        return false;
    }

    executeFile(command, args) {
        return `Executing ${command} with args: ${args.join(' ')} (simulated)`;
    }

    getFileAtPath(path) {
        let fullPath = path;
        if (!path.startsWith('/')) {
            fullPath = this.currentPath === '/' ? `/${path}` : `${this.currentPath}/${path}`;
        }
        
        const pathParts = fullPath.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            } else {
                return null;
            }
        }
        
        const filename = pathParts[pathParts.length - 1];
        return currentDir.children ? currentDir.children[filename] : null;
    }

    getCurrentDirectory() {
        const pathParts = this.currentPath.split('/').filter(part => part);
        let currentDir = this.fileSystem['/'];
        
        for (const part of pathParts) {
            if (currentDir.children && currentDir.children[part]) {
                currentDir = currentDir.children[part];
            } else {
                return null;
            }
        }
        
        return currentDir;
    }
}

// Package Manager Class
class PackageManager {
    constructor() {
        this.packages = new Map([
            ['git', { name: 'git', version: '2.34.1', description: 'Fast, scalable, distributed revision control system', installed: true }],
            ['python3', { name: 'python3', version: '3.9.2', description: 'Interactive high-level object-oriented language', installed: true }],
            ['nodejs', { name: 'nodejs', version: '16.14.0', description: 'Event-based server-side JavaScript engine', installed: true }],
            ['nano', { name: 'nano', version: '6.2', description: 'Small, friendly text editor inspired by Pico', installed: true }],
            ['vim', { name: 'vim', version: '8.2', description: 'Vi IMproved - enhanced vi editor', installed: true }],
            ['curl', { name: 'curl', version: '7.81.0', description: 'Command line tool for transferring data with URL syntax', installed: false }],
            ['wget', { name: 'wget', version: '1.21.2', description: 'Retrieves files from the web', installed: false }],
            ['htop', { name: 'htop', version: '3.0.5', description: 'Interactive process viewer', installed: false }],
            ['tree', { name: 'tree', version: '1.8.0', description: 'Displays directories as trees', installed: false }],
            ['zip', { name: 'zip', version: '3.0', description: 'Archiver for .zip files', installed: false }]
        ]);
        this.lastUpdate = new Date('2024-01-01');
    }

    handleCommand(args) {
        if (args.length === 0) {
            return this.showHelp();
        }

        const command = args[0];
        const packageName = args[1];

        switch(command) {
            case 'update':
                return this.updatePackageList();
            case 'upgrade':
                return this.upgradePackages();
            case 'install':
                return packageName ? this.installPackage(packageName) : 'E: Missing package name';
            case 'remove':
                return packageName ? this.removePackage(packageName) : 'E: Missing package name';
            case 'search':
                return packageName ? this.searchPackage(packageName) : 'E: Missing search term';
            case 'list':
                return this.listPackages(args.slice(1));
            case 'show':
                return packageName ? this.showPackage(packageName) : 'E: Missing package name';
            default:
                return `E: Invalid operation ${command}`;
        }
    }

    updatePackageList() {
        this.lastUpdate = new Date();
        return `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
Get:3 http://archive.ubuntu.com/ubuntu jammy-backports InRelease [107 kB]
Get:4 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Fetched 336 kB in 2s (168 kB/s)
Reading package lists... Done`;
    }

    upgradePackages() {
        return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`;
    }

    installPackage(packageName) {
        const pkg = this.packages.get(packageName);
        if (!pkg) {
            return `E: Unable to locate package ${packageName}`;
        }
        if (pkg.installed) {
            return `${packageName} is already the newest version (${pkg.version}).`;
        }
        
        pkg.installed = true;
        return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  ${packageName}
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 1,234 kB of archives.
After this operation, 5,678 kB of additional disk space will be used.
Get:1 http://archive.ubuntu.com/ubuntu jammy/main amd64 ${packageName} amd64 ${pkg.version} [1,234 kB]
Fetched 1,234 kB in 1s (1,234 kB/s)
Selecting previously unselected package ${packageName}.
(Reading database ... 123456 files and directories currently installed.)
Preparing to unpack .../${packageName}_${pkg.version}_amd64.deb ...
Unpacking ${packageName} (${pkg.version}) ...
Setting up ${packageName} (${pkg.version}) ...
Processing triggers for man-db (2.10.2-1) ...`;
    }

    removePackage(packageName) {
        const pkg = this.packages.get(packageName);
        if (!pkg) {
            return `E: Unable to locate package ${packageName}`;
        }
        if (!pkg.installed) {
            return `Package '${packageName}' is not installed, so not removed`;
        }
        
        pkg.installed = false;
        return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following packages will be REMOVED:
  ${packageName}
0 upgraded, 0 newly installed, 1 to remove and 0 not upgraded.
After this operation, 5,678 kB disk space will be freed.
(Reading database ... 123456 files and directories currently installed.)
Removing ${packageName} (${pkg.version}) ...
Processing triggers for man-db (2.10.2-1) ...`;
    }

    searchPackage(searchTerm) {
        let results = [];
        for (const [name, pkg] of this.packages) {
            if (name.includes(searchTerm) || pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                const status = pkg.installed ? '[installed]' : '';
                results.push(`${name}/${pkg.version} - ${pkg.description} ${status}`);
            }
        }
        return results.length > 0 ? results.join('\n') : `No packages found matching '${searchTerm}'`;
    }

    listPackages(args) {
        const showInstalled = args.includes('--installed');
        let result = '';
        
        for (const [name, pkg] of this.packages) {
            if (!showInstalled || pkg.installed) {
                const status = pkg.installed ? 'ii' : 'un';
                result += `${status}  ${name.padEnd(20)} ${pkg.version.padEnd(15)} ${pkg.description}\n`;
            }
        }
        return result.trim();
    }

    showPackage(packageName) {
        const pkg = this.packages.get(packageName);
        if (!pkg) {
            return `N: Unable to locate package ${packageName}`;
        }
        
        return `Package: ${pkg.name}
Version: ${pkg.version}
Priority: optional
Architecture: amd64
Depends: libc6 (>= 2.34)
Installed-Size: 5678
Maintainer: Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>
Description: ${pkg.description}
 This is a simulated package description for ${pkg.name}.
 It provides functionality for ${pkg.description.toLowerCase()}.
Homepage: https://example.com/${pkg.name}`;
    }

    showHelp() {
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
  upgrade - upgrade the system by installing/upgrading packages`;
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