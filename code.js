const dayOfTheWeek = {1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토", 0:"일"};
const member = ["조", "정", "황", "송", "신", "태", "현", "윤", "최", "임"];
const cleanType = {1:["화장실", "1층복도", "건조장", "생활관", "야스"],
				   2:["목욕탕","중앙복도 및 계단", "야스", "생활관", "나머지"],
				   3:["세면실", "2층복도", "연등실도서관", "생활관", "야스"]};
let cleaning_member = [];
let cleaning_role = {};
//const memberbox = document.getElementsByClassName("memberbox");
const memberbox = $('.memberbox');
let givenRoles = {};
//let pos=0;
const rangeTable = $(".rangebox table");

function printDay()
{
	const clock = $("#clock");
	let currentDate = new Date();
	clock.text(`${currentDate.getMonth()+1}월 ${currentDate.getDate()}일 ${dayOfTheWeek[currentDate.getDay()]}요일`);
}

function slide(pos)
{
	const wrap = $(".slide");
	const target = wrap.children('ul');
	const len = target.children().length;
	const height = target.height();
	
	target.css('height', `calc(100% * ${len})`);
	target.css('transition', '0.6s');
	target.children().css('height', `calc(100% / ${len})`);
  	//Array.from(target.children()).forEach(elem => elem.css('height', `calc(100% / ${len})`));
	target.css('margin-top', `${-(height / len) * ((pos+1) % len)}px`);
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
	const range_label = $('.range-label');
	let cleaning_type = $('#cleaning-type option:selected').val();
	if (cleaning_type === "auto") cleaning_type = getTodayType();
	range_label.each(function(idx, obj) {obj.innerText = cleanType[cleaning_type][idx]});
}

$(document).ready(function(){ //range-num 값 갱신
	$(".rangebox table").find("input[type='range']").change(
		function (e) 
		{
			const preVal = parseInt($(this).closest('tr').find('.range-num').text()); //이전값
			const nowVal = parseInt(this.value); //현재값
			const diff = nowVal - preVal; //변화값
			$(this).closest('tr').find('.range-num label').text(this.value);
			if(!$("#whole-range").data('wholeNum')) //만약 정의되어있지 않다면
			{
				let n = 0;
				$(".rangebox table").find('.range-num').each(function(idx, obj){n += parseInt($(obj).text())});
				$("#whole-range").data('wholeNum', n);
			}
			else
			{
				$("#whole-range").data('wholeNum', $("#whole-range").data('wholeNum') + diff);
			}
			$("#whole-range").text("선택한 역할의 수 : " + $("#whole-range").data('wholeNum'));
		}
	);
})

function getTodayType()
{
	const stdDate = new Date("May 10, 2021 00:00");
	const currentDate = new Date();
	const autoCleanType = Math.floor(Math.floor((currentDate - stdDate)/(60*60*1000*24)) / 14) % 3 + 1;
	return autoCleanType;
}

function setMember()
{
	for(let i = 0; i < member.length; i++)
	{
		let mem = $(`<div class='member' id='member[${i}]'><label>${member[i]}</label></div>`);
		mem.data('joined', true);
		mem.appendTo('.memberbox');
	}
}

$(document).ready(function(){ //memBtn 구현
	$('.member').click(function(e) {
		const preNum = $("#now-member").data('memNum');
		if(!preNum)
		{
			let n = 0;
			$(".member").each(function(idx, obj){if($(obj).data('joined')) n += 1 })
			$("#now-member").data('memNum', n); //정의되어 있지 않다면
		}
		if($(this).data('joined'))
		{
			$(this).css('background', '#3DA7F25F');
			$(this).css('color', '373F6A');
			$(this).data('joined', false);
			$("#now-member").data('memNum', $("#now-member").data('memNum') - 1);
		}
		else
		{
			$(this).css('background', '#3DA7F2');
			$(this).css('color', 'white');
			$(this).data('joined', true);
			$("#now-member").data('memNum', $("#now-member").data('memNum') + 1);
		}
		
		$("#now-member").text("현재원 : " + $("#now-member").data('memNum'));
	})
})

function getCleaningMember()
{
	cleaning_member.length = 0;
	const members = $(".member");
	$(".member").each(function(idx, obj) {
		if($(obj).data('joined')) cleaning_member.push($(obj).text())
	})
}

function getCleaningRole()
{
	cleaning_role = {};
	$(".rangebox table .range-role-row").each(function(idx, obj){
		cleaning_role[$(obj).find(".range-label").text()] = 
			parseInt($(obj).find(".range-num").text());
	})
}

function isRightNumber(cleaning_member, cleaning_role) //현재원과 역할 개수가 일치하면 true 반환
{
	return $("#whole-range").data('wholeNum') == $("#now-member").data('memNum');
}

function giveRoles()
{
	const roleArray = Object.keys(cleaning_role);
	let tmp = -1;
	givenRoles = {};
	roleArray.forEach((elem) => givenRoles[elem] = []);
	
	//멤버 배열 섞기
	for(let i = 0; i <= Math.floor(Math.random() * cleaning_member.length); i++)
	{
		let idx1 = Math.floor(Math.random() * cleaning_member.length);
		let idx2 = Math.floor(Math.random() * cleaning_member.length);
		while(idx1 == idx2)
			idx2 = Math.floor(Math.random() * cleaning_member.length);
		swapMember(idx1, idx2);
	}
	
	//멤버에게 역할 부여하기
	if(isRightNumber(cleaning_member, cleaning_role))
	{
		for(let i = 0; i < cleaning_member.length; i++)
		{
			while(true)
			{
				tmp = Math.floor(Math.random() * roleArray.length);
				if(cleaning_role[roleArray[tmp]] > 0)
				{
					givenRoles[roleArray[tmp]].push(cleaning_member[i]);
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

function swapMember(idx1, idx2)
{
	let _tmp = cleaning_member[idx1];
	cleaning_member[idx1] = cleaning_member[idx2];
	cleaning_member[idx2] = _tmp;
}

function match()
{
	getCleaningMember();
	getCleaningRole();
	let givenRoles = giveRoles(cleaning_member, cleaning_role);
	if(givenRoles == false) return 0;
	slide(1);
}


function showResult(givenRoles)
{
	if($(".resultbox").data("opened") == true) return;
	$(".resultbox").data("opend", true);
	const resultbox = $(".resultbox");
	resultbox.children("label").text("");
	resultbox.css("background", "white");
	resultbox.css("color", "black");
	//for(let i = 0; i < cleaning_member.length; i++)
	//{
	//	resultbox.text(resultbox.text() + `${cleaning_member[i]} : ${givenRoles[cleaning_member[i]]}\n`);
	//}
	$("#done-button").css("display", "block");
	$(".result-table").css("display", "block");
	
	const roleArray = Object.keys(cleaning_role);
	$(".result-table .clean-role-col").each(function(idx, obj){
		obj.innerText = roleArray[idx];
	})
	
	$(".clean-result-row").each(function(idx, obj){
		let role_mem = givenRoles[$(obj).children(".clean-role-col").text()]
		$(obj).children(".clean-mem-col").each(function(_idx, _obj){
			if(role_mem[_idx]) $("<div><label>"+role_mem[_idx]+"</label></div>").appendTo($(_obj));
		})
	})
}

function done()
{
	const resultbox = $(".resultbox");
	resultbox.children("label").text("결과를 보시려면 누르십시오...");
	resultbox.css("background", "black");
	resultbox.css("color", "white");
	$("#done-button").css("display", "none");
	$(".result-table").css("display", "none");
	$(".resultbox").data("opend", false);
	
	$(".clean-result-row").each(function(idx, obj){ // 테이블 초기화
		let role_mem = givenRoles[$(obj).children(".clean-role-col").text()]
		$(obj).children(".clean-mem-col").each(function(_idx, _obj){
			$(_obj).text("");
		})
	})
}
