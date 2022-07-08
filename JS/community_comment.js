// 페이지 접속 시 초기화
$(document).ready(function() {
    commentGet()
})

// 게시물 댓글 POST
function commentMakePosts() {
    let content = $('comment_box').val()

    $.ajax({
        type: "POST",
        url: "/user/community/post/comment",
        data: {content: content},
        success: function (response) {
            alert(response['msg']);
            window.location.reload();
        }
    })
}

// 게시물 댓글 시간
function time3str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 14) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

//게시물 댓글 GET
function commentGet() {
    $('#comments').empty()
    $.ajax({
        type: "GET",
        url: " /user/community/post/{postId}/comments",
        data: {},
        success: function (comments) {
            let comment = comments['result']
            console.log(comment['result'])
            for (let i = 0; i < comment.length; i++) {
                const comment_id = post[i]['commentId']
                const nickname = post[i]['nickname']
                const comment = posr[i]['comment']
                const create_at = card[i]['createdAt']
                const time_befor = time3str(create_at)
                const temp_html = `<div id="${comment_id}">
                                        <p style="margin-top: 10px; margin-bottom: 5px; float: left;" >${comment}</p>
                                        <button class="comment" id="comment_delete">댓글 삭제</button>
                                        <p class="comment">${time_befor}</p>
                                        <p class="comment">${nickname}</p>
                                    </div>`
                                $('#comments').append(temp_html)
            }
        }
    })
}

// 게시물 DELETE
$(document).ready( function() {
    $('#comment_delete').click(function() {
        $.ajax({
        type: "DELETE",
        url: "/user/community/post/comment/{commentId}",
        data: {},
        success: function (result) {
            console.log(result);
        }
    })
    })
})

