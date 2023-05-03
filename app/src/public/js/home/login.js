"use strict";
// ID 태그(#)로 구분된 데이터를 id, name, password ~~의 이름을 가진 변수로 지정

const id = document.querySelector("#id"),
  password = document.querySelector("#password"),
  login_btn = document.querySelector("#button");

login_btn.addEventListener("click", login);

//login() 이라는 함수가 id와 password를 요구하도록 함
function login() {
  const req = {
    id: id.value,
    password: password.value,
  };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        location.href = "/";
      } else {
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error(new Error("로그인 중 오류가 발생하였습니다."));
    });
}
