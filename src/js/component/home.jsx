import React, {useEffect, useState} from "react";

const Home = () => {
	let [listItems, setListItems] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const url= "https://playground.4geeks.com/apis/fake/todos/user/pedro";

	useEffect(() => {
		if (getTasks() == "404"){
			createTodos();
		};
	}, []);

 	useEffect(() => {
		updateTasks();
		if (listItems.length===0 && inputValue===""){
			alert("No tasks, add a task");}
	}, [listItems]);

	//cargar la lista
	async function getTasks(){	
		let response = await fetch (url);
		verifyResp(response);
		if (!response.ok){
			console.log(`Error al cargar: ${response.status} - ${response.statusText}`);
			return response.status;
		}
		let data = await response.json();
		setListItems(data);
		console.log(listItems);
	}

	//crear lista si no hay elementos
	async function createTodos(){
		let respo = await fetch(url, {
			method: "POST",
			body: JSON.stringify([]),
			headers: {"Content-Type": "application/json"}
		})
		if (!respo.ok){
			console.log(`Error al crear: ${respo.status} - ${respo.statusText}`);
			return
		}
	}

	//actualizar lista
	async function updateTasks(){
		let resp = await fetch(url, {
			method: "PUT",
			body: JSON.stringify(listItems),
			headers: {"Content-Type": "application/json"}
		})
		if (!resp.ok){
			if (resp.status == "404"){
				createTodos();
			} else {
				console.log(`Error al actualizar: ${resp.status} - ${resp.statusText}`);
				return
			}
		}
	}

	//borrar todos
	async function deleteTasks(){
		let resp = await fetch(url, {
			method: "DELETE",
			headers: {"Content-Type": "application/json"}
		})
		if (!resp.ok){
			console.log(`Error al borrar: ${resp.status} - ${resp.statusText}`);
			return
		}
		setListItems([]);
	}

	//validar Enter
	const validateInput = (e) => {
		if(e.key === 'Enter'){
			if (inputValue === ""){
				alert("The input cannot be empty");
			} else {
				setListItems([...listItems, {"label":inputValue, "done": false}]);
				setInputValue("");
			}
		}
	};

	//borrar elemento
	const deleteItem = (ind) => {
		const newArray = [...listItems];
		newArray.splice(ind, 1);
		setListItems(newArray);
		if (newArray.length==0) deleteTasks();
	}

	return (
		<div className="container m-5">
			<input type="text" onChange={e => 
					setInputValue(e.target.value)
					}
					onKeyUp={validateInput}
					value={inputValue} className="form-control" 
					placeholder="What needs to be done?"
			/>
			<ul className="list-group">
				{
					listItems.map((item, i) =>
					<li key={i} className="list-group-item d-flex flex-row">
						{item.label}
						<i className="closed fa-solid fa-xmark"
							onClick={() => deleteItem(i)}>
						</i>
					</li>)
				}
			</ul>
			<div className="text-center">
				<a href="#" className="btn btn-success m-3" onClick={deleteTasks}>
					Clean all tasks
				</a>
			</div>
		</div>
	);
};

export default Home;
