//获取元素 data-index 属性的值
export function getData(el,name,val) {
	const prefix = 'data-'
	name = prefix + name
	if(val){
		return el.setAttribute(name,val)
	}else{
		return el.getAttribute(name)
	}
}