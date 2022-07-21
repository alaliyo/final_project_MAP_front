var schedules = []
$(window.document).ready(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    post_id = params['id']
    
    console.log("ddd  " + post_id)
    get_schedules(post_id);
    
});

function get_schedules(post_id){
    let token = get_cookie("X-AUTH-TOKEN");
    $('#schedules').empty()
    $.ajax({
        type: "GET",
        url: "http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user/plan/post/" + post_id + "/schedules",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            get_map(response)
        }
    })
}

function get_map(schedules){
    console.log(schedules)
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(schedules[0].y, schedules[0].x), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };  

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    var positions = []
    var iwPositions = []
    var iwContents = []
    var linePath = []

    
    for(let i=0; i<schedules.length; i++ ){
        schedule = schedules[i];
        positions.push({
            title: schedule.title,
            latlng: new kakao.maps.LatLng(schedule.y, schedule.x)
        })
        iwPositions.push(new kakao.maps.LatLng(schedule.y, schedule.x))
        iwContents.push(`<div style="padding:5px;">Day-${schedule.date} <br> ${schedule.placeName} <br> (${i+1}번째)  <a href="https://map.kakao.com/link/to/${schedule.placeName},${schedule.y},${schedule.x}" style="color:blue" target="_blank">길찾기</a></div>`)
        linePath.push(new kakao.maps.LatLng(schedule.y, schedule.x));
    }

    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < positions.length; i ++) {

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image : markerImage // 마커 이미지
        });

        var infowindow = new kakao.maps.InfoWindow({
            map : map,
            position : iwPositions[i], 
            content : iwContents[i] 
        });
        
    }

    // 지도에 표시할 선을 생성합니다
    var polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 10, // 선의 두께 입니다
        strokeColor: '#f50621', // 선의 색깔입니다
        strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    // 지도에 선을 표시합니다 
    polyline.setMap(map);
    
}



