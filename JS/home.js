
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }
// 페이지 올 시 GET 함수 실핼
$(window.document).ready(function() {
    keep_out();
    likes_inquiry();
})
// 로그인 , 로그아웃 온 오프
function keep_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token) {
        $('#login').hide()
        $('#logout').show()
    } else {
        $('#logout').hide()
        $('#login').show()
    }
}
//좋아요 반응형
// function likes_psotid(post_id) {
//     console.log(post_id)
//     $(`#likes${post_id}`).attr('src', '/static/like-icon-on.png');
// }
// 내가 좋아요 한 post_id 값 조회
let like_btn = [];
function likes_inquiry() {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/posts/my-like",
        data: {},
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (likes) {
            console.log(likes);
            for (let i = 0; i < likes.length; i++) {
                let post_id = likes[i]['postId']
                console.log(post_id)
                like_btn.push(post_id)
            }
            cards();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            cards_none_login()
        }
    })
}
//게시물 좋아요 기능 추가
function likes_btn(post_id) {
    let token = get_cookie("X-AUTH-TOKEN");
    console.log(post_id)
    $.ajax({
        type: "POST",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/${post_id}/like`,
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)
            window.location.reload('/');
        }
    })
}
function view(post_id) {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "PUT",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/${post_id}/view`,
        data: {},
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)
        }
    })
}
function cards() {
    $('#cards').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/plan/posts",
        data: {},
        contentType: "application/json",
        success: function (cards) {
            console.log(cards)
            let card = cards
            for (let i = 0; i < card.length; i++) {
                const post_id = card[i]['id']
                const nickname = card[i]['nickname']
                const title = card[i]['title']
                const image = card[i]['image']
                const likes = card[i]['likes']
                const views = card[i]['views']
                const create_at = new Date(card[i]['createdAt'])
                const time_brfore = time2str(create_at)
                let temp_html = ``
                console.log("like_btn"+like_btn)
                if (like_btn.indexOf(post_id) >= 0) {
                    console.log("하트 참")
                    temp_html = `<div class="card" id="${post_id}">
                                            <a class="card_img_box" onclick="window.location.href='/detail.html?id=${post_id}';  view(${post_id});">
                                                <img class="card_img" src="${image}"/>
                                            </a>
                                            <div>
                                                <a onclick="window.location.href='/detail.html?id=${post_id}'; view(${post_id});">
                                                    <p class="card_title">${title}</p>
                                                </a>
                                            </div>
                                            <div>
                                                <num style="float: right; margin-left: 3px;">${likes}</num>
                                                <a>
                                                    <img onclick=" likes_btn(${post_id})" class="likes likes_on" id="likes${post_id}" src="/static/like-icon-on.png">
                                                </a>
                                                <P> 조회수: ${views}</P>
                                                <br>
                                                <p class="card_writer">${nickname}</p>
                                                <br>
                                                <p class="card_time">${time_brfore}</p>
                                            </div>
                                        </div>`
                } else {
                    console.log("하트 안 참")
                    temp_html = `<div class="card" id="${post_id}">
                                            <a class="card_img_box" onclick="window.location.href='/detail.html?id=${post_id}';  view(${post_id});">
                                                <img class="card_img" src="${image}"/>
                                            </a>
                                            <div>
                                                <a onclick="window.location.href='/detail.html?id=${post_id}'; view(${post_id});">
                                                    <p class="card_title">${title}</p>
                                                </a>
                                            </div>
                                            <div>
                                                <num style="float: right; margin-left: 3px;">${likes}</num>
                                                <a>
                                                    <img onclick=" likes_btn(${post_id})" class="likes likes_off" id="likes${post_id}" src="/static/like-icon-off.png">
                                                </a>
                                                <P> 조회수: ${views}</P>
                                                <br>
                                                <p class="card_writer">${nickname}</p>
                                                <br>
                                                <p class="card_time">${time_brfore}</p>
                                            </div>
                                        </div>`
                }
                $('#cards').append(temp_html)
            }
        }
    })
}
function cards_none_login() {
    $('#cards').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/plan/posts",
        data: {},
        contentType: "application/json",
        success: function (cards) {
            console.log(cards)
            let card = cards
            for (let i = 0; i < card.length; i++) {
                const post_id = card[i]['id']
                const nickname = card[i]['nickname']
                const title = card[i]['title']
                const image = card[i]['image']
                const likes = card[i]['likes']
                const views = card[i]['views']
                const create_at = new Date(card[i]['createdAt'])
                const time_brfore = time2str(create_at)
                let temp_html = `<div class="card" id="${post_id}">
                                    <a class="card_img_box" onclick="window.location.href='/detail.html?id=${post_id}'">
                                        <img class="card_img" src="${image}"/>
                                    </a>
                                    <div>
                                        <a onclick="window.location.href='/detail.html?id=${post_id}'">
                                            <p class="card_title">${title}</p>
                                        </a>
                                    </div>
                                    <div>
                                        <num style="float: right; margin-left: 3px;">${likes}</num>
                                        <a>
                                        <img class="likes likes_off" src="/static/like-icon-off.png">
                                        </a>
                                        <P> 조회수: ${views}</P>
                                        <br>
                                        <p class="card_writer">${nickname}</p>
                                        <br>
                                        <p class="card_time">${time_brfore}</p>
                                    </div>
                                </div>`
                                $('#cards').append(temp_html)
                }
            }
        })
    }
function time2str(createdAt) {
    let today = new Date()
    let time = (today - createdAt) / 1000 / 60  // 분
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