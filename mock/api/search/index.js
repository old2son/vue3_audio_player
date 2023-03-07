import Mock, { Random } from 'mockjs';
export default [
    {
        url: "api/search/index",
        method: "get",
        response: () => {
            return {
                code: 0,
                message: "ok",
                data: Mock.mock({
                    'list|4': [
                        {
                            id: '@id',
                            name: '@cname',
                            age: Random.integer(1, 100),
                            address: '@county',
                            city: '@city',
                            province: '@province',
                            email: Random.email(),
                            phone: /^1[0-9]{10}$/,
                            regin: '@region',
                            url: '@url',
                            date: Random.date('yyyy-MM-dd'),
                        }
                    ]
                })
            };
        },
    },
];