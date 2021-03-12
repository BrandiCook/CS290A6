// addresses for local testing and testing on the server.
var requestAddr = "http://localhost:9712/";

// Add 
document.getElementById('postAdd').addEventListener('click', function(event){
    if (document.getElementById('workoutName').value != ""){
		document.getElementById('nameError').textContent = "";
		var req = new XMLHttpRequest();
		var payload = {};
		// gets info from the form and adds it to POST
		payload.name = document.getElementById('workoutName').value;
		payload.reps = document.getElementById('workoutReps').value;
		payload.weight = document.getElementById('workoutWeight').value;
		payload.date = document.getElementById('workoutDate').value;
		payload.lbs = document.getElementById('workoutLbs').checked;
		
		req.open('POST', requestAddr + 'insert', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			 if(req.status >= 200 && req.status < 400){
				 var response = JSON.parse(req.response);
				 //console.log(response);
				 
				 buildTable(response);
				 
		} else {
			 console.log("Error in network request: " + request.statusText);
		}
		});
		req.send(JSON.stringify(payload));
		//console.log("sent: " + payload);

		}
		else{
			document.getElementById('nameError').textContent = "Really? Your Exercise has no name?"
		}
		
		event.preventDefault();
});

// Edit 
document.getElementById('submitEditButton').addEventListener('click', function (event){
		if (document.getElementById('workoutName').value != ""){
			document.getElementById('nameError').textContent = "";
			var req = new XMLHttpRequest();
			var payload = {};
			
			//get stuff from the form and add it to the POST.
			payload.id = document.getElementById('workoutId').value;
			payload.name = document.getElementById('workoutName').value;
			payload.reps = document.getElementById('workoutReps').value;
			payload.weight = document.getElementById('workoutWeight').value;
			payload.date = document.getElementById('workoutDate').value;
			payload.lbs = document.getElementById('workoutLbs').checked;
			
			req.open('POST', requestAddr + 'update', true);
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load',function(){
				 if(req.status >= 200 && req.status < 400){
					 var response = JSON.parse(req.response);
					 //console.log(response);
					 
					 // Returns input box to normal 
					// hides Add button, shows SubmitEdit btn
					document.getElementById('postAdd').hidden = false;
					document.getElementById("submitEditButton").hidden = true;
					document.getElementById('workoutForm').textContent = "Add Exercise:";
				 
					 buildTable(response);
					 
			} else {
				 console.log("Error in network request: " + req.statusText);
			}
			});
			req.send(JSON.stringify(payload));
			//console.log("sent: " + payload);
			
		}else{
			document.getElementById('nameError').textContent = "Really? Your Exercise has no name?"

		}
		event.preventDefault();
}
);



// Delete 
function deleteRow(taskNumber){
    var req = new XMLHttpRequest();
	var payload = {};
	payload.id = taskNumber;
	
	req.open('POST', requestAddr + 'delete', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		 if(req.status >= 200 && req.status < 400){
			 var response = JSON.parse(req.response);
			 //console.log(response);
			 
			 buildTable(response);
			 
	} else {
		 console.log("Error in network request: " + request.statusText);
	}
	});
	req.send(JSON.stringify(payload));
	//console.log("sent: " + payload);
	//event.preventDefault();
};


// gets table on page load 
function onPageLoadGet(){
	console.log("body loaded.")
    var req = new XMLHttpRequest();

	req.open('GET', requestAddr + 'getTable', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		 if(req.status >= 200 && req.status < 400){
			 var response = JSON.parse(req.response);
			 //console.log(response);
			 
			 buildTable(response);
			 
	} else {
		 console.log("Error in network request: " + request.statusText);
	}
	});
	req.send(null);
	//event.preventDefault();
}

onPageLoadGet();


// Builds table based on data 
function buildTable(response){
	var table = document.getElementById("workoutTable");
	
	// cleans up old table
	while(table.firstChild){
		table.removeChild(table.firstChild);
	}
	
	console.log(response);
	
	// adds new items to table 
	for(var row = 0; row <= response.length; row++){
		var newTableRow = document.createElement("tr");
		if(row == 0){
				// builds header
				var newHeader1 = document.createElement("th");
				newHeader1.textContent = "Name";
				newTableRow.appendChild(newHeader1);
				
				var newHeader2 = document.createElement("th");
				newHeader2.textContent = "Reps";
				newTableRow.appendChild(newHeader2);
				
				var newHeader3 = document.createElement("th");
				newHeader3.textContent = "Weight";
				newTableRow.appendChild(newHeader3);
				
				var newHeader4 = document.createElement("th");
				newHeader4.textContent = "Date";
				newTableRow.appendChild(newHeader4);
				
				var newHeader5 = document.createElement("th");
				newHeader5.textContent = "lb?";
				newTableRow.appendChild(newHeader5);
		}else{
			// fills body from request -> one row at time
			for(var cell in response[row - 1]){
				if(!response[row - 1].hasOwnProperty(cell)) {
					continue;
				}
				
				// id not added to table, but it's used to keep track 
				if(cell == 'id'){
					newTableRow.name = response[row - 1][cell];
				}else if(cell == 'date'){
					// trims mysql time 
					var newTableCell = document.createElement("td");
					var dateLength = 10;
					var fullDate = response[row - 1][cell];
					
					newTableCell.textContent = fullDate.substring(0, dateLength);
					if(response[row - 1][cell] == null){
						newTableCell.textContent = "NA";
					}
					newTableRow.appendChild(newTableCell);
				}else{
					// all normal cells != ID !=Date 
					var newTableCell = document.createElement("td");
					newTableCell.textContent = response[row - 1][cell];
					if(response[row - 1][cell] == null){
						newTableCell.textContent = "NA";
					}
					newTableRow.appendChild(newTableCell);
				}
				
			}
				// adds DELETE buttons
				var deleteButton = document.createElement('input');
				deleteButton.type = "button";
				deleteButton.value = "Del";
				deleteButton.className = "deleteButton"
				newTableRow.appendChild(deleteButton);
				
				// adds EDIT buttons
				var editButton = document.createElement('input');
				editButton.type = "button";
				editButton.value = "Edit";
				editButton.className = "editButton"
				newTableRow.appendChild(editButton);
		}
		document.getElementById("workoutTable").appendChild(newTableRow);
	}
	
	var deleteButtons = document.getElementsByClassName("deleteButton");
	bindDeleteButtons(deleteButtons);
	
	var editButtons = document.getElementsByClassName("editButton");
	bindEditButtons(editButtons);
}

// binds actions to buttons
function bindDeleteButtons(deleteButton){	
	
	for (var i = 0; i < deleteButton.length; i++) {
		console.log("binding!!!");
		deleteButton[i].addEventListener('click', function (event){
		var req = new XMLHttpRequest();
		var payload = {};

		payload.id = this.parentNode.name;
		req.open('POST', requestAddr + 'delete', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			 if(req.status >= 200 && req.status < 400){
				 var response = JSON.parse(req.response);
				 //console.log(response);
				 
				 buildTable(response);
				 
		} else {
			 console.log("Error in network request: " + request.statusText);
		}
		});
		req.send(JSON.stringify(payload));
		//console.log("sent: " + payload);
		event.preventDefault();
}
);
}
}

// binds actions to buttons
function bindEditButtons(editButton){	
	
	for (var i = 0; i < editButton.length; i++) {
		console.log("binding!!!");
		editButton[i].addEventListener('click', function (event){
			var req = new XMLHttpRequest();
			var payload = {};

			payload.id = this.parentNode.name;
			req.open('POST', requestAddr + 'getId', true);
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load',function(){
				 if(req.status >= 200 && req.status < 400){
					 var response = JSON.parse(req.response);
					 //console.log(response);
					// gets info from form and adds it to POST
					document.getElementById('workoutId').value = response[0].id;
					document.getElementById('workoutForm').textContent = "Edit Exercise:";
					console.log(response);
					document.getElementById('workoutName').value = response[0].name;
					document.getElementById('workoutReps').value = response[0].reps;
					document.getElementById('workoutWeight').value = response[0].weight;
					document.getElementById('workoutLbs').checked = response[0].lbs;
			
					var dateLength = 10;
					var fullDate = response[0].date;
					document.getElementById('workoutDate').value = fullDate.substring(0, dateLength);
					
					// hides Add button, show SubmitEdit button
					document.getElementById('postAdd').hidden = true;
					document.getElementById("submitEditButton").hidden = false;
					
		
				} else {
					 console.log("Error in network request: " + request.statusText);
				}
			});
		req.send(JSON.stringify(payload));
		//console.log("sent: " + payload);
		event.preventDefault();
		}
		);
	}
}