function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 실행하기
$(window.document).ready(function() {
    communityPostsGet();
})

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
                let create_at = post[i]['createdAt']
                let temp_html = `<div id="communtity_post ">
                                    <div class="communtity_post_box">
                                        <a class="posting_box"  onclick="window.location.href='/community_detail.html?id=${post_id}'">
                                            <p style="font-size: 20px; float: left;">${title}</p>
                                            <div style="float:">
                                                <div class="time_box">
                                                    <p class="posting_time">${create_at}</p>
                                                </div>
                                                <div class="nickname_box" style="text-align: center;">
                                                    <p>${nickname}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <button style="float: right;" onclick="community_post_delete(${post_id})" >삭제</button>
                                </div>
                                <hr style="width=100%">`
                $('#communtity_posts').append(temp_html)
            }
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


//게시물 수정
function communityPutGet(postId) {
    location.href = '/community_make.html'
    //$('#communitys').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/community/posts",
        data: {postId: post_id},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
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



// 게시물 시간
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
