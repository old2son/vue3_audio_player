export default [
    {
        url: "/api/radio/tabLi",
        method: "get",
        response: () => {
            return {
                code: 0,
                message: "ok",
                data: [
                    {
                        tabId: 1,
                        tabName: "推荐",
                        children: [
                            {
                                id: 10,
                                tl: "🔥🔥🔥🔥艺人",
                            },
                            {
                                id: 11,
                                tl: "🔥艺人",
                            },
                            {
                                id: 12,
                                tl: "🔥🔥🔥艺人",
                            },
                        ]
                    },
                    {
                        tabId: 2,
                        tabName: "热门",
                        children: [
                            {
                                id: 21,
                                tl: "💧艺人",
                            },
                        ]
                    },
                    {
                        tabId: 3,
                        tabName: "电台",
                        children: [
                            {
                                id: 30,
                                tl: "🌩🌩🌩🌩艺人",
                            },
                            {
                                id: 31,
                                tl: "🌩艺人",
                            },
                        ]
                    }
                ],
            };
        },
    },
];