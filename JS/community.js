function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 실행하기
$(window.document).ready(function() {
    communityPostsGet();
    keep_out()
})

// 토큰 있을 시 이동 가능
function keep_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token) {}
    else {
        alert("로그인 후 이용해주세요")
        location.href = '/login.html';
    }
}
// 에러 발생 시 홈으로
function relogin(){
    window.location.replace("/login.html");
    alert('토큰이 만료되었습니다. 다시 로그인 하세요');
}


//게시물 GET
function communityPostsGet() {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (posts) {
            console.log(posts)
            let post = posts
            for (let i = 0; i < post.length; i++) {
                let post_id = post[i]['postId']
                let title = post[i]['title']
                let nickname = post[i]['nickname']
                let create_at = new Date(post[i]['createdAt'])
                let time_brfore = time2str(create_at)
                let temp_html = `<div id="communtity_post ">
                                    <div class="communtity_post_box">
                                        <a class="posting_box"  onclick="window.location.href='/community_detail.html?id=${post_id}'">
                                            <p style="font-size: 20px; float: left;">${title}</p>
                                            <div style="float:">
                                                <div class="time_box">
                                                    <p class="posting_time">${time_brfore}</p>
                                                </div>
                                                <div class="nickname_box" style="text-align: center;">
                                                    <p>${nickname}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <hr style="width=100%">`
                $('#communtity_posts').append(temp_html)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            relogin()
        }
    })
}


// 게시물 DELETE
function community_post_delete(postId){
    const token = get_cookie("X-AUTH-TOKEN");
    const post_id= postId
    console.log(post_id)
    if(confirm('삭제하겠습니까?')){
        $.ajax({
            type: "DELETE",
            url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/post/${post_id}`,
            data: {
                postId : post_id,
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function (result) {
                window.location.reload('/community.html');
                console.log(result);
            }
        })
        alert("삭제되었습니다.")
    } else {
        window.location.reload('/community.html');
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


/*
// 삭제 버튼을 위한 커뮤티니 postId 조회
function community_posts() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (community_id) {
            console.log(community_id)
            for (let i = 0; i < community_id.length; i++) {
                let post_id = community_id[i]['postId']
                console.log(post_id)
            }
        }
    })
}


// 삭제 버튼을 위한 회원 커뮤니티 postId조회
function my_community_my_postid() {
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
        success: function (my_community_id) {
            console.log(my_community_id)
            for (let i = 0; i < my_community_id.length; i++) {
                let post_id = my_community_id[i]['postId']
                console.log(post_id)
            }
        }
    })
}
*/