function makechess(num) {
	let start = 0
	str1 = ''
	str2 = ''
	while(start<num) {
		if (start%2 ==0) {
			str1 = str1 + '#'
			str2 = str2 + ' '
		} else {
			str1 = str1 + ' '
			str2 = str2 + '#'
		}
		start += 1
	}
	for (let i=0; i<num; i++) {
		if (i%2==0){
			console.log(str1)
		} else {
			console.log(str2)
		}
	}
}
makechess(5)
