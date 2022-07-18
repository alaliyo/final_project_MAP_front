
let setCookie = function(name, value, exp) {
    let date = new Date();
    date.setTime(date.getTime() + exp*24*60*60*1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};



//<------------------ 로그인 기능 ----------------------->
function sign_in() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()

    if (username == "") {
        $("#help-id-login").text(alert("아이디를 입력해주세요."))
        $("#input-username").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (password == "") {
        $("#help-password-login").text(alert("비밀번호를 입력해주세요."))
        $("#input-password").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/login",
        data:JSON.stringify({
                username: username,
                password: password,
            }
        ),
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            if (response == "가입되지 않은 아이디 입니다.") {
                alert("가입되지 않은 아이디 입니다.")
                window.location.replace("/login.html")
            } else if (response == "잘못된 비밀번호입니다.") {
                alert("잘못된 비밀번호입니다.")
                window.location.replace("/login.html")
            } else{
                setCookie ('X-AUTH-TOKEN', response, 1)
                window.location.replace("/home.html")
                alert("로그인 되었습니다.")
            }
        }
    });
}


//<-------------------------- 회원가입 ---------------------------->
function sign_up() {
    // 회원 가입시 아이디, 비밀번호1,2, 이메일, 이름 정보 받기
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let password2 = $("#input-password2").val()
    let email = $("#input-email").val()
    let nickname = $("#input-nickname").val()
    console.log(username, password, password2, nickname, email)

    // 중복 검사 했는지 안 했는지 is-success가 있으면 아이디 중복 확인한거다
    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if ($("#help-nickname").hasClass("is-danger")) {
        alert("닉네임을 다시 확인해주세요.")
        return;
    } else if (!$("#help-nickname").hasClass("is-success")) {
        alert("닉네임 중복확인을 해주세요.")
        return;
    }

    if ($("#help-email").hasClass("is-danger")) {
        alert("닉네임을 다시 확인해주세요.")
        return;
    } else if (!$("#help-email").hasClass("is-success")) {
        alert("닉네임 중복확인을 해주세요.")
        return;
    }

    // <------------------------------------- 비밀번호 확인 ------------------------------------->    
    // 비밀번호1 입력 확인
    if (password == "") {
        $("#help-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return;
    }
    // 비밀번호1 조건 확인
    else if (!is_password(password)) {
        $("#help-password").text("영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return
    }
    // 비밍번호1 조건 충족
    else {
        $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }

    // 비밀번호2 입력확인
    if (password2 == "") {
        $("#help-password2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    }
    // 비밀번호1과 비밀번호 비교
    else if (password2 != password) {
        $("#help-password2").text(alert("비밀번호와 비밀번호 재입력 다릅니다")).removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    }
    // 비밀번호2 조건 충족
    else {
        $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/join",
        // 저장된 유저 네임 페스워드를 서버로 회원가입한다고 요청
        data: JSON.stringify(
            {
                username: username,
                password: password,
                email: email,
                nickname: nickname
            }
        ),
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login.html")
        }
    });

}


// <---------------------------- 숨기기 ---------------------------->
function toggle_sign_up() {
    $("#sign-up-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-password").toggleClass("is-hidden")
    $("#help-password2").toggleClass("is-hidden")
}


// <------------------------- 회원가입 규칙 ------------------------>
// 아이디 규칙
function is_username(asValue) {
    const regExp = /^(?=.*[a-zA-Z0-9])[0-9a-zA-Z]{6,15}$/;
    return regExp.test(asValue);
}
// 비밀번호 규칙
function is_password(asValue) {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}
//이메일 규칙
function is_email(asValue) {
    const regExp = /^(?=.*[a-zA-Z0-9]*@[a-zA-Z0-9]*.[a-zA-Z0-9])[0-9a-zA-Z@.]{10,30}$/;
    return regExp.test(asValue);
}
//닉이름 규칙
function is_nickname(asValue) {
    const regExp = /^(?=.*[a-zA-Z0-9ㄱ-ㅎ가-힣])[0-9a-zA-Zㄱ-ㅎ가-힣]{2,30}$/;
    return regExp.test(asValue);
}


// 아이디 중복 확인 회원 가입
function username_check_dup() {
    let username = $("#input-username").val()
    console.log(username)
    // 아이디 빈칸의 경우
    if (username == "") {
        // 벌마의 클래스가 is-danger인 경우 false로 보는게 맞기 때문에 is-safe를 지운다
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        // 아이디 입력하는 부분으로 커서가 focus 됨
        $("#input-username").focus()
        return;
    }
    // 정규식에 규칙에 포함이 되는가
    if (!is_username(username)) {
        $("#help-id").text("영문과 숫자 필수 포함. 사용가능 6-15자").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    // 아이디 입력후 형식메 맞는다면 서버에서 db에 맞는 이름이 있는지 확인
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/overlap-username",
        data: {
                username : username
        },
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            console.log(response)
            if (response == "회원 유저네임 중복입니다.") {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-id").focus()
            }
            else{
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
                $("#help-id").removeClass("is-loading")
            }
        }
    });
}


    // <------------------------------------- 닉네임 확인 ------------------------------------->
    // 닉네임 입력 확인
function nickname_check_dup() {
    let nickname = $("#input-nickname").val()
    console.log(nickname)
    if (nickname == "") {
        $("#help-nickname").text("닉네임을 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    // 닉네임 조건 확인
    if (!is_nickname(nickname)) {
        $("#help-nickname").text("2글자 이상 필요합니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    // 닉네임 조건 충족 시 서버에 중복 확인
    $("#help-nickname").addClass("is-loading")
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/overlap-nickname",
        data:{
                nickname : nickname
            },
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            console.log(response)
            if (response == "회원 닉네임 중복입니다.") {
                $("#help-nickname").text("이미 존재하는 닉네임입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-nickname").focus()
            }
            else{
                $("#help-nickname").text("사용할 수 있는 닉네임입니다.").removeClass("is-danger").addClass("is-success")
                $("#help-nickname").removeClass("is-loading")
            }
        }
    });
}


// <------------------------------------- 이메일 확인 ------------------------------------->
// 이메일 입력 확인
function email_check_dup() {
    let email = $("#input-email").val()
    console.log(email)
    if (email == "") {
        $("#help-email").text("이메일을 입력하세요.").removeClass("is-safe").addClass("is-danger")
        // 아이디 입력하는 부분으로 커서가 focus 됨
        $("#input-email").focus()
        return;
    } 
    // 이메일 조건 확인
    else if (!is_email(email)) {
        $("#help-email").text("이메일을 확인해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-email").focus()
        return;
    }
    // 이메일 조건 충족 시 서버에 중복 확인
    $("#help-email").addClass("is-loading")
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/overlap-email",
        data:{
                email : email
            },
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            console.log(response)
            if (response == "회원 이메일 중복입니다.") {
                $("#help-email").text("이미 존재하는 이메일입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-email").focus()
            }
            else{
                $("#help-email").text("사용할 수 있는 이메일입니다.").removeClass("is-danger").addClass("is-success")
                $("#help-email").removeClass("is-loading")
            }
        }
    });
}