let appState = {
    tasks: [],
    semesters: [],
    folders: [],
    goals: [],
    currentPath: [],
    selectedFile: null
};

// Dashboard-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (document.getElementById('goalsContainer')) {
        renderHomepage();
    }
});

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Remove theme-related event listeners and functions

function renderHomepage() {
    renderCalendar('calendarDays');
    renderWeekCalendar();
    renderGoals();
    renderTasks('todayTasks', true);
    updateCountdowns();
    renderNotifications();
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

let calendarState = {
    currentDate: new Date(),
    selectedDate: null
};

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
                <span class="goal-progress-text">${goal.progress}/${goal.target}</span>
            </div>
            <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="width: ${percentage}%; background-color: ${goal.color}"></div>
            </div>
            <div class="goal-percentage">${percentage.toFixed(0)}% complete</div>
        `;
        
        container.appendChild(goalElement);
    });
}

function updateCountdowns() {
    renderCountdown('countdownContainer');
    renderCountdown('calendarCountdown');
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

function renderTasks(containerId, filterToday = false, maxItems = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let tasks = appState.tasks;
    
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
