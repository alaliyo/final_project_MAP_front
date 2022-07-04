function check_local() {
    $('#cards').empty()
    $.ajax({
        type: "GET",
        url: "/plan/posts",
        data: {},
        success: function (cards) {
            let card = cards['result']
            console.log(cards['result'])
            for (let i = 0; i < card.length; i++) {
                const post_id = card[i]['postId']
                const nickname = card[i]['nickname']
                const title = card[i]['title']
                const image = card[i]['image']
                const create_at = card[i]['createdAt']
                const temp_html = `<div class="card" id="${post_id}">
                                    <a class="card_img_box" href="detail.html">
                                        <img class="card_img" src="${image}"/>
                                    </a>
                                    <div>
                                        <a href="detail.html">
                                            <p class="card_title">${title}</p>
                                        </a>
                                    </div>
                                    <div >
                                        <p class="card_writer">${nickname}</p>
                                        <br>
                                        <p class="card_time">${create_at}</p>
                                    </div>
                                </div>`
                                $('#cards').append(temp_html)
            }
        }
    })
}