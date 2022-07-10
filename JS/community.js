function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 초기화
$(window.document).ready(function() {
    communityPostsGet();
})

//게시물 GET
function communityPostsGet() {
    let token = get_cookie("X-AUTH-TOKEN");
    console.log(token);
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
                const post_id = post[i]['postId']
                const title = post[i]['title']
                const nickname = post[i]['nickname']
                const create_at = post[i]['createdAt']
                const time_befor = time2str(create_at)
                const temp_html = `<div>
                                    <a class="posting_box" href="${post_id}">
                                        <p style="font-size: 20px; float: left;">${title}</p>
                                        <div class="time_box">
                                            <p class="posting_time">${time_befor}</p>
                                        </div>
                                        <div class="time_box" style="text-align: center;">
                                            <p>${nickname}</p>
                                        </div>        
                                    </a>
                                </div>`
                $('#community_post').append(temp_html)
            }
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

// 게시물 POST
function communityMakePost() {
    let title = $('title_box').val()
    let content = $('content_box').val()
    let created_at = new Date().toISOString()

    $.ajax({
        type: "POST",
        url: "/user/community/post",
        data: {title: title, content: content, created_at: created_at},
        contentType: "application/json;",
        success: function (response) {
            console.log(response)
            alert(response['저장되었습니다.']);
            window.location.reload("/community.js");
        }
    })
}

// 게시물 DELETE
function community_post_delete(){
    if(confirm('삭제하겠습니까?')){
        $.ajax({
            type: "DELETE",
            url: "/user/community/post/{postId}",
            data: {},
            success: function (result) {
                console.log(result);
            }
        })
        alert("삭제되었습니다.")
    } else {
    }
}


//게시물 수정
function communityPutGet(post_id) {
    location.href = '/community_make.html'
    //$('#communitys').empty()
    $.ajax({
        type: "GET",
        url: "/user/community/posts",
        data: {postId: post_id},
        success: function (post) {
            let my_post = post['result']
            console.log(my_post['result'])
            const title = my_post[postId]['title']
            const content = my_post[postId]['content']
            const temp_html =   `<div>
                                    <div style="margin-bottom: 5px; font-size: 20px;">
                                        제목 : <input type="text" class="title_input" id="title_box" placeholder="제목을 입력하세요"
                                        value="${title}">
                                    </div>
                                    <hr class="hr_top">
                                    <textarea id="content_box" placeholder="내용을 입력하세요">${content}</textarea>
                                </div>`
            $('#communitys').append(temp_html)

        }
    })
}



