function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }

$(document).ready(function() {
    keep_out()
})

function keep_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token) {}
    else {
        alert("로그인 후 이용해주세요")
        location.href = '/login.html';
    }
}

function communityMakePost() {
    let token = get_cookie("X-AUTH-TOKEN");
    let title = $('#title_box').val();
    let content = $('#content_box').val();
    console.log(title, content)
    $.ajax({
        type: "POST",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/post",
        data: JSON.stringify({
            title: title,
            content: content,
        }),
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)
            window.location.replace("/community.html");
            alert("저장되었습니다.");
        }
    })
}


