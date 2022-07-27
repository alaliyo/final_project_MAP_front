function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}


// 홈페이 접속 시 호출
$(window.document).ready(function() {
    profil_get();
    profil_revise();
})


//프로필 보여줌
function profil_revise_off() {
    $('#my_profil_revise').hide();
    $('#my_profil').show();
}


// 유저정보 들고오기
function profil_revise() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (user) {
            let nickname = user['nickname'];
            let email = user['email'];
            $('.nickname_textbox').val(`${nickname}`);
            $('.email_textbox').val(`${email}`);  
            }
        }
    )
}


// 프로필 닉네임, 이메일 GET
let profil_nickname_get = [];
let profil_image_get = [];
let profil_email_get = [];

function profil_get() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (user) {
            let nickname = user['nickname'];
            let image = user['image'];
            let email = user['email'];
            profil_nickname_get.push(nickname)
            profil_image_get.push(image)
            profil_email_get.push(email)
        }
    })
}


// 프로필 수정 
function update_profile() {
    let token = get_cookie("X-AUTH-TOKEN");
    let nickname = $('.nickname_textbox').val();
    let email = $('.email_textbox').val();
//    let image = $('#image_textbox').val();
//    let password = $('#password_textbox').val();
    let file = $('#file')[0];
    if ($("#help-nickname").hasClass("is-danger")) {
        alert("닉네임을 다시 확인해주세요.")
        return;
    } else if (!$("#help-nickname").hasClass("is-success")) {
        alert("닉네임 중복확인을 해주세요.")
        return;
    }

    if ($("#help-email").hasClass("is-danger")) {
        alert("이메일을 다시 확인해주세요.")
        return;
    } else if (!$("#help-email").hasClass("is-success")) {
        alert("이메일 중복확인을 해주세요.")
        return;
    }

    let formData = new FormData();
    formData.append("file", file.files[0]);
    // 프로필 사진 변경 업을 시 요청 X
    if(file.files.length != 0){
        $.ajax({
            type: "POST",
            url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/profile",
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function (response) {
                window.location.reload();
            }
        })
    }else{
    }

    $.ajax({
        type: "PUT",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/modify`,
        data: JSON.stringify({
            nickname: nickname,
            email: email
        }),
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            alert(response)
            window.location.reload('/');
        }
    })
}


//<------------------------------- 정보 수정 규칙 --------------------------------->
//닉네임 규칙
function is_nickname(asValue) {
    const regExp = /^(?=.*[a-zA-Z0-9ㄱ-ㅎ가-힣])[0-9a-zA-Zㄱ-ㅎ가-힣]{2,30}$/;
    return regExp.test(asValue);
}
//이메일 규칙
function is_email(asValue) {
    const regExp = /^(?=.*[a-zA-Z0-9]*@[a-zA-Z0-9]*.[a-zA-Z0-9])[0-9a-zA-Z@.]{10,30}$/;
    return regExp.test(asValue);
}


// <------------------------------------- 닉네임 확인 ------------------------------------->
// 닉네임 입력 확인
function nickname_check_dup() {
    let nickname = $("#input-nickname").val()
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
    // 기존 닉네임이랑 동일하지 확인
    if (nickname == profil_nickname_get) {
        $("#help-nickname").text("기존 닉네임이라 사용가능합니다.").removeClass("is-danger").addClass("is-success")
        $("#help-nickname").removeClass("is-loading")
        return;
    }
    // 닉네임 조건 충족 시 서버에 중복 확인
    $("#help-nickname").addClass("is-loading")
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/overlap-nickname",
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
    if (email == profil_email_get) {
        $("#help-email").text("기존 이메일이라 사용가능합니다.").removeClass("is-danger").addClass("is-success")
        $("#help-email").removeClass("is-loading")
        return;
    }
    // 이메일 조건 충족 시 서버에 중복 확인
    $("#help-email").addClass("is-loading")
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/overlap-email",
        data:{
                email : email
            },
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
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
