function logout(){
    $.removeCookie('X-AUTH-TOKEN');
    alert('로그아웃!')
    window.location.reload("/home.html")
}