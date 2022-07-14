$(window.document).ready(function() {
    cookie_null_out()
})

function cookie_null_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token == 1) {
        $.removeCookie('X-AUTH-TOKEN');
        window.location.replace("/home.html");
        alert('로그아웃 되었습니다.');
    }
}