function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 시작
$(document).ready(function() {
    community_put_get();
})


// 게시물 수정 GET
function community_put_get() {
    const token = get_cookie("X-AUTH-TOKEN");
    const para = document.location.href.split("=");
    const postId = para[1]
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/post/${postId}`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (my_post) {
            const title = my_post['title'];
            const content = my_post['content'];
            $('#title_box').val(`${title}`);
            $('#content_box').val(`${content}`);      
            }
        }
    )
}


// 게시물 수정 POST
function community_put_post() {
    let token = get_cookie("X-AUTH-TOKEN");
    const para = document.location.href.split("=");
    const postId = para[1]
    let title = $('#title_box').val();
    let content = $('#content_box').val();
    $.ajax({
        type: "PUT",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/post/${postId}`,
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
            alert(response);
            window.location.replace("/community.html");
        }
    })
    }