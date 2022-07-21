function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 새롭게 페이지 생성
$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    community_detail(params['id']);
});


//페이지 접속 시 실행
$(document).ready(function() {
    keep_out();
    community_user_nickname();
    comment_user_nickname();
})


// community_user_nickname()를 넣은 전역 변수
let communitys_user_nickname = [];


//토큰 만료 시 로그인 페이지로
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
    window.location.replace("/home.html");
    alert('토큰이 만료되었습니다. 다시 로그인 하세요');
}


// 게시물 보기
function community_detail(postId) {
    const token = get_cookie("X-AUTH-TOKEN");
    console.log(postId);
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/post/${postId}`,
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
            let createdAt = post['createdAt'] + '+0000'
            let create_at = new Date(createdAt)
            let time_brfore = time2str(create_at)
            let temp_html = ``
            console.log('test' + communitys_user_nickname);
            if (communitys_user_nickname == nickname) {
                temp_html = `<div>
                                <div>
                                    <div style="margin-bottom: 5px; font-size: 20px;">
                                        <p style="float: right; font-size: 12px; margin-top: 8px; margin-left: 5px"> ${time_brfore}</p>
                                        <p style="font-size: 15px; float: right; margin-top: 5px;">작성자: ${nickname}</p>
                                        <p>제목: ${title}</p>
                                    </div>
                                    <hr class="hr_top">
                                    <div class="community_content" style="margin-top: 10px; margin-bottom: 10px; height:100px; overflow-y: scroll;">
                                        <p>내용: </p>
                                        <text style="font-size: 18px;"> ${content}</text>
                                    </div>
                                </div>
                                <hr class="hr_top">
                                <button class="button is-light" style="float: right; margin-top: 5px; width:50px; height:30px" onclick="community_put_get(window.location.href='/community_revise.html?id=${post_id}')">수정</button>
                            </div>`
            } else {
                temp_html = `<div>
                                <div>
                                    <div style="margin-bottom: 5px; font-size: 20px;">
                                        <p style="float: right; font-size: 12px; margin-top: 8px; margin-left: 5px"> ${time_brfore}</p>
                                        <p style="font-size: 15px; float: right; margin-top: 5px;">작성자: ${nickname}</p>
                                        <p>제목: ${title}</p>
                                    </div>
                                    <hr class="hr_top">
                                    <div class="community_content" style="margin-top: 10px; margin-bottom: 10px; height:100px; overflow-y: scroll;">
                                        <p>내용: </p>
                                        <text style="font-size: 18px;"> ${content}</text>
                                    </div>
                                </div>
                                <hr class="hr_top">
                            </div>`
            }
            $('#community_content').append(temp_html)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            relogin()
        }
    })
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


// 수정 버튼을 위한 닉네임 조회
function community_user_nickname() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/my-posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (community) {
            console.log(community)
            let nickname = community[0]['nickname']
            console.log(nickname)
            communitys_user_nickname.push(nickname)
        }
    })
}