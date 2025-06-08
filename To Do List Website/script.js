document.addEventListener('DOMContentLoaded', function() {

    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksContainer = document.getElementById('tasks-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryFilter = document.getElementById('category-filter');
    const taskCountSpan = document.getElementById('task-count');
    const totalStat = document.getElementById('total-stat');
    const activeStat = document.getElementById('active-stat');
    const completedStat = document.getElementById('completed-stat');
    
    // Array untuk menyimpan tugas//
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let currentCategory = 'home';
    let categoryFilterValue = 'all';
    
    // Aktifkan kategori default//
    document.querySelector('.category-btn[data-category="home"]').classList.add('active');
    
    // Fungsi untuk menyimpan tugas ke localstoragee//
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    }
    
    // Fungsi untuk menambah tugas//
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Silakan masukkan tugas!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            category: currentCategory,
            timestamp: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
        
        // Animasi
        const taskElement = document.querySelector(`.task[data-id="${newTask.id}"]`);
        if (taskElement) {
            taskElement.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                taskElement.style.animation = '';
            }, 500);
        }
    }
    
    // Fungsi untuk menghapus tugas
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Fungsi untuk mengubah status tugas
    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed};
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }
    
    // Fungsi untuk mengedit tugas
    function editTask(id, newText) {
        if (!newText.trim()) return;
        
        tasks = tasks.map(task => {
            if (task.id === id) {
                return {...task, text: newText.trim()};
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }
    
    // Fungsi untuk mengubah kategori
    function setActiveCategory(category) {
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
        currentCategory = category;
    }
    
    // Fungsi untuk merender tugas berdasarkan filter
    function renderTasks() {
        const filteredTasks = tasks.filter(task => {
            // Filter berdasarkan status (all, active, completed)
            let statusMatch = true;
            if (currentFilter === 'active') statusMatch = !task.completed;
            if (currentFilter === 'completed') statusMatch = task.completed;
            
            // Filter berdasarkan kategori
            let categoryMatch = true;
            if (categoryFilterValue !== 'all') {
                categoryMatch = task.category === categoryFilterValue;
            }
            
            return statusMatch && categoryMatch;
        });
        
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Tidak ada tugas</h3>
                    <p>${currentFilter === 'completed' ? 'Belum ada tugas yang selesai' : currentFilter === 'active' ? 'Semua tugas selesai' : 'Tambahkan tugas baru untuk memulai'}</p>
                </div>
            `;
            return;
        }
        
        tasksContainer.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.dataset.id = task.id;
            
            const date = new Date(task.timestamp);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            // Kategori mapping
            const categoryNames = {
                'home': 'Rumah',
                'school': 'Sekolah',
                'sport': 'Olahraga',
                'other': 'Lainnya'
            };
            
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-text">${task.text}</div>
                <div class="task-details">
                    <div class="task-category ${task.category}">${categoryNames[task.category]}</div>
                    <div class="task-date">${formattedDate}</div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            
            tasksContainer.appendChild(taskElement);
            
            // Tambahkan event listeners
            const checkbox = taskElement.querySelector('.task-checkbox');
            const editBtn = taskElement.querySelector('.edit-btn');
            const deleteBtn = taskElement.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit tugas:', task.text);
                if (newText !== null) {
                    editTask(task.id, newText);
                }
            });
        });
    }
    
    // Fungsi untuk memperbarui statistik
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;
        
        // Update greeting section
        if (taskCountSpan) taskCountSpan.textContent = activeTasks;
        if (totalStat) totalStat.textContent = totalTasks;
        if (activeStat) activeStat.textContent = activeTasks;
        if (completedStat) completedStat.textContent = completedTasks;
    }
    
    // Event listener untuk tombol tambah
    addTaskBtn.addEventListener('click', addTask);
    
    // Event listener untuk menekan Enter di input
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Event listener untuk filter status
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    // Event listener untuk kategori
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveCategory(btn.dataset.category);
        });
    });
    
    // Event listener untuk filter kategori
    categoryFilter.addEventListener('change', () => {
        categoryFilterValue = categoryFilter.value;
        renderTasks();
    });
    
    // Inisialisasi aplikasi
    updateStats();
    renderTasks();
});