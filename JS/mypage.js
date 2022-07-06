function logout(){
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/'
}

function delete_word(postid) {
    $.ajax({
        type: "POST",
        url: `/trip/posts/delete`,
        data: {
            postid : postid,
        },
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

$(document).ready(function () {
    get_mypost();
});

// 시간 보기 
function time(date) {
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

// 내가 작성한 글 불러오기
function get_mypost() {
//    if (username == undefined)
//    username == ""
//    console.log(username)
    $.ajax({
        type: "GET",
        url: '/user/plan/my-posts',
        data: {},
        success: function (response) {
            let my_posts = response['PostId']
            for (let i = 0; i < my_posts.length; i++) {
                let postid = my_posts[i]['postid']
                let title = my_posts[i]['title']
                let img = my_posts[i]['image']
                let createt_at = my_posts[i]['createdAt']
                let time_befor = time(createt_at)
                console.log(my_posts)
                let temp_html = `<div class="card-box box">
                                    <div class="mycards">
                                        <div class="card-image">
                                            <a href="detail.html">
                                                <figure class="image is-1by1">
                                                    <img src="${img}" alt="Placeholder image" />
                                                </figure>
                                            </a>
                                        </div>
                                        <div class="card-content">
                                            <div class="media" style="padding-bottom: 15px">
                                                <div class="media-content">
                                                    <a href="/user/plan/my-posts/${postid}" class="post-title" style="font-size: 30px">${title}</a>
                                                    <p style="float: right; margin-top: 20px;">${time_befor}</p>
                                                </div>
                                            </div>
                                            <footer class="card-footer">
                                                <!--  편집 삭제 onclick 지정해주기-->
                                                <a href="#" class="card-footer-item" onclick="">수정</a>
                                                <a href="#" class="card-footer-item" onclick="plan_delete()">삭제</a>
                                            </footer>
                                        </div>
                                    </div>
                                </div>`
                $('#card-box').append(temp_html)
            }
        }
    });
}