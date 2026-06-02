// Lấy các phần tử DOM
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearBtn');
const totalTodos = document.getElementById('totalTodos');
const completedTodos = document.getElementById('completedTodos');

// Local Storage Key
const STORAGE_KEY = 'todos';

// State
let todos = [];
let currentFilter = 'all';

// Khởi tạo ứng dụng
function init() {
    loadTodosFromStorage();
    renderTodos();
    setupEventListeners();
    updateStats();
}

// Thiết lập sự kiện
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });

    clearBtn.addEventListener('click', clearCompletedTodos);
}

// Thêm việc cần làm
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Vui lòng nhập một công việc!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString('vi-VN')
    };

    todos.push(todo);
    todoInput.value = '';
    todoInput.focus();

    saveTodosToStorage();
    renderTodos();
    updateStats();
}

// Xóa công việc
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToStorage();
    renderTodos();
    updateStats();
}

// Bật/tắt hoàn thành
function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodosToStorage();
    renderTodos();
    updateStats();
}

// Xóa tất cả công việc hoàn thành
function clearCompletedTodos() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả công việc hoàn thành?')) {
        todos = todos.filter(todo => !todo.completed);
        saveTodosToStorage();
        renderTodos();
        updateStats();
    }
}

// Lọc công việc dựa trên bộ lọc hiện tại
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Render danh sách công việc
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">Không có công việc nào 🎉</div>';
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleComplete(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Xóa</button>
        `;
        todoList.appendChild(li);
    });
}

// Cập nhật thống kê
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;

    totalTodos.textContent = `Tổng: ${total}`;
    completedTodos.textContent = `Hoàn thành: ${completed}`;
    clearBtn.disabled = completed === 0;
}

// Lưu vào Local Storage
function saveTodosToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Tải từ Local Storage
function loadTodosFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Khởi tạo khi DOM tải xong
document.addEventListener('DOMContentLoaded', init);
