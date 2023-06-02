import Mock from 'mockjs';

// @ 引用的是 Mock.Random
// const Random = Mock.Random;
const data = Mock.mock({
	'userList|30-100': [
		{
            id: '@ID',
			name: '@NAME',
			img: '@IMAGE(100x100, @COLOR, @COLOR, @NAME)',
			desc: '@PARAGRAPH(1)'
		}
	]
});

export default [
	{
		url: '/api/getSearchData',
		method: 'get',
		response: () => {
			return {
				code: 0,
				message: 'ok',
				data
			};
		}
	}
];
