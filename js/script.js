import { fetchData } from "./utils/fetchData.js";
import { formFactory } from "./utils/formFactory.js";
import { putData } from "./utils/putData.js";

const remoteUrl = "https://easy-simple-users-rest-api.onrender.com/api/users";
const spinner = document.querySelector(".spinner-border");
const alert = document.querySelector(".alert");
let users = [];

// Display all user cards
const displayUsers = (localUsers) => {
  const usersContainer = document.getElementById("users-container");
  usersContainer.innerHTML = "";

  localUsers.forEach((user) => {
    const cardHTML = `
      <article class="card pb-3 m-2">
        <div class="card-image p-3">
          <img src="${user.avatar_url}" alt="${user.name}" height="254px"
               class="card-img-top object-fit-contain" />
          <span class="card-title">${user.name}</span>
        </div>
        <div class="card-content">
          <ul class="list-group">
            <li class="list-group-item"><strong>Name:</strong> ${user.name}</li>
            <li class="list-group-item"><strong>Age:</strong> ${user.age}</li>
            <li class="list-group-item"><strong>Gender:</strong> ${user.gender}</li>
          </ul>
          <button 
            data-user-id="${user.id}"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            class="edit-btn btn btn-secondary m-2">
            Edit
          </button>
        </div>
      </article>
    `;
    usersContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
};

// Update one card after PUT
const updateCard = (user) => {
  const allCards = document.querySelectorAll(".card");
  const foundCard = Array.from(allCards).find(
    (card) =>
      card.querySelector(".edit-btn").getAttribute("data-user-id") ===
      String(user.id)
  );

  if (!foundCard) return console.warn("Card not found for user:", user);

  foundCard.innerHTML = `
    <div class="card-image p-3">
      <img src="${user.avatar_url}" alt="${user.name}" height="254px"
           class="card-img-top object-fit-contain" />
      <span class="card-title">${user.name}</span>
    </div>
    <div class="card-content">
      <ul class="list-group">
        <li class="list-group-item"><strong>Name:</strong> ${user.name}</li>
        <li class="list-group-item"><strong>Age:</strong> ${user.age}</li>
        <li class="list-group-item"><strong>Gender:</strong> ${user.gender}</li>
      </ul>
      <button 
        data-user-id="${user.id}"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        class="edit-btn btn btn-secondary m-2">
        Edit
      </button>
    </div>
  `;
};

// Fill form with selected user's data
const getModalForm = (foundUser) => {
  const modalForm = document.querySelector(".modal-body form");
  modalForm.userName.value = foundUser.name;
  modalForm.userAge.value = foundUser.age;
  modalForm.userImage.value = foundUser.avatar_url;
  modalForm.userGender.value = foundUser.gender;

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.setAttribute("data-user-id", foundUser.id);
};

// Handle save changes
const setupSubmitHandler = () => {
  const submitBtn = document.querySelector(".submit-btn");

  submitBtn.addEventListener("click", async () => {
    const userId = submitBtn.getAttribute("data-user-id");

    const dataToSend = {
      id: userId,
      name: document.querySelector("#userName").value,
      age: document.querySelector("#userAge").value,
      avatar_url: document.querySelector("#userImage").value,
      gender: document.querySelector("#userGender").value,
    };

    console.log("🟡 Sending update:", dataToSend);

    try {
      const response = await putData(remoteUrl, dataToSend);
      if (response?.data) {
        updateCard(response.data); // Update DOM with new info
      }

      const modalElement = document.getElementById("exampleModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      setTimeout(() => {
        modal.hide();
        addEventListeners(); // reattach edit buttons
      }, 700);
    } catch (error) {
      console.error("❌ Failed to update:", error);
    }
  });
};

// Add edit button listeners
const addEventListeners = () => {
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const modalBody = document.querySelector(".modal-body");
      modalBody.innerHTML = "";
      modalBody.appendChild(formFactory());

      const foundUser = users.find(
        (user) => user.id === parseInt(e.target.getAttribute("data-user-id"))
      );

      getModalForm(foundUser);
      setupSubmitHandler();
    });
  });
};

// Fetch and initialize
const loadData = async () => {
  spinner.classList.remove("d-none");
  try {
    const data = await fetchData(remoteUrl);
    spinner.classList.add("d-none");

    if (data && data.data) {
      users = data.data;
      alert.classList.remove("d-none", "alert-danger");
      alert.classList.add("alert-success");
      alert.textContent = "Data loaded successfully!";
      displayUsers(users);
      addEventListeners();
    }
  } catch (error) {
    spinner.classList.add("d-none");
    alert.classList.remove("d-none");
    alert.classList.add("alert-danger");
    alert.textContent = `Failed to load data: ${error.message}`;
  }
};

window.addEventListener("DOMContentLoaded", loadData);
