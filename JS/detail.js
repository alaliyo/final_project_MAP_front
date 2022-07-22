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

// 에러 시 로그아웃
// function relogin(){
//     alert('다시 로그인 하세요');
//     window.location.replace("/login.html");
// }


function add_day(post_id){
    // let token = get_cookie("X-AUTH-TOKEN");
    $('#schedules').empty()
    $(`#title`).empty()
    $(`#writer`).empty()
    $(`#createAt`).empty()
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/plan/post/" + post_id,
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader("Content-type","application/json");
        //     xhr.setRequestHeader("X-AUTH-TOKEN", token);
        // },
        success: function (response) {
            console.log(response)

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
    // let token = get_cookie("X-AUTH-TOKEN");
    $('#schedules').empty()
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/plan/post/" + post_id + "/schedules",
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader("Content-type","application/json");
        //     xhr.setRequestHeader("X-AUTH-TOKEN", token);
        // },
        success: function (response) {
            console.log(response)

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


// // 페이스북 공유
// function shareFacebook() {
//     let sendUrl = document.location.href; // 전달할 URL
//     console.log(sendUrl)
//     window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl);
// }


// // 카카오톡 공유
// function shareKakao() {
//     let sendUrl = document.location.href;
//     // 사용할 앱의 JavaScript 키 설정
//     console.log()
//     Kakao.init('34a4374ea4bd8acb6de7112e2f55b723');
//     // 카카오링크 버튼 생성
//     Kakao.Link.createDefaultButton({
//       container: '#btnKakao', // 카카오공유버튼ID
//       objectType: 'feed',
//       content: {
//         title: "make a plan", // 보여질 제목
//         description: "국내 여행을 성계하고 공유하자", // 보여질 설명
//         imageUrl: sendUrl, // 콘텐츠 URL
//         link: {
//            mobileWebUrl: sendUrl,
//            webUrl: sendUrl
//         }
//       }
//     });
//   }
  