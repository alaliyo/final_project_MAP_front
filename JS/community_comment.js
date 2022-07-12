function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }

// 게시물 댓글 POST
function comment_make(postId) {
    const token = get_cookie("X-AUTH-TOKEN");
    let comment = $('#comment_text_box').val();
    console.log(comment);
    console.log(postId);

    $.ajax({
        type: "POST",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/${postId}/comment`,
        data: JSON.stringify({
            comment: comment,
        }),
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (comment) {
            console.log(comment)
            window.location.reload(true);
            console.log("작성완료")
        }
    })
}

// 페이지 접속 시 초기화
$(document).ready(function() {
    commentGet();
})

//게시물 댓글 GET
function commentGet() {
    const token = get_cookie("X-AUTH-TOKEN");

    $.ajax({
        type: "GET",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/post/${postId}/comment`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (comments) {
            console.log(comments)
            const comment = comments
            for (let i = 0; i < comment.length; i++) {
                const comment_id = comment[i]['commentId']
                const nickname = comment[i]['nickname']
                const comment = comment[i]['comment']
                const create_at = comment[i]['createdAt']
                const temp_html = `<div id="${comment_id}">
                                    <p style="margin-top: 10px; margin-bottom: 5px; float: left;">${comment}</p>
                                    <br>
                                    <button class="comment" id="comment_delete" onclick="comment_delete(${comment_id})">댓글 삭제</button>
                                    <p class="comment">${create_at}</p>
                                    <p class="comment">${nickname}</p>
                                </div>`
                    $('#comments').append(temp_html)
            }
        }
    })
}



// 게시물 댓글 시간
// function time3str(date) {
//     let today = new Date()
//     let time = (today - date) / 1000 / 60  // 분
//     if (time < 60) {
//         return parseInt(time) + "분 전"
//     }
//     time = time / 60  // 시간
//     if (time < 24) {
//         return parseInt(time) + "시간 전"
//     }
//     time = time / 24
//     if (time < 14) {
//         return parseInt(time) + "일 전"
//     }
//     return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
// }

// 게시물 DELETE
function comment_delete(commentId) {
    const token = get_cookie("X-AUTH-TOKEN");
    const comment_id = commentId;
    console.log(comment_id)
    if (confirm('삭제하겠습니까?')) {
        $.ajax({
            type: "DELETE",
            url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/post/comment/${comment_id}`,
            data: {
                commentId : comment_id
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function (result) {
                console.log(result);
                window.location.reload(true);
            }
        })
        alert("삭제되었습니다.")
    } else {
        window.location.reload(true);
    }
}

