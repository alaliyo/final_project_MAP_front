function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 생성 및 시작
$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    profil(params['id']);
    keep_out()
    my_plan()
    my_plans()
    my_community()
    my_like_plans_id()
    my_like_cards()
});


// 토큰 없을 시 페이지 접속 막음
function keep_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token) {}
    else {
        alert("로그인 후 이용해주세요")
        location.href = '/login.html';
    }
    
}


//토근 만료 시 로그인 창으로
function relogin(){
    alert('다시 로그인 하세요');
    window.location.replace("/login.html");
}


// 게시물 및 커뮤니티 조회 버튼
function my_plan() {
    $('#my_communtity_box').hide()
    $('#my_like_plan').hide()
    $('#mycards').show()
}
function my_like_plan() {
    $('#mycards').hide()
    $('#my_communtity_box').hide()
    $('#my_like_plan').show()
}
function my_community_box() {
    $('#mycards').hide()
    $('#my_like_plan').hide()
    $('#my_communtity_box').show()
}



// 버튼 누를 시 색 고정
$(document).ready(function() {
    $(".button0").click(
        function () {
            document.getElementsByClassName("button0")[0].className = "menu_remote_change button0";
            document.getElementsByClassName("menu_remote0")[0].className = "menu_remote_btm_change menu_remote0";
            document.getElementsByClassName("button1")[0].className = "menu_remote button1";
            document.getElementsByClassName("menu_remote1")[0].className = "menu_remote_btm menu_remote1";
            document.getElementsByClassName("button2")[0].className = "menu_remote button2";
            document.getElementsByClassName("menu_remote2")[0].className = "menu_remote_btm menu_remote2";
        }
    )
    $(".button1").click(
        function () {
            document.getElementsByClassName("button1")[0].className = "menu_remote_change button1";
            document.getElementsByClassName("menu_remote1")[0].className = "menu_remote_btm_change menu_remote1";
            document.getElementsByClassName("button0")[0].className = "menu_remote button0";
            document.getElementsByClassName("menu_remote0")[0].className = "menu_remote_btm menu_remote0";
            document.getElementsByClassName("button2")[0].className = "menu_remote button2";
            document.getElementsByClassName("menu_remote2")[0].className = "menu_remote_btm menu_remote2";
        }
    )
    $(".button2").click(
        function () {
            document.getElementsByClassName("button2")[0].className = "menu_remote_change button2";
            document.getElementsByClassName("menu_remote2")[0].className = "menu_remote_btm_change menu_remote2";
            document.getElementsByClassName("button0")[0].className = "menu_remote button0";
            document.getElementsByClassName("menu_remote0")[0].className = "menu_remote_btm menu_remote0";
            document.getElementsByClassName("button1")[0].className = "menu_remote button1";
            document.getElementsByClassName("menu_remote1")[0].className = "menu_remote_btm menu_remote1";
        }
    )
})

//이메일 전역 변수
let profil_email = []


// 프로필 GET 
function profil() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (user) {
            const user_id = user['id']
            let nickname = user['nickname']
            let image = user['image']
            let temp_html = ''
            if (image === null) {
                temp_html = `<div class="profil_box" id="profil_box">
                                <div class="mypage_profil_ring">
                                    <img class="mypage_profil" src="/static/default_profile.png" alt="Placeholder image" />
                                </div>
                                <p class="nickname" id="idname">${nickname}</p>
                                <div class="community_write_back" style="width: 110px;" onclick="profil_revise(${user_id});">
                                    <a class="profil_revise_btn" onclick="password_inquiry();" >개인정보수정</a>
                                </div>
                            </div>`
            } else {
                temp_html = `<div class="profil_box" id="profil_box">
                                <div class="mypage_profil_ring">
                                    <img class="mypage_profil" src="${image}" alt="Placeholder image" />
                                </div>
                                <p class="nickname" id="idname">${nickname}</p>
                                <div class="community_write_back" style="width: 110px;" onclick="profil_revise(${user_id});">
                                    <a class="profil_revise_btn" onclick="password_inquiry();" >개인정보수정</a>
                                </div>
                            </div>`
            }
            $('#my_profil').append(temp_html)
            let email = user['email'];
            profil_email.push(email)
        }
    })
}


// 내가 작성한 개시물 GET
function my_plans() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: 'http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/my-posts',
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (postId) {
            for (let i = 0; i < postId.length; i++) {
                let post_id = postId[i]['id']
                let title = postId[i]['title']
                let image = postId[i]['image']
                let createdAt = postId[i]['createdAt'] + '+0000'
                let create_at = new Date(createdAt)
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
                                        <div class="media">
                                            <div class="media-content">
                                                <a onclick="window.location.href='/detail.html?id=${post_id}'" class="post-title" style="font-size: 22px">${title}</a>
                                                <p style="float: right; margin-top: 20px;" >${time_brfore}</p>
                                            </div>
                                        </div>
                                        <footer class="card-footer">
                                            <a class="card-footer-item" onclick="window.location.href='/plan.html?id=${post_id}'; ">수정</a>
                                            <a href="#" class="card-footer-item" onclick="my_plan_delete(${post_id})">삭제</a>
                                        </footer>
                                    </div>
                                </div>`
                $('#mycards').append(temp_html)
            }
        }
    });
}


// 내가 좋아요한 게시물 GET
let my_like_plan_id = []

function my_like_plans_id() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: 'http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/posts/my-like',
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (like_posts_id) {
            for (let i = 0; i < like_posts_id.length; i++) {
                let posts_id = like_posts_id[i]['postId']
                my_like_plan_id.push(posts_id)
            }
        }
    });
}

function my_like_cards() {
    $('#cards').empty()
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/plan/posts",
        data: {},
        contentType: "application/json",
        success: function (like_cards) {
            for (let i=0; i < like_cards.length; i ++) {
                function category_variable() {
                    let categories = like_cards[i]['category'];
                    if (categories === 'FOOD') {
                        return "맛집투어"
                    } else if (categories === 'HEALING') {
                        return "힐링여행"
                    } else if (categories === 'SCENERY') {
                        return "풍경"
                    } else if (categories === 'CAFE') {
                        return "카페투어"
                    } else if (categories === 'ATTRACTION') {
                        return "관광지"
                    } else if (categories === 'DATE') {
                        return "데이트"
                    } else {
                        return "없음"
                    } 
                }
                function images() {
                    const img = like_cards[i]['image'];
                    if (img === '입력 없음') {
                        return "/static/MAP_logo.png"
                    } else {
                        return img
                    }
                }
                const category = category_variable()
                const post_id = like_cards[i]['id']
                const nickname = like_cards[i]['nickname']
                const title = like_cards[i]['title']
                const image = images()
                const likes = like_cards[i]['likes']
                const views = like_cards[i]['views']
                const createdAt = like_cards[i]['createdAt'] + "+0000"
                const create_at = new Date(createdAt)
                const time_brfore = time2str(create_at)
                let temp_html = ``
                if (my_like_plan_id.indexOf(post_id) >= 0) {
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
                                            <p style="position : absolute; bottom : 30px;">카테고리: ${category}</p>
                                            <div style="position : absolute; bottom : 5px; width:150px;">
                                                <P style="float: left;"> 조회수: ${views}</P>
                                                <a style="float: left;  margin-left: 20px;">
                                                    <img onclick="likes_btn(${post_id})" class="likes likes_on" id="likes-${post_id}" src="/static/like-icon-on.png">
                                                </a>
                                                <num style="float: left; margin-left: 3px;">${likes}</num>
                                            </div>
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

function likes_btn(post_id) {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "POST",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/post/${post_id}/like`,
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function () {
            my_like_plans_id();
            my_like_cards();
            location.reload('/')
        }
    })
}


// 게시물 DELETE
function my_plan_delete(id){
    const token = get_cookie("X-AUTH-TOKEN");
    const post_id = id
    if(confirm('삭제하겠습니까?')){
        $.ajax({
            type: "DELETE",
            url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/post/${post_id}`,
            data: {
                postId : post_id,
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function () {
                window.location.reload('/');
            }
        })
        alert("삭제되었습니다.")
    } else {
        window.location.reload('/');
    }
}


// 시간 변경 함수
function time2str(createdAt) {
    let today = new Date() 
    let time = (today - createdAt) / 1000 / 60 // 분
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


// community_user_nickname()를 넣은 전역 변수
let totalData; //총 데이터 수
let dataPerPage = 10; //한 페이지에 나타낼 글 수
let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let globalData; //controller에서 가져온 data 전역변수
let user_nickname = []; // community_user_nickname()를 넣은 전역 변수


//나의 커뮤니티 게시물 GET
function my_community() {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/my-posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (communitys)  {
            totalData = communitys.length
            globalData = communitys
            //글 목록 표시 호출 (테이블 생성)
            displayData(1, dataPerPage, globalData);
            //페이징 표시 호출
            paging(totalData, dataPerPage, pageCount, 1);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            relogin()
        }
    })
}


function paging(totalData, dataPerPage, pageCount, currentPage) {
    console.log(totalData, dataPerPage, pageCount, currentPage)

    totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수
    console.log(totalPage)

    if (totalPage < pageCount) {
        pageCount = totalPage;
    }

    let pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
    let last = pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호

    if (last > totalPage) {
        last = totalPage;
    }

    let first = last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
    let next = last + 1;
    let prev = first - 1;

    let pageHtml = "";

    if (prev > 0) {
        pageHtml += "<li><a href='#' id='prev'> 이전 </a></li>";
    }

    //페이징 번호 표시 
    for (var i = first; i <= last; i++) {
        if (currentPage == i) {
            pageHtml +=
                "<li class='on' style='float: left; margin-left: 5px; margin-right: 5px;'><a class='paging_remotr href='#' id='" + i + "'>" + i + "</a></li>";
        } else {
            pageHtml += "<li style='float: left; margin-left: 5px; margin-right: 5px;'><a class='paging_remotr' href='#' id='" + i + "'>" + i + "</a></li>";
        }
    }

    if (last < totalPage) {
        pageHtml += "<li><a href='#' id='next'> 다음 </a></li>";
    }

    $("#pagingul").html(pageHtml);
    let displayCount = "";
    displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
    $("#displayCount").text(displayCount);


    //페이징 번호 클릭 이벤트 
    $("#pagingul li a").click(function () {
        globalData

        let $id = $(this).attr("id");
        selectedPage = $(this).text();

        if ($id == "next") selectedPage = next;
        if ($id == "prev") selectedPage = prev;

        //전역변수에 선택한 페이지 번호를 담는다...
        globalCurrentPage = selectedPage;
        //페이징 표시 재호출
        paging(totalData, dataPerPage, pageCount, selectedPage);
        //글 목록 표시 재호출
        displayData(selectedPage, dataPerPage, globalData);
    });
    }


    //현재 페이지(currentPage)와 페이지당 글 개수(dataPerPage) 반영
    function displayData(currentPage, dataPerPage, globalData) {
    let chartHtml = "";

    //Number로 변환하지 않으면 아래에서 +를 할 경우 스트링 결합이 되어버림.. 
    currentPage = Number(currentPage);
    dataPerPage = Number(dataPerPage);

    $("#my_communtity").empty();
    for (var i = (currentPage - 1) * dataPerPage; i < (currentPage - 1) * dataPerPage + dataPerPage; i++)
    {

        if (globalData[i] == undefined)
        {
            break;
        }
        let post_id = globalData[i]['postId']
        let title = globalData[i]['title']
        let modifiedAt = globalData[i]['modifiedAt'] + '+0000'
        let create_at = new Date(modifiedAt)
        let time_brfore = time2str(create_at)
        let temp_html = `<div id="communtity_post ">
                                <a id="delete_btn" style="float: right; margin-top: 8px; margin-right: 20px; color: red;" onclick="community_post_delete(${post_id})" >삭제</a>
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


// 게시물 DELETE
function community_post_delete(postId){
    const token = get_cookie("X-AUTH-TOKEN");
    const post_id= postId
    if(confirm('삭제하겠습니까?')){
        $.ajax({
            type: "DELETE",
            url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/post/${post_id}`,
            data: {
                postId : post_id,
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function () {
                window.location.reload('/');
            }
        })
        alert("삭제되었습니다.")
    } else {
        window.location.reload('/');
    }
}


// 탈퇴기능
function withdrawal(){
    const token = get_cookie("X-AUTH-TOKEN");
    if (prompt("탈퇴하시려면 '탈퇴하기' 입력해주세요") == "탈퇴하기"){
        if(confirm('탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')){
            $.ajax({
                type: "DELETE",
                url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/member`,
                data: {
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Content-type","application/json");
                    xhr.setRequestHeader("X-AUTH-TOKEN", token);
                },
                success: function () {
                    window.location.replace('/home.html');
                }
            })
            alert("탈퇴되습니다. 그동안 서비스를 이용해 주셔서 감사합니다.");
        } else {
            alert("취소하였습니다.");
        }
    } else {
        alert("잘못 입력하셨습니다. 다시 입력해 주세요");
    }
}


//페스워드 비교 조회 후 수정 기능 띄우기
function password_inquiry() {
    const token = get_cookie("X-AUTH-TOKEN");
    let email = profil_email
    if (email == 'kakao') {
        $('#my_profil').hide();
        $('#my_profil_revise').show();
        $('#email_hide').hide();
    } else {
        $('#my_profil').hide();
        $('#my_profil_revise').hide();
        $('#my_profil_password_check').show();
    }
}

function password_check_btn() {
    const token = get_cookie("X-AUTH-TOKEN");
    let password = $('#password_check_input').val();
    if (password === null) {
    } else {
        $.ajax({
            type: "GET",
            url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/member?password=${password}`,
            data:{},
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function (response) {
                if ("비밀번호 확인이 완료되었습니다." == response) {
                        $('#my_profil').hide();
                        $('#my_profil_password_check').hide();
                        $('#my_profil_revise').show();
                } else {
                    alert("비밀번호를 확인해 주세요");
                    password_inquiry();
                }
            }
        });
    }
}