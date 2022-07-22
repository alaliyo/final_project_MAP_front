function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 실행
$(document).ready(function() {
    detail_community_users_nickname();
})


// 전역 변수 detail_community_users_nickname() 넣기
let detail_community_user_nickname = [];

// 삭제 버튼을 위한 닉네임 조회
function detail_community_users_nickname() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (user) {
            console.log(user)
            let nickname = user['nickname']
            console.log(nickname)
            detail_community_user_nickname.push(nickname)
            detail_comment_get();
        
        }
    })
}

// 게시물 댓글 POST
function detail_comment_make() {
    const token = get_cookie("X-AUTH-TOKEN");
    const para = document.location.href.split("=");
    const postId = para[1];
    let comment = $('#content_text_box').val();
    console.log(postId);
    console.log(comment);
    if (comment.length == 0) {
        alert('뎃글을 입력해주세요.')
    } else if (comment.length > 40) {
        alert('뎃글은 40자까지 입력가능합니다.')
    } else {
        $.ajax({
            type: "POST",
            url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/post/${postId}/comment`,
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
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
                alert("로그인 후 사용 가능합니다.")
            }
        })
    }
}


//게시물 댓글 GET
function detail_comment_get() {
    const token = get_cookie("X-AUTH-TOKEN");
    const para = document.location.href.split("=");
    const postId = para[1];
    console.log(postId);
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/plan/post/${postId}/comment`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (comments) {
            console.log(comments)
            for (let i = 0; i < comments.length; i++) {
                let comment_id = comments[i]['id']
                let nickname = comments[i]['member']
                let comment = comments[i]['comment']
                let createdAt = comments[i]['createdAt'] + '+0000'
                let create_at = new Date(createdAt)
                let time_brfore = time2str(create_at)
                let temp_html = ``
                console.log('에휴'+ detail_community_user_nickname)
                if (detail_community_user_nickname == nickname ) {
                    console.log("일치")
                    temp_html = `<div>
                                    <div style="overflow:hidden; height: auto;">
                                        <p style="float: left;">${comment}</p>
                                        <br>
                                        <a class="comment" style="margin-right: 10px; color: red;" id="comment_delete" onclick="detail_comment_delete(${comment_id})">×</a>
                                        <p class="comment" style="margin-right: 10px">${time_brfore}</p>
                                        <p class="comment" style="margin-right: 10px">${nickname}</p>
                                    </div>
                                    <hr style="margin: 0;">
                                </div>`
                } else {
                    console.log('불일치')
                    temp_html = `<div>
                                    <div style="overflow:hidden; height: auto;">
                                        <p style="margin-top: 10px; margin-bottom: 5px; float: left;">${comment}</p>
                                        <br>
                                        <p class="comment">${time_brfore}</p>
                                        <p class="comment">${nickname}</p>
                                    </div>
                                    <hr style="margin: 0;">
                                </div>`
                }
                    $('#comments').append(temp_html)
            }
        }
    })
}


// 게시물 DELETE
function detail_comment_delete(id) {
    const token = get_cookie("X-AUTH-TOKEN");
    console.log(id)
    if (confirm('삭제하겠습니까?')) {
        $.ajax({
            type: "DELETE",
            url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/post/comment/${id}`,
            data: {
                commentId : id
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


// 게시물 시간 변경
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
