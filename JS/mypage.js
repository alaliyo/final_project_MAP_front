function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 생성 및 시작
$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    profil(params['id']);
    my_plan()
    my_plans()
    my_community()
});


// 게시물 및 커뮤니티 조회 버튼
function my_plan() {
    $('#my_communtity_box').hide()
    $('#mycards').show()
}
function my_community_box() {
    $('#mycards').hide()
    $('#my_communtity_box').show()
}


// 프로필 GET 
function profil() {
    const token = get_cookie("X-AUTH-TOKEN");

    $.ajax({
        type: "GET",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (user) {
            console.log(user)
            const user_id = user['id']
            let nickname = user['nickname']
            let image = user['image']
            let temp_html = `<div class="profil_box" id="profil_box">
                                <div class="profil_ring">
                                    <img class="profil" src="${image}" alt="Placeholder image" />
                                </div>
                                <p class="nickname" id="idname">${nickname}</p>
                                <button class="profil_revise_btn" onclick="profil_revise_show(); profil_revise(${user_id});">개인정보수정</button>
                            </div>`
            $('#my_profil').append(temp_html)
        }
    })
}


// 내가 작성한 개시물 GET
function my_plans() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: 'http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/my-posts',
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (postId) {
            console.log(postId)
            for (let i = 0; i < postId.length; i++) {
                let post_id = postId[i]['id']
                let title = postId[i]['title']
                let image = postId[i]['image']
                let create_at = new Date(postId[i]['createdAt'])
                let time_brfore = time2str(create_at)
                let temp_html = `<div class="card-box box" id="my-card-box" >
                                    <div class="card-image">
                                        <a onclick="window.location.href='/detail.html?id=${post_id}'">
                                            <figure class="image is-1by1">
                                                <img src="${image}" alt="Placeholder image"/>
                                            </figure>
                                        </a>
                                    </div>
                                    <div class="card-content">
                                        <div class="media" style="padding-bottom: 15px">
                                            <div class="media-content">
                                                <a onclick="window.location.href='/detail.html?id=${post_id}'" class="post-title" style="font-size: 30px">${title}</a>
                                                <p style="float: right; margin-top: 20px;" >${time_brfore}</p>
                                            </div>
                                        </div>
                                        <footer class="card-footer">
                                            <a class="card-footer-item" onclick="window.location.href='/plan.html?id=${post_id}'">수정</a>
                                            <a href="#" class="card-footer-item" onclick="my_plan_delete(${post_id})">삭제</a>
                                        </footer>
                                    </div>
                                </div>`
                $('#mycards').append(temp_html)
            }
        }
    });
}


// 내가 작성한 커뮤니티 조회
function my_community() {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/my-posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (communitys) {
            console.log(communitys)
            for (let i = 0; i < communitys.length; i++) {
                let post_id = communitys[i]['postId']
                let title = communitys[i]['title']
                let create_at = new Date(communitys[i]['createdAt'])
                let time_brfore = time2str(create_at)
                let temp_html = `<div id="communtity_post ">
                                    <button style="float: right;" onclick="community_post_delete(${post_id})" >삭제</button>
                                    <div class="communtity_post_box">
                                        <a class="posting_box"  onclick="window.location.href='/community_detail.html?id=${post_id}'">
                                            <p style="font-size: 20px; float: left;">${title}</p>
                                            <div style="float:">
                                                <div class="time_box">
                                                    <p class="posting_time">${time_brfore}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <hr style="width=100%">`
                $('#my_communtity').append(temp_html)
            }
        }
    })
}


// 게시물 DELETE
function my_plan_delete(id){
    const token = get_cookie("X-AUTH-TOKEN");
    const post_id = id
    console.log(post_id)
    if(confirm('삭제하겠습니까?')){
        $.ajax({
            type: "DELETE",
            url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/${post_id}`,
            data: {
                postId : post_id,
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function (result) {
                window.location.reload('/');
                console.log(result);
            }
        })
        alert("삭제되었습니다.")
    } else {
        window.location.reload('/');
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