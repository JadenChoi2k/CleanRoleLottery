const dayOfTheWeek = {1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토", 0:"일"};
const member = ["조", "정", "황", "송", "신", "태", "현", "윤", "최", "임"];
const cleanType = {1:["화장실", "1층복도", "건조장", "생활관", "야스"],
				   2:["세면실", "2층복도", "연등실도서관", "생활관", "야스"],
				   3:["???","중앙복도 및 계단", "???", "생활관", "야스"]};
let out_member = [];
let pos=0;

function printDay()
{
	const clock = document.getElementById("clock");
	let currentDate = new Date();
	clock.innerHTML = `${currentDate.getMonth()+1}월 ${currentDate.getDate()}일 ${dayOfTheWeek[currentDate.getDay()]}요일`;
	//setTimeout("printDay()",1000);
	clock.style.cssText = "text-align:center; padding:5% 0; font-size:2em;";
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

function setType()
{
	const range_label = document.getElementsByClassName("range-label");
	let cleaning_type = document.getElementById("cleaning-type").value;
	if (cleaning_type == "auto") cleaning_type = getTodayType();
	for(let i = 0; i < 5; i++)
	{
		range_label[i].innerText = cleanType[cleaning_type][i];
	}
}

function getTodayType()
{
	return "1";
}
