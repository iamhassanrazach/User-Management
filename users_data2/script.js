import { fetchData } from "./fetch.js"

const localUrl = "../mock_data/response.json"

const spinner = document.getElementById("spinner")
const alert = document.getElementById("alert")
let users = []

const loadData = async () => {
	spinner.classList.remove("d-none")

	try {
		console.log("Fetching data...")
		const data = await fetchData(localUrl)
		if (data) {
			spinner.classList.add("d-none")
			users = data.data // set the users variable
			displayUsers(users) // pass users to displayUsers
		}
	} catch (error) {
		console.error("Failed to load data:", error.message)
		spinner.classList.add("d-none")
		alert.classList.remove("d-none")
		alert.classList.add("alert-danger")
		alert.innerHTML = `Failed to load data: ${error.message}`
	}
}
const displayUsers = (localUsers) => {
	if (!localUsers|| localUsers.length === 0) {
		alert.classList.remove("d-none")
		alert.classList.add("alert-danger")
		alert.innerHTML = "No users found."
		return
	}
 

	localUsers.forEach((user) => {
		const usersContainer = document.getElementById("users-container")
		usersContainer.innerHTML += `
		<article class="card">
				<div class="card-image">
					<img src="${user.avatar_url}" alt="${user.name}" class="card-img-top" />
					<span class="card-title">${user.name}</span>
				</div>

				<div class="card-content">
					<ul class="list-group">
						<li class="list-group-item"><strong>Name:</strong>${user.name}</li>
						<li class="list-group-item"><strong>Age:</strong>${user.age}</li>
                        <li class="list-group-item">
	<strong>Email:</strong> ${user.email}
</li>
						<li class="list-group-item">
							<strong>Gender:</strong> ${user.gender}
						</li>
					</ul>
				</div>
			</article>
`
	})
}
loadData()