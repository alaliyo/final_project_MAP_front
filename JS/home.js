let my_cards = []
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 올 시 GET 함수 실핼
$(window.document).ready(function() {
    keep_out();
    likes_inquiry();
    //search_cards();

    // 정렬 변경시 작동
    $('#select_sort').on('change', function () {
        likes_inquiry();
        cards();
    });

    // 카테고리 변경시 작동
    $('#select_category').on('change', function () {
        likes_inquiry();
        cards();
    });
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


// 내가 좋아요 한 post_id 값 조회
let like_btn = [];
function likes_inquiry() {
    like_btn = [];
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
            likes_inquiry();
            cards();
            
        }
    })
    
    
}


// 이미지 클릭 시 조회수 증가 기능
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


// 메인 페이지의 게시물 GET 기능
function cards() {
    $('#cards').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/plan/posts",
        data: {},
        contentType: "application/json",
        success: function (cards) {
            console.log(cards)
            my_cards = cards
            add_cards(my_cards);
        }
            
    })
}





// 화면에 카드 붙이기
function add_cards(cards){
    $('#cards').empty()
    let sorted = $('#select_sort').val()
    let my_category = $('#select_category').val()
    console.log(sorted)
    console.log(my_category)
    if(cards.length !=0){
        cards = sortJSON(cards,sorted.split(',')[0],sorted.split(',')[1])
    }
    
    
    for (let i = 0; i < cards.length; i++) {
        const post_id = cards[i]['id']
        const nickname = cards[i]['nickname']
        const title = cards[i]['title']
        const image = cards[i]['image']
        const likes = cards[i]['likes']
        const views = cards[i]['views']
        const category = cards[i]['category']
        console.log(category)
        const create_at = new Date(cards[i]['modifiedAt'])
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
                                            <img onclick=" likes_btn(${post_id})" class="likes likes_on" id="likes-${post_id}" src="/static/like-icon-on.png">
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
                                            <img onclick=" likes_btn(${post_id})" class="likes likes_off" id="likes-${post_id}" src="/static/like-icon-off.png">
                                        </a>
                                        <P> 조회수: ${views}</P>
                                        <br>
                                        <p class="card_writer">${nickname}</p>
                                        <br>
                                        <p class="card_time">${time_brfore}</p>
                                    </div>
                                </div>`
        }
        if(my_category=="ALL" || category == my_category){
            $('#cards').append(temp_html)
        }
    }
}



// 미 로그인 시 띄우는 게시물 함수
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
                const create_at = new Date(cards[i]['modifiedAt'])
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

    function search_btn(){
        local = $('#input-local').val();
        console.log(local)
        let token = get_cookie("X-AUTH-TOKEN");
        if(local == ""){
            cards();
            return 0
        }else{
            $.ajax({
                type: "GET",
                url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/schedule?local=${local}`,
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Content-type","application/json");
                    xhr.setRequestHeader("X-AUTH-TOKEN", token);
                },
                success: function (response) {
                    console.log(response)
                    my_cards = response
                    add_cards(my_cards)
                }
            })
        }
        
        
    }


// 시간 변경 함수
function time2str(createdAt) {
    let today = new Date() 
    let time = (today - createdAt) / 1000 / 60  // 분
    console.log(time)
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

// JSON 정렬 함수
var sortJSON = function(data, key, type) {
    if (type == undefined) {
      type = "asc";
    }
    return data.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      if (type == "desc") {
        return x > y ? -1 : x < y ? 1 : 0;
      } else if (type == "asc") {
        return x < y ? -1 : x > y ? 1 : 0;
      }
    });
  };