let day_status = 1
let post_id = null

// 쿠키에서 값 받아오는 함수
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


$(window.document).ready(function() {
    keep_out()
})

// 토큰 있을 시 이동 가능
function keep_out() {
    let token = get_cookie("X-AUTH-TOKEN");
    if (token) {}
    else {
        alert("로그인 후 이용해주세요")
        location.href = '/login.html';
    }
}


$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    post_id = params['id']
    
    console.log(post_id)
    read_schedules(post_id);

    // 여행일 변경시 작동
    $('#select_day').on('change', function () {
        day_status = this.value
        console.log(day_status)
        read_schedules(post_id);
    });
});

// 에러 시 로그아웃
function relogin(){
    window.location.replace("/home.html");
    alert('토큰이 만료되었습니다. 다시 로그인 하세요');
}

function add_day(post_id){
    let token = get_cookie("X-AUTH-TOKEN");
    $('#schedules').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id + "/schedules",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)

            let schedules = response
            for (let i = 0; i < schedules.length; i++) {
                let schedule = schedules[i];
                console.log(schedule)
                if(day_status == schedule['date']){
                    let temp_html = `<li class="list-group-item" style="border: solid; border-radius: 10px; padding: 10px;">
                                    <button  onclick="delete_schedule(${schedule.id})" style="float: right">취소</button>
                                    <h5><a href="${schedule.link}">${schedule.placeName}</a></h5>
                                    <p style="font-size: 15px">${schedule.address}</p>
                                    <p style="font-size: 12px; color: green">${schedule.phone}</p>
                                </li>
                                `
                    $(`#schedules`).append(temp_html)
                }  
            }
        }
    })
}

function read_schedules(post_id){
    let token = get_cookie("X-AUTH-TOKEN");
    $('#schedules').empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id + "/schedules",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)

            let schedules = response
            for (let i = 0; i < schedules.length; i++) {
                let schedule = schedules[i];
                console.log(schedule)
                if(day_status == schedule['date']){
                    let temp_html = `<li class="list-group-item" style="border: solid; border-radius: 10px; padding: 10px;">
                                    <button  onclick="delete_schedule(${schedule.id})" style="float: right">취소</button>
                                    <h5><a href="${schedule.link}">${schedule.placeName}</a></h5>
                                    <p style="font-size: 15px">${schedule.address}</p>
                                    <p style="font-size: 12px; color: green">${schedule.phone}</p>
                                </li>
                                `
                    $(`#schedules`).append(temp_html)
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            relogin()
        }
    })
}





