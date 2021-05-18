const dayOfTheWeek = {1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토", 0:"일"};
const member = ["조", "정", "황", "송", "신", "태", "현", "윤", "최", "임"];
const cleanType = {1:["화장실", "1층복도", "건조장", "생활관", "야스"],
				   2:["목욕탕","계단", "야스", "생활관", "나머지"],
				   3:["세면실", "2층복도", "연등실도서관", "생활관", "야스"]};
let cleaning_member = [];
let cleaning_role = {};
const memberbox = document.getElementsByClassName("memberbox");
let givenRoles = {};
//let pos=0;

function printDay()
{
	const clock = document.getElementById("clock");
	let currentDate = new Date();
	clock.innerHTML = `${currentDate.getMonth()+1}월 ${currentDate.getDate()}일 ${dayOfTheWeek[currentDate.getDay()]}요일`;
	//setTimeout("printDay()",1000);
	clock.style.cssText = "";
}

function slide(pos)
{
	const wrap = document.querySelector(".slide");
	const target = wrap.children[0];
	const len = target.children.length;
	const height = target.clientHeight;
	
	target.style.cssText = `height:calc(100% * ${len});transition:0.6s;`;
  	Array.from(target.children).forEach(ele => ele.style.cssText = `height:calc(100% / ${len});`);
	target.style.marginTop = `${-(height / len) * ((pos+1) % len)}px`;
}

function priSlide()
{
	const wrap = document.querySelector(".slide");
	const target = wrap.children[0];
	const len = target.children.length;
	const height = target.clientHeight;
	
	target.style.cssText = `height:calc(100% * ${len});`;
  	Array.from(target.children).forEach(ele => ele.style.cssText = `height:calc(100% / ${len});`);
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

function renewRange(rangeIndex)
{
	rangeTable.rows[rangeIndex].cells[2].children[0].innerText = rangeTable.rows[rangeIndex].cells[1].children[0].value;
	renewWholeRange();
}

function renewWholeRange()
{
	let n = 0;
	for(let i = 0; i < rangeTable.rows.length - 1; i++)
	{
		n += parseInt(rangeTable.rows[i].cells[2].children[0].innerText)
	}
	document.getElementById("whole-range").innerText = "선택한 역할의 수 : " + n;
}

function getTodayType()
{
	const stdDate = new Date("May 10, 2021 00:00");
	const currentDate = new Date();
	const autoCleanType = Math.floor(Math.floor((currentDate - stdDate)/(60*60*1000*24)) / 14) % 3 + 1;
	return autoCleanType;
}

function showMember()
{
	for(let i = 0; i < member.length; i++)
	{
		let member_elem = document.createElement("div");
		member_elem.appendChild(document.createElement("label"));
		member_elem.children[0].innerText = member[i];
		member_elem.setAttribute("class", "member");
		member_elem.setAttribute("id", `member[${i}]`);
		member_elem.setAttribute("onclick", `outToggle(${i});`);
		member_elem.setAttribute("value", "true"); //청소를 하는가?
		memberbox[0].appendChild(member_elem);
	}
}

function outToggle(index)
{
	const selectedMember = memberbox[0].children[index];
	if(selectedMember.getAttribute("value") === "true")
	{
		selectedMember.style.background = "#3DA7F25F";
		selectedMember.children[0].style.color = "373F6A";
		selectedMember.setAttribute("value", "false");
	}
	else
	{
		selectedMember.style.background = "#3DA7F2";
		selectedMember.children[0].style.color = "white";
		selectedMember.setAttribute("value", "true");
	}
	document.getElementById("now-member").innerText = "현재원 : " + getWholeMember();
}

function getWholeMember()
{
	let n = 0;
	for(let i = 0; i < member.length; i++)
	{
		if(memberbox[0].children[i].getAttribute("value") === "true") n+=1;
	}
	return n;
}

function getCleaningMember()
{
	cleaning_member.length = 0;
	const members = memberbox[0].children
	for(let i = 0; i < member.length; i++)
	{
		if(members[i].getAttribute("value") === "true") cleaning_member.push(members[i].innerText);
	}
}

function getCleaningRole()
{
	cleaning_role = {};
	for(let i = 0; i < rangeTable.rows.length - 1; i++)
	{
		cleaning_role[rangeTable.rows[i].cells[0].innerText] = parseInt(rangeTable.rows[i].cells[2].innerText);
	}
}

function isRightNumber(cleaning_member, cleaning_role) //역할 개수가 일치하면 true 반환
{
	let n = 0;
	Object.values(cleaning_role).forEach((elem) => n += elem);
	return n == cleaning_member.length;
}

function giveRoles(cleaning_member, cleaning_role)
{
	const roleArray = Object.keys(cleaning_role);
	let tmp = -1;
	givenRoles = {};
	if(isRightNumber(cleaning_member, cleaning_role))
	{
		for(let i = 0; i < cleaning_member.length; i++)
		{
			while(true)
			{
				tmp = Math.floor(Math.random() * roleArray.length);
				if(cleaning_role[roleArray[tmp]] > 0)
				{
					givenRoles[cleaning_member[i]] = roleArray[tmp];
					cleaning_role[roleArray[tmp]] -= 1;
					break;
				}
			}
		}
		return true;
	}
	else
	{
		alert("역할 개수와 멤버 수가 일치하지 않습니다!");
		return false;
	}
}

function matchStart()
{
	getCleaningMember();
	getCleaningRole();
	let givenRoles = giveRoles(cleaning_member, cleaning_role);
	if(givenRoles == false) return 0;
	slide(1);
}

function showResult(givenRoles)
{
	const resultbox = document.getElementsByClassName("resultbox")[0];
	resultbox.innerText = "";
	resultbox.style.background = "#FFFFFF";
	resultbox.style.color = "#000000";
	for(let i = 0; i < cleaning_member.length; i++)
	{
		resultbox.innerText += `${cleaning_member[i]} : ${givenRoles[cleaning_member[i]]}\n`;
	}
	document.getElementById("done-button").style.display = "block";
}

function done()
{
	const resultbox = document.getElementsByClassName("resultbox")[0];
	resultbox.innerText = "결과를 보시려면 클릭하십시오...";
	resultbox.style.background = "#000000";
	resultbox.style.color = "#FFFFFF";
	document.getElementById("done-button").style.display = "none";
}
