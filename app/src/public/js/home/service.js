"use strict";
// ID 태그(#)로 구분된 데이터를 id, name, password ~~의 이름을 가진 변수로 지정

const url = document.querySelector("#url"),
  service_btn = document.querySelector("#button");

service_btn.addEventListener("click", service);

//login() 이라는 함수가 id와 password를 요구하도록 함
function service() {
  const req = {
    url: url.value,
  };

  fetch("/diagnostics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        location.href = "/result";
      } else {
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error(new Error("URL 조회 중 오류가 발생하였습니다."));
    });
}
