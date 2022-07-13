// 쿠키에서 값 받아오는 함수
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }

// 페이지 올 시 GET 함수 실핼
$(window.document).ready(function() {
    cards();
    keep_out()
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


function cards() {
    $('#cards').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/plan/posts",
        data: {},
        contentType: "application/json",
        success: function (cards) {
            let card = cards
            for (let i = 0; i < card.length; i++) {
                const post_id = card[i]['id']
                const nickname = card[i]['nickname']
                const title = card[i]['title']
                const image = card[i]['image']
                const create_at = new Date(card[i]['createdAt'])
                const time_brfore = time2str(create_at)
                const temp_html = `<div class="card" id="${post_id}" onclick="window.location.href='/detail.html?id=${post_id}'" >
                                    <a class="card_img_box" onclick="window.location.href='/detail.html?id=${post_id}'">
                                        <img class="card_img" src="${image}"/>
                                    </a>
                                    <div>
                                        <a onclick="window.location.href='/detail.html?id=${post_id}'">
                                            <p class="card_title">${title}</p>
                                        </a>
                                    </div>
                                    <div >
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