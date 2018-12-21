function readFile(e) {
	var file = e.target.files[0];
	console.log(file)
	if(!file){
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e){
		var contents = e.target.result;
		parseJson(contents);
	};
	reader.readAsText(file);
}

function parseJson(contents){
	try {
		var data = JSON.parse(contents);
	}
	catch(err){
		alert("Invalid File \nError: " +err + "\nPlease select a valid Messenger JSON file");
	}
	console.log(data);
	parseData(data);
}

function parseData(data){
	var participants = [];	
	var count = [];
	for (var i = 0; i < data.participants.length; i++){
		participants.push(data.participants[i].name);
		count.push(0);
	}
	for (var i = 0; i < data.messages.length;  i++){
		var message = data.messages[i];
		var content = message.content;
		if( !content.includes("Say hi to your new Facebook friend, ")){
			idx = participants.indexOf(message.sender_name);
			count[idx] += content.split(" ").length;
		}
	}
	console.log(count)
	var ctx = document.getElementById('myChart').getContext('2d');
	var barChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: participants,
			datasets: [{
				data: count,
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}],
				xAxes: [{
					ticks: {
						autoSkip: false
					}
				}]
			}
		}
	})

}

function displayContents(contents){
	var element = document.getElementById('file-contents');
	element.textContent = contents;
}

window.onload = function(){
	document.getElementById('file-input').addEventListener('change',readFile,false);
}
