// Folder page initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (document.getElementById('folderContainer')) {
        initializeFolderPage();
    }
});

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Remove theme-related event listeners and functions

function initializeFolderPage() {
    console.log("Initializing folder page");
    
    // Load data from localStorage
    try {
        const savedData = localStorage.getItem('folderData');
        if (savedData) {
            window.appState = JSON.parse(savedData);
            console.log("Loaded saved data");
        } else {
            // Initialize with empty structure
            window.appState = {
                folders: [],
                currentPath: [],
                selectedFile: null
            };
            console.log("No saved data found, initialized empty structure");
        }
    } catch (e) {
        console.error("Error loading data:", e);
        window.appState = {
            folders: [],
            currentPath: [],
            selectedFile: null
        };
    }
    
    renderFolderPage();
    initializeFolderModals();
    initializeFileUpload();
    
    // Set default view mode to grid if not already set
    if (!localStorage.getItem('folder-view-mode')) {
        localStorage.setItem('folder-view-mode', 'grid');
    }
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Remove theme-related event listeners and functions

function initializeFolderPage() {
    renderFolderPage();
    initializeFolderModals();
    initializeFileUpload();
    
    // Set default view mode to grid if not already set
    if (!localStorage.getItem('folder-view-mode')) {
        localStorage.setItem('folder-view-mode', 'grid');
    }
}

function initializeFolderModals() {
    const newFolderBtn = document.getElementById('newFolderBtn');
    const folderModal = document.getElementById('folderModal');
    const closeFolderModal = document.getElementById('closeFolderModal');
    const cancelFolderBtn = document.getElementById('cancelFolderBtn');
    const createFolderBtn = document.getElementById('createFolderBtn');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const fileInput = document.getElementById('fileInput');
    const backBtn = document.getElementById('backBtn');
    
    // Initialize confirm modal buttons
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');

    if (newFolderBtn) {
        newFolderBtn.addEventListener('click', openFolderModal);
    }

    if (closeFolderModal) {
        closeFolderModal.addEventListener('click', closeFolderModalFunc);
    }

    if (cancelFolderBtn) {
        cancelFolderBtn.addEventListener('click', closeFolderModalFunc);
    }

    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', createFolder);
    }

    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', () => fileInput.click());
    }

    if (backBtn) {
        backBtn.addEventListener('click', navigateBack);
    }
    
    // Add confirm modal event listeners
    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', hideConfirmModal);
    }
    
    if (confirmNoBtn) {
        confirmNoBtn.addEventListener('click', hideConfirmModal);
    }
    
    if (confirmYesBtn) {
        confirmYesBtn.addEventListener('click', () => {
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
            hideConfirmModal();
        });
    }

    // Close modal when clicking outside
    if (folderModal) {
        folderModal.addEventListener('click', (e) => {
            if (e.target === folderModal) {
                closeFolderModalFunc();
            }
        });
    }
    
    // Close confirm modal when clicking outside
    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                hideConfirmModal();
            }
        });
    }

    // Enter key to create folder
    const folderNameInput = document.getElementById('folderName');
    if (folderNameInput) {
        folderNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createFolder();
            }
        });
    }
}

function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', () => {
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileInput.click();
            }
        });
    }
}

function renderFolderPage() {
    const container = document.getElementById('folderContainer');
    if (!container) return;
    
    // Render breadcrumbs
    renderBreadcrumbs();
    
    // Render toolbar without search
    renderFolderToolbar();
    
    // Render file list
    renderFileList();
    
    // Render storage stats
    updateStorageInfo();
}

function openFolderModal() {
    const modal = document.getElementById('folderModal');
    const folderNameInput = document.getElementById('folderName');
    
    if (folderNameInput) {
        folderNameInput.value = '';
    }
    
    modal.classList.add('active');
    document.getElementById('overlay').classList.add('active');
    
    // Focus on input after modal opens
    setTimeout(() => {
        if (folderNameInput) {
            folderNameInput.focus();
        }
    }, 100);
}

function closeFolderModalFunc() {
    const modal = document.getElementById('folderModal');
    modal.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function createFolder() {
    console.log("Creating folder...");
    const folderNameInput = document.getElementById('folderName');
    const name = folderNameInput?.value.trim();
    
    if (!name) {
        alert('Please enter a folder name');
        return;
    }
    
    console.log(`Creating folder with name: ${name}`);
    
    // Initialize appState if needed
    if (!window.appState) {
        window.appState = {
            folders: [],
            currentPath: [],
            selectedFile: null
        };
    }
    
    // Check if folder already exists
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    
    if (!currentFolder.children) {
        currentFolder.children = [];
    }
    
    const existingFolder = currentFolder.children.find(
        item => item.type === 'folder' && item.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingFolder) {
        alert('A folder with this name already exists');
        return;
    }
    
    const folder = {
        id: Date.now().toString(),
        name,
        type: 'folder',
        children: [],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };
    
    // Add to current location
    currentFolder.children.push(folder);
    console.log(`Folder created: ${name}`);
    
    // Save data
    saveData();
    closeFolderModalFunc();
    
    // Render the folder page
    renderFolderPage();
    
    // Add notification
    if (typeof addNotification === 'function') {
        addNotification('folder', 'Folder Created', `New folder "${name}" has been created.`);
    }
}

function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    console.log("Files selected:", files.length);
    
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    
    if (!currentFolder.children) {
        currentFolder.children = [];
    }
    
    let uploadedCount = 0;
    const totalFiles = files.length;
    
    files.forEach(file => {
        console.log("Processing file:", file.name);
        
        // Check if file already exists
        const existingFile = currentFolder.children.find(
            item => item.type === 'file' && item.name === file.name
        );
        
        if (existingFile) {
            if (!confirm(`File "${file.name}" already exists. Do you want to replace it?`)) {
                return;
            }
            // Remove existing file
            currentFolder.children = currentFolder.children.filter(item => item.id !== existingFile.id);
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log(`File ${file.name} loaded, size: ${e.target.result.length}`);
            
            const fileObj = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: 'file',
                size: file.size,
                content: e.target.result,
                mimeType: file.type,
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            };
            
            currentFolder.children.push(fileObj);
            uploadedCount++;
            console.log(`Added file ${file.name}, processed ${uploadedCount}/${totalFiles}`);
            
            // When all files are processed, save data and render
            if (uploadedCount === totalFiles) {
                console.log("All files processed, saving data");
                saveData();
                renderFolderPage();
                
                // If it's a single file, automatically view it
                if (totalFiles === 1) {
                    setTimeout(() => viewFile(fileObj.id), 100);
                }
                
                addNotification('folder', 'Files Uploaded', `${totalFiles} file(s) have been uploaded.`);
            }
        };
        
        reader.onerror = function(e) {
            console.error(`Error reading file ${file.name}:`, e);
            alert(`Error reading file ${file.name}`);
        };
        
        // Read file as data URL for storage
        reader.readAsDataURL(file);
    });
    
    // Clear the file input for future uploads
    event.target.value = '';
}

function renderFileList() {
    const container = document.getElementById('fileList');
    if (!container) return;
    
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const items = currentFolder.children || [];
    
    // Clear the container
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-folder">
                <i class="fas fa-folder-open"></i>
                <p>This folder is empty</p>
                <p class="text-muted">Upload files or create folders to get started</p>
            </div>
        `;
        return;
    }
    
    // Sort items: folders first, then files
    const sortedItems = items.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
    
    // Add view toggle buttons
    const viewToggle = document.createElement('div');
    viewToggle.className = 'view-toggle';
    const viewMode = getViewMode();
    viewToggle.innerHTML = `
        <button class="view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="Grid view">
            <i class="fas fa-th"></i>
        </button>
        <button class="view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="List view">
            <i class="fas fa-list"></i>
        </button>
    `;
    container.appendChild(viewToggle);
    
    // Add event listeners to view toggle buttons
    const gridBtn = viewToggle.querySelector('.view-btn[data-view="grid"]');
    const listBtn = viewToggle.querySelector('.view-btn[data-view="list"]');
    
    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            setViewMode('grid');
        });
    }
    
    if (listBtn) {
        listBtn.addEventListener('click', () => {
            setViewMode('list');
        });
    }
    
    // Create content container based on view mode
    if (viewMode === 'grid') {
        renderGridView(container, sortedItems);
    } else {
        renderListView(container, sortedItems);
    }
}

function renderGridView(container, items) {
    // Create a new grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'file-grid';
    container.appendChild(gridContainer);
    
    // Add items to the grid
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'grid-item';
        itemElement.dataset.id = item.id;
        itemElement.dataset.type = item.type;
        
        const icon = item.type === 'folder' ? 'fas fa-folder' : getFileIcon(item.name);
        const date = new Date(item.modified).toLocaleDateString();
        const size = item.type === 'file' ? formatFileSize(item.size) : '';
        
        itemElement.innerHTML = `
            <div class="grid-item-icon">
                <i class="${icon}"></i>
            </div>
            <div class="grid-item-name" title="${item.name}">${item.name}</div>
            <div class="grid-item-meta">
                ${size ? `<span>${size}</span>` : ''}
                <span>${date}</span>
            </div>
            <div class="grid-item-actions">
                ${item.type === 'file' ? `<button class="file-action" onclick="event.stopPropagation(); viewFile('${item.id}')" title="View file">
                    <i class="fas fa-eye"></i>
                </button>` : ''}
                ${item.type === 'file' ? `<button class="file-action" onclick="event.stopPropagation(); downloadFile('${item.id}')" title="Download file">
                    <i class="fas fa-download"></i>
                </button>` : ''}
                <button class="file-action delete" onclick="event.stopPropagation(); deleteItem('${item.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add click handler for navigation
        if (item.type === 'folder') {
            itemElement.addEventListener('click', () => navigateToFolder(item.id));
        } else {
            itemElement.addEventListener('click', () => viewFile(item.id));
        }
        
        gridContainer.appendChild(itemElement);
    });
}

function renderListView(container, items) {
    // Create a new list container
    const listContainer = document.createElement('div');
    listContainer.className = 'file-list-container';
    container.appendChild(listContainer);
    
    // Add items to the list
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'file-item';
        itemElement.dataset.id = item.id;
        
        const icon = item.type === 'folder' ? 'fas fa-folder' : getFileIcon(item.name);
        const size = item.type === 'file' ? formatFileSize(item.size) : '';
        const date = new Date(item.modified).toLocaleDateString();
        
        itemElement.innerHTML = `
            <div class="file-icon">
                <i class="${icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
                <div class="file-meta">
                    ${size ? `<span>${size}</span>` : ''}
                    <span>Modified: ${date}</span>
                </div>
            </div>
            <div class="file-actions">
                ${item.type === 'file' ? `<button class="file-action" onclick="event.stopPropagation(); viewFile('${item.id}')" title="View file">
                    <i class="fas fa-eye"></i>
                </button>` : ''}
                ${item.type === 'file' ? `<button class="file-action" onclick="event.stopPropagation(); downloadFile('${item.id}')" title="Download file">
                    <i class="fas fa-download"></i>
                </button>` : ''}
                <button class="file-action delete" onclick="event.stopPropagation(); deleteItem('${item.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add click handler for navigation
        if (item.type === 'folder') {
            itemElement.addEventListener('click', () => navigateToFolder(item.id));
        } else {
            itemElement.addEventListener('click', () => viewFile(item.id));
        }
        
        listContainer.appendChild(itemElement);
    });
}

function renderBreadcrumbs() {
    const container = document.getElementById('breadcrumbs');
    const backBtn = document.getElementById('backBtn');
    if (!container) return;
    
    const currentPath = getCurrentPath();
    
    container.innerHTML = '';
    
    // Root breadcrumb
    const rootCrumb = document.createElement('span');
    rootCrumb.className = 'breadcrumb-item';
    rootCrumb.textContent = 'Root';
    rootCrumb.addEventListener('click', () => navigateToPath([]));
    container.appendChild(rootCrumb);
    
    // Path breadcrumbs
    let pathSoFar = [];
    currentPath.forEach((folderId, index) => {
        pathSoFar.push(folderId);
        const folder = findItemInPath(pathSoFar);
        
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.textContent = ' / ';
        container.appendChild(separator);
        
        const crumb = document.createElement('span');
        crumb.className = 'breadcrumb-item';
        if (index === currentPath.length - 1) {
            crumb.classList.add('active');
        }
        crumb.textContent = folder.name;
        crumb.addEventListener('click', () => navigateToPath([...pathSoFar]));
        container.appendChild(crumb);
    });
    
    // Show/hide back button
    if (backBtn) {
        if (currentPath.length > 0) {
            backBtn.style.display = 'inline-flex';
        } else {
            backBtn.style.display = 'none';
        }
    }
}

function updateStorageInfo() {
    const totalFilesEl = document.getElementById('totalFiles');
    const totalFoldersEl = document.getElementById('totalFolders');
    const storageUsedEl = document.getElementById('storageUsed');
    
    const stats = calculateStorageStats(appState.folders);
    
    if (totalFilesEl) totalFilesEl.textContent = stats.files;
    if (totalFoldersEl) totalFoldersEl.textContent = stats.folders;
    if (storageUsedEl) storageUsedEl.textContent = formatFileSize(stats.size);
}

function calculateStorageStats(items) {
    let files = 0;
    let folders = 0;
    let size = 0;
    
    function countItems(itemList) {
        if (!itemList) return;
        
        itemList.forEach(item => {
            if (item.type === 'folder') {
                folders++;
                countItems(item.children);
            } else {
                files++;
                size += item.size || 0;
            }
        });
    }
    
    countItems(items);
    
    return { files, folders, size };
}

function getCurrentPath() {
    return appState.currentPath || [];
}

function findItemInPath(path) {
    let current = { children: appState.folders };
    
    for (const folderId of path) {
        current = current.children.find(item => item.id === folderId);
        if (!current) {
            // Path is invalid, reset to root
            appState.currentPath = [];
            return { children: appState.folders };
        }
    }
    
    return current;
}

function navigateToFolder(folderId) {
    const currentPath = getCurrentPath();
    appState.currentPath = [...currentPath, folderId];
    saveData();
    renderFolderPage();
}

function navigateToPath(path) {
    appState.currentPath = path;
    saveData();
    renderFolderPage();
}

function navigateBack() {
    const currentPath = getCurrentPath();
    if (currentPath.length > 0) {
        appState.currentPath = currentPath.slice(0, -1);
        saveData();
        renderFolderPage();
    }
}

function viewFile(fileId, path = null) {
    let currentFolder;
    
    if (path) {
        // If path is provided, find the file in that path
        let folder = { children: appState.folders };
        for (const folderId of path) {
            folder = folder.children.find(item => item.id === folderId);
            if (!folder) return;
        }
        currentFolder = folder;
    } else {
        // Otherwise use current path
        const currentPath = getCurrentPath();
        currentFolder = findItemInPath(currentPath);
    }
    
    const file = currentFolder.children?.find(item => item.id === fileId);
    
    if (!file) return;
    
    const editorTitle = document.getElementById('fileEditorTitle');
    const editor = document.getElementById('fileEditor');
    
    if (editorTitle) {
        editorTitle.textContent = file.name;
    }
    
    if (editor) {
        // Determine file type
        const isTextFile = isTextBasedFile(file.name);
        const isImageFile = file.mimeType && file.mimeType.startsWith('image/');
        
        if (isTextFile && file.content) {
            // For text files, show editable content
            let fileContent = '';
            
            // Try to extract text content from data URL
            try {
                if (file.content.includes('base64,')) {
                    const base64Content = file.content.split('base64,')[1];
                    fileContent = atob(base64Content);
                } else {
                    fileContent = file.content;
                }
            } catch (e) {
                console.error('Error decoding file content:', e);
                fileContent = 'Error: Could not decode file content';
            }
            
            editor.innerHTML = `
                <div class="file-info">
                    <div class="file-name-display">
                        <i class="${getFileIcon(file.name)}"></i>
                        ${file.name}
                    </div>
                    <div>
                        <button class="btn btn-sm btn-primary" onclick="saveFileContent('${file.id}')">
                            <i class="fas fa-save"></i> Save
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="downloadFile('${file.id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
                <textarea class="file-content" id="fileContentEditor">${fileContent}</textarea>
            `;
        } else if (isImageFile) {
            // For images, show preview
            editor.innerHTML = `
                <div class="file-info">
                    <div class="file-name-display">
                        <i class="${getFileIcon(file.name)}"></i>
                        ${file.name}
                    </div>
                    <div>
                        <button class="btn btn-sm btn-secondary" onclick="downloadFile('${file.id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
                <div class="file-preview">
                    <img src="${file.content}" alt="${file.name}" style="max-width: 100%; max-height: 500px;">
                </div>
            `;
        } else {
            // For other files, show metadata
            editor.innerHTML = `
                <div class="file-info">
                    <div class="file-name-display">
                        <i class="${getFileIcon(file.name)}"></i>
                        ${file.name}
                    </div>
                    <div>
                        <button class="btn btn-sm btn-secondary" onclick="downloadFile('${file.id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
                <div class="file-preview">
                    <p>Preview not available for this file type.</p>
                    <p>Size: ${formatFileSize(file.size)}</p>
                    <p>Last modified: ${new Date(file.modified).toLocaleString()}</p>
                </div>
            `;
        }
    }
    
    appState.selectedFile = fileId;
}

function saveFileContent(fileId) {
    const editor = document.getElementById('fileContentEditor');
    if (!editor) return;
    
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const file = currentFolder.children?.find(item => item.id === fileId);
    
    if (!file) return;
    
    // Convert text content to data URL
    const contentType = getMimeType(file.name);
    const newContent = `data:${contentType};base64,${btoa(editor.value)}`;
    
    file.content = newContent;
    file.modified = new Date().toISOString();
    file.size = new Blob([editor.value]).size;
    
    saveData();
    addNotification('folder', 'File Saved', `File "${file.name}" has been saved.`);
    updateStorageInfo();
}

function downloadFile(fileId) {
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const file = currentFolder.children?.find(item => item.id === fileId);
    
    if (!file) return;
    
    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    link.click();
    
    addNotification('folder', 'File Downloaded', `File "${file.name}" has been downloaded.`);
}

function deleteItem(itemId) {
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const item = currentFolder.children?.find(item => item.id === itemId);
    
    if (!item) return;
    
    const itemType = item.type === 'folder' ? 'folder' : 'file';
    const message = `Are you sure you want to delete this ${itemType}? ${item.type === 'folder' ? 'All contents will be lost.' : ''}`;
    
    showConfirmModal(`Delete ${itemType}`, message, () => {
        currentFolder.children = currentFolder.children.filter(item => item.id !== itemId);
        
        // Clear editor if this file was selected
        if (appState.selectedFile === itemId) {
            appState.selectedFile = null;
            const editor = document.getElementById('fileEditor');
            const editorTitle = document.getElementById('fileEditorTitle');
            
            if (editor) {
                editor.innerHTML = `
                    <div class="no-file-selected">
                        <i class="fas fa-file"></i>
                        <p>Select a file to view and edit its contents</p>
                    </div>
                `;
            }
            
            if (editorTitle) {
                editorTitle.textContent = 'Select a file';
            }
        }
        
        addNotification('folder', `${itemType} Deleted`, `${itemType} "${item.name}" has been deleted.`);
        saveData();
        renderFolderPage();
    });
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'doc':
        case 'docx': return 'fas fa-file-word';
        case 'xls':
        case 'xlsx': return 'fas fa-file-excel';
        case 'ppt':
        case 'pptx': return 'fas fa-file-powerpoint';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp': return 'fas fa-file-image';
        case 'mp4':
        case 'avi':
        case 'mov': return 'fas fa-file-video';
        case 'mp3':
        case 'wav':
        case 'flac': return 'fas fa-file-audio';
        case 'zip':
        case 'rar':
        case '7z': return 'fas fa-file-archive';
        case 'txt':
        case 'md': return 'fas fa-file-alt';
        case 'js':
        case 'html':
        case 'css':
        case 'py':
        case 'java': return 'fas fa-file-code';
        default: return 'fas fa-file';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getTextContent(dataUrl) {
    if (!dataUrl || !dataUrl.includes('base64,')) return '';
    
    try {
        const base64 = dataUrl.split('base64,')[1];
        return atob(base64);
    } catch (error) {
        return '';
    }
}

// Make functions globally available
window.viewFile = viewFile;
window.downloadFile = downloadFile;
window.deleteItem = deleteItem;
window.saveFileContent = saveFileContent;
window.navigateToFolder = navigateToFolder;
window.navigateToPath = navigateToPath;
window.navigateBack = navigateBack;
window.navigateToItemLocation = navigateToItemLocation;
window.performSearch = performSearch;
window.clearSearch = clearSearch;

// Function to set view mode
function setViewMode(mode) {
    // Save preference
    localStorage.setItem('folder-view-mode', mode);
    
    // Re-render the file list with the new mode
    const container = document.getElementById('fileList');
    if (!container) return;
    
    // Clear existing content except view toggle
    const viewToggle = container.querySelector('.view-toggle');
    container.innerHTML = '';
    if (viewToggle) container.appendChild(viewToggle);
    
    // Update active button state
    if (viewToggle) {
        const buttons = viewToggle.querySelectorAll('.view-btn');
        buttons.forEach(btn => {
            if (btn.dataset.view === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Get current folder items
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const items = currentFolder.children || [];
    
    // Sort items: folders first, then files
    const sortedItems = items.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
    
    // Render the appropriate view
    if (mode === 'grid') {
        renderGridView(container, sortedItems);
    } else {
        renderListView(container, sortedItems);
    }
}

// Function to get current view mode
function getViewMode() {
    return localStorage.getItem('folder-view-mode') || 'grid';
}

// Global variable to store the callback function
let confirmCallback = null;

function showConfirmModal(title, message, callback) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');

    if (!modal) {
        console.error('Confirm modal not found in the DOM');
        return;
    }

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    // Store the callback function
    confirmCallback = callback;
    
    // Show the modal
    modal.classList.add('active');
    document.getElementById('overlay').classList.add('active');
    
    // Debug log
    console.log('Showing confirm modal:', { title, message });
}

function hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    
    if (!modal) {
        console.error('Confirm modal not found in the DOM');
        return;
    }
    
    modal.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    confirmCallback = null;
    
    // Debug log
    console.log('Hiding confirm modal');
}

function renderFolderToolbar() {
    const container = document.getElementById('folderToolbar');
    if (!container) return;
    
    container.innerHTML = `
        <div class="toolbar-left">
            <button id="backBtn" class="btn btn-icon" title="Go back">
                <i class="fas fa-arrow-left"></i>
            </button>
            <button id="newFolderBtn" class="btn btn-primary btn-sm">
                <i class="fas fa-folder-plus"></i> New Folder
            </button>
            <label for="fileInput" class="btn btn-primary btn-sm">
                <i class="fas fa-file-upload"></i> Upload Files
            </label>
            <input type="file" id="fileInput" multiple style="display: none;">
        </div>
    `;
    
    // Add event listeners
    const backBtn = document.getElementById('backBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (backBtn) {
        backBtn.addEventListener('click', navigateBack);
    }
    
    if (newFolderBtn) {
        newFolderBtn.addEventListener('click', openFolderModal);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

// Completely rewrite the renderFileList function to fix view toggle
function renderFileList() {
    const container = document.getElementById('fileList');
    if (!container) return;
    
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const items = currentFolder.children || [];
    
    // Clear the container
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-folder">
                <i class="fas fa-folder-open"></i>
                <p>This folder is empty</p>
                <p class="text-muted">Upload files or create folders to get started</p>
            </div>
        `;
        return;
    }
    
    // Sort items: folders first, then files
    const sortedItems = items.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
    
    // Add view toggle buttons
    const viewToggle = document.createElement('div');
    viewToggle.className = 'view-toggle';
    const viewMode = getViewMode();
    viewToggle.innerHTML = `
        <button class="view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="Grid view">
            <i class="fas fa-th"></i>
        </button>
        <button class="view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="List view">
            <i class="fas fa-list"></i>
        </button>
    `;
    container.appendChild(viewToggle);
    
    // Add event listeners to view toggle buttons
    const gridBtn = viewToggle.querySelector('.view-btn[data-view="grid"]');
    const listBtn = viewToggle.querySelector('.view-btn[data-view="list"]');
    
    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            setViewMode('grid');
        });
    }
    
    if (listBtn) {
        listBtn.addEventListener('click', () => {
            setViewMode('list');
        });
    }
    
    // Create content container based on view mode
    if (viewMode === 'grid') {
        renderGridView(container, sortedItems);
    } else {
        renderListView(container, sortedItems);
    }
}

// Simplify the setViewMode function to ensure it works correctly
function setViewMode(mode) {
    // Save preference
    localStorage.setItem('folder-view-mode', mode);
    
    // Re-render the file list with the new mode
    const container = document.getElementById('fileList');
    if (!container) return;
    
    // Clear existing content except view toggle
    const viewToggle = container.querySelector('.view-toggle');
    container.innerHTML = '';
    if (viewToggle) container.appendChild(viewToggle);
    
    // Update active button state
    if (viewToggle) {
        const buttons = viewToggle.querySelectorAll('.view-btn');
        buttons.forEach(btn => {
            if (btn.dataset.view === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Get current folder items
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    const items = currentFolder.children || [];
    
    // Sort items: folders first, then files
    const sortedItems = items.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
    
    // Render the appropriate view
    if (mode === 'grid') {
        renderGridView(container, sortedItems);
    } else {
        renderListView(container, sortedItems);
    }
}

// Simplify the createFolder function
function createFolder() {
    console.log("Creating folder...");
    const folderNameInput = document.getElementById('folderName');
    const name = folderNameInput?.value.trim();
    
    if (!name) {
        alert('Please enter a folder name');
        return;
    }
    
    console.log(`Creating folder with name: ${name}`);
    
    // Initialize appState if needed
    if (!window.appState) {
        window.appState = {
            folders: [],
            currentPath: [],
            selectedFile: null
        };
    }
    
    // Check if folder already exists
    const currentPath = getCurrentPath();
    const currentFolder = findItemInPath(currentPath);
    
    if (!currentFolder.children) {
        currentFolder.children = [];
    }
    
    const existingFolder = currentFolder.children.find(
        item => item.type === 'folder' && item.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingFolder) {
        alert('A folder with this name already exists');
        return;
    }
    
    const folder = {
        id: Date.now().toString(),
        name,
        type: 'folder',
        children: [],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };
    
    // Add to current location
    currentFolder.children.push(folder);
    console.log(`Folder created: ${name}`);
    
    // Save data
    saveData();
    closeFolderModalFunc();
    
    // Render the folder page
    renderFolderPage();
    
    // Add notification
    if (typeof addNotification === 'function') {
        addNotification('folder', 'Folder Created', `New folder "${name}" has been created.`);
    }
}

// Remove all search-related functions
function initializeFolderPage() {
    renderFolderPage();
    initializeFolderModals();
    initializeFileUpload();
    
    // Set default view mode to grid if not already set
    if (!localStorage.getItem('folder-view-mode')) {
        localStorage.setItem('folder-view-mode', 'grid');
    }
}

// Update renderFolderPage to remove search functionality
function renderFolderPage() {
    // Render breadcrumbs
    renderBreadcrumbs();
    
    // Render toolbar without search
    renderFolderToolbar();
    
    // Render file list
    renderFileList();
    
    // Render storage stats
    updateStorageInfo();
}

// Remove these search-related functions
// initializeSearch
// performSearch
// clearSearch
// renderSearchResults
// searchFiles
// navigateToItemLocation
// Helper function to get a readable path display
function getPathDisplay(path) {
    if (!path || path.length === 0) return 'Root';
    
    const pathNames = [];
    let currentFolder = { children: appState.folders };
    
    for (const folderId of path) {
        const folder = currentFolder.children.find(item => item.id === folderId);
        if (folder) {
            pathNames.push(folder.name);
            currentFolder = folder;
        }
    }
    
    return pathNames.length > 0 ? `Location: ${pathNames.join(' / ')}` : 'Root';
}

// Function to navigate to an item's location
function navigateToItemLocation(itemId, path) {
    if (!path || path.length === 0) {
        // Item is in root
        navigateToPath([]);
    } else {
        // Navigate to the item's parent folder
        navigateToPath(path);
    }
    
    // Highlight the item after navigation
    setTimeout(() => {
        const item = document.querySelector(`[data-id="${itemId}"]`);
        if (item) {
            item.classList.add('highlight');
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove highlight after a delay
            setTimeout(() => {
                item.classList.remove('highlight');
            }, 2000);
        }
    }, 100);
}

// Helper function to determine if a file is text-based
function isTextBasedFile(filename) {
    const textExtensions = [
        '.txt', '.md', '.js', '.html', '.css', '.json', '.xml', 
        '.csv', '.log', '.py', '.java', '.c', '.cpp', '.h', 
        '.php', '.rb', '.pl', '.sh', '.bat', '.ps1', '.sql'
    ];
    
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return textExtensions.includes(ext);
}

// Helper function to get file icon based on extension
function getFileIcon(filename) {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    
    switch (ext) {
        case '.pdf': return 'fas fa-file-pdf';
        case '.doc': case '.docx': return 'fas fa-file-word';
        case '.xls': case '.xlsx': return 'fas fa-file-excel';
        case '.ppt': case '.pptx': return 'fas fa-file-powerpoint';
        case '.jpg': case '.jpeg': case '.png': case '.gif': case '.bmp': return 'fas fa-file-image';
        case '.mp3': case '.wav': case '.ogg': return 'fas fa-file-audio';
        case '.mp4': case '.avi': case '.mov': case '.wmv': return 'fas fa-file-video';
        case '.zip': case '.rar': case '.7z': case '.tar': case '.gz': return 'fas fa-file-archive';
        case '.html': case '.htm': return 'fas fa-file-code';
        case '.js': case '.css': case '.php': case '.py': case '.java': return 'fas fa-file-code';
        case '.txt': case '.md': return 'fas fa-file-alt';
        default: return 'fas fa-file';
    }
}

// Add notification function if it doesn't exist
if (typeof addNotification !== 'function') {
    function addNotification(type, title, message) {
        console.log(`Notification: [${type}] ${title} - ${message}`);
        // This is a fallback if the real notification function doesn't exist
    }
    window.addNotification = addNotification;
}

// Make sure these functions are available globally
window.handleFileUpload = handleFileUpload;
window.createFolder = createFolder;
window.saveData = saveData;
window.initializeFolderPage = initializeFolderPage;
