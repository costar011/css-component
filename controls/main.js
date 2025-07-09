const usernames = ["costar", "costar1", "costar2"];

const input = document.querySelector("#input"),
  spinner = document.querySelector(".spinner"),
  button = document.querySelector("button");

// 입력값을 검증하고 UI 상태를 업데이트하는 함수
const update = (value) => {
  spinner.classList.remove("visible");

  // 입력값이 이미 존재하는 아이디인지 확인
  const usernameExists = usernames.some((u) => u === value);
  // 입력값이 없거나 이미 존재하면 invalid 처리
  const invalid = usernameExists || !value;

  button.disabled = invalid;
  input.classList.toggle("valid", !invalid);
};

// 디바운스 함수: 입력이 멈춘 뒤 일정 시간 후에만 콜백 실행
const debounce = (callback, time) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback.apply(null, args);
    }, time);
  };
};

const handleStartTyping = () => {
  spinner.classList.add("visible");
};

// 입력값이 바뀔 때마다 호출되는 함수
const handleChange = debounce((input) => {
  const { value } = input.target;
  // 입력창에 값이 있으면 has-value 클래스 추가
  input.target.classList.toggle("has-value", value);
  update(value);
}, 500);