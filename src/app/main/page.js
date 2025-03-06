let posts = [
    {
        poster_id: 1,
        content: "หารับหิ้วแม็คโคร"
    },
    {
        poster_id: 2,
        content: "อนุญาตให้หลงใหล แต่ไม่อนุญาตให้หลงรัก"
    },
    {
        poster_id: 3,
        content: "หาเพื่อนคุยเหงามาก เบื่อปลื้ม "
    },
    {
        poster_id: 4,
        content: "อยากกินหนมจีนน้ำยา"
    },
    {
        poster_id: 5,
        content: "ทุกอย่างมันอยู่ที่ความพยายามของเราป่ะ"
    }
]

export default function Main(){

    return (
        <div>
            <ul id="nav-bar">
                <li>;-;</li>
                <li>Ngao Ngao</li>
                <li>Profile</li>
            </ul>
            <div>=====================================================================</div>
            <div id="content">
                {
                    posts.map((post, id) => (
                        <div key={id}>
                            {post.content}
                            <button>like</button>
                            <button>comment</button>
                        </div>
                    ))
                }
            </div>
            <div>=====================================================================</div>
            <div id="sticky-buttons">
                <button>notification</button>
                <button>post</button>
            </div>
        </div>
    )
}