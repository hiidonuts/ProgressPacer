// Enhanced Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app state
    initializeAppState();
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        // For demo purposes, set as logged in
        localStorage.setItem('isLoggedIn', 'true');
    }
    
    // Initialize profile page
    initializeProfilePage();
    
    // Add escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Add click outside handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('overlay')) {
            closeAllModals();
        }
    });
});

// Global app state
let appState = {
    profile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        studentId: 'STU-2024-001',
        major: 'Computer Science',
        year: 'Junior',
        avatar: null
    },
    studyStats: {
        totalHours: 124,
        completedTasks: 87,
        currentGPA: 3.85,
        goalsAchieved: 12
    },
    preferences: {
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: false,
        theme: 'light'
    },
    notifications: [],
    recentActivity: [
        {
            id: 1,
            type: 'completed',
            title: 'Completed Math Assignment',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'study',
            title: 'Studied for 2 hours',
            time: '5 hours ago'
        },
        {
            id: 3,
            type: 'goal',
            title: 'Achieved weekly goal',
            time: '1 day ago'
        }
    ]
};

// Global callback for confirm modal
let confirmCallback = null;

function initializeAppState() {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('progressPacerData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appState = { ...appState, ...parsedData };
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

function saveData() {
    try {
        localStorage.setItem('progressPacerData', JSON.stringify(appState));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function initializeProfilePage() {
    // Initialize all components
    initializeNavigation();
    initializeNotifications();
    initializeProfileModals();
    initializeSettingsTabs();
    initializeThemeSelector();
    initializeDataManagement();
    
    // Render page content
    renderProfilePage();
    
    // Apply saved theme
    applyTheme(appState.preferences.theme);
}

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const sideNav = document.getElementById('sideNav');
    const closeSideNav = document.getElementById('closeSideNav');
    const overlay = document.getElementById('overlay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            sideNav.classList.add('open');
            overlay.classList.add('active');
        });
    }
    
    if (closeSideNav) {
        closeSideNav.addEventListener('click', () => {
            sideNav.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sideNav.classList.remove('open');
            overlay.classList.remove('active');
            closeAllModals();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const markAllRead = document.getElementById('markAllRead');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
        });
    }
    
    if (markAllRead) {
        markAllRead.addEventListener('click', () => {
            appState.notifications.forEach(notification => {
                notification.read = true;
            });
            saveData();
            renderNotifications();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-container')) {
            notificationDropdown?.classList.remove('active');
        }
    });
}

function initializeProfileModals() {
    // Edit Profile Modal
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditProfileModal = document.getElementById('closeEditProfileModal');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    
    // Change Password Modal
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closeChangePasswordModal = document.getElementById('closeChangePasswordModal');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    
    // Confirm Modal
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const confirmNoBtn = document.getElementById('confirmNoBtn');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    
    // Edit Profile Modal Events
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditProfileModal);
    }
    
    if (closeEditProfileModal) {
        closeEditProfileModal.addEventListener('click', closeEditProfileModal);
    }
    
    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', closeEditProfileModal);
    }
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
    
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => avatarInput?.click());
    }
    
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarChange);
    }
    
    // Change Password Modal Events
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            showModal('changePasswordModal');
        });
    }
    
    if (closeChangePasswordModal) {
        closeChangePasswordModal.addEventListener('click', () => {
            hideModal('changePasswordModal');
        });
    }
    
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            hideModal('changePasswordModal');
        });
    }
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', changePassword);
    }
    
    // Confirm Modal Events
    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', hideConfirmModal);
    }
    
    if (confirmNoBtn) {
        confirmNoBtn.addEventListener('click', hideConfirmModal);
    }
    
    if (confirmYesBtn) {
        confirmYesBtn.addEventListener('click', () => {
            if (confirmCallback) {
                confirmCallback();
            }
            hideConfirmModal();
        });
    }
}

function initializeSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const contents = document.querySelectorAll('.settings-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabName = tab.getAttribute('data-tab');
            const content = document.getElementById(`${tabName}-tab`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

function initializeThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Set active theme
    const currentTheme = appState.preferences.theme || 'light';
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === currentTheme) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', () => {
            // Remove active class from all options
            themeOptions.forEach(o => o.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update theme
            const theme = option.getAttribute('data-theme');
            appState.preferences.theme = theme;
            applyTheme(theme);
            saveData();
        });
    });
}

function initializeDataManagement() {
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const importDataInput = document.getElementById('importDataInput');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }
    
    if (importDataBtn) {
        importDataBtn.addEventListener('click', () => importDataInput?.click());
    }
    
    if (importDataInput) {
        importDataInput.addEventListener('change', importData);
    }
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteAccount);
    }
}

function renderProfilePage() {
    renderProfileInfo();
    renderStudyStats();
    renderRecentActivity();
    renderPreferences();
    renderNotifications();
}

function renderProfileInfo() {
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const displayStudentId = document.getElementById('displayStudentId');
    const displayMajor = document.getElementById('displayMajor');
    const displayYear = document.getElementById('displayYear');
    const avatarCircle = document.getElementById('avatarCircle');
    
    if (displayName) displayName.textContent = appState.profile.name;
    if (displayEmail) displayEmail.textContent = appState.profile.email;
    if (displayStudentId) displayStudentId.textContent = appState.profile.studentId;
    if (displayMajor) displayMajor.textContent = appState.profile.major;
    if (displayYear) displayYear.textContent = appState.profile.year;
    
    if (avatarCircle) {
        if (appState.profile.avatar) {
            avatarCircle.innerHTML = `<img src="${appState.profile.avatar}" alt="User Avatar">`;
        } else {
            avatarCircle.innerHTML = `<i class="fas fa-user"></i>`;
        }
    }
}

function renderStudyStats() {
    const totalStudyHours = document.getElementById('totalStudyHours');
    const completedTasks = document.getElementById('completedTasks');
    const currentGPA = document.getElementById('currentGPA');
    const goalsAchieved = document.getElementById('goalsAchieved');
    
    if (totalStudyHours) totalStudyHours.textContent = appState.studyStats.totalHours;
    if (completedTasks) completedTasks.textContent = appState.studyStats.completedTasks;
    if (currentGPA) currentGPA.textContent = appState.studyStats.currentGPA.toFixed(2);
    if (goalsAchieved) goalsAchieved.textContent = appState.studyStats.goalsAchieved;
}

function renderRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    if (activityList && appState.recentActivity) {
        if (appState.recentActivity.length === 0) {
            activityList.innerHTML = `
                <div class="no-activity">
                    <i class="fas fa-clock"></i>
                    <p>No recent activity</p>
                </div>
            `;
        } else {
            activityList.innerHTML = appState.recentActivity.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }
}

function renderPreferences() {
    const emailNotifications = document.getElementById('emailNotifications');
    const pushNotifications = document.getElementById('pushNotifications');
    const weeklyReports = document.getElementById('weeklyReports');
    
    if (emailNotifications) {
        emailNotifications.checked = appState.preferences.emailNotifications;
        emailNotifications.addEventListener('change', () => {
            appState.preferences.emailNotifications = emailNotifications.checked;
            saveData();
            addNotification('task', 'Settings Updated', 'Email notification preferences updated.');
        });
    }
    
    if (pushNotifications) {
        pushNotifications.checked = appState.preferences.pushNotifications;
        pushNotifications.addEventListener('change', () => {
            appState.preferences.pushNotifications = pushNotifications.checked;
            saveData();
            addNotification('task', 'Settings Updated', 'Push notification preferences updated.');
        });
    }
    
    if (weeklyReports) {
        weeklyReports.checked = appState.preferences.weeklyReports;
        weeklyReports.addEventListener('change', () => {
            appState.preferences.weeklyReports = weeklyReports.checked;
            saveData();
            addNotification('task', 'Settings Updated', 'Weekly report preferences updated.');
        });
    }
}

function renderNotifications() {
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationList = document.getElementById('notificationList');
    
    if (!appState.notifications) {
        appState.notifications = [];
    }
    
    const unreadCount = appState.notifications.filter(n => !n.read).length;
    
    if (notificationBadge) {
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }
    
    if (notificationList) {
        if (appState.notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
        } else {
            notificationList.innerHTML = appState.notifications
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .map(notification => `
                    <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                        <div class="notification-icon ${notification.type}">
                            <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${notification.title}</div>
                            <div class="notification-message">${notification.message}</div>
                            <div class="notification-time">${getTimeAgo(new Date(notification.time))}</div>
                        </div>
                        <button class="notification-close" onclick="markNotificationRead('${notification.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
        }
    }
}

function getActivityIcon(type) {
    switch (type) {
        case 'completed': return 'check';
        case 'study': return 'book';
        case 'goal': return 'bullseye';
        default: return 'clock';
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'task': return 'tasks';
        case 'goal': return 'bullseye';
        case 'event': return 'calendar';
        default: return 'bell';
    }
}

function openEditProfileModal() {
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editStudentId = document.getElementById('editStudentId');
    const editMajor = document.getElementById('editMajor');
    const editYear = document.getElementById('editYear');
    
    if (editName) editName.value = appState.profile.name;
    if (editEmail) editEmail.value = appState.profile.email;
    if (editStudentId) editStudentId.value = appState.profile.studentId;
    if (editMajor) editMajor.value = appState.profile.major;
    if (editYear) editYear.value = appState.profile.year;
    
    showModal('editProfileModal');
}

function closeEditProfileModal() {
    hideModal('editProfileModal');
}

function saveProfile() {
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editStudentId = document.getElementById('editStudentId');
    const editMajor = document.getElementById('editMajor');
    const editYear = document.getElementById('editYear');
    
    if (editName) appState.profile.name = editName.value.trim();
    if (editEmail) appState.profile.email = editEmail.value.trim();
    if (editStudentId) appState.profile.studentId = editStudentId.value.trim();
    if (editMajor) appState.profile.major = editMajor.value.trim();
    if (editYear) appState.profile.year = editYear.value;
    
    saveData();
    renderProfileInfo();
    hideModal('editProfileModal');
    
    addNotification('task', 'Profile Updated', 'Your profile information has been updated successfully.');
}

function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        appState.profile.avatar = e.target.result;
        saveData();
        renderProfileInfo();
        
        addNotification('task', 'Avatar Updated', 'Your profile picture has been updated successfully.');
    };
    reader.readAsDataURL(file);
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (!currentPassword?.value || !newPassword?.value || !confirmPassword?.value) {
        alert('Please fill in all password fields');
        return;
    }
    
    if (newPassword.value !== confirmPassword.value) {
        alert('New passwords do not match');
        return;
    }
    
    if (newPassword.value.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Clear form
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    
    hideModal('changePasswordModal');
    addNotification('task', 'Password Changed', 'Your password has been updated successfully.');
}

function exportData() {
    const dataToExport = {
        profile: appState.profile,
        studyStats: appState.studyStats,
        preferences: appState.preferences,
        notifications: appState.notifications,
        recentActivity: appState.recentActivity,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progresspacer-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addNotification('task', 'Data Exported', 'Your data has been exported successfully.');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            showConfirmModal('Import Data', 'This will replace all your current data. Are you sure you want to continue?', () => {
                // Merge imported data with current state
                if (importedData.profile) appState.profile = { ...appState.profile, ...importedData.profile };
                if (importedData.studyStats) appState.studyStats = { ...appState.studyStats, ...importedData.studyStats };
                if (importedData.preferences) appState.preferences = { ...appState.preferences, ...importedData.preferences };
                if (importedData.notifications) appState.notifications = importedData.notifications;
                if (importedData.recentActivity) appState.recentActivity = importedData.recentActivity;
                
                saveData();
                renderProfilePage();
                applyTheme(appState.preferences.theme);
                
                addNotification('task', 'Data Imported', 'Your data has been imported successfully.');
            });
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
    
    // Clear the input
    event.target.value = '';
}

function deleteAccount() {
    showConfirmModal('Delete Account', 'Are you sure you want to permanently delete your account? This action cannot be undone.', () => {
        localStorage.clear();
        alert('Your account has been deleted.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
}

function handleLogout() {
    showConfirmModal('Logout', 'Are you sure you want to logout?', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        
        addNotification('task', 'Logged Out', 'You have been successfully logged out.');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.style.setProperty('--background-color', '#0f172a');
        root.style.setProperty('--card-background', '#1e293b');
        root.style.setProperty('--card-background-alt', '#334155');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#cbd5e1');
        root.style.setProperty('--text-muted', '#94a3b8');
        root.style.setProperty('--border-color', '#334155');
        root.style.setProperty('--border-light', '#475569');
    } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        root.style.setProperty('--background-color', '#f8fafc');
        root.style.setProperty('--card-background', '#ffffff');
        root.style.setProperty('--card-background-alt', '#f9fafb');
        root.style.setProperty('--text-primary', '#1f2937');
        root.style.setProperty('--text-secondary', '#6b7280');
        root.style.setProperty('--text-muted', '#9ca3af');
        root.style.setProperty('--border-color', '#e5e7eb');
        root.style.setProperty('--border-light', '#f3f4f6');
    } else if (theme === 'system') {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal) {
        modal.classList.add('active');
        overlay?.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal) {
        modal.classList.remove('active');
        
        // Only hide overlay if no other modals are active
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length === 0) {
            overlay?.classList.remove('active');
        }
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('overlay');
    
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    
    overlay?.classList.remove('active');
}

function showConfirmModal(title, message, callback) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    confirmCallback = callback;
    showModal('confirmModal');
}

function hideConfirmModal() {
    hideModal('confirmModal');
    confirmCallback = null;
}

function addNotification(type, title, message, relatedId = null) {
    if (!appState.notifications) {
        appState.notifications = [];
    }
    
    const notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        time: new Date().toISOString(),
        read: false,
        relatedId
    };
    
    appState.notifications.unshift(notification);
    
    // Limit to 20 notifications
    if (appState.notifications.length > 20) {
        appState.notifications = appState.notifications.slice(0, 20);
    }
    
    saveData();
    renderNotifications();
}

function markNotificationRead(id) {
    if (!appState.notifications) return;
    
    const notification = appState.notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        saveData();
        renderNotifications();
    }
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

// Make functions globally available
window.markNotificationRead = markNotificationRead;
window.showConfirmModal = showConfirmModal;
window.addNotification = addNotification;