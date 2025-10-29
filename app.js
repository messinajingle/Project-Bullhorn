// Global variables to store project data
let projectConfig = {};
let tasks = [];
let taskTypes = {};
let currentFilter = 'all';
let currentSort = 'start_date';
let chart = null;

// Task type color mapping
const TYPE_COLORS = {
  'Export': '#3B82F6',
  'Map': '#10B981',
  'Load': '#F59E0B',
  'Setup': '#8B5CF6',
  'Other': '#6B7280',
  'Planning': '#EC4899',
  'Testing': '#8B5CF6',
  'Documentation': '#06B6D4'
};

// Initialize the application
async function init() {
  try {
    // Load project configuration
    await loadProjectConfig();
    
    // Load tasks from CSV
    await loadTasksFromCSV();
    
    // Initialize all components
    updateHeaderDisplay();
    updateStatistics();
    initCalendar();
    initGantt();
    initTaskTable();
    initChart();
    
    // Setup event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing application:', error);
    alert('Error loading project data. Please check the console for details.');
  }
}

// Load project configuration from JSON file
async function loadProjectConfig() {
  try {
    const response = await fetch('project-config.json');
    projectConfig = await response.json();
  } catch (error) {
    console.error('Error loading project configuration:', error);
    // Use default values if config file is missing
    projectConfig = {
      name: 'Project Dashboard',
      daily_capacity_hours: 8,
      other_projects_hours: 0,
      current_date: new Date().toISOString().split('T')[0]
    };
  }
}

// Load tasks from CSV file
async function loadTasksFromCSV() {
  return new Promise((resolve, reject) => {
    Papa.parse('tasks.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
        }
        
        // Process the parsed data
        tasks = results.data.map(row => {
          // Clean up the task object
          const task = {
            task: row.Task || row.task || '',
            hours_estimate: parseFloat(row.Hours_Estimate || row.hours_estimate || 0),
            percent_complete: parseFloat(row.Percent_Complete || row.percent_complete || 0),
            start_date: row.Start_Date || row.start_date || '',
            end_date: row.End_Date || row.end_date || '',
            duration_days: parseInt(row.Duration_Days || row.duration_days || 0),
            status: row.Status || row.status || 'Not Started',
            notes: row.Notes || row.notes || '',
            type: row.Type || row.type || 'Other'
          };
          
          // Count task types
          if (!taskTypes[task.type]) {
            taskTypes[task.type] = 0;
          }
          taskTypes[task.type]++;
          
          return task;
        });
        
        resolve();
      },
      error: function(error) {
        console.error('Error loading CSV:', error);
        reject(error);
      }
    });
  });
}

// Update header display
function updateHeaderDisplay() {
  document.getElementById('project-title').textContent = projectConfig.name || 'Project Dashboard';
  document.getElementById('project-subtitle').textContent = 
    `Daily Capacity: ${projectConfig.daily_capacity_hours} hours/day` +
    (projectConfig.other_projects_hours > 0 ? ` (${projectConfig.other_projects_hours} hours allocated to other projects)` : '');
  
  // Calculate project dates
  const startDates = tasks
    .filter(t => t.start_date && t.start_date !== 'Completed')
    .map(t => new Date(t.start_date));
  const endDates = tasks
    .filter(t => t.end_date && t.end_date !== 'Completed')
    .map(t => new Date(t.end_date));
  
  const projectStart = startDates.length > 0 ? new Date(Math.min(...startDates)) : new Date();
  const projectEnd = endDates.length > 0 ? new Date(Math.max(...endDates)) : new Date();
  
  document.getElementById('start-date-display').textContent = formatDateFull(projectStart);
  document.getElementById('end-date-display').textContent = formatDateFull(projectEnd);
  document.getElementById('total-tasks-display').textContent = tasks.length;
  
  // Update task counts by status
  const statusCounts = {
    'Complete': 0,
    'In Progress': 0,
    'Not Started': 0
  };
  
  tasks.forEach(task => {
    if (statusCounts.hasOwnProperty(task.status)) {
      statusCounts[task.status]++;
    }
  });
  
  document.getElementById('complete-count').textContent = statusCounts['Complete'];
  document.getElementById('in-progress-count').textContent = statusCounts['In Progress'];
  document.getElementById('not-started-count').textContent = statusCounts['Not Started'];
  
  // Update configuration display
  document.getElementById('daily-capacity').textContent = `${projectConfig.daily_capacity_hours}h/day`;
  document.getElementById('other-projects').textContent = `${projectConfig.other_projects_hours}h/day`;
  document.getElementById('current-date-display').textContent = formatDateFull(new Date(projectConfig.current_date));
  
  // Update Gantt subtitle
  document.getElementById('gantt-subtitle').textContent = 
    `Sequential task execution with ${projectConfig.daily_capacity_hours} hours/day capacity`;
}

// Update project statistics
function updateStatistics() {
  const totalHours = tasks.reduce((sum, task) => sum + task.hours_estimate, 0);
  const completedHours = tasks.reduce((sum, task) => sum + (task.hours_estimate * task.percent_complete), 0);
  const remainingHours = totalHours - completedHours;
  const workingDaysRequired = Math.ceil(remainingHours / projectConfig.daily_capacity_hours);
  
  document.getElementById('total-hours').textContent = totalHours.toFixed(2);
  document.getElementById('hours-completed').textContent = completedHours.toFixed(2);
  document.getElementById('hours-remaining').textContent = remainingHours.toFixed(2);
  document.getElementById('working-days').textContent = `${workingDaysRequired} days`;
  
  // Update overall progress
  const progressPercent = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
  document.getElementById('overall-progress-percent').textContent = `${progressPercent}%`;
  document.getElementById('overall-progress-fill').style.width = `${progressPercent}%`;
  
  // Update task type legend
  const legendContainer = document.getElementById('task-type-legend');
  legendContainer.innerHTML = '';
  
  Object.entries(taskTypes).forEach(([type, count]) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <span class="legend-color" style="background-color: ${getTypeColor(type)}"></span>
      <span class="legend-label">${type} (${count})</span>
    `;
    legendContainer.appendChild(legendItem);
  });
}

// Utility Functions
function parseDate(dateStr) {
  if (!dateStr || dateStr === 'Completed' || dateStr === 'TBD') return null;
  return new Date(dateStr);
}

function formatDate(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateFull(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getWorkingDays(startDate, endDate) {
  let count = 0;
  let current = new Date(startDate);
  while (current <= endDate) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function getTasksByDate(date) {
  const dateStr = date.toISOString().split('T')[0];
  return tasks.filter(task => {
    if (task.start_date === 'Completed') return false;
    const taskStart = parseDate(task.start_date);
    const taskEnd = parseDate(task.end_date);
    return taskStart && taskEnd && date >= taskStart && date <= taskEnd;
  });
}

function getStatusClass(status) {
  return status.toLowerCase().replace(' ', '-');
}

function getTypeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS['Other'];
}

// Initialize Calendar
function initCalendar() {
  const container = document.getElementById('calendar-container');
  container.innerHTML = '';
  
  // Determine which months to show based on task dates
  const taskDates = tasks
    .filter(t => t.start_date && t.start_date !== 'Completed')
    .map(t => new Date(t.start_date))
    .concat(tasks
      .filter(t => t.end_date && t.end_date !== 'Completed')
      .map(t => new Date(t.end_date))
    );
  
  if (taskDates.length === 0) {
    // Show current and next month if no tasks
    const now = new Date();
    container.appendChild(createMonthCalendar(now.getFullYear(), now.getMonth()));
    container.appendChild(createMonthCalendar(now.getFullYear(), now.getMonth() + 1));
    return;
  }
  
  const minDate = new Date(Math.min(...taskDates));
  const maxDate = new Date(Math.max(...taskDates));
  
  // Show all months between min and max dates
  let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  
  while (current <= end) {
    container.appendChild(createMonthCalendar(current.getFullYear(), current.getMonth()));
    current.setMonth(current.getMonth() + 1);
  }
}

function createMonthCalendar(year, month) {
  const calendar = document.createElement('div');
  calendar.className = 'calendar';
  
  // Header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  header.textContent = `${monthNames[month]} ${year}`;
  calendar.appendChild(header);
  
  // Grid
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  
  // Day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    grid.appendChild(emptyCell);
  }
  
  // Days
  const currentDate = parseDate(projectConfig.current_date);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    
    if (isWeekend(date)) {
      dayCell.classList.add('weekend');
    }
    
    const tasksForDay = getTasksByDate(date);
    if (tasksForDay.length > 0 && !isWeekend(date)) {
      dayCell.classList.add('has-tasks');
    }
    
    if (currentDate && date.toDateString() === currentDate.toDateString()) {
      dayCell.classList.add('current');
    }
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);
    
    // Add click handler
    dayCell.addEventListener('click', () => {
      if (!isWeekend(date)) {
        showDayModal(date, tasksForDay);
      }
    });
    
    grid.appendChild(dayCell);
  }
  
  calendar.appendChild(grid);
  return calendar;
}

// Initialize Gantt Chart
function initGantt() {
  const container = document.getElementById('gantt-container');
  container.innerHTML = '';
  
  const gantt = document.createElement('div');
  gantt.className = 'gantt-chart';
  
  // Get date range from tasks
  const validTasks = tasks.filter(t => t.start_date && t.start_date !== 'Completed');
  if (validTasks.length === 0) {
    container.innerHTML = '<p class="no-data">No tasks with dates to display</p>';
    return;
  }
  
  const startDates = validTasks.map(t => new Date(t.start_date));
  const endDates = validTasks
    .filter(t => t.end_date && t.end_date !== 'Completed')
    .map(t => new Date(t.end_date));
  
  const projectStart = new Date(Math.min(...startDates));
  const projectEnd = endDates.length > 0 ? new Date(Math.max(...endDates)) : new Date(projectStart);
  
  // Get all working days
  const workingDays = [];
  let current = new Date(projectStart);
  while (current <= projectEnd) {
    if (!isWeekend(current)) {
      workingDays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  // Create header
  const header = document.createElement('div');
  header.className = 'gantt-header';
  workingDays.forEach(date => {
    const dateCell = document.createElement('div');
    dateCell.className = 'gantt-date';
    dateCell.textContent = formatDate(date);
    header.appendChild(dateCell);
  });
  gantt.appendChild(header);
  
  // Create rows for each task
  validTasks.forEach(task => {
    const row = document.createElement('div');
    row.className = 'gantt-row';
    
    const taskName = document.createElement('div');
    taskName.className = 'gantt-task-name';
    taskName.textContent = task.task;
    taskName.title = task.task;
    row.appendChild(taskName);
    
    const timeline = document.createElement('div');
    timeline.className = 'gantt-timeline';
    
    const taskStart = parseDate(task.start_date);
    const taskEnd = parseDate(task.end_date);
    
    if (taskStart && taskEnd) {
      // Calculate position and width
      const startIndex = workingDays.findIndex(d => d.toDateString() === taskStart.toDateString());
      const endIndex = workingDays.findIndex(d => d.toDateString() === taskEnd.toDateString());
      
      if (startIndex !== -1 && endIndex !== -1) {
        const barWidth = ((endIndex - startIndex + 1) / workingDays.length) * 100;
        const barLeft = (startIndex / workingDays.length) * 100;
        
        const bar = document.createElement('div');
        bar.className = `gantt-bar ${getStatusClass(task.status)}`;
        bar.style.width = `${barWidth}%`;
        bar.style.left = `${barLeft}%`;
        bar.style.backgroundColor = getTypeColor(task.type);
        bar.textContent = task.task;
        bar.title = `${task.task}\n${task.hours_estimate}h\n${task.status}`;
        
        timeline.appendChild(bar);
      }
    }
    
    row.appendChild(timeline);
    gantt.appendChild(row);
  });
  
  container.appendChild(gantt);
}

// Initialize Task Table
function initTaskTable() {
  renderTaskTable();
}

function renderTaskTable() {
  const tbody = document.getElementById('task-table-body');
  tbody.innerHTML = '';
  
  // Filter tasks
  let filteredTasks = tasks;
  if (currentFilter !== 'all') {
    filteredTasks = tasks.filter(task => task.status === currentFilter);
  }
  
  // Sort tasks
  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (currentSort === 'start_date') {
      const aDate = parseDate(a.start_date);
      const bDate = parseDate(b.start_date);
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate - bDate;
    } else if (currentSort === 'task') {
      return a.task.localeCompare(b.task);
    } else if (currentSort === 'hours_estimate') {
      return b.hours_estimate - a.hours_estimate;
    } else if (currentSort === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });
  
  // Render rows
  filteredTasks.forEach(task => {
    const row = document.createElement('tr');
    
    // Task name
    const nameCell = document.createElement('td');
    const nameDiv = document.createElement('div');
    nameDiv.className = 'task-name';
    nameDiv.textContent = task.task;
    nameCell.appendChild(nameDiv);
    row.appendChild(nameCell);
    
    // Status
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${getStatusClass(task.status)}`;
    statusBadge.textContent = task.status;
    statusCell.appendChild(statusBadge);
    row.appendChild(statusCell);
    
    // Hours
    const hoursCell = document.createElement('td');
    hoursCell.textContent = `${task.hours_estimate}h`;
    row.appendChild(hoursCell);
    
    // Progress
    const progressCell = document.createElement('td');
    const progressDiv = document.createElement('div');
    progressDiv.className = 'task-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'task-progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'task-progress-fill';
    progressFill.style.width = `${task.percent_complete * 100}%`;
    progressBar.appendChild(progressFill);
    
    const progressText = document.createElement('span');
    progressText.className = 'task-progress-text';
    progressText.textContent = `${Math.round(task.percent_complete * 100)}%`;
    
    progressDiv.appendChild(progressBar);
    progressDiv.appendChild(progressText);
    progressCell.appendChild(progressDiv);
    row.appendChild(progressCell);
    
    // Start date
    const startCell = document.createElement('td');
    startCell.textContent = task.start_date === 'Completed' ? 'Completed' : 
      (task.start_date ? formatDateFull(parseDate(task.start_date)) : 'TBD');
    row.appendChild(startCell);
    
    // End date
    const endCell = document.createElement('td');
    endCell.textContent = task.end_date === 'Completed' ? 'Completed' : 
      (task.end_date ? formatDateFull(parseDate(task.end_date)) : 'TBD');
    row.appendChild(endCell);
    
    // Duration
    const durationCell = document.createElement('td');
    durationCell.textContent = task.duration_days === 0 ? 'N/A' : `${task.duration_days} day${task.duration_days > 1 ? 's' : ''}`;
    row.appendChild(durationCell);
    
    // Notes
    const notesCell = document.createElement('td');
    const notesDiv = document.createElement('div');
    notesDiv.className = 'task-notes';
    notesDiv.textContent = task.notes || '-';
    notesDiv.title = task.notes;
    notesCell.appendChild(notesDiv);
    row.appendChild(notesCell);
    
    tbody.appendChild(row);
  });
}

// Initialize Chart
function initChart() {
  const ctx = document.getElementById('taskTypeChart');
  
  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }
  
  // Prepare data
  const labels = Object.keys(taskTypes);
  const data = Object.values(taskTypes);
  const colors = labels.map(type => getTypeColor(type));
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} tasks (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Modal Functions
function showDayModal(date, tasksForDay) {
  const modal = document.getElementById('day-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  modalTitle.textContent = `Tasks for ${formatDateFull(date)}`;
  modalBody.innerHTML = '';
  
  if (tasksForDay.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'modal-empty';
    emptyMsg.textContent = 'No tasks scheduled for this day.';
    modalBody.appendChild(emptyMsg);
  } else {
    tasksForDay.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'modal-task';
      taskDiv.style.borderLeftColor = getTypeColor(task.type);
      
      const header = document.createElement('div');
      header.className = 'modal-task-header';
      
      const name = document.createElement('div');
      name.className = 'modal-task-name';
      name.textContent = task.task;
      header.appendChild(name);
      
      const statusBadge = document.createElement('span');
      statusBadge.className = `status-badge ${getStatusClass(task.status)}`;
      statusBadge.textContent = task.status;
      header.appendChild(statusBadge);
      
      taskDiv.appendChild(header);
      
      const details = document.createElement('div');
      details.className = 'modal-task-details';
      details.innerHTML = `
        <div class="modal-task-detail"><strong>Type:</strong> ${task.type}</div>
        <div class="modal-task-detail"><strong>Hours:</strong> ${task.hours_estimate}h</div>
        <div class="modal-task-detail"><strong>Progress:</strong> ${Math.round(task.percent_complete * 100)}%</div>
        ${task.notes ? `<div class="modal-task-detail"><strong>Notes:</strong> ${task.notes}</div>` : ''}
      `;
      taskDiv.appendChild(details);
      
      modalBody.appendChild(taskDiv);
    });
  }
  
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('day-modal');
  modal.classList.remove('active');
}

// Setup event listeners
function setupEventListeners() {
  // Filter and sort
  document.getElementById('status-filter').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTaskTable();
  });
  
  document.getElementById('sort-by').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTaskTable();
  });
  
  // Modal close handlers
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('day-modal').addEventListener('click', (e) => {
    if (e.target.id === 'day-modal') {
      closeModal();
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);