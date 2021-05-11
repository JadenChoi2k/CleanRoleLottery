function printDay() {
	let clock = document.getElementById("clock");
	let currentDate = new Date();
	clock.innerHTML = currentDate.toString();
	setTimeout("printDay()",1000);
}
