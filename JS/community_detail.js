function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }

$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    community_detail(params['id']);
});

$(document).ready(function() {
    commentGet();
})


// 게시물 보기
function community_detail(postId) {
    const token = get_cookie("X-AUTH-TOKEN");
    console.log(postId);
    $.ajax({
        type: "GET",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/post/${postId}`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (post) {
            console.log(post)
            let post_id = post['postId']
            let title = post['title']
            let content = post['content']
            let nickname = post['nickname']
            let create_at = new Date(post['createdAt'])
            let time_brfore = time2str(create_at)
            let temp_html = `<div>
                                <div>
                                    <div style="margin-bottom: 5px; font-size: 20px;">
                                        <p style="float: right; font-size: 12px; margin-top: 8px; margin-left: 5px"> ${time_brfore}</p>
                                        <p style="font-size: 15px; float: right; margin-top: 5px;">작성자: ${nickname}</p>
                                        <p>제목: ${title}</p>
                                    </div>
                                    <hr class="hr_top">
                                    <div style="margin-top: 10px; margin-bottom: 10px;">
                                        <text style="font-size: 18px;"> ${content}</text>
                                    </div>
                                </div>
                                <hr class="hr_top">
                                <button style="float: right; margin-top: 5px;" onclick="community_put_get(window.location.href='/community_revise.html?id=${post_id}')">수정</button>
                            </div>`
            $('#community_content').append(temp_html)
        }
    })
}


//게시물 댓글 GET
function commentGet() {
    const token = get_cookie("X-AUTH-TOKEN");
    const para = document.location.href.split("=");
    console.log(para);
    const postId = para[1]
    console.log(postId);

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
            for (let i = 0; i < comments.length; i++) {
                let comment_id = comments[i]['commentId']
                let nickname = comments[i]['nickname']
                let comment = comments[i]['comment']
                let create_at = new Date(comments[i]['createdAt'])
                let time_brfore = time2str(create_at)
                let temp_html = `<div>
                                    <p style="margin-top: 10px; margin-bottom: 5px; float: left;">${comment}</p>
                                    <br>
                                    <button class="comment" id="comment_delete" onclick="comment_delete(${comment_id})">댓글 삭제</button>
                                    <p class="comment">${time_brfore}</p>
                                    <p class="comment">${nickname}</p>
                                </div>`
                    $('#comments').append(temp_html)
            }
        }
    })
}


// 게시물 댓글 POST
function comment_make() {
    const token = get_cookie("X-AUTH-TOKEN");
    let comment = $('#comment_text_box').val();
    const para = document.location.href.split("=");
    console.log(para);
    const postId = para[1]
    console.log(postId)

    $.ajax({
        type: "POST",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/post/${postId}/comment`,
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
            window.location.reload();
        }
    })
}


// 게시물 댓글 POST
function comment_delete(comment_id) {
    const token = get_cookie("X-AUTH-TOKEN");
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


// 게시물 시간
function time2str(date) {
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