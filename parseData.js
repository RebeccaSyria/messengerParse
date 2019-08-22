const charts = {};

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
	var count = {};
    //for particpant in participants
	for (var i = 0; i < data.participants.length; i++){
        console.log(data.participants);
        var p = data.participants[i].name;
		participants.push(p);
		count[p] = {};
        count[p]["total"] = 0;
        count[p]["totalWords"] = 0;
	}
    //for message in messages
	for (var i = 0; i < data.messages.length;  i++){
		var message = data.messages[i];
		var content = message.content;
		if( !content.includes("Say hi to your new Facebook friend, ")){
            var time = new Date(message["timestamp_ms"])
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(0);
            time.setMilliseconds(0);

            if( !count[message["sender_name"]][time]) {
                count[message["sender_name"]][time] = 1
            } else {
                count[message["sender_name"]][time] += 1
            }
            count[message["sender_name"]]["total"] += 1;
			count[message["sender_name"]]["totalWords"] += content.split(" ").length;
		}
	}
	console.log(count)

    totalMessagesByParticipant = [];
    totalWordsByParticipant = [];
    for (var p in participants) {
        totalMessagesByParticipant.push(count[participants[p]]["total"]);
        totalWordsByParticipant.push(count[participants[p]]["totalWords"]);
    }
    makeBarGraph("totalMessages", participants, totalMessagesByParticipant, "Total Messages");
    makeBarGraph("totalWords", participants, totalWordsByParticipant, "Total Words");
}

function makeBarGraph(canvasId, labels, data, dataLabel){
    console.log(canvasId);
    var canvas = document.getElementById(canvasId);
	var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    if( charts[canvasId] ) {
        charts[canvasId].destroy();
    }
    charts[canvasId] = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
                label: dataLabel,
				data: data,
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


window.onload = function(){
	document.getElementById('file-input').addEventListener('change',readFile,false);
}
