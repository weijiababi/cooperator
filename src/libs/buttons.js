
function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
 }

export const detailButton = (vm, h, currentRow, index, on_click) => {
	return h('Button', {
					 props: {
							 type: 'primary',
					 },
					 style: {
							 margin: '5px 5px'
					 },
					 on: {
							 click: (event) => {
									if (isFunction(on_click)) {
										on_click(currentRow);
									}
							 }
					 }
					 
			 }, '查看详情'); 
};

export const editButton = (vm, h, currentRow, index, on_click) => {
	return h('Button', {
					 props: {
							 type: 'primary',
					 },
					 style: {
							 margin: '5px 5px'
					 },
					 on: {
							 click: (event) => {
									if (isFunction(on_click)) {
										on_click(currentRow);
									}
							 }
					 }
					 
			 }, '编辑'); 
};
export const deleteButton = (vm, h, currentRow, index, on_delete) => {
	return h('Poptip', {
			props: {
					confirm: true,
					title: '您确定要删除这条数据吗?',
					transfer: true
			},
			on: {
					'on-ok': () => {
							on_delete(currentRow)
					}
			}
	}, [
			h('Button', {
					style: {
							margin: '0 5px'
					},
					props: {
							type: 'error',
						 
					}
			}, '删除')
	]);
};



