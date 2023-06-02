import Mock from 'mockjs';

const Random = Mock.mock({
    "string|1-10": "★"
});

export default [
    {
        url: "/api/getSearchData",
        method: "get",
        response: () => {
            return {
                code: 0,
                message: "ok",
                data: {
                    Random
                },
            };
        },
    },
];