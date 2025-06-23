// Application State
let appState = {
    tasks: [],
    semesters: [],
    folders: [],
    goals: [
        // { id: '1', title: 'Study Hours', progress: 25, target: 100, color: '#3b82f6' },
        // { id: '2', title: 'Assignments', progress: 8, target: 15, color: '#10b981' },
        // { id: '3', title: 'Projects', progress: 3, target: 5, color: '#f59e0b' }
    ],
    currentPath: [],
    selectedFile: null,
    notifications: []
};

// Timer state
let timerState = {
    time: 1500, // 25 minutes
    initialTime: 1500,
    isRunning: false,
    interval: null
};

// Calendar state
let calendarState = {
    currentDate: new Date(),
    selectedDate: null
};

// Notification state
let notificationState = {
    isOpen: false,
    unreadCount: 0
};

// Grade points mapping
const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
};

// Inspirational quotes
const inspirationalQuotes = [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream bigger. Do bigger.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Little things make big days.", author: "Unknown" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
    { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
    { text: "Dream it. Believe it. Build it.", author: "Unknown" }
];

// Welcome and Quote functions
function updateWelcomeName() {
    const welcomeNameEl = document.getElementById('welcomeName');
    if (welcomeNameEl) {
        welcomeNameEl.textContent = appState.profile.name || 'Student';
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in before initializing the app
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadData();
    initializeNavigation();
    initializeTimer();
    initializeCalendar();
    initializeTaskModal();
    initializeGoalModal();
    initializeNotifications();
    initializeSortable();
    updateCurrentTime();
    renderHomepage();
    loadDailyQuote();
    
    // Update time every second
    setInterval(updateCurrentTime, 1000);
    setInterval(updateCountdowns, 1000);
    setInterval(checkForNotifications, 30000); // Check every 30 seconds
});

// Initialize Sortable for drag and drop
function initializeSortable() {
    const columns = ['leftColumn', 'middleColumn', 'rightColumn'];
    
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        if (column) {
            new Sortable(column, {
                group: 'shared-cards',
                animation: 150,
                ghostClass: 'sortable-ghost',
                dragClass: 'sortable-drag',
                handle: '.card',
                onEnd: saveCardOrder
            });
        }
    });
    
    loadCardOrder();
}

function saveCardOrder() {
    const order = {};
    const columns = ['leftColumn', 'middleColumn', 'rightColumn'];
    
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        if (column) {
            const cardIds = Array.from(column.children).map(card => card.id);
            order[columnId] = cardIds;
        }
    });
    
    localStorage.setItem('cardOrder', JSON.stringify(order));
}

function loadCardOrder() {
    const saved = localStorage.getItem('cardOrder');
    if (!saved) return;
    
    const order = JSON.parse(saved);
    const columns = ['leftColumn', 'middleColumn', 'rightColumn'];
    
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        const cardIds = order[columnId];
        
        if (cardIds && column) {
            cardIds.forEach(id => {
                const card = document.getElementById(id);
                if (card) column.appendChild(card);
            });
        }
    });
}

// Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const sideNav = document.getElementById('sideNav');
    const overlay = document.getElementById('overlay');
    const closeSideNav = document.getElementById('closeSideNav');
    const logoutBtn = document.getElementById('logoutBtn');
    const navItems = document.querySelectorAll('.nav-item');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            sideNav.classList.add('open');
            overlay.classList.add('active');
        });
    }

    if (closeSideNav) {
        closeSideNav.addEventListener('click', closeSideNavigation);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSideNavigation);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    function closeSideNavigation() {
        sideNav.classList.remove('open');
        overlay.classList.remove('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // e.preventDefault();
            const page = item.dataset.page;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show page content based on selection
            if (page === 'home') {
                renderHomepage();
            } else if (page === 'calendar') {
                
            } else if (page === 'gpa') {

            } else if (page === 'folder') {

            } else if (page === 'profile') {

            }
            
            closeSideNavigation();
        });
    });
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        
        // Show logout message
        alert('You have been successfully logged out.');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Notifications System
function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const markAllRead = document.getElementById('markAllRead');

    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotifications);
    }

    if (markAllRead) {
        markAllRead.addEventListener('click', markAllNotificationsRead);
    }

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-container')) {
            closeNotifications();
        }
    });

    updateNotificationBadge();
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    notificationState.isOpen = !notificationState.isOpen;
    
    if (notificationState.isOpen) {
        dropdown.classList.add('active');
        renderNotifications();
    } else {
        dropdown.classList.remove('active');
    }
}

function closeNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.remove('active');
    notificationState.isOpen = false;
}

function addNotification(type, title, message, relatedId = null) {
    const notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        time: new Date(),
        read: false,
        relatedId // Store the ID of the related task or event
    };
    
    appState.notifications.unshift(notification);
    notificationState.unreadCount++;
    
    updateNotificationBadge();
    saveData();
    
    if (notificationState.isOpen) {
        renderNotifications();
    }
}

function markAllNotificationsRead() {
    appState.notifications.forEach(notification => {
        notification.read = true;
    });
    
    notificationState.unreadCount = 0;
    updateNotificationBadge();
    renderNotifications();
    saveData();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        if (notificationState.unreadCount > 0) {
            badge.textContent = notificationState.unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;
    
    if (appState.notifications.length === 0) {
        container.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.notifications.map(notification => {
        const timeAgo = getTimeAgo(notification.time);
        return `
            <div class="notification-item ${!notification.read ? 'unread' : ''}" onclick="markNotificationRead('${notification.id}')">
                <div class="notification-content">
                    <div class="notification-icon ${notification.type}">
                        <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${timeAgo}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getNotificationIcon(type) {
    switch (type) {
        case 'task': return 'check-circle';
        case 'deadline': return 'exclamation-triangle';
        case 'event': return 'calendar-day';
        case 'reminder': return 'clock';
        case 'goal': return 'target';
        default: return 'bell';
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

function markNotificationRead(id) {
    const notification = appState.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
        notification.read = true;
        notificationState.unreadCount--;
        updateNotificationBadge();
        renderNotifications();
        saveData();
    }
}

function checkForNotifications() {
    const now = new Date();
    
    // Check for upcoming task deadlines
    appState.tasks.forEach(task => {
        if (task.isImportant && !task.completed) {
            const taskDate = new Date(`${task.date}T${task.time || '23:59'}`);
            const timeDiff = taskDate.getTime() - now.getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            const daysDiff = hoursDiff / 24;
            
            // Only create notifications if we don't already have one for this task
            const existingNotification = appState.notifications.find(n => 
                n.relatedId === task.id && 
                n.type === 'deadline' && 
                n.read === false
            );
            
            if (!existingNotification) {
                // Notify 3 days before deadline
                if (daysDiff <= 3 && daysDiff > 2) {
                    addNotification('deadline', 'Upcoming Deadline', `${task.title} is due in 3 days.`, task.id);
                }
                
                // Notify 1 day before deadline
                if (daysDiff <= 1 && daysDiff > 0.5) {
                    addNotification('deadline', 'Upcoming Deadline', `${task.title} is due tomorrow!`, task.id);
                }
                
                // Notify 6 hours before deadline
                if (hoursDiff <= 6 && hoursDiff > 1) {
                    addNotification('deadline', 'Urgent Deadline', `${task.title} is due in less than 6 hours!`, task.id);
                }
            }
        }
    });
    
    // Check for upcoming events (especially important dates)
    if (appState.events) {
        appState.events.forEach(event => {
            if (event.type === 'deadline' || event.type === 'exam' || event.type === 'presentation') {
                const eventDate = new Date(`${event.date}T${event.time || '23:59'}`);
                const timeDiff = eventDate.getTime() - now.getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                const daysDiff = hoursDiff / 24;
                
                // Only create notifications if we don't already have one for this event
                const existingNotification = appState.notifications.find(n => 
                    n.relatedId === event.id && 
                    n.type === 'event' && 
                    n.read === false
                );
                
                if (!existingNotification) {
                    // Notify 3 days before important event
                    if (daysDiff <= 3 && daysDiff > 2) {
                        addNotification('event', 'Upcoming Event', `${event.title} is scheduled in 3 days.`, event.id);
                    }
                    
                    // Notify 1 day before important event
                    if (daysDiff <= 1 && daysDiff > 0.5) {
                        addNotification('event', 'Upcoming Event', `${event.title} is scheduled tomorrow!`, event.id);
                    }
                    
                    // Notify 6 hours before important event
                    if (hoursDiff <= 6 && hoursDiff > 1) {
                        addNotification('event', 'Urgent Event', `${event.title} is scheduled in less than 6 hours!`, event.id);
                    }
                }
            }
        });
    }
    
    // Check for neglected tasks (not completed for 5+ days)
    appState.tasks.forEach(task => {
        if (!task.completed) {
            const taskCreationDate = task.createdAt ? new Date(task.createdAt) : null;
            
            // Skip if we don't have creation date
            if (!taskCreationDate) return;
            
            const daysSinceCreation = (now - taskCreationDate) / (1000 * 60 * 60 * 24);
            
            // Only create notifications if we don't already have one for this task
            const existingNotification = appState.notifications.find(n => 
                n.relatedId === task.id && 
                n.type === 'reminder' && 
                n.read === false
            );
            
            // Remind about tasks not completed for 5+ days
            if (daysSinceCreation >= 5 && !existingNotification) {
                addNotification('reminder', 'Task Reminder', `You haven't completed "${task.title}" for 5 days.`, task.id);
            }
        }
    });
}

// Quote System
function loadDailyQuote() {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem('dailyQuote');
    const savedDate = localStorage.getItem('dailyQuoteDate');
    
    if (savedQuote && savedDate === today) {
        // Use saved quote for today
        const quote = JSON.parse(savedQuote);
        displayQuote(quote.text, quote.author);
    } else {
        // Generate new quote for today
        const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
        displayQuote(randomQuote.text, randomQuote.author);
        
        // Save quote for today
        localStorage.setItem('dailyQuote', JSON.stringify(randomQuote));
        localStorage.setItem('dailyQuoteDate', today);
    }
}

function displayQuote(text, author) {
    const quoteElement = document.getElementById('dailyQuote');
    const authorElement = document.getElementById('quoteAuthor');
    
    if (quoteElement) {
        quoteElement.textContent = text;
    }
    
    if (authorElement) {
        authorElement.textContent = `- ${author}`;
    }
}

// Time functions
function updateCurrentTime() {
    const now = new Date();
    
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    
    if (currentDate) {
        currentDate.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (currentTime) {
        currentTime.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Timer functions
function initializeTimer() {
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    if (startPauseBtn) {
        startPauseBtn.addEventListener('click', toggleTimer);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }
    
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time = parseInt(btn.dataset.time);
            setTimerPreset(time);
            
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    updateTimerDisplay();
}

function toggleTimer() {
    const btn = document.getElementById('startPauseBtn');
    
    if (timerState.isRunning) {
        pauseTimer();
        btn.innerHTML = '<i class="fas fa-play"></i> Start';
        btn.className = 'btn btn-success';
    } else {
        startTimer();
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        btn.className = 'btn btn-danger';
    }
}

function startTimer() {
    timerState.isRunning = true;
    timerState.interval = setInterval(() => {
        timerState.time--;
        updateTimerDisplay();
        
        if (timerState.time <= 0) {
            timerState.time = 0;
            pauseTimer();
            playTimerSound();
            addNotification('task', 'Timer Complete', 'Your study session has ended!');
            document.getElementById('startPauseBtn').innerHTML = '<i class="fas fa-play"></i> Start';
            document.getElementById('startPauseBtn').className = 'btn btn-success';
        }
    }, 1000);
}

function pauseTimer() {
    timerState.isRunning = false;
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }
}

function resetTimer() {
    pauseTimer();
    timerState.time = timerState.initialTime;
    updateTimerDisplay();
    const btn = document.getElementById('startPauseBtn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-play"></i> Start';
        btn.className = 'btn btn-success';
    }
}

function setTimerPreset(seconds) {
    pauseTimer();
    timerState.time = seconds;
    timerState.initialTime = seconds;
    updateTimerDisplay();
    const btn = document.getElementById('startPauseBtn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-play"></i> Start';
        btn.className = 'btn btn-success';
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerState.time / 60);
    const seconds = timerState.time % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerTimeElement = document.getElementById('timerTime');
    if (timerTimeElement) {
        timerTimeElement.textContent = timeString;
    }
    
    // Update progress circle
    const progress = timerState.initialTime > 0 ? 
        ((timerState.initialTime - timerState.time) / timerState.initialTime) * 440 : 0;
    const progressElement = document.getElementById('timerProgress');
    if (progressElement) {
        progressElement.style.strokeDashoffset = 440 - progress;
    }
}

function playTimerSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
        console.log('Audio not supported');
    }
}

function setCustomTime() {
    const input = document.getElementById("customTimeInput");
    if (!input) return;
    
    const minutes = parseInt(input.value);

    if (!isNaN(minutes) && minutes > 0) {
        const customSeconds = minutes * 60;
        pauseTimer();
        timerState.time = customSeconds;
        timerState.initialTime = customSeconds;
        updateTimerDisplay();

        const btn = document.getElementById('startPauseBtn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-play"></i> Start';
            btn.className = 'btn btn-success';
        }
        
        input.value = '';
    }
}

// Spotify functions
function updateSpotifyEmbed() {
    const inputField = document.getElementById('spotifyUrlInput');
    const iframe = document.getElementById('spotifyFrame');
    
    if (!inputField || !iframe) return;
    
    let input = inputField.value.trim();

    // Convert to embed format if needed
    if (input.includes('open.spotify.com/playlist/')) {
        input = input.replace('open.spotify.com/playlist/', 'open.spotify.com/embed/playlist/');
    }

    if (input.includes('open.spotify.com/embed/playlist/')) {
        iframe.src = input;
        localStorage.setItem('spotifyEmbedUrl', input);
        inputField.value = '';
    } else {
        alert('Please enter a valid Spotify playlist link.');
    }
}

// Load saved Spotify URL on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedUrl = localStorage.getItem('spotifyEmbedUrl');
    const iframe = document.getElementById('spotifyFrame');

    if (savedUrl && iframe) {
        iframe.src = savedUrl;
    }
});

// Calendar functions
function initializeCalendar() {
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    
    if (prevMonth) {
        prevMonth.addEventListener('click', () => navigateMonth(-1));
    }
    
    if (nextMonth) {
        nextMonth.addEventListener('click', () => navigateMonth(1));
    }
}

function navigateMonth(direction) {
    calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + direction);
    renderCalendar('calendarDays', true);
}

function renderCalendar(containerId, showTasks = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    container.innerHTML = '';
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        container.appendChild(emptyDay);
    }
    
    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const isToday = today.getDate() === date && 
                       today.getMonth() === month && 
                       today.getFullYear() === year;
        
        if (isToday) {
            dayElement.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date;
        dayElement.appendChild(dayNumber);
        
        if (showTasks) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            const dayTasks = appState.tasks.filter(task => task.date === dateStr);
            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'day-tasks';
            
            dayTasks.slice(0, 3).forEach(task => {
                const taskDot = document.createElement('div');
                taskDot.className = `task-dot ${task.priority}`;
                taskDot.title = task.title;
                tasksContainer.appendChild(taskDot);
            });
            
            dayElement.appendChild(tasksContainer);
            
            dayElement.addEventListener('click', () => {
                calendarState.selectedDate = dateStr;
                openTaskModal(dateStr);
            });
        }
        
        container.appendChild(dayElement);
    }
}

function renderWeekCalendar() {
    const container = document.getElementById('weekCalendar');
    if (!container) return;
    
    const today = new Date();
    const currentWeek = [];
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Generate 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        currentWeek.push(date);
    }
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    container.innerHTML = '';
    
    currentWeek.forEach((date, index) => {
        const isToday = date.toDateString() === today.toDateString();
        
        const dayElement = document.createElement('div');
        dayElement.className = `week-day ${isToday ? 'today' : ''}`;
        
        const dayName = document.createElement('div');
        dayName.className = 'week-day-name';
        dayName.textContent = dayNames[index];
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'week-day-number';
        dayNumber.textContent = date.getDate();
        
        dayElement.appendChild(dayName);
        dayElement.appendChild(dayNumber);
        container.appendChild(dayElement);
    });
}

// Task functions
function initializeTaskModal() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const closeTaskModal = document.getElementById('closeTaskModal');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => openTaskModal());
    }
    
    if (closeTaskModal) {
        closeTaskModal.addEventListener('click', closeTaskModalFunc);
    }
    
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', closeTaskModalFunc);
    }
    
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', saveTask);
    }
    
    // Close modal when clicking outside
    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                closeTaskModalFunc();
            }
        });
    }
}

function openTaskModal(selectedDate = null) {
    const modal = document.getElementById('taskModal');
    const dateInput = document.getElementById('taskDate');
    
    if (!modal) return;
    
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.value = selectedDate || today;
    }
    
    // Clear form
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskTime = document.getElementById('taskTime');
    const taskPriority = document.getElementById('taskPriority');
    const taskImportant = document.getElementById('taskImportant');
    
    if (taskTitle) taskTitle.value = '';
    if (taskDescription) taskDescription.value = '';
    if (taskTime) taskTime.value = '';
    if (taskPriority) taskPriority.value = 'medium';
    if (taskImportant) taskImportant.checked = false;
    
    modal.classList.add('active');
}

function closeTaskModalFunc() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveTask() {
    const title = document.getElementById('taskTitle')?.value.trim();
    const description = document.getElementById('taskDescription')?.value.trim();
    const date = document.getElementById('taskDate')?.value;
    const time = document.getElementById('taskTime')?.value;
    const priority = document.getElementById('taskPriority')?.value;
    const isImportant = document.getElementById('taskImportant')?.checked;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const task = {
        id: Date.now().toString(),
        title,
        description,
        date,
        time,
        priority,
        completed: false,
        isImportant,
        createdAt: new Date() // Add creation date for tracking neglected tasks
    };
    
    appState.tasks.push(task);
    // Removed notification for task creation
    saveData();
    closeTaskModalFunc();
    renderHomepage();
}

function toggleTask(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        
        // Only add notification if it's an important task being completed
        if (task.completed && task.isImportant) {
            addNotification('task', 'Important Task Completed', `Great job! You completed "${task.title}".`, task.id);
        }
        
        saveData();
        renderHomepage();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        appState.tasks = appState.tasks.filter(t => t.id !== taskId);
        // Removed notification for task deletion
        saveData();
        renderHomepage();
    }
}

function renderTasks(containerId, filterToday = false, maxItems = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let tasks = [...appState.tasks];
    
    if (filterToday) {
        const today = new Date().toISOString().split('T')[0];
        tasks = tasks.filter(task => task.date === today);
    }
    
    // Sort by priority and completion status
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    if (maxItems) {
        tasks = tasks.slice(0, maxItems);
    }
    
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No tasks yet</p>';
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTask('${task.id}')">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}
                    ${task.isImportant ? '<i class="fas fa-exclamation-circle" style="color: #f59e0b; margin-left: 0.5rem;"></i>' : ''}
                </div>
                ${task.description ? `<div class="task-description" style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">${task.description}</div>` : ''}
                <div class="task-meta">
                    ${task.time ? `<span><i class="fas fa-clock"></i> ${task.time}</span>` : ''}
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action delete" onclick="deleteTask('${task.id}')" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(taskElement);
    });
}

// Goal functions
function initializeGoalModal() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    const goalModal = document.getElementById('goalModal');
    const closeGoalModal = document.getElementById('closeGoalModal');
    const cancelGoalBtn = document.getElementById('cancelGoalBtn');
    const saveGoalBtn = document.getElementById('saveGoalBtn');
    
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', openGoalModal);
    }
    
    if (closeGoalModal) {
        closeGoalModal.addEventListener('click', closeGoalModalFunc);
    }
    
    if (cancelGoalBtn) {
        cancelGoalBtn.addEventListener('click', closeGoalModalFunc);
    }
    
    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', saveGoal);
    }
    
    // Close modal when clicking outside
    if (goalModal) {
        goalModal.addEventListener('click', (e) => {
            if (e.target === goalModal) {
                closeGoalModalFunc();
            }
        });
    }
}

function openGoalModal() {
    const modal = document.getElementById('goalModal');
    if (!modal) return;
    
    // Clear form
    const goalTitle = document.getElementById('goalTitle');
    const goalProgress = document.getElementById('goalProgress');
    const goalTarget = document.getElementById('goalTarget');
    const goalColor = document.getElementById('goalColor');
    const goalType = document.getElementById('goalType');
    
    if (goalTitle) goalTitle.value = '';
    if (goalProgress) goalProgress.value = '0';
    if (goalTarget) goalTarget.value = '100';
    if (goalColor) goalColor.value = '#3b82f6';
    if (goalType) goalType.value = 'general';
    
    modal.classList.add('active');
}

function closeGoalModalFunc() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveGoal() {
    const title = document.getElementById('goalTitle')?.value.trim();
    const progress = parseInt(document.getElementById('goalProgress')?.value) || 0;
    const target = parseInt(document.getElementById('goalTarget')?.value) || 100;
    const color = document.getElementById('goalColor')?.value || '#3b82f6';
    const type = document.getElementById('goalType')?.value || 'general';
    
    if (!title) {
        alert('Please enter a goal title');
        return;
    }
    
    const goal = {
        id: Date.now().toString(),
        title,
        progress,
        target,
        color,
        type
    };
    
    appState.goals.push(goal);
    addNotification('goal', 'Goal Added', `New goal "${title}" has been created.`);
    saveData();
    closeGoalModalFunc();
    renderGoals();
}

function updateGoalProgress(goalId, newProgress) {
    const goal = appState.goals.find(g => g.id === goalId);
    if (goal) {
        const oldProgress = goal.progress;
        goal.progress = Math.max(0, Math.min(newProgress, goal.target));
        
        // Only notify when a goal is achieved
        if (goal.progress >= goal.target && oldProgress < goal.target) {
            addNotification('goal', 'Goal Achieved!', `Congratulations! You've completed your goal: ${goal.title}`, goal.id);
        }
        
        saveData();
        renderGoals();
    }
}

function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
        appState.goals = appState.goals.filter(g => g.id !== goalId);
        // Removed notification for goal deletion
        saveData();
        renderGoals();
    }
}

function renderGoals() {
    const container = document.getElementById('goalsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    appState.goals.forEach(goal => {
        const percentage = Math.min((goal.progress / goal.target) * 100, 100);
        
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        
        goalElement.innerHTML = `
            <div class="goal-header">
                <span class="goal-title">${goal.title}</span>
                <div class="goal-actions">
                    <button class="goal-action" onclick="updateGoalProgress('${goal.id}', ${goal.progress + 1})" title="Increment progress">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="goal-action" onclick="updateGoalProgress('${goal.id}', ${goal.progress - 1})" title="Decrement progress">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="goal-action delete" onclick="deleteGoal('${goal.id}')" title="Delete goal">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="goal-progress-text">${goal.progress}/${goal.target}</div>
            <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="width: ${percentage}%; background-color: ${goal.color}"></div>
            </div>
            <div class="goal-percentage">${percentage.toFixed(0)}% complete</div>
        `;
        
        container.appendChild(goalElement);
    });
}

function showConfirmModal(title, message, callback) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    confirmCallback = callback;
    modal.classList.add('active');
}

function hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    confirmCallback = null;
}

// Countdown functions
function updateCountdowns() {
    renderCountdown('countdownContainer');
}

function renderCountdown(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const now = new Date();
    const importantTasks = appState.tasks.filter(task => 
        task.isImportant && !task.completed && new Date(`${task.date}T${task.time || '23:59'}`) > now
    );
    
    container.innerHTML = '';
    
    if (importantTasks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No upcoming deadlines</p>';
        return;
    }
    
    importantTasks.slice(0, 3).forEach(task => {
        const targetDate = new Date(`${task.date}T${task.time || '23:59'}`);
        const diff = targetDate.getTime() - now.getTime();
        
        if (diff <= 0) return;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        const isUrgent = days === 0 && hours < 24;
        
        const countdownElement = document.createElement('div');
        countdownElement.className = `countdown-item ${isUrgent ? 'urgent' : 'important'}`;
        
        countdownElement.innerHTML = `
            <div class="countdown-header">
                <div class="countdown-title">
                    ${isUrgent ? '<i class="fas fa-exclamation-triangle" style="color: #dc2626;"></i>' : ''}
                    ${task.title}
                </div>
                <div class="countdown-time">
                    <div class="countdown-value">
                        ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m
                    </div>
                    <div class="countdown-label">remaining</div>
                </div>
            </div>
            <div class="countdown-due">
                Due: ${new Date(task.date).toLocaleDateString()} 
                ${task.time ? ` at ${task.time}` : ''}
            </div>
        `;
        
        container.appendChild(countdownElement);
    });
}

// Page rendering functions
function renderHomepage() {
    renderCalendar('calendarDays', true);
    renderWeekCalendar();
    renderGoals();
    renderTasks('todayTasks', true);
    updateCountdowns();
}

// Data persistence
function saveData() {
    const dataToSave = {
        ...appState,
        notifications: appState.notifications,
        unreadCount: notificationState.unreadCount
    };
    localStorage.setItem('progresspacer-data', JSON.stringify(dataToSave));
}

function loadData() {
    const savedData = localStorage.getItem('progresspacer-data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            appState = { ...appState, ...parsed };
            
            // Load notification state
            if (parsed.notifications) {
                appState.notifications = parsed.notifications;
                notificationState.unreadCount = parsed.notifications.filter(n => !n.read).length;
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Add theme management to the global script
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNavigation();
    initializeTimer();
    initializeCalendar();
    initializeTaskModal();
    initializeGoalModal();
    initializeNotifications();
    initializeSortable();
    updateCurrentTime();
    renderHomepage();
    loadDailyQuote();
    
    // Update time every second
    setInterval(updateCurrentTime, 1000);
    setInterval(updateCountdowns, 1000);
    setInterval(checkForNotifications, 30000); // Check every 30 seconds
});

// Improved theme management system
function initializeTheme() {
    // Load theme preference from storage
    if (!appState.preferences) {
        appState.preferences = { theme: 'light' };
    }
    
    // Apply the saved theme
    applyTheme(appState.preferences.theme || 'light');
    
    // Add theme toggle to all pages
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeToggleIcon();
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Apply system theme if no preference is saved
        if (!localStorage.getItem('progresspacer-data')) {
            const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
            setTheme(systemTheme);
        }
        
        // Listen for changes in system theme
        prefersDarkScheme.addEventListener('change', (e) => {
            // Only apply if user hasn't set a preference
            if (!appState.preferences?.hasOwnProperty('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
            }
        });
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    const currentTheme = appState.preferences?.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Set theme and save preference
function setTheme(theme) {
    if (!appState.preferences) {
        appState.preferences = {};
    }
    appState.preferences.theme = theme;
    applyTheme(theme);
    updateThemeToggleIcon();
    saveData();
}

// Apply theme to document
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    
    // Add theme class to body
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
    
    // Update theme buttons if they exist
    updateThemeButtons();
    
    // Update theme meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'theme-color';
        newMeta.content = theme === 'dark' ? '#0f172a' : '#ffffff';
        document.head.appendChild(newMeta);
    }
    
    // Dispatch custom event for theme change
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// Update theme toggle icon
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const currentTheme = appState.preferences?.theme || 'light';
    
    if (currentTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('title', 'Switch to Light Mode');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('title', 'Switch to Dark Mode');
    }
}

// Update theme buttons on profile page
function updateThemeButtons() {
    const lightBtn = document.getElementById('lightThemeBtn');
    const darkBtn = document.getElementById('darkThemeBtn');
    
    if (lightBtn && darkBtn) {
        const currentTheme = appState.preferences?.theme || 'light';
        lightBtn.classList.toggle('active', currentTheme === 'light');
        darkBtn.classList.toggle('active', currentTheme === 'dark');
    }
}

// Make functions globally available
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.updateGoalProgress = updateGoalProgress;
window.deleteGoal = deleteGoal;
window.setCustomTime = setCustomTime;
window.updateSpotifyEmbed = updateSpotifyEmbed;
window.markNotificationRead = markNotificationRead;

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}
