
$(window.document).ready(function() {
    haeder_mypage();
})

function haeder_mypage() {
    let token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: `http://finalapp-env.eba-mcuzkehj.ap-northeast-2.elasticbeanstalk.com/user`,
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            let nickname = response['nickname']
            let temp_html1 = `
                <p style="float:left; margin-right:3px; margin-top:10px;">${nickname}</p>
                `
            $('.haed_nickname').append(temp_html1)
            let image = response['image']
            let temp_html2 = `
                <div class="header_profil_ring">
                    <img class="header_profil" src="${image}" alt="Placeholder image" />
                </div>
                `
            $('.haed_img').append(temp_html2)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);    
        }
    })
}