// DOM 요소 가져오기
const todoInput = document.querySelector('.todo-input') as HTMLInputElement;
const todoList = document.querySelector('.todo-list') as HTMLUListElement;
const completeAllBtn = document.querySelector('.complete-all-btn') as HTMLButtonElement;
const leftItemsSpan = document.querySelector('.left-items') as HTMLDivElement; // 남은 할 일 개수 표시 요소
const clearCompletedBtn = document.querySelector('.clear-completed-btn') as HTMLButtonElement; // 완료된 할 일 삭제 버튼
const filterButtons = document.querySelectorAll('.button-group button') as NodeListOf<HTMLButtonElement>; // 필터 버튼들

// 로컬 스토리지에서 할 일 불러오기
let todos: { id: number, text: string, completed: boolean }[] = JSON.parse(localStorage.getItem('todos') || '[]');
let nextId: number = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 0;
let currentFilter: 'all' | 'active' | 'completed' = 'all'; // 현재 필터 상태

// 할 일 목록 렌더링 함수
function renderTodos() {
    todoList.innerHTML = ''; // 목록 초기화
    
    // 현재 필터에 맞는 할 일 목록 가져오기
    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-id', todo.id.toString()); // data-id 속성에 id 저장
        if (todo.completed) {
            li.classList.add('checked');
        }

        const checkboxElem = document.createElement('div');
        checkboxElem.classList.add('checkbox');
        checkboxElem.textContent = todo.completed ? '✔' : '';
        checkboxElem.addEventListener('click', () => {
            toggleComplete(todo.id);
        });
        
        const todoElem = document.createElement('div');
        todoElem.classList.add('todo');
        todoElem.textContent = todo.text;

        // 더블 클릭 시 수정 모드
        todoElem.addEventListener('dblclick', () => {
            const originalText = todo.text;
            const inputElem = document.createElement('input');
            inputElem.type = 'text';
            inputElem.classList.add('edit-input');
            inputElem.value = originalText;
            
            // 원래 요소들을 숨기고 input 추가
            li.innerHTML = ''; // 기존 자식 요소 삭제
            li.appendChild(checkboxElem); // 체크박스는 유지
            li.appendChild(inputElem);
            // 삭제 버튼은 수정 완료 후 다시 추가

            inputElem.focus(); // 입력 필드에 포커스

            const saveEdit = () => {
                const newText = inputElem.value.trim();
                if (newText === '') {
                     // 텍스트가 비어있으면 삭제
                    deleteTodo(todo.id);
                } else if (newText !== originalText) {
                    // 텍스트가 변경되었으면 수정
                    editTodo(todo.id, newText);
                }
                 else {
                    // 변경 없으면 수정 모드 종료
                    renderTodos(); // 전체 다시 렌더링하여 원래 상태로 되돌림
                 }
            };

            inputElem.addEventListener('blur', saveEdit); // 포커스를 잃으면 저장
            inputElem.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    inputElem.removeEventListener('blur', saveEdit); // Enter 키 입력 시 blur 이벤트 중복 방지
                    saveEdit(); // Enter 키 입력 시 저장
                }
            });
        });
    
        const delBtnElem = document.createElement('button');
        delBtnElem.classList.add('delBtn');
        delBtnElem.textContent = 'X';
        delBtnElem.addEventListener('click', () =>  {
            deleteTodo(todo.id);
        });

        // 수정 모드가 아닐 때만 버튼 추가
        if (li.querySelector('.edit-input') === null) {
             li.appendChild(todoElem);
             li.appendChild(delBtnElem);
        }
       
        todoList.appendChild(li);
    });
    updateCompleteAllBtn(); // 전체 완료 버튼 상태 업데이트
    updateLeftItems(); // 남은 할 일 개수 업데이트
    updateFilterButtons(); // 필터 버튼 상태 업데이트
}

// 현재 필터에 맞는 할 일 목록 반환 함수
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        return todos.filter(todo => todo.completed);
    } else {
        return todos;
    }
}

// 할 일 추가 함수
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const newTodo = { id: nextId++, text: todoText, completed: false };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value = '';
    renderTodos();
}

// 할 일 완료/미완료 토글 함수
function toggleComplete(id: number) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 할 일 삭제 함수
function deleteTodo(id: number) {
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 할 일 수정 함수
function editTodo(id: number, newText: string) {
     todos = todos.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
    );
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 전체 완료 버튼 상태 업데이트 함수
function updateCompleteAllBtn() {
    if (todos.length > 0 && todos.every(todo => todo.completed)) {
        completeAllBtn.classList.add('checked');
    } else {
        completeAllBtn.classList.remove('checked');
    }
}

// 전체 완료/미완료 토글 함수
function toggleCompleteAll() {
    const allCompleted = todos.every(todo => todo.completed);
    todos = todos.map(todo => ({ ...todo, completed: !allCompleted }));
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 남은 할 일 개수 업데이트 함수
function updateLeftItems() {
    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    leftItemsSpan.textContent = `${activeTodosCount} items left`;
}

// 완료된 할 일 삭제 함수
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 필터 버튼 상태 업데이트 함수
function updateFilterButtons() {
    filterButtons.forEach(button => {
        if (button.dataset.type === currentFilter) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

// 이벤트 리스너 연결
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

completeAllBtn.addEventListener('click', toggleCompleteAll);

clearCompletedBtn.addEventListener('click', clearCompleted); // 완료된 할 일 삭제 버튼 이벤트

// 필터 버튼 이벤트 리스너
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.type as 'all' | 'active' | 'completed';
        renderTodos(); // 필터 변경 후 다시 렌더링
    });
});

// 페이지 로드 시 할 일 목록 렌더링 및 초기 상태 설정
renderTodos();
updateLeftItems(); // 페이지 로드 시 남은 할 일 개수 업데이트
updateFilterButtons(); // 페이지 로드 시 필터 버튼 상태 업데이트
