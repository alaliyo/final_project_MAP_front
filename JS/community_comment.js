function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 전역변수 community_user_nickname()가지고 있음
let user_nickname = [];

//페이지 입장 시 실행
$(document).ready(function() {
    community_user_nickname();
})


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
                let temp_html = ``
                console.log (user_nickname)
                if (user_nickname == comments[i]['nickname']) {
                    temp_html = `<div>
                                    <p style="margin-top: 10px; margin-bottom: 5px; float: left;">${comment}</p>
                                    <br>
                                    <button class="comment" id="comment_delete" onclick="comment_delete(${comment_id})">삭제</button>
                                    <p class="comment">${time_brfore}</p>
                                    <p class="comment">${nickname}</p>
                                </div>
                                <br>
                                <hr style="margin-top: 5px;">`
                } else {
                    temp_html = `<div>
                                    <p style="margin-top: 10px; margin-bottom: 5px; float: left;">${comment}</p>
                                    <br>
                                    <p class="comment">${time_brfore}</p>
                                    <p class="comment">${nickname}</p>
                                </div>
                                <br>
                                <hr style="margin-top: 5px;">`
                }

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


// 삭제 버튼을 위한 닉네임 조회
function community_user_nickname() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/my-posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (community) {
            console.log(community)
            for (let i = 0; i < community.length; i++) {
                let nickname = community[i]['nickname']
                console.log(nickname)
                user_nickname.push(nickname)
            }
        }
    })
}