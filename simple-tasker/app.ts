// DOM 요소 가져오기
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;

// 할 일 추가 함수
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    alert('할 일을 입력해주세요!');
    return;
  }

  // 리스트 아이템 생성
  const li = document.createElement('li');
  li.className = 'task-item';

  // 텍스트 span
  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = taskText;

  // 클릭 시 완료 토글
  span.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  // 삭제 버튼
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.title = '삭제';

  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(li);
  });

  // li에 자식 요소 추가
  li.appendChild(span);
  li.appendChild(deleteBtn);

  // 리스트에 추가
  taskList.appendChild(li);

  // 입력창 초기화 및 포커스 유지
  taskInput.value = '';
  taskInput.focus();
}

// 버튼 클릭 이벤트
addBtn.addEventListener('click', addTask);

// 엔터키로도 추가 가능하게
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});
