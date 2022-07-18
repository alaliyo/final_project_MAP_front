

// 로그아웃 기능
function logout(){
    $.removeCookie('X-AUTH-TOKEN');
    window.location.replace("/home.html");
    alert('로그아웃!');
}