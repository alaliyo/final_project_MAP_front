// 쿠키에서 값 받아오는 함수
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }

// 페이지 올 시 GET 함수 실핼
$(window.document).ready(function() {
    cards();
})

// function time2str(date) {
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
                const create_at = card[i]['createdAt']
                
                const temp_html = `<div class="card" id="${post_id}" >
                                    <a class="card_img_box" href="detail.html">
                                        <img class="card_img" src="${image}"/>
                                    </a>
                                    <div>
                                        <a href="detail.html">
                                            <p class="card_title">${title}</p>
                                        </a>
                                    </div>
                                    <div >
                                        <p class="card_writer">${nickname}</p>
                                        <br>
                                        <p class="card_time">${create_at}</p>
                                    </div>
                                </div>`
                                $('#cards').append(temp_html)
                
            }
        }
    })
}

