function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 페이지 접속 시 실행하기
$(window.document).ready(function() {
    communityPostsGet();
    community_user_nickname()
})




// 에러 발생 시 홈으로
function relogin(){
    window.location.replace("/login.html");
    alert('다시 로그인 하세요');
}


// community_user_nickname()를 넣은 전역 변수
let totalData; //총 데이터 수
let dataPerPage = 10; //한 페이지에 나타낼 글 수
let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let globalData; //controller에서 가져온 data 전역변수
let user_nickname = []; // community_user_nickname()를 넣은 전역 변수


//게시물 GET
function communityPostsGet() {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (posts) {
            totalData = posts.length
            globalData = posts
            console.log(totalData)
            console.log(globalData)
            //글 목록 표시 호출 (테이블 생성)
            displayData(1, dataPerPage, globalData);
            //페이징 표시 호출
            paging(totalData, dataPerPage, pageCount, 1);
        },
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

    $("#communtity_posts").empty();
    for (var i = (currentPage - 1) * dataPerPage; i < (currentPage - 1) * dataPerPage + dataPerPage; i++)
    {

        if (globalData[i] == undefined)
        {
            console.log(globalData);
            break;
        }
            let post_id = globalData[i]['postId']
            let title = globalData[i]['title']
            let nickname = globalData[i]['nickname']
            let createdAt = globalData[i]['createdAt'] + '+0000'
            let create_at = new Date(createdAt)
            let time_brfore = time2str(create_at)
            let temp_html = ``
            console.log(user_nickname)
            if (user_nickname == globalData[i]['nickname']) {
                console.log("삭제 버튼 on")
                temp_html = `<div id="communtity_post ">
                                <a id="delete_btn" style="float: right; margin-top: 8px; margin-right: 10px; color: red;" onclick="community_post_delete(${post_id})" >삭제</a>
                                <div class="communtity_post_box">
                                    <a class="posting_box"  onclick="window.location.href='/community_detail.html?id=${post_id}'">
                                        <p style="font-size: 20px; float: left;">${title}</p>
                                        <div style="float:">
                                            <div class="time_box">
                                                <p class="posting_time">${time_brfore}</p>
                                            </div>
                                            <div class="nickname_box" style="text-align: center;">
                                                <p>${nickname}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <hr style="width=100%">`
            } else {
                console.log("삭제 버튼 off")
                temp_html =`<div id="communtity_post ">
                                <div class="communtity_post_box">
                                    <a class="posting_box"  onclick="window.location.href='/community_detail.html?id=${post_id}'">
                                        <p style="font-size: 20px; float: left;">${title}</p>
                                        <div style="float:">
                                            <div class="time_box">
                                                <p class="posting_time">${time_brfore}</p>
                                            </div>
                                            <div class="nickname_box" style="text-align: center;">
                                                <p>${nickname}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <hr style="width=100%">`
            }
            $('#communtity_posts').append(temp_html);
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
                window.location.reload('/community.html');
                console.log(result);
            }
        })
        alert("삭제되었습니다.")
    } else {
        window.location.reload('/community.html');
    }
}


// 게시물 시간 변경
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


// 삭제 버튼을 위한 닉네임 조회
function community_user_nickname() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/community/my-posts",
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (community) {
            console.log(community)
                let nickname = community[0]['nickname']
                console.log(nickname)
                user_nickname.push(nickname)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            relogin()
        }
    })
}

