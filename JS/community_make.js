function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 시작
$(document).ready(function() {
    keep_out()
})


// 로그아웃 기능
function keep_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token) {}
    else {
        alert("로그인 후 이용해주세요")
        location.href = '/login.html';
    }
}


// 게시물 만들기 api
function communityMakePost() {
    let token = get_cookie("X-AUTH-TOKEN");
    let title = $('#title_box').val();
    let content = $('#content_box').val();
    if (title.length == 0) {
        alert('제목을 입력 해주세요.');
    } else if (title.length > 25) {
        alert('제목은 30자까지 입력 가능합니다.');
    } else if (content.length == 0) {
        alert('내용을 입력 해주세요.');
    } else if (content.length > 300){
        alert('내용은 300자까지 입력 가능합니다.');
    } else {
        $.ajax({
            type: "POST",
            url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/post",
            data: JSON.stringify({
                title: title,
                content: content,
            }),
            contentType: "application/json;",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function () {
                window.location.replace("/community.html");
                alert("저장되었습니다.");
            }
        })
    }
    }
    