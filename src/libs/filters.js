
//不足10补0
let formatNumber = function (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 格式化时间
let formatTime = data => {
	if(!data){
		return "未知"
	}else{
		let date = new Date(data);
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		let day = date.getDate();
		let hour = date.getHours();
  	let minute = date.getMinutes();
  	let seconds = date.getSeconds();

		return  [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute,seconds].map(formatNumber).join(':')
	}
}

// 格式化时间
let formatTime1 = data => {
	if(!data){
		return ''
	}else{
		let date = new Date(data);
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		let day = date.getDate();
		return  [year, month, day].join('-')
	}
}

let filters = { 
	formatTime,
	formatTime1
}
export default filters
