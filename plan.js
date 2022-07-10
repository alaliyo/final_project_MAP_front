
let day; // 여행 기간 (예 2박 3일)
let day_status // 선택된 d y 상 태 
let post_id // 현재 작성중인 post_id

$(document).ready(function (){

    day = -1;
    day_status = 1;

    // 여행 설계 버튼 클릭시 게시물이 생성 
    if(localStorage.getItem('action') == 'create'){
        create_post();
        read_schedule();
    }else{
        console.log('fail')

    }

    // 큰 여행 리스트, 그 안에 일정 생성
    create_plan(day);

    // 여행일 변경시 작동
    $('#select_day').on('change', function () {
        alert(this.value + '일치 일정을 추가해 주세요')
        day = this.value
        create_plan(day);
        read_schedule();
    });

})

//쿠키 
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }

// 게시물 생성하는 함수
function create_post(){
    let token = get_cookie("X-AUTH-TOKEN");
    console.log(token)
    console.log("craete_post in")
    $.ajax({
        type: "POST",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post",
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function(response){
            console.log(response)
            post_id = response;
            localStorage.setItem('action', 'null');
        }
    })
}

// 큰 계획 일정 만드는 함수
function create_plan(day){
    $('#day_plan').empty()

    for(let i=0; i<day; i++){
        let temp_html = `<h4 onclick="change_status(${i + 1})">${i + 1}일</h4>
                            <li class="list-group-item">
                                <ul class="list-group" id="schedule-${i + 1}" style="height: 200px; overflow: auto; padding: 10px; border: solid; border-radius: 10px;">
                                    fdsfsdfsesfedfesdfseg
                                </ul>
                            </li>`
        $('#day_plan').append(temp_html);
    }
}

function change_status(num) {
    day_status = num;
    alert(day_status + '일을 선택했습니다. 일정을 추가해 주세요')
}

//작은 일정 만들어서 디비에 저장
function api_create_schedule(title, address, y, x, phone, url) {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "POST",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/schedule",
        data: JSON.stringify({
            'postId': post_id,
            'date': day_status,
            'placeName': title,
            'address': address,
            'x': x,
            'y': y,
            'phone': phone,
            'link': url
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log('api_create_schedule: ' + response)
            console.log(title, address, y, x, phone, url)
            read_schedule();
        }
    })

}

// 디비에서 일정 받아와 화면에 그려주기
function read_schedule() {
    
    let token = get_cookie("X-AUTH-TOKEN");

    for (let i = 0; i < day; i++) {
        $(`#schedule-${i + 1}`).empty()
    }

    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id + "/schedules",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        
        success: function (response) {
            let schedules = response
            for (let i = 0; i < schedules.length; i++) {
                console.log(schedules)
                let schedule = schedules[i];

                let temp_html = `<li class="list-group-item" style="border: solid; border-radius: 10px; padding: 10px;">
                                    <button  onclick="delete_schedule(${schedule.id})" style="float: right">취소</button>
                                    <h5><a href="${schedule.link}">${schedule.placeName}</a></h5>
                                    <p style="font-size: 15px">${schedule.address}</p>
                                    <p style="font-size: 12px; color: green">${schedule.phone}</p>
                                </li>
                                `

                $(`#schedule-${schedule.date}`).append(temp_html)
            }

        }
    })
}

// 일정 삭제
function delete_schedule(scheduleId) {
    let token = get_cookie("X-AUTH-TOKEN");
    console.log("들어왔다")
    $.ajax({
        type: "DELETE",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/schedule/" + scheduleId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)
            create_plan(day);
            read_schedule();
        }
    })
    
}

// 모든 일정 삭제
function delete_all(){

}

// 여행 게시물 저장
function save_post(){
    let token = get_cookie("X-AUTH-TOKEN");
    let title = $('#mytitle').val();
    let category = $("#select_category").val();
    let period = $("#select_day").val();
    let file = $('#file')[0];

    if(file.files.length === 0){
        alert("대표 이지미를 선택해주세요");
        return;
    }

    let formData = new FormData();
    formData.append("file", file.files[0]);

    $.ajax({
        type: "PUT",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id,
        data: JSON.stringify({
            'title' : title,
            'category' : category,
            'period' : period
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)
        }
    })

    $.ajax({
        type: "POST",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id + "/image?path=images",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log("여기2")
            console.log(response)
            window.location='/home.html'
        }
    })
}

// 여행 게시물의 모든 일정 삭제
function delete_all(){
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "DELETE",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id + "/schedules",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)
            alert("일정을 초기화 했습니다.")
            read_schedule()
        }
    })

}
