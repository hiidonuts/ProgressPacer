// GPA-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('overallCGPA')) {
        initializeGPAPage();
    }
});

function initializeGPAPage() {
    // Define gradePoints if not already defined
    if (typeof gradePoints === 'undefined') {
        window.gradePoints = {
            'A+': 4.0,
            'A': 4.0,
            'A-': 3.7,
            'B+': 3.3,
            'B': 3.0,
            'B-': 2.7,
            'C+': 2.3,
            'C': 2.0,
            'C-': 1.7,
            'D+': 1.3,
            'D': 1.0,
            'F': 0.0
        };
    }
    
    initializeGPAModals();
    initializeAddSemesterButton();
    initializeCalculator();
    
    // Load data first to ensure we have the latest state
    loadData();
    
    // Then render the page
    renderGPAPage();
    
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
        updateCGPAStats();
    }, 100);
}

function renderGPAPage() {
    updateOverallCGPA();
    renderSemesters();
    updateGPAStats();
    updatePerformanceStats();
    updateMotivationalQuote();
    updateCGPAStats(); // Add this new function call
}

function initializeAddSemesterButton() {
    const showAddSemester = document.getElementById('showAddSemester');
    
    if (showAddSemester) {
        showAddSemester.addEventListener('click', () => {
            const modal = document.getElementById('addSemesterModal');
            if (modal) {
                modal.classList.add('active');
                document.getElementById('overlay').classList.add('active');
                
                // Focus on input after modal opens
                setTimeout(() => {
                    const input = document.getElementById('newSemesterName');
                    if (input) {
                        input.focus();
                    }
                }, 100);
            }
        });
    }
}

function initializeGPAModals() {
    // GPA Scale Modal
    const showGpaScaleBtn = document.getElementById('showGpaScaleBtn');
    const gpaScaleModal = document.getElementById('gpaScaleModal');
    const closeGpaScaleModal = document.getElementById('closeGpaScaleModal');
    const closeGpaScaleBtn = document.getElementById('closeGpaScaleBtn');

    if (showGpaScaleBtn) {
        showGpaScaleBtn.addEventListener('click', () => {
            if (gpaScaleModal) {
                gpaScaleModal.classList.add('active');
                document.getElementById('overlay').classList.add('active');
            }
        });
    }

    if (closeGpaScaleModal) {
        closeGpaScaleModal.addEventListener('click', () => {
            if (gpaScaleModal) {
                gpaScaleModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }

    if (closeGpaScaleBtn) {
        closeGpaScaleBtn.addEventListener('click', () => {
            if (gpaScaleModal) {
                gpaScaleModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }

    // Statistics Modal
    const showStatsBtn = document.getElementById('showStatsBtn');
    const statsModal = document.getElementById('statsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');
    const closeStatsBtn = document.getElementById('closeStatsBtn');

    if (showStatsBtn) {
        showStatsBtn.addEventListener('click', () => {
            updateGPAStats();
            if (statsModal) {
                statsModal.classList.add('active');
                document.getElementById('overlay').classList.add('active');
            }
        });
    }

    if (closeStatsModal) {
        closeStatsModal.addEventListener('click', () => {
            if (statsModal) {
                statsModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }

    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', () => {
            if (statsModal) {
                statsModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }

    // Add Semester Modal
    const addSemesterModal = document.getElementById('addSemesterModal');
    const closeAddSemesterModal = document.getElementById('closeAddSemesterModal');
    const createSemesterBtn = document.getElementById('createSemesterBtn');
    const cancelSemesterBtn = document.getElementById('cancelSemesterBtn');

    if (closeAddSemesterModal) {
        closeAddSemesterModal.addEventListener('click', () => {
            if (addSemesterModal) {
                addSemesterModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }

    if (cancelSemesterBtn) {
        cancelSemesterBtn.addEventListener('click', () => {
            if (addSemesterModal) {
                addSemesterModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }

    if (createSemesterBtn) {
        createSemesterBtn.addEventListener('click', createSemester);
    }

    // Confirmation Modal
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');
    
    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', () => {
            if (confirmModal) {
                confirmModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }
    
    if (confirmNoBtn) {
        confirmNoBtn.addEventListener('click', () => {
            if (confirmModal) {
                confirmModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }
    
    if (confirmYesBtn) {
        confirmYesBtn.addEventListener('click', () => {
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
            if (confirmModal) {
                confirmModal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    }
}

function initializeCalculator() {
    // CGPA Calculator
    const calculatorInputs = ['currentCGPA', 'completedCredits', 'newGPA', 'newCredits'];
    
    calculatorInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateCGPACalculator);
        }
    });
}

function createSemester() {
    const nameInput = document.getElementById('newSemesterName');
    const name = nameInput?.value.trim();
    
    if (!name) {
        alert('Please enter a semester name');
        return;
    }
    
    const semester = {
        id: Date.now().toString(),
        name,
        courses: [],
        gpa: 0
    };
    
    if (!appState.semesters) {
        appState.semesters = [];
    }
    
    appState.semesters.push(semester);
    addNotification('gpa', 'Semester Added', `New semester "${name}" has been created.`);
    saveData();
    
    // Get expanded semesters before rendering
    const expandedSemesters = getExpandedSemesters();
    renderGPAPage();
    restoreExpandedSemesters(expandedSemesters);
    
    // Expand the newly added semester
    const newSemesterContent = document.getElementById(`semesterContent-${semester.id}`);
    const newSemesterIcon = document.getElementById(`toggleIcon-${semester.id}`);
    if (newSemesterContent) newSemesterContent.classList.add('expanded');
    if (newSemesterIcon) newSemesterIcon.classList.add('expanded');
    
    // Close modal and clear input
    const modal = document.getElementById('addSemesterModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }
    if (nameInput) {
        nameInput.value = '';
    }
}

function renderSemesters() {
    const container = document.getElementById('semestersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!appState.semesters || appState.semesters.length === 0) {
        return;
    }
    
    appState.semesters.forEach((semester, index) => {
        const semesterElement = document.createElement('div');
        semesterElement.className = 'card semester-card';
        semesterElement.dataset.semesterId = semester.id;
        
        // Determine if this is the current semester (most recent)
        const isCurrent = index === appState.semesters.length - 1;
        const badgeClass = isCurrent ? 'current' : 'completed';
        const badgeText = isCurrent ? 'Current' : 'Completed';
        
        // Create the header (always visible)
        const headerHTML = `
            <div class="semester-header" onclick="toggleSemester('${semester.id}')">
                <div class="semester-info">
                    <h3>${semester.name}</h3>
                    <span class="semester-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="semester-gpa">
                    <div class="semester-gpa-label">GPA:</div>
                    <div class="semester-gpa-value">${semester.gpa.toFixed(2)}</div>
                    <i class="fas fa-chevron-down toggle-icon" id="toggleIcon-${semester.id}"></i>
                </div>
            </div>
        `;
        
        // Create the content (collapsible)
        const contentHTML = `
            <div class="semester-content" id="semesterContent-${semester.id}">
                <div class="semester-actions">
                    <button class="btn btn-primary btn-sm" onclick="addCourse('${semester.id}')">
                        <i class="fas fa-plus"></i> Add Course
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSemester('${semester.id}')">
                        <i class="fas fa-trash"></i> Delete Semester
                    </button>
                </div>
                <table class="courses-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Credit Hours</th>
                            <th>Grade</th>
                            <th>Points</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${semester.courses.map(course => `
                            <tr>
                                <td>
                                    <input type="text" value="${course.name}" 
                                           onchange="updateCourse('${semester.id}', '${course.id}', 'name', this.value)">
                                </td>
                                <td>
                                    <input type="number" min="1" max="6" value="${course.creditHours}" 
                                           onchange="updateCourse('${semester.id}', '${course.id}', 'creditHours', this.value)">
                                </td>
                                <td>
                                    <select onchange="updateCourse('${semester.id}', '${course.id}', 'grade', this.value)">
                                        ${Object.keys(gradePoints).map(grade => 
                                            `<option value="${grade}" ${course.grade === grade ? 'selected' : ''}>${grade}</option>`
                                        ).join('')}
                                    </select>
                                </td>
                                <td>${course.points.toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="deleteCourse('${semester.id}', '${course.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${semester.courses.length === 0 ? `
                    <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <p><i class="fas fa-book" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i></p>
                        <p>No courses added yet</p>
                        <p>Click "Add Course" to get started</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        semesterElement.innerHTML = headerHTML + contentHTML;
        container.appendChild(semesterElement);
    });
    
    // After all semesters are rendered, load expanded state
    setTimeout(() => {
        loadExpandedState();
    }, 0);
}

function deleteSemester(semesterId) {
    showConfirmModal('Delete Semester', 'Are you sure you want to delete this semester? This action cannot be undone.', () => {
        const semester = appState.semesters.find(s => s.id === semesterId);
        appState.semesters = appState.semesters.filter(s => s.id !== semesterId);
        
        if (semester) {
            addNotification('gpa', 'Semester Deleted', `Semester "${semester.name}" has been deleted.`);
        }
        
        saveData();
        
        // Get expanded semesters before rendering
        const expandedSemesters = getExpandedSemesters();
        renderGPAPage();
        restoreExpandedSemesters(expandedSemesters);
    });
}

function addCourse(semesterId) {
    const semester = appState.semesters.find(s => s.id === semesterId);
    if (!semester) return;
    
    const course = {
        id: Date.now().toString(),
        name: 'New Course',
        creditHours: 3,
        grade: 'A',
        points: 4.0
    };
    
    semester.courses.push(course);
    updateSemesterGPA(semesterId);
    saveData();
    
    // Render the page but preserve expanded state
    const expandedSemesters = getExpandedSemesters();
    renderGPAPage();
    restoreExpandedSemesters(expandedSemesters);
    updateCGPAStats(); // Add this line
}

function updateCourse(semesterId, courseId, field, value) {
    const semester = appState.semesters.find(s => s.id === semesterId);
    if (!semester) return;
    
    const course = semester.courses.find(c => c.id === courseId);
    if (!course) return;
    
    if (field === 'grade') {
        course.grade = value;
        course.points = gradePoints[value] || 0;
    } else if (field === 'creditHours') {
        course.creditHours = parseInt(value) || 0;
    } else {
        course[field] = value;
    }
    
    updateSemesterGPA(semesterId);
    saveData();
    updateOverallCGPA();
    updateGPAStats();
    updateCGPAStats(); // Make sure this is called
}

function deleteCourse(semesterId, courseId) {
    showConfirmModal('Delete Course', 'Are you sure you want to delete this course?', () => {
        const semester = appState.semesters.find(s => s.id === semesterId);
        if (!semester) return;
        
        const course = semester.courses.find(c => c.id === courseId);
        semester.courses = semester.courses.filter(c => c.id !== courseId);
        
        if (course) {
            addNotification('gpa', 'Course Deleted', `Course "${course.name}" has been deleted.`);
        }
        
        updateSemesterGPA(semesterId);
        saveData();
        
        // Render the page but preserve expanded state
        const expandedSemesters = getExpandedSemesters();
        renderGPAPage();
        restoreExpandedSemesters(expandedSemesters);
        updateCGPAStats(); // Add this line
    });
}

function updateSemesterGPA(semesterId) {
    const semester = appState.semesters.find(s => s.id === semesterId);
    if (!semester) return;
    
    if (semester.courses.length === 0) {
        semester.gpa = 0;
        return;
    }
    
    const totalPoints = semester.courses.reduce((sum, course) => sum + (course.points * course.creditHours), 0);
    const totalCredits = semester.courses.reduce((sum, course) => sum + course.creditHours, 0);
    
    semester.gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function updateOverallCGPA() {
    const cgpa = calculateOverallCGPA();
    const cgpaElement = document.getElementById('overallCGPA');
    const badgeElement = document.getElementById('cgpaBadge');
    
    if (cgpaElement) {
        cgpaElement.textContent = cgpa.toFixed(2);
    }
    
    if (badgeElement) {
        let status = '';
        let color = '';
        
        if (cgpa >= 3.7) {
            status = 'Excellent';
            color = 'var(--success-color)';
        } else if (cgpa >= 3.0) {
            status = 'Good Standing';
            color = 'var(--primary-color)';
        } else if (cgpa >= 2.0) {
            status = 'Satisfactory';
            color = 'var(--warning-color)';
        } else {
            status = 'Needs Improvement';
            color = 'var(--danger-color)';
        }
        
        badgeElement.textContent = status;
        badgeElement.style.backgroundColor = color;
    }
}

function calculateOverallCGPA() {
    if (!appState.semesters || appState.semesters.length === 0) {
        return 0;
    }
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    appState.semesters.forEach(semester => {
        if (semester.courses && semester.courses.length > 0) {
            semester.courses.forEach(course => {
                totalPoints += course.points * course.creditHours;
                totalCredits += course.creditHours;
            });
        }
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function updateGPAStats() {
    // Get main card stats elements
    const mainTotalCreditsEl = document.getElementById('mainTotalCredits');
    const mainTotalSemestersEl = document.getElementById('mainTotalSemesters');
    const mainHighestGPAEl = document.getElementById('mainHighestGPA');
    
    // Get modal stats elements
    const modalTotalCreditsEl = document.getElementById('modalTotalCredits');
    const modalTotalSemestersEl = document.getElementById('modalTotalSemesters');
    const modalHighestGPAEl = document.getElementById('modalHighestGPA');
    
    if (!appState.semesters) {
        appState.semesters = [];
    }
    
    let totalCredits = 0;
    const semesterGPAs = [];
    
    appState.semesters.forEach(semester => {
        if (semester.courses) {
            semester.courses.forEach(course => {
                totalCredits += parseInt(course.creditHours) || 0;
            });
        }
        if (semester.gpa > 0) {
            semesterGPAs.push(semester.gpa);
        }
    });
    
    // Update main card stats
    if (mainTotalCreditsEl) mainTotalCreditsEl.textContent = totalCredits;
    if (mainTotalSemestersEl) mainTotalSemestersEl.textContent = appState.semesters.length;
    if (mainHighestGPAEl) mainHighestGPAEl.textContent = semesterGPAs.length > 0 ? Math.max(...semesterGPAs).toFixed(2) : '0.00';
    
    // Update modal stats
    if (modalTotalCreditsEl) modalTotalCreditsEl.textContent = totalCredits;
    if (modalTotalSemestersEl) modalTotalSemestersEl.textContent = appState.semesters.length;
    if (modalHighestGPAEl) modalHighestGPAEl.textContent = semesterGPAs.length > 0 ? Math.max(...semesterGPAs).toFixed(2) : '0.00';
}

function updateCGPACalculator() {
    const current = parseFloat(document.getElementById('currentCGPA')?.value) || 0;
    const completedCredits = parseFloat(document.getElementById('completedCredits')?.value) || 0;
    const newGPA = parseFloat(document.getElementById('newGPA')?.value) || 0;
    const newCredits = parseFloat(document.getElementById('newCredits')?.value) || 0;
    
    const totalPoints = (current * completedCredits) + (newGPA * newCredits);
    const totalCredits = completedCredits + newCredits;
    
    const newCGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    
    const calculatedCGPA = document.getElementById('calculatedCGPA');
    if (calculatedCGPA) {
        calculatedCGPA.textContent = newCGPA.toFixed(2);
    }
}

// Motivational quotes based on GPA
const gpaQuotes = {
    excellent: [
        "Excellence is not a skill. It's an attitude.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Your dedication to excellence is truly inspiring. Keep up the amazing work!"
    ],
    good: [
        "Believe you can and you're halfway there.",
        "The only place where success comes before work is in the dictionary.",
        "You're doing great! Keep pushing forward with the same determination.",
        "Progress is progress, no matter how small. You're on the right track!"
    ],
    average: [
        "Don't watch the clock; do what it does. Keep going.",
        "The expert in anything was once a beginner.",
        "You have potential for greatness. Keep working hard and you'll see results.",
        "Every master was once a disaster. Keep learning and growing!"
    ],
    needsImprovement: [
        "The only failure is not trying.",
        "Fall seven times, stand up eight.",
        "It's not about how bad you want it, it's about how hard you're willing to work for it.",
        "Challenges are what make life interesting. Overcoming them is what makes life meaningful."
    ]
};

function getMotivationalQuote(gpa) {
    let category;
    if (gpa >= 3.5) {
        category = 'excellent';
    } else if (gpa >= 3.0) {
        category = 'good';
    } else if (gpa >= 2.0) {
        category = 'average';
    } else {
        category = 'needsImprovement';
    }
    
    const quotes = gpaQuotes[category];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function getCGPABadge(gpa) {
    if (gpa >= 3.7) return { text: "Dean's List", color: "#10b981" };
    if (gpa >= 3.5) return { text: "Excellent", color: "#3b82f6" };
    if (gpa >= 3.0) return { text: "Good Standing", color: "#6366f1" };
    if (gpa >= 2.0) return { text: "Satisfactory", color: "#f59e0b" };
    return { text: "Academic Warning", color: "#ef4444" };
}

function renderGPAChart() {
    const chartContainer = document.getElementById('gpaChart')?.parentElement;
    const ctx = document.getElementById('gpaChart');
    
    if (!ctx || !chartContainer) {
        console.error('Chart container or canvas not found');
        return;
    }
    
    // Clear any existing chart
    if (window.gpaChart) {
        window.gpaChart.destroy();
    }
    
    // Check if we have data to display
    if (!appState.semesters || appState.semesters.length < 2) {
        // Show empty state
        const emptyStateDiv = document.createElement('div');
        emptyStateDiv.className = 'chart-empty-state';
        emptyStateDiv.innerHTML = `
            <i class="fas fa-chart-line"></i>
            <p>Add at least two semesters to see your GPA trend</p>
        `;
        
        // Clear the container and add empty state
        chartContainer.innerHTML = '';
        chartContainer.appendChild(emptyStateDiv);
        
        // Re-add the canvas for future use
        const canvas = document.createElement('canvas');
        canvas.id = 'gpaChart';
        chartContainer.appendChild(canvas);
        
        return;
    }
    
    // Make sure the container only has the canvas
    if (chartContainer.querySelector('.chart-empty-state')) {
        chartContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.id = 'gpaChart';
        chartContainer.appendChild(canvas);
        ctx = canvas; // Update ctx reference to the new canvas
    }
    
    // Debug
    console.log('Rendering chart with data:', {
        labels: appState.semesters.map(s => s.name),
        data: appState.semesters.map(s => s.gpa)
    });
    
    const labels = appState.semesters.map(s => s.name);
    const data = appState.semesters.map(s => s.gpa);
    
    // Create gradient - make sure we have a valid context
    const ctx2d = ctx.getContext('2d');
    if (!ctx2d) {
        console.error('Could not get 2d context from canvas');
        return;
    }
    
    const gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    
    try {
        window.gpaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'GPA',
                    data: data,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `GPA: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.max(0, Math.min(...data) - 0.5),
                        max: Math.min(4, Math.max(...data) + 0.5),
                        ticks: {
                            stepSize: 0.5,
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully');
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

function updateMotivationalQuote() {
    const quoteElement = document.getElementById('quoteText');
    if (!quoteElement) return;
    
    const cgpa = calculateOverallCGPA();
    const quote = getMotivationalQuote(cgpa);
    
    quoteElement.textContent = quote;
}

function getMotivationalQuote(gpa) {
    const quotes = {
        excellent: [
            "Excellence is not a skill. It's an attitude.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "The harder you work for something, the greater you'll feel when you achieve it.",
            "Your dedication to excellence is truly inspiring.",
            "Keep up the outstanding work. Your future is bright!"
        ],
        good: [
            "Good, better, best. Never let it rest until your good is better and your better is best.",
            "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and love.",
            "You're on the right track. Keep pushing forward!",
            "Your consistent effort is paying off. Well done!",
            "Believe you can and you're halfway there."
        ],
        average: [
            "Don't watch the clock; do what it does. Keep going.",
            "The expert in anything was once a beginner.",
            "You have the potential to achieve more. Keep pushing!",
            "Small improvements add up to big results.",
            "Progress is progress, no matter how small."
        ],
        needsImprovement: [
            "The only place where success comes before work is in the dictionary.",
            "It's not about how bad you want it, it's about how hard you're willing to work for it.",
            "Every master was once a disaster. Keep going!",
            "The comeback is always stronger than the setback.",
            "Don't be discouraged. It's often the last key in the bunch that opens the lock."
        ]
    };
    
    let category;
    if (gpa >= 3.5) {
        category = 'excellent';
    } else if (gpa >= 3.0) {
        category = 'good';
    } else if (gpa >= 2.0) {
        category = 'average';
    } else {
        category = 'needsImprovement';
    }
    
    const categoryQuotes = quotes[category];
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

function updatePerformanceStats() {
    const bestCourseEl = document.getElementById('bestCourse');
    const bestSemesterEl = document.getElementById('bestSemester');
    const performanceTrendEl = document.getElementById('performanceTrend');
    
    if (!appState.semesters || appState.semesters.length === 0) {
        if (bestCourseEl) bestCourseEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> No data available</span>';
        if (bestSemesterEl) bestSemesterEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> No data available</span>';
        if (performanceTrendEl) performanceTrendEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> No data available</span>';
        return;
    }
    
    // Find best course
    let bestCourse = null;
    let bestCourseGPA = 0;
    
    appState.semesters.forEach(semester => {
        if (semester.courses) {
            semester.courses.forEach(course => {
                if (course.points > bestCourseGPA) {
                    bestCourseGPA = course.points;
                    bestCourse = { ...course, semesterName: semester.name };
                }
            });
        }
    });
    
    if (bestCourseEl) {
        if (bestCourse) {
            bestCourseEl.innerHTML = `
                <i class="fas fa-star" style="color: #f59e0b;"></i>
                ${bestCourse.name} 
                <span style="color: var(--success-color); margin-left: 0.5rem;">${bestCourse.grade}</span>
                <span style="color: var(--text-secondary); font-size: 0.85rem; margin-left: 0.5rem;">(${bestCourse.semesterName})</span>
            `;
        } else {
            bestCourseEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> No courses added yet</span>';
        }
    }
    
    // Find best semester
    let bestSemester = null;
    let bestSemesterGPA = 0;
    
    appState.semesters.forEach(semester => {
        if (semester.gpa > bestSemesterGPA) {
            bestSemesterGPA = semester.gpa;
            bestSemester = semester;
        }
    });
    
    if (bestSemesterEl) {
        if (bestSemester) {
            bestSemesterEl.innerHTML = `
                <i class="fas fa-trophy" style="color: #f59e0b;"></i>
                ${bestSemester.name} 
                <span style="color: var(--success-color); margin-left: 0.5rem;">${bestSemester.gpa.toFixed(2)}</span>
                <span style="color: var(--text-secondary); font-size: 0.85rem; margin-left: 0.5rem;">(${bestSemester.courses.length} courses)</span>
            `;
        } else {
            bestSemesterEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> No semesters added yet</span>';
        }
    }
    
    // Calculate performance trend
    if (performanceTrendEl) {
        if (appState.semesters.length < 2) {
            performanceTrendEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> Need more data</span>';
        } else {
            const semesterGPAs = appState.semesters.map(s => s.gpa);
            const recentGPAs = semesterGPAs.slice(-3); // Last 3 semesters
            
            if (recentGPAs.length < 2) {
                performanceTrendEl.innerHTML = '<span class="text-muted"><i class="fas fa-info-circle"></i> Need more data</span>';
                return;
            }
            
            // Check if trend is consistently up or down
            let isIncreasing = true;
            let isDecreasing = true;
            
            for (let i = 1; i < recentGPAs.length; i++) {
                if (recentGPAs[i] <= recentGPAs[i-1]) {
                    isIncreasing = false;
                }
                if (recentGPAs[i] >= recentGPAs[i-1]) {
                    isDecreasing = false;
                }
            }
            
            if (isIncreasing) {
                performanceTrendEl.innerHTML = '<span style="color: var(--success-color);"><i class="fas fa-arrow-trend-up"></i> Consistently improving</span>';
            } else if (isDecreasing) {
                performanceTrendEl.innerHTML = '<span style="color: var(--danger-color);"><i class="fas fa-arrow-trend-down"></i> Consistently declining</span>';
            } else {
                // Calculate overall trend
                const firstGPA = recentGPAs[0];
                const lastGPA = recentGPAs[recentGPAs.length - 1];
                const difference = lastGPA - firstGPA;
                
                if (difference > 0.2) {
                    performanceTrendEl.innerHTML = '<span style="color: var(--success-color);"><i class="fas fa-arrow-up"></i> Overall improving</span>';
                } else if (difference < -0.2) {
                    performanceTrendEl.innerHTML = '<span style="color: var(--danger-color);"><i class="fas fa-arrow-down"></i> Overall declining</span>';
                } else {
                    performanceTrendEl.innerHTML = '<span style="color: var(--text-secondary);"><i class="fas fa-minus"></i> Relatively stable</span>';
                }
            }
        }
    }
}

// Function to toggle semester expansion
function toggleSemester(semesterId) {
    const content = document.getElementById(`semesterContent-${semesterId}`);
    const icon = document.getElementById(`toggleIcon-${semesterId}`);
    
    if (content) {
        content.classList.toggle('expanded');
    }
    
    if (icon) {
        icon.classList.toggle('expanded');
    }
    
    // Save expanded state to localStorage for persistence
    saveExpandedState();
}

// Function to save expanded state
function saveExpandedState() {
    const expandedSemesters = getExpandedSemesters();
    localStorage.setItem('expandedSemesters', JSON.stringify(expandedSemesters));
}

// Function to load expanded state
function loadExpandedState() {
    try {
        const savedState = localStorage.getItem('expandedSemesters');
        if (savedState) {
            const expandedSemesters = JSON.parse(savedState);
            restoreExpandedSemesters(expandedSemesters);
        }
    } catch (error) {
        console.error('Error loading expanded state:', error);
    }
}

// Add this function to ensure the chart is visible
function ensureChartVisibility() {
    // Wait for DOM to be fully rendered
    setTimeout(() => {
        const chartContainer = document.querySelector('.gpa-chart-container');
        const canvas = document.getElementById('gpaChart');
        
        if (chartContainer && canvas) {
            // Check if the container has zero height
            const containerHeight = chartContainer.offsetHeight;
            console.log('Chart container height:', containerHeight);
            
            if (containerHeight < 50) {
                console.log('Chart container has insufficient height, fixing...');
                chartContainer.style.height = '250px';
                
                // Force chart redraw
                if (window.gpaChart) {
                    window.gpaChart.resize();
                } else {
                    renderGPAChart();
                }
            }
            
            // Check if canvas is visible
            const canvasDisplay = window.getComputedStyle(canvas).display;
            console.log('Canvas display style:', canvasDisplay);
            
            if (canvasDisplay === 'none') {
                console.log('Canvas is hidden, fixing...');
                canvas.style.display = 'block';
                
                // Force chart redraw
                if (window.gpaChart) {
                    window.gpaChart.resize();
                } else {
                    renderGPAChart();
                }
            }
        }
    }, 500);
}

// Helper function to get currently expanded semesters
function getExpandedSemesters() {
    const expandedSemesters = [];
    document.querySelectorAll('.semester-content').forEach(content => {
        if (content.classList.contains('expanded')) {
            const semesterId = content.id.replace('semesterContent-', '');
            expandedSemesters.push(semesterId);
        }
    });
    return expandedSemesters;
}

// Helper function to restore expanded semesters
function restoreExpandedSemesters(expandedSemesters) {
    expandedSemesters.forEach(semesterId => {
        const content = document.getElementById(`semesterContent-${semesterId}`);
        const icon = document.getElementById(`toggleIcon-${semesterId}`);
        if (content) content.classList.add('expanded');
        if (icon) icon.classList.add('expanded');
    });
}

// Make sure loadData is defined if not already
if (typeof loadData !== 'function') {
    function loadData() {
        const savedData = localStorage.getItem('progresspacer-data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                appState = { ...appState, ...parsed };
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }
}

// GPA page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    if (document.getElementById('gpaContainer')) {
        renderGPAPage();
    }
});

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}
