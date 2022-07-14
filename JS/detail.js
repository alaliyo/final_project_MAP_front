let day_status = 1
let post_id = null


// 쿠키에서 값 받아오는 함수
function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    post_id = params['id']
    
    console.log(post_id)
    add_day(post_id)
    read_schedules(post_id);

    // 여행일 변경시 작동
    $('#select_day').on('change', function () {
        day_status = this.value
        console.log(day_status)
        read_schedules(post_id);
    });
});



function add_day(post_id){
    let token = get_cookie("X-AUTH-TOKEN");
    $('#schedules').empty()
    $(`#title`).empty()
    $(`#writer`).empty()
    $(`#createAt`).empty()
    $.ajax({
        type: "GET",
        url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response)

            for(let i=2; i<=response['period']; i++){
                let temp_html = `<option value=${i} label="${i}일"></option>
                                `
                $(`#select_day`).append(temp_html)
            }

            $(`#title`).append(`<h1 style="font-size: 40px; float: left;">${response['title']}</h1></div>`)
            $(`#writer`).append(`<h2 style="font-size: 30px;text-align: right;"> 작성자 : ${response['nickname']}</h2></div>`)
            $(`#createAt`).append(`<h2 style="font-size: 25px;text-align: right;">작성 날짜 : ${response['createdAt'].substring(0,10)}</h2></div>`)
            
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
                    let temp_html = `<li class="list-group-item" style="border: solid; border-radius: 10px; padding: 20px;">
                                        <a href="https://map.kakao.com/link/to/${schedule.placeName},${schedule.y},${schedule.x}" style="float: right">길 찾기</a>
                                        <h5 style="font-size: 30px;"><a href="${schedule.link}">${schedule.placeName}</a></h5>
                                        <p style="font-size: 20px">${schedule.address}</p>
                                        <p style="font-size: 15px; color: green">${schedule.phone}</p>
                                    </li>
                                    <br>
                                `
                                
                    $(`#schedules`).append(temp_html)
                }
                

                
            }

            
        }
    })
}






