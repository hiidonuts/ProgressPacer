// Make sure we're using the same calendarState from script.js
// If it's not defined yet, initialize it
if (typeof calendarState === 'undefined') {
    calendarState = {
        currentDate: new Date(),
        selectedDate: null
    };
}

// Make sure we're using the same appState from script.js
// If it's not defined yet, initialize it
if (typeof appState === 'undefined') {
    appState = {
        tasks: [],
        events: [],
        semesters: [],
        folders: [],
        goals: [],
        currentPath: [],
        selectedFile: null,
        notifications: []
    };
}

// Calendar-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calendar.js loaded');
    console.log('fullCalendarDays element exists:', !!document.getElementById('fullCalendarDays'));
    
    if (document.getElementById('fullCalendarDays')) {
        console.log('Initializing calendar page');
        initializeCalendarPage();
        
        // Make sure the Add Task button works
        const addCalendarTaskBtn = document.getElementById('addCalendarTaskBtn');
        if (addCalendarTaskBtn) {
            addCalendarTaskBtn.addEventListener('click', () => openTaskModal());
        }
    }
});

function initializeCalendarPage() {
    // Initialize calendar navigation for calendar page
    const calPrevMonth = document.getElementById('calPrevMonth');
    const calNextMonth = document.getElementById('calNextMonth');
    
    if (calPrevMonth) {
        calPrevMonth.addEventListener('click', () => navigateCalendarMonth(-1));
    }
    
    if (calNextMonth) {
        calNextMonth.addEventListener('click', () => navigateCalendarMonth(1));
    }

    renderCalendarPage();
    initializeEventModal();
    updateCalendarHeader(); // Make sure header is updated initially
}

function navigateCalendarMonth(direction) {
    calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + direction);
    renderCalendar('fullCalendarDays', true);
    updateCalendarHeader();
    
    // Debug
    console.log('Calendar navigated:', 
        calendarState.currentDate.getMonth() + 1,
        calendarState.currentDate.getFullYear());
}

function renderCalendarPage() {
    renderCalendar('fullCalendarDays', true);
    renderAllTasks();
    renderImportantEvents();
    updateCalendarHeader();
    updateCountdowns();
}

function initializeEventModal() {
    const addEventBtn = document.getElementById('addEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeEventModal = document.getElementById('closeEventModal');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    
    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => openEventModal());
    }
    
    if (closeEventModal) {
        closeEventModal.addEventListener('click', closeEventModalFunc);
    }
    
    if (cancelEventBtn) {
        cancelEventBtn.addEventListener('click', closeEventModalFunc);
    }
    
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', saveEvent);
    }
    
    // Close modal when clicking outside
    if (eventModal) {
        eventModal.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                closeEventModalFunc();
            }
        });
    }
}

function openEventModal(dateStr = null) {
    const modal = document.getElementById('eventModal');
    if (!modal) return;
    
    // Clear form
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const eventDate = document.getElementById('eventDate');
    const eventTime = document.getElementById('eventTime');
    const eventType = document.getElementById('eventType');
    const eventColor = document.getElementById('eventColor');
    const eventRecurrence = document.getElementById('eventRecurrence');
    
    if (eventTitle) eventTitle.value = '';
    if (eventDescription) eventDescription.value = '';
    
    // Set date to the selected date or today
    if (eventDate) {
        eventDate.value = dateStr || new Date().toISOString().split('T')[0];
    }
    
    if (eventTime) eventTime.value = '';
    if (eventType) eventType.value = 'meeting';
    if (eventColor) eventColor.value = '#3b82f6';
    if (eventRecurrence) eventRecurrence.value = 'none';
    
    modal.classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeEventModalFunc() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveEvent() {
    const title = document.getElementById('eventTitle')?.value.trim();
    const description = document.getElementById('eventDescription')?.value.trim();
    const date = document.getElementById('eventDate')?.value;
    const time = document.getElementById('eventTime')?.value;
    const type = document.getElementById('eventType')?.value;
    const color = document.getElementById('eventColor')?.value;
    const recurrence = document.getElementById('eventRecurrence')?.value;
    
    if (!title || !date) {
        alert('Please enter event title and date');
        return;
    }
    
    const event = {
        id: Date.now().toString(),
        title,
        description,
        date,
        time,
        type,
        color,
        recurrence
    };
    
    // Initialize events array if it doesn't exist
    if (!appState.events) {
        appState.events = [];
    }
    
    appState.events.push(event);
    
    // If it's a recurring event, generate future occurrences
    if (recurrence && recurrence !== 'none') {
        generateRecurringEvents(event);
    }
    
    // Only add notification for important event types
    if (type === 'deadline' || type === 'exam' || type === 'presentation') {
        const eventDate = new Date(`${date}T${time || '23:59'}`);
        const now = new Date();
        const daysDiff = (eventDate - now) / (1000 * 60 * 60 * 24);
        
        // Only notify if the event is within the next 3 days
        if (daysDiff <= 3) {
            addNotification('event', 'Important Event Added', `New ${type}: "${title}" has been scheduled.`, event.id);
        }
    }
    
    saveData();
    closeEventModalFunc();
    renderImportantEvents();
    renderCalendar('fullCalendarDays', true);
}

function generateRecurringEvents(baseEvent) {
    const recurrenceType = baseEvent.recurrence;
    if (!recurrenceType || recurrenceType === 'none') return;
    
    const baseDate = new Date(`${baseEvent.date}T${baseEvent.time || '00:00'}`);
    const futureEvents = [];
    
    // Generate events for the next 6 occurrences
    for (let i = 1; i <= 6; i++) {
        const newEvent = {...baseEvent};
        newEvent.id = Date.now().toString() + i;
        newEvent.isRecurring = true;
        newEvent.parentEventId = baseEvent.id;
        
        let newDate = new Date(baseDate);
        
        switch (recurrenceType) {
            case 'daily':
                newDate.setDate(newDate.getDate() + i);
                break;
            case 'weekly':
                newDate.setDate(newDate.getDate() + (i * 7));
                break;
            case 'biweekly':
                newDate.setDate(newDate.getDate() + (i * 14));
                break;
            case 'monthly':
                newDate.setMonth(newDate.getMonth() + i);
                break;
            case 'yearly':
                newDate.setFullYear(newDate.getFullYear() + i);
                break;
        }
        
        newEvent.date = newDate.toISOString().split('T')[0];
        futureEvents.push(newEvent);
    }
    
    // Add future events to the events array
    appState.events = [...appState.events, ...futureEvents];
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        // Also delete any recurring instances
        appState.events = appState.events.filter(e => e.id !== eventId && e.parentEventId !== eventId);
        // Removed notification for event deletion
        saveData();
        renderImportantEvents();
        renderCalendar('fullCalendarDays', true);
    }
}

function renderImportantEvents() {
    const container = document.getElementById('importantEvents');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!appState.events || appState.events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-plus"></i>
                <p>No important events yet</p>
            </div>
        `;
        return;
    }
    
    // Sort events by date
    const sortedEvents = appState.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.style.borderLeftColor = event.color;
        
        const eventDate = new Date(event.date);
        const isToday = eventDate.toDateString() === new Date().toDateString();
        const isPast = eventDate < new Date() && !isToday;
        
        eventElement.innerHTML = `
            <div class="event-header">
                <div>
                    <div class="event-title">
                        ${event.title}
                        ${event.recurrence && event.recurrence !== 'none' ? 
                            `<span class="recurring-badge"><i class="fas fa-sync-alt"></i> ${event.recurrence}</span>` : ''}
                    </div>
                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                    <div class="event-datetime">
                        <i class="fas fa-calendar"></i>
                        ${eventDate.toLocaleDateString()}
                        ${event.time ? ` at ${event.time}` : ''}
                        ${isToday ? '<span style="color: #059669; font-weight: 500; margin-left: 0.5rem;">Today</span>' : ''}
                        ${isPast ? '<span style="color: #6b7280; margin-left: 0.5rem;">Past</span>' : ''}
                    </div>
                </div>
                <div class="event-actions">
                    <button class="task-action delete" onclick="deleteEvent('${event.id}')" title="Delete event">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="event-type ${event.type}">${event.type}</div>
        `;
        
        container.appendChild(eventElement);
    });
}

function updateCalendarHeader() {
    const headerElement = document.getElementById('calendarMonthYear');
    if (!headerElement) return;
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[calendarState.currentDate.getMonth()];
    const year = calendarState.currentDate.getFullYear();
    
    headerElement.textContent = `${month} ${year}`;
}

function renderAllTasks() {
    const container = document.getElementById('allTasks');
    if (!container) return;
    
    let tasks = [...appState.tasks];
    
    // Sort by date, priority and completion status
    tasks.sort((a, b) => {
        // First by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA - dateB !== 0) return dateA - dateB;
        
        // Then by completion
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        // Finally by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No tasks yet</p>';
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const taskDate = new Date(task.date);
        const isToday = taskDate.toDateString() === new Date().toDateString();
        const isPast = taskDate < new Date() && !isToday;
        
        taskElement.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTask('${task.id}')">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}
                    ${task.isImportant ? '<i class="fas fa-exclamation-circle" style="color: #f59e0b; margin-left: 0.5rem;"></i>' : ''}
                </div>
                <div class="task-meta">
                    <span class="task-date">
                        <i class="fas fa-calendar"></i> 
                        ${taskDate.toLocaleDateString()}
                        ${isToday ? '<span class="today-badge">Today</span>' : ''}
                        ${isPast ? '<span class="past-badge">Past</span>' : ''}
                    </span>
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

function updateCountdowns() {
    renderCountdown('countdownContainer');
    renderCountdown('calendarCountdown'); // Make sure this is called for the calendar page
}

function renderCountdown(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const now = new Date();
    const importantTasks = appState.tasks.filter(task => 
        task.isImportant && !task.completed && new Date(`${task.date}T${task.time || '23:59'}`) > now
    );
    
    // Also include important events
    const importantEvents = appState.events ? appState.events.filter(event => 
        event.type === 'deadline' && new Date(`${event.date}T${event.time || '23:59'}`) > now
    ) : [];
    
    container.innerHTML = '';
    
    if (importantTasks.length === 0 && importantEvents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No upcoming deadlines</p>';
        return;
    }
    
    // Render important tasks
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
    
    // Render important events
    importantEvents.slice(0, 3).forEach(event => {
        const targetDate = new Date(`${event.date}T${event.time || '23:59'}`);
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
                    ${event.title}
                </div>
                <div class="countdown-time">
                    <div class="countdown-value">
                        ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m
                    </div>
                    <div class="countdown-label">remaining</div>
                </div>
            </div>
            <div class="countdown-due">
                Due: ${new Date(event.date).toLocaleDateString()} 
                ${event.time ? ` at ${event.time}` : ''}
            </div>
        `;
        
        container.appendChild(countdownElement);
    });
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
            
            // Get events for this day
            const dayEvents = appState.events ? appState.events.filter(event => event.date === dateStr) : [];
            
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            // Show task indicators
            dayTasks.slice(0, 3).forEach(task => {
                const taskDot = document.createElement('div');
                taskDot.className = `task-dot ${task.priority}`;
                taskDot.title = task.title;
                eventsContainer.appendChild(taskDot);
            });
            
            // Show event indicators
            dayEvents.forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = `event-dot ${event.type}`;
                eventDot.style.backgroundColor = event.color;
                
                // Add special styling for recurring events
                if (event.recurrence && event.recurrence !== 'none') {
                    eventDot.classList.add('recurring-event');
                    eventDot.title = `${event.title} (${event.recurrence})`;
                    
                    // Add a small recurring indicator
                    const recurIcon = document.createElement('span');
                    recurIcon.className = 'recur-icon';
                    recurIcon.innerHTML = '<i class="fas fa-sync-alt"></i>';
                    eventDot.appendChild(recurIcon);
                } else {
                    eventDot.title = event.title;
                }
                
                eventsContainer.appendChild(eventDot);
            });
            
            dayElement.appendChild(eventsContainer);
            
            // Add click event to open task/event modal
            dayElement.addEventListener('click', () => {
                calendarState.selectedDate = dateStr;
                
                // If there are events on this day, show them in a popup
                if (dayEvents.length > 0) {
                    showDayEventsPopup(dateStr, dayEvents);
                } else {
                    // Otherwise open the task modal
                    openTaskModal(dateStr);
                }
            });
        }
        
        container.appendChild(dayElement);
    }
}

// Function to show a popup with events for a specific day
function showDayEventsPopup(dateStr, events) {
    // Create or get existing popup
    let popup = document.getElementById('dayEventsPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'dayEventsPopup';
        popup.className = 'day-events-popup';
        document.body.appendChild(popup);
    }
    
    // Format the date for display
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Generate popup content
    popup.innerHTML = `
        <div class="popup-header">
            <h3>${formattedDate}</h3>
            <button class="close-btn" onclick="closeDayEventsPopup()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="popup-content">
            <div class="popup-events">
                ${events.map(event => `
                    <div class="popup-event" style="border-left-color: ${event.color}">
                        <div class="event-title">
                            ${event.title}
                            ${event.recurrence && event.recurrence !== 'none' ? 
                                `<span class="recurring-badge"><i class="fas fa-sync-alt"></i> ${event.recurrence}</span>` : ''}
                        </div>
                        <div class="event-time">${event.time || 'All day'}</div>
                        <div class="event-type ${event.type}">${event.type}</div>
                    </div>
                `).join('')}
            </div>
            <div class="popup-actions">
                <button class="btn btn-primary" onclick="openTaskModal('${dateStr}')">
                    <i class="fas fa-plus"></i> Add Task
                </button>
                <button class="btn btn-primary" onclick="openEventModal('${dateStr}')">
                    <i class="fas fa-plus"></i> Add Event
                </button>
            </div>
        </div>
    `;
    
    // Show the popup
    popup.style.display = 'block';
    
    // Position the popup near the clicked day
    // This is a simple positioning, you might want to improve it
    const rect = event.target.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
}

function closeDayEventsPopup() {
    const popup = document.getElementById('dayEventsPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Make functions globally available
window.deleteEvent = deleteEvent;
window.closeDayEventsPopup = closeDayEventsPopup;
