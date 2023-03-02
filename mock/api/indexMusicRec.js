export default [
    {
        url: "/api/indexMusicRec",
        method: "get",
        response: () => {
            return {
                code: 0,
                message: "ok",
                data: {
                    timeRec: [
                        {
                            pic: "/src/assets/poster_01.jpg",
                            text: "normal rank"
                        },
                        {
                            pic: "/src/assets/poster_01.jpg",
                            text: "🔥⭐rank"
                        },
                        {
                            pic: "/src/assets/poster_01.jpg",
                            text: "🌏rank"
                        },
                        {
                            pic: "/src/assets/poster_01.jpg",
                            text: "🌌rank"
                        }
                    ],
                    recentList: [
                        {
                            pic: "/src/assets/poster_02.jpg",
                            text: "流行乐"
                        },
                        {
                            pic: "/src/assets/poster_02.jpg",
                            text: "动感音乐"
                        },
                        {
                            pic: "/src/assets/poster_02.jpg",
                            text: "最Hit音乐"
                        },
                        {
                            pic: "/src/assets/poster_02.jpg",
                            text: "vtb专辑"
                        }
                    ]
                },
            };
        },
    },
];