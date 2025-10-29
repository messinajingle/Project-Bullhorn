// Project Data
const projectData = {
  name: 'Bullhorn Data Integration Workstream',
  start_date: '2025-10-30',
  end_date: '2025-11-11',
  daily_capacity_hours: 2.5,
  other_projects_hours: 5.5,
  total_hours: 24.17,
  hours_completed: 3.17,
  hours_remaining: 21.0,
  working_days_required: 9,
  current_date: '2025-10-29'
};

const taskTypes = [
  { name: 'Export', color: '#3B82F6', count: 5 },
  { name: 'Map', color: '#10B981', count: 4 },
  { name: 'Load', color: '#F59E0B', count: 6 },
  { name: 'Setup', color: '#8B5CF6', count: 1 },
  { name: 'Other', color: '#6B7280', count: 1 }
];

const tasks = [
  {
    task: 'Establish Console Link',
    hours_estimate: 3.0,
    percent_complete: 0.5,
    start_date: '2025-10-30',
    end_date: '2025-10-30',
    duration_days: 1,
    status: 'In Progress',
    notes: 'Running into minor technical difficulties',
    type: 'Setup'
  },
  {
    task: 'Export Users',
    hours_estimate: 0.17,
    percent_complete: 1.0,
    start_date: 'Completed',
    end_date: 'Completed',
    duration_days: 0,
    status: 'Complete',
    notes: 'User file sent to Russ to create Users',
    type: 'Export'
  },
  {
    task: 'Load Users',
    hours_estimate: 1.0,
    percent_complete: 0.0,
    start_date: '2025-10-30',
    end_date: '2025-10-30',
    duration_days: 1,
    status: 'Not Started',
    notes: 'Russ creating users must be done before loading any additional data',
    type: 'Load'
  },
  {
    task: 'Export Companies',
    hours_estimate: 0.5,
    percent_complete: 0.0,
    start_date: '2025-10-31',
    end_date: '2025-10-31',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Export'
  },
  {
    task: 'Map Companies',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-10-31',
    end_date: '2025-11-03',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Map'
  },
  {
    task: 'Load Companies',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-03',
    end_date: '2025-11-03',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Load'
  },
  {
    task: 'Export Contacts',
    hours_estimate: 0.5,
    percent_complete: 0.0,
    start_date: '2025-11-03',
    end_date: '2025-11-03',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Export'
  },
  {
    task: 'Map Contacts',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-04',
    end_date: '2025-11-04',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Map'
  },
  {
    task: 'Load Contacts',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-04',
    end_date: '2025-11-05',
    duration_days: 2,
    status: 'Not Started',
    notes: '',
    type: 'Load'
  },
  {
    task: 'Export Jobs',
    hours_estimate: 0.5,
    percent_complete: 0.0,
    start_date: '2025-11-05',
    end_date: '2025-11-05',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Export'
  },
  {
    task: 'Map Jobs',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-05',
    end_date: '2025-11-06',
    duration_days: 2,
    status: 'Not Started',
    notes: '',
    type: 'Map'
  },
  {
    task: 'Load Jobs',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-06',
    end_date: '2025-11-07',
    duration_days: 2,
    status: 'Not Started',
    notes: '',
    type: 'Load'
  },
  {
    task: 'Export Candidates',
    hours_estimate: 0.5,
    percent_complete: 0.0,
    start_date: '2025-11-07',
    end_date: '2025-11-07',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Export'
  },
  {
    task: 'Map Candidates',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-07',
    end_date: '2025-11-10',
    duration_days: 2,
    status: 'Not Started',
    notes: '',
    type: 'Map'
  },
  {
    task: 'Load Candidates',
    hours_estimate: 2.0,
    percent_complete: 0.0,
    start_date: '2025-11-10',
    end_date: '2025-11-11',
    duration_days: 2,
    status: 'Not Started',
    notes: '',
    type: 'Load'
  },
  {
    task: 'Export Candidate Files',
    hours_estimate: 1.0,
    percent_complete: 0.0,
    start_date: '2025-11-11',
    end_date: '2025-11-11',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Export'
  },
  {
    task: 'Attach Candidate Files via console',
    hours_estimate: 1.0,
    percent_complete: 0.0,
    start_date: '2025-11-11',
    end_date: '2025-11-11',
    duration_days: 1,
    status: 'Not Started',
    notes: '',
    type: 'Load'
  }
];

// Utility Functions
function parseDate(dateStr) {
  if (!dateStr || dateStr === 'Completed') return null;
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
  const typeObj = taskTypes.find(t => t.name === type);
  return typeObj ? typeObj.color : '#6B7280';
}

// Initialize Calendar
function initCalendar() {
  const container = document.getElementById('calendar-container');
  
  // Create calendars for October and November 2025
  const october = createMonthCalendar(2025, 9); // Month is 0-indexed
  const november = createMonthCalendar(2025, 10);
  
  container.appendChild(october);
  container.appendChild(november);
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
  const currentDate = parseDate(projectData.current_date);
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
    
    if (date.toDateString() === currentDate.toDateString()) {
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
  const gantt = document.createElement('div');
  gantt.className = 'gantt-chart';
  
  // Get date range
  const startDate = parseDate(projectData.start_date);
  const endDate = parseDate(projectData.end_date);
  
  // Get all working days
  const workingDays = [];
  let current = new Date(startDate);
  while (current <= endDate) {
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
  tasks.forEach(task => {
    if (task.start_date === 'Completed') return;
    
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
let currentFilter = 'all';
let currentSort = 'start_date';

function initTaskTable() {
  renderTaskTable();
  
  // Add event listeners for filters
  document.getElementById('status-filter').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTaskTable();
  });
  
  document.getElementById('sort-by').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTaskTable();
  });
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
    startCell.textContent = task.start_date === 'Completed' ? 'Completed' : formatDateFull(parseDate(task.start_date));
    row.appendChild(startCell);
    
    // End date
    const endCell = document.createElement('td');
    endCell.textContent = task.end_date === 'Completed' ? 'Completed' : formatDateFull(parseDate(task.end_date));
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
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: taskTypes.map(t => t.name),
      datasets: [{
        data: taskTypes.map(t => t.count),
        backgroundColor: taskTypes.map(t => t.color),
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

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  initGantt();
  initTaskTable();
  initChart();
  
  // Modal close handlers
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('day-modal').addEventListener('click', (e) => {
    if (e.target.id === 'day-modal') {
      closeModal();
    }
  });
  
  // Calculate and update overall progress
  const totalHours = tasks.reduce((sum, task) => sum + task.hours_estimate, 0);
  const completedHours = tasks.reduce((sum, task) => sum + (task.hours_estimate * task.percent_complete), 0);
  const progressPercent = Math.round((completedHours / totalHours) * 100);
  
  document.getElementById('overall-progress-percent').textContent = `${progressPercent}%`;
  document.getElementById('overall-progress-fill').style.width = `${progressPercent}%`;
});