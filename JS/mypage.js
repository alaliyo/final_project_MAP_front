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
    $('#mycards').show()
}
function my_community_box() {
    $('#mycards').hide()
    $('#my_communtity_box').show()
}

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
            console.log(user)
            const user_id = user['id']
            let nickname = user['nickname']
            let image = user['image']
            console.log(image)
            let temp_html = ''
            if (image === null) {
                temp_html = `<div class="profil_box" id="profil_box">
                                <div class="profil_ring">
                                    <img class="profil" src="/static/default_profile.png" alt="Placeholder image" />
                                </div>
                                <p class="nickname" id="idname">${nickname}</p>
                                <div class="community_write_back" style="width: 110px;" onclick="profil_revise_show(); profil_revise(${user_id});">
                                    <a class="profil_revise_btn" onclick="password_inquiry();" >개인정보수정</a>
                                </div>
                            </div>`
            } else {
                temp_html = `<div class="profil_box" id="profil_box">
                                <div class="profil_ring">
                                    <img class="profil" src="${image}" alt="Placeholder image" />
                                </div>
                                <p class="nickname" id="idname">${nickname}</p>
                                <div class="community_write_back" style="width: 110px;" onclick="profil_revise_show(); profil_revise(${user_id});">
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
            console.log(postId)
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


// 게시물 DELETE
function my_plan_delete(id){
    const token = get_cookie("X-AUTH-TOKEN");
    const post_id = id
    console.log(post_id)
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


// 시간 변경 함수
function time2str(createdAt) {
    let today = new Date() 
    let time = (today - createdAt) / 1000 / 60 // 분
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
            console.log(totalData)
            console.log(globalData)
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
            console.log(globalData);
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
    console.log(post_id)
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
                success: function (result) {
                    window.location.replace('/home.html');
                    console.log(result);
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


//페스워드 비교 조회 호 수정 기능 띄우기
function password_inquiry() {
    const token = get_cookie("X-AUTH-TOKEN");
    let email = profil_email
    console.log(email)
    if (email == 'kakao') {
        $('#my_profil').hide();
        $('#my_profil_revise').show();
    } else {
        let password = prompt ("페스워드를 입력하세요")
        console.log(password)
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
                    console.log(response)
                    if ("비밀번호 확인이 완료되었습니다." == response) {
                            $('#my_profil').hide();
                            $('#my_profil_revise').show();
                    } else {
                        alert("비밀번호를 확인해 주세요");
                        password_inquiry();
                    }
                }
            });
        }
    }

}