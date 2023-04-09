"use strict";

const id = document.querySelector("#id"),
  name = document.querySelector("#name"),
  password = document.querySelector("#password"),
  confirm_password = document.querySelector("#confirm_password"),
  register_btn = document.querySelector("#button");
console.log("hello register");
register_btn.addEventListener("click", register);

function register() {
  const req = {
    id: id.value,
    name: name.value,
    password: password.value,
    confirm_password: confirm_password.value,
  };
  console.log(req);

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        location.href = "/login";
      } else {
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error(new Error("회원가입 중 오류가 발생하였습니다."));
    });
}
