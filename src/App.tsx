import React, {useEffect, useState} from 'react';
import './App.css';
import Person from "./Dto";

function App() {
	
	const [people, setPeople] = useState<Person[]>([]);
	const [searchInput, setSearchInput] = useState<string>("");
	const [pageNr, setPageNr] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const getPeopleUrl = "http://localhost:8080/getpeople";
	
	
	useEffect(() => {
		
		async function getPeople(name: string, page?: number) {
			
			let url: string = getPeopleUrl + "?page=" + page + "&size=5";
			
			if (name) {
				url = url + "&name=" + name;
			}
			
			await fetch(url,
			{
				method: 'GET',
				mode: 'cors',
				cache: 'default',
				credentials: 'same-origin',
				headers: {
					"Accept": "application/json",
				}
			}).then((response: any) => {
				
				if (process.env.NODE_ENV !== "production") {
					console.dir(response);
				}
				
				if (response.status === 200) {
					return response.json();
				} else {
					setPeople([]);
					setTotalPages(1);
				}
				
			}).then((result: any) => {
				
				if (process.env.NODE_ENV !== "production") {
					console.dir(result);
				}
				
				if (result) {
					setPeople(result.content);
					setTotalPages(result.totalPages);
				}
				
			}).catch((error) => {
				console.error(error);
			});
		}
		
		getPeople(searchInput, pageNr);
		
		return () => {
			setPeople([]);
		}
	}, [searchInput, pageNr]);
	
	const onSearchValueChange = (value: string) => {
		
		setSearchInput(value);
		setPageNr(0);
	}
	
	
	return (
		<div className="App">
			<header className="App-header">
				
				<div className={"searchContainer"}>
					
					<label htmlFor="fname">
						Search by name:
					</label>
					<input
						type="text"
						id="fname"
						value={searchInput}
						onChange={(event) => onSearchValueChange(event.target.value)}
					/>
				</div>
				
				<div className={"navigationContainer"}>
					
					{
						pageNr > 0 &&
						<button
							id={"prev"}
							onClick={() => setPageNr(pageNr -1)}
						>
							Prev
						</button>
					}
					
					<span>
						{
							"Page " + (pageNr + 1) + " of " + (totalPages === 0 ? (totalPages + 1) : totalPages)
						}
					</span>
					
					{
						((totalPages > 1) && ((pageNr + 1) < totalPages)) &&
						<button
							id={"next"}
							onClick={() => setPageNr(pageNr + 1)}
						>
							Next
						</button>
					}
				
				</div>
			
			</header>
				
			<div
				className={"list-container"}
			>
				{
					people?.map((person: Person) => {
						return (
							<div
								key={person.id}
								className={"item-container"}
							>
								
								<img src={person.photoUrl} />
								
								<span>
								{
									person.fullName
								}
								</span>
							</div>
						);
					})
				}
			</div>
			
		</div>
	);
}

export default App;
