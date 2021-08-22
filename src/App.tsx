import React, {useEffect, useState} from 'react';
import './App.css';
import Person from "./Dto";

function App() {
	
	const [people, setPeople] = useState<Person[]>([]);
	const [searchInput, setSearchInput] = useState<string>("");
	const [pageNr, setPageNr] = useState<number>(1);
	const getPeopleUrl = "http://localhost:8080/getpeople";
	
	
	useEffect(() => {
		
		async function getPeople(name: string, page?: number) {
			
			let url: string = getPeopleUrl + "?page=" + page + "&size=10";
			
			if (name) {
				url = url + "?name=" + name;
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
				
				return response.json();
				
			}).then((result: any) => {
				
				if (process.env.NODE_ENV !== "production") {
					console.dir(result);
				}
				
				setPeople(result.content);
				
			}).catch((error) => {
				console.error(error);
			});
		}
		
		getPeople(searchInput, pageNr);
		
		return () => {
			setPeople([]);
		}
	}, [searchInput]);
	
	
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
						onChange={(event) => setSearchInput(event.target.value)}
					/>
				</div>
				
				<div
					className={"listContainer"}
				>
					{
						people?.map((person: Person) => {
							return (
								<div>
									{
										person.fullName
									}
								</div>
							);
						})
					}
				</div>
			
			</header>
		</div>
	);
}

export default App;
