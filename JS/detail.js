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
    add_day(post_id)
    read_schedules(post_id);

    // 여행일 변경시 작동
    $('#select_day').on('change', function () {
        day_status = this.value
        read_schedules(post_id);
    });
});



function add_day(post_id){
    $('#schedules').empty()
    $(`#title`).empty()
    $(`#writer`).empty()
    $(`#createAt`).empty()
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/plan/post/" + post_id,
        success: function (response) {
            for(let i=2; i<=response['period']; i++){
                let temp_html = `<option value=${i} label="${i}일"></option>
                                `
                $(`#select_day`).append(temp_html)
            }

            $(`#title`).append(`<p style="float: left; font-size: 23px;">제목 : ${response['title']}</h1></div>`)
            $(`#writer`).append(`<p style="text-align: right; font-size: 18px;"> 작성자 : ${response['nickname']}</h2></div>`)
            $(`#createAt`).append(`<p style="text-align: right; font-size: 18px;"> 날짜 : ${response['createdAt'].substring(0,10)}</h2></div>`)
        }
    })
}

function read_schedules(post_id){
    $('#schedules').empty()
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/plan/post/" + post_id + "/schedules",
        success: function (response) {
            let schedules = response
            for (let i = 0; i < schedules.length; i++) {
                let schedule = schedules[i];
                console.log(schedule)
                if(day_status == schedule['date']){
                    let temp_html = `<li class="list-group-item" style="padding: 5px;">
                                        <a href="https://map.kakao.com/link/to/${schedule.placeName},${schedule.y},${schedule.x}" target="_blank" style="float: right; color: rgb(50, 115, 220);"">길 찾기</a>
                                        <h5 style="font-size: 20px;"><a style="color: rgb(50, 115, 220);" href="${schedule.link}" target="_blank" >${schedule.placeName}</a></h5>
                                        <p style="font-size: 17px">${schedule.address}</p>
                                        <p style="font-size: 15px; color: green">${schedule.phone}</p>
                                    </li>
                                    <br>
                                `
                    $(`#schedules`).append(temp_html)
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    })
}