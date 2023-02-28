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
                            pic: "/src/assets/temp_003.jpg",
                            text: "宇宙榜"
                        },
                        {
                            pic: "/src/assets/temp_003.jpg",
                            text: "银河系榜"
                        }
                    ],
                    recentList: [
                        {
                            pic: "/src/assets/temp_004.jpg",
                            text: "流行乐"
                        },
                        {
                            pic: "/src/assets/temp_004.jpg",
                            text: "vtb专辑"
                        }
                    ]
                },
            };
        },
    },
];