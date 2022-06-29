function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function sign_in() {
    // 로그인 1
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    if (username == "") {
        $("#help-id-login").text("")
        $("#input-username").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (password == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username: username,
            password: password
        },
        // 토큰에는 검증 받은 사람 아이디 시간 저장 이 토큰을 받아서 브라우저에 쿠키로 저장 브라우저의 데이터 베이스 느낌 {}형으로 저장
        success: function (response) {
            if (response['result'] == 'success') {
                // 브라우저에 쿠키로 저장
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}

function sign_up() {
    // 회원 가입시 필요한 아이디 비번, 비번확인용 회원 가입(3)
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let password2 = $("#input-password2").val()
    console.log(username, password, password2)

    // 중복 검사 했는지 안 했는지 is-success가 있으면 아이디 중복 확인한거다
    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (password == "") {
        $("#help-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return;
    } else if (!is_password(password)) {
        $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return
    } else {
        $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (password2 == "") {
        $("#help-password2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else if (password2 != password) {
        $("#help-password2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else {
        $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/sign_up/save",
        // 저장된 유저 네임 페스워드를 서버로 회원가입한다고 요청
        data: {
            username: username,
            password: password
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login")
        }
    });

}

function toggle_sign_up() {
    $("#sign-up-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-password").toggleClass("is-hidden")
    $("#help-password2").toggleClass("is-hidden")
}
// a~z,A~Z사이,0~9사이 _.포함하는 2~10자리 아이디
function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}
//정수 포함a~z,A~Z사이,0~9사이 @#$%! 등포함
function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

// 아이디 중복 확인 회원 가입(1)
function check_dup() {
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
    if (!is_nickname(username)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    // 아이디 입력후 형식메 맞는다면 서버에서 db에 맞는 이름이 있는지 확인
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_dup",
        data: {
            username : username
        },
        success: function (response) {

            // 위에까지 실행후 서버단에서 check_dup(2)함수에서 값을 받아옴
            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-username").focus()
            }
            // 중복 확인해서 아이디가 유효한 값인지 확인하기 위해서 is-success클래스를 추가해준다, 회원 가입 버튼 눌렀을시에 hepl-text에 is-success가 있어야 함
            else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}