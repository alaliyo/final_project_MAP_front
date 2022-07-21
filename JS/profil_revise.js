


function profil_revise_off() {
    $('#my_profil_revise').hide();
    $('#my_profil').show();
}

function get_cookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null; }


// 유저정보 들고오기
function profil_revise() {
    const token = get_cookie("X-AUTH-TOKEN");
    $.ajax({
        type: "GET",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user`,
        data: {},
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (user) {
            console.log(user)
            const nickname = user['nickname'];
            const email = user['email'];
            $('.nickname_textbox').val(`${nickname}`);
            $('.email_textbox').val(`${email}`);  
            
            }
        }
    )
}


// 게시물 수정 
function community_put_post() {
    let token = get_cookie("X-AUTH-TOKEN");
    let nickname = $('.nickname_textbox').val();
    let email = $('.email_textbox').val();
    let image = $('#image_textbox').val();
    let password = $('#password_textbox').val();
    let file = $('#file')[0];

    let formData = new FormData();
    formData.append("file", file.files[0]);

    console.log(nickname, email, image, password)
    $.ajax({
        type: "PUT",
        url: `http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/modify`,
        data: JSON.stringify({
            nickname: nickname,
            email: email
        }),
        contentType: "application/json;",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("X-AUTH-TOKEN", token);
        },
        success: function (response) {
            console.log(response);
            alert(response)
        }
    })
    if(file.files.length != 0){
        $.ajax({
            type: "POST",
            url: "http://springapp-env.eba-uvimdpb4.ap-northeast-2.elasticbeanstalk.com/user/profile",
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-AUTH-TOKEN", token);
            },
            success: function (response) {
                console.log(response)
            }
        })
    }

}