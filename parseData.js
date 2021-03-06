const charts = {};

function readFile(e) {
	var file = e.target.files[0];
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
	parseData(data);
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function parseData(data){
	var participants = [];
	var count = {};
    //for particpant in participants
	for (var i = 0; i < data.participants.length; i++){

        var p = data.participants[i].name;
		participants.push(p);
		count[p] = {};
        count[p]["total"] = 0;
        count[p]["totalWords"] = 0;
	}
    var months = [];
    var totalMessagesByMonth = [];
    var messagesByHour = new Array(24).fill(0);
    //for message in messages
	for (var i = 0; i < data.messages.length;  i++){
		var message = data.messages[i];
		var content = message.content;


		if( content && !content.includes("Say hi to your new Facebook friend, ")){
            var time = new Date(message["timestamp_ms"])
            time.setDate(0);
            messagesByHour[time.getHours()] += 1;
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(0);
            time.setMilliseconds(0);
            //console.log(time.toLocaleDateString())
            var monthString = (time.getMonth()+1) + " - " + time.getFullYear();
            if(!months.includes(monthString)) {
                months.unshift(monthString);
                totalMessagesByMonth.unshift(0);
            }
            totalMessagesByMonth[months.indexOf(monthString)] += 1;
            if(!participants.includes(message["sender_name"])) {
                participants.push(message["sender_name"]);
        		count[message["sender_name"]] = {};
                count[message["sender_name"]]["total"] = 0;
                count[message["sender_name"]]["totalWords"] = 0;
            }
            if( !count[message["sender_name"]][time]) {
                count[message["sender_name"]][time] = 1
            } else {
                count[message["sender_name"]][time] += 1
            }
            count[message["sender_name"]]["total"] += 1;
			count[message["sender_name"]]["totalWords"] += content.split(" ").length;
		}
	}
    totalMessagesByParticipant = [];
    totalWordsByParticipant = [];

    for (var p in participants) {
        totalMessagesByParticipant.push(count[participants[p]]["total"]);
        totalWordsByParticipant.push(count[participants[p]]["totalWords"]);
    }

    makeBarGraph("totalMessages", participants, totalMessagesByParticipant, "Total Messages");
    makeBarGraph("totalWords", participants, totalWordsByParticipant, "Total Words");

    makeLineChart("byMonth", months, totalMessagesByMonth, "Messages")
    makeLineChart("byHour", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], messagesByHour, " Total Messages sent during the hour");
}

function destroyChart(canvasId) {
    if( charts[canvasId] ) {
        charts[canvasId].destroy();
    }
}

function makeLineChart(canvasId, labels, data, dataLabel){
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    destroyChart(canvasId);

    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: dataLabel,
                data: data,
                backgroundColor: getRandomColor()
            }]
        }
    })

}
function makeBarGraph(canvasId, labels, data, dataLabel){
    var canvas = document.getElementById(canvasId);
	var ctx = canvas.getContext('2d');
    destroyChart(canvasId);
    var colorArray = [];
    data.forEach(() => {
        colorArray.push(getRandomColor());
    })
    charts[canvasId] = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				data: data,
                backgroundColor: colorArray
			}]
		},
		options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: dataLabel
            },
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
