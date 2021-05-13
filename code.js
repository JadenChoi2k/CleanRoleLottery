function printDay() {
	let clock = document.getElementById("clock");
	let currentDate = new Date();
	clock.innerHTML = currentDate.toString();
	setTimeout("printDay()",1000);
}

function slide(pos)
{
	const wrap = document.querySelector(".slide");
	const target = wrap.children[0];
	const len = target.children.length;
	const height = target.clientHeight;
	
	target.style.cssText = `width:calc(100% * ${len});transition:1s;`;
  	Array.from(target.children).forEach(ele => ele.style.cssText = `width:calc(100% / ${len});`);
	
	target.style.marginTop = `${-(pos+1)%len*height}px`;
}

let pos=0;

window.onload = function () { slide() };
