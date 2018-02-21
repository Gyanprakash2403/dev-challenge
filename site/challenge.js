(function(global) {
	// body...

	const url = "ws://localhost:8011/stomp";
	const client = Stomp.client(url);
	var sparkLineArray = [];
	_delay = 0;
	// check connection	
	client.connect({}, connectCallback, function(error) {
  		console.log(error.headers.message)
	});

	//check if connected subscibe the client for bestPrice;
	function connectCallback(){
		console.log('connected');		
		var subscription = client.subscribe("/fx/prices", 
			 function( message ) {
                onCallBack(message)
             }
		);
	}

	//set heartbeat
	client.ws.onopen = function(heartbeat){
		heartbeat = {outgoing: 10000, incoming: 30000};
		var headers =[];
		client.debug('Web Socket Opened...');
            headers['accept-version'] = Stomp.VERSIONS.supportedVersions();
            // Check if we already have heart-beat in headers before adding them
            if (!headers['heart-beat']) {
            	client.heartbeat = heartbeat; 
            }
            client._transmit('CONNECT', headers);
	}


	//call back server response
	function onCallBack(message){		
		if(message.body){
			console.log('receiving data',message.body);	
			var data = message.body
			whenMassegeResieved(JSON.parse(data));	
		}else{
			console.log('message contain no data');
		}		
	}

	//when message resived 
	function whenMassegeResieved(data){		
		var table = document.getElementById('price_table');		
		var dataArray = [];
		dataArray.push(data);		
		drawSparkline(dataArray[0].bestBid, dataArray[0].bestAsk);
		appendTableRow(dataArray[0],table);	
	}

	//draw sparkline and shift 
	function drawSparkline(bBid,bAsk){
		//midprice calculated by adding the bestBid and bestAsk fields together and dividing by 2
		var midPrice = (bBid + bAsk) / 2;
		sparkLineArray.push(midPrice);	
		if(sparkLineArray.length > 10){
			sparkLineArray.shift();
		}		
		const exampleSparkline = document.getElementById('example-sparkline')
		const sparkline = new Sparkline(exampleSparkline);
    	sparkline.draw(sparkLineArray);		
	}


	//create table row and append data to the table
	function appendTableRow(feed,target){
		//copy feed to an array named data
		var data = [];
		data.push(feed);

		//check table lenght if its grater than 10  remove the last row;
		var rowLength = target.getElementsByTagName("tr").length
		if( rowLength > 10){
			target.deleteRow(rowLength - 1);
		}
		var rowCount = target.rows.length - (target.rows.length - 1);	
		var row = target.insertRow(rowCount);
		
		//cell for lastChangeBid
		var cell1 = row.insertCell(0);
		var td1 = document.createElement("td")
		td1.innerText = data[0].lastChangeBid;
		cell1.appendChild(td1);

		//cell for lastChangeAsk
		var cell2 = row.insertCell(0);
		var td2= document.createElement("td")
		td2.innerText = data[0].lastChangeAsk;
		cell2.appendChild(td2);

		//cell for lastChangeAsk
		var cell3 = row.insertCell(0);
		var td3 = document.createElement("td")
		td3.innerText = data[0].lastChangeAsk;
		cell3.appendChild(td3);

		//cell for openBid
		var cell4 = row.insertCell(0);
		var td4 = document.createElement("td")
		td4.innerText = data[0].openBid;
		cell4.appendChild(td4);

		//cell for bestAsk
		var cell5 = row.insertCell(0);
		var td5 = document.createElement("td")
		td5.innerText = data[0].bestAsk;
		cell5.appendChild(td5);

		//cell for bestBid
		var cell6 = row.insertCell(0);
		var td6 = document.createElement("td")
		td6.innerText = data[0].bestBid;
		cell6.appendChild(td6);

		//cell for name
		var cell7 = row.insertCell(0);
		var td7 = document.createElement("td")
		td7.innerText = data[0].name;
		cell7.appendChild(td7);

	}



}());