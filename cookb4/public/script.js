const baseUrl = "http://flip3.engr.oregonstate.edu:9286/";

let add_exercise = document.querySelector(".addExerciseForm");

// init
let request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    console.log("Request is ready.");
    let response = request.responseText;
	console.log("RESPONSE: ",response);
	make_table(JSON.parse(response));
  }
};
request.open('GET', baseUrl);
request.send(null);


// makes table based on info
function make_table(table_data){
	// writes table 
	let table = document.querySelector(".tableBody");
	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}
	for (let ind = 0; ind < table_data.results.length; ind++){
		let new_row = document.createElement("tr");
		let curr_row = table_data.results[ind]
		let row_data = [curr_row.name, curr_row.weight, curr_row.reps, curr_row.unit, curr_row.date, 'Update', 'Delete'];

		for (let col_data of row_data){
			let new_col = document.createElement("td");
			if (col_data == 'Update' || col_data == 'Delete'){
				let col_button = document.createElement("button");
				col_button.textContent = col_data;
				col_button.setAttribute("id", `${curr_row.id}`);
				new_col.appendChild(col_button);

				if (col_data == "Delete"){
					new_col.addEventListener("click", delete_request);
				}
				if (col_data == "Update"){
					new_col.addEventListener("click", update_request, {once:true});
				}
			}
			else{
				new_col.textContent = col_data;
			}
			new_row.appendChild(new_col);
		}
		table.appendChild(new_row);
	}
}

function delete_request(event){
	event.preventDefault();
	console.log("DELETE A ROW REQUEST");
	let button = event.target;
	console.log("CLICKED BUTTON LOG: ", button);
	let button_id = button.id;
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    console.log("Request ready.");
	    let response = request.responseText;
		console.log("RESPONSE: ",response);
		// re-writes table
		make_table(JSON.parse(response));
	  }
	};
	document.querySelector(".blankFieldMessage").textContent = "DELETED WORKOUT FROM LOG";
	request.open('POST', baseUrl);
	let data = {delete_id:button_id};
	data.requestType = 'delete';
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data));
}

function update_request(event){
	event.preventDefault();
	console.log("TRYING TO UPDATE A ROW");
	let table = document.querySelector(".tableBody");
	let button = event.target;
	console.log("JUST CLICKED BUTTON: ", button);
	let button_id = button.id;
	let table_headers = document.querySelector(".tableHeaders");
	console.log("REMOVING DELETE HEADER FROM: ", table_headers);
	console.log("REMOVING THIS HEADER: ", document.querySelector(".deleteHeader"));
	// removes delete from table headers
	// cant so gave lastChild a class
		let delete_header = document.querySelector(".deleteHeader");
		table_headers.removeChild(delete_header);
		console.log("REMOVED DELETE HEADER: ", table_headers);

	// update user specified row
		let keep_row = button.parentElement.parentElement;
		console.log("TRYING TO UPDATE THIS ROW: ", keep_row);

	// deletes table except for exercise to update
		console.log("THESE ARE THE ROWS WERE WORKING WITH: ", table.childNodes);

	// redraws table with only value to update
		while (table.firstChild) {table.removeChild(table.firstChild)};

	// removes delete option from row to update
		keep_row.removeChild(keep_row.lastChild);

	// updates Workout Log to show Updating Workout
		let descriptor = document.querySelector(".logUpdate");
		descriptor.textContent = "Updating Workout";

	// changes items of keep_row to text boxes -> editable
		let col_data = keep_row.children;
		let updateForm = document.createElement("form");
		let name_text = document.createElement("input");
		name_text.setAttribute("type", "text");
		name_text.setAttribute("name", "name");
		name_text.setAttribute("value", `${col_data[0].textContent}`);
		col_data[0].textContent = "";
		let reps_text = document.createElement("input");
		reps_text.setAttribute("type", "text");
		reps_text.setAttribute("name", "reps");
		reps_text.setAttribute("value", `${col_data[1].textContent}`);
		col_data[1].textContent = "";
		let weight_text = document.createElement("input");
		weight_text.setAttribute("type", "text");
		weight_text.setAttribute("name", "weight");
		weight_text.setAttribute("value", `${col_data[2].textContent}`);
		col_data[2].textContent = "";
		let lbs_radio = document.createElement("input");
		lbs_radio.setAttribute("type", "radio");
		lbs_radio.setAttribute("name", "unit");
		lbs_radio.setAttribute("id", "lbs");
		lbs_radio.setAttribute("value", "0");
		let lbs_label = document.createElement("label");
		lbs_label.for = "lbs";
		lbs_label.textContent = "lbs";
		let kgs_radio = document.createElement("input");
		kgs_radio.setAttribute("type", "radio");
		kgs_radio.setAttribute("name", "unit");
		kgs_radio.setAttribute("id", "kgs");
		kgs_radio.setAttribute("value", "1");
		let kgs_label = document.createElement("label");
		kgs_label.for = "kgs";
		kgs_label.textContent = "kgs";
		col_data[3].textContent = "";

		// already selected radio button can be seen
			if (col_data[3].textContent == "0") {lbs_radio.checked = true}
			else {kgs_radio.checked = true}

		let date_text = document.createElement("input");
		date_text.setAttribute("type", "date");
		date_text.setAttribute("name", "date");
		date_text.setAttribute("value", `${col_data[4].textContent}`);
		col_data[4].textContent = "";

	// appends inputs into TD elements
		col_data[0].appendChild(name_text);
		col_data[1].appendChild(weight_text);
		col_data[2].appendChild(reps_text);
		col_data[3].appendChild(lbs_radio);
		col_data[3].appendChild(lbs_label);
		col_data[3].appendChild(kgs_radio);
		col_data[3].appendChild(kgs_label);
		col_data[4].appendChild(date_text);

	// appends table to form
		let update_form = document.createElement("form");
		update_form.className = "updateForm";
		update_form.appendChild(document.querySelector(".entireTable"));

	// appends updated keep_row to table
		table.appendChild(keep_row);

	// appends finalized form to page
		document.body.appendChild(update_form);

		button.removeEventListener("click", update_request);

	// now makes submit update event
		button.addEventListener("click", event=>{

			event.preventDefault();

			// sends request with update
				const data = new FormData(update_form);

			// turns form into JSON object
				let formJSON = Object.fromEntries(data.entries());
				formJSON.requestType = 'update';
				formJSON.update_id = `${button_id}`;
				let formSTRINGIFY = JSON.stringify(formJSON);
				console.log("TRYING TO SEND REQUEST WITH REQUEST TYPE: ", formSTRINGIFY);

			let request = new XMLHttpRequest();
			request.onreadystatechange = function() {
			  if (this.readyState == 4 && this.status == 200) {
			    console.log("Request is ready.");
			    let response = request.responseText;
				console.log("UPDATE RESPONSE: ",response);
				// re-writes table after updated table is done
				table_headers.appendChild(delete_header); // reappends delete header to redraw table
				make_table(JSON.parse(response));
			  }
			};
			document.querySelector(".blankFieldMessage").textContent = "UPDATING WORKOUT";
			request.open('POST', baseUrl);
			request.setRequestHeader("Content-type", "application/json");
			request.send(formSTRINGIFY);
		})
}

add_exercise.addEventListener("submit", event=>{
	event.preventDefault();

	// grabs info from add exercise 	
	const data = new FormData(event.target);

	// turns form into JSON
	let formJSON = Object.fromEntries(data.entries());
	formJSON.requestType = 'insert';
	let formSTRINGIFY = JSON.stringify(formJSON);
	console.log("TRYING TO SEND REQUEST WITH REQUEST TYPE: ", formSTRINGIFY);

	if (formJSON.name && formJSON.reps && formJSON.weight && formJSON.unit && formJSON.date){
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
		    console.log("Request is ready.");
		    let response = request.responseText;
			console.log("RESPONSE: ",response);
			// re-writes table once updated table done
			make_table(JSON.parse(response));
		  }
		};
		document.querySelector(".blankFieldMessage").textContent = "ADDED WORKOUT TO LOG";
		request.open('POST', baseUrl);
		request.setRequestHeader("Content-type", "application/json");
		request.send(formSTRINGIFY);
		add_exercise.reset();
	}
	else{
		document.querySelector(".blankFieldMessage").textContent = "ENTRY NEEDS TO BE COMPLETE";
	};
})