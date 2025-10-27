// using RemoteUrl

/**
 * User Management Application
 * Fetches user data from API, displays cards, and allows editing with localStorage persistence
 */

import { fetchData } from "./fetch2.js";
import { formFactory } from "./formFactory.js";
import { putData } from "./putData.js";

// API endpoint
const remoteUrl = "https://easy-simple-users-rest-api.onrender.com/api/users";

// DOM elements
const spinner = document.getElementById("spinner");
const alert = document.getElementById("alert");
const usersContainer = document.getElementById("users-container");

// Store users array
let users = [];

/**
 * Display error alert message to user
 * @param {string} message - Error message to display
 */
const showAlert = (message) => {
    alert.classList.remove("d-none", "alert-success");
    alert.classList.add("alert-danger");
    alert.textContent = message;
};

/**
 * Display success alert message to user
 * @param {string} message - Success message to display
 */
const showSuccess = (message) => {
    alert.classList.remove("d-none", "alert-danger");
    alert.classList.add("alert-success");
    alert.textContent = message;
    setTimeout(() => alert.classList.add("d-none"), 3000);
};

/**
 * Save original user data to localStorage on first load
 * @param {Array} data - User data from API
 */
const saveOriginalData = (data) => {
    if (!localStorage.getItem("originalUsers")) {
        localStorage.setItem("originalUsers", JSON.stringify(data));
    }
};

/**
 * Get original user data from localStorage
 * @returns {Array|null} Original user data or null
 */
const getOriginalData = () => {
    try {
        return JSON.parse(localStorage.getItem("originalUsers") || "null");
    } catch {
        return null;
    }
};

/**
 * Get edit history (array of changes in order)
 * @returns {Array} Array of edit history objects
 */
const getEditHistory = () => {
    try {
        return JSON.parse(localStorage.getItem("editHistory") || "[]");
    } catch {
        return [];
    }
};

/**
 * Add an edit to history
 * @param {number} userId - User ID
 * @param {Object} beforeData - User data before edit
 * @param {Object} afterData - User data after edit
 */
const addToHistory = (userId, beforeData, afterData) => {
    const history = getEditHistory();
    history.push({
        userId: userId,
        before: beforeData,
        after: afterData,
        timestamp: Date.now()
    });
    localStorage.setItem("editHistory", JSON.stringify(history));
    updateUndoButton();
};

/**
 * Undo the last edit
 */
const undoLastEdit = () => {
    const history = getEditHistory();
    
    if (history.length === 0) {
        showAlert("No edits to undo!");
        return;
    }
    
    // Get the last edit
    const lastEdit = history.pop();
    
    // Save updated history
    localStorage.setItem("editHistory", JSON.stringify(history));
    
    // Apply the "before" state
    const userIndex = users.findIndex(u => u.id === lastEdit.userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...lastEdit.before };
    }
    
    // Refresh display
    displayUsers(users);
    updateUndoButton();
    showSuccess("✅ Last edit undone successfully!");
};

/**
 * Update undo button state
 */
const updateUndoButton = () => {
    const undoBtn = document.getElementById("undoBtn");
    const history = getEditHistory();
    
    if (undoBtn) {
        if (history.length === 0) {
            undoBtn.disabled = true;
            undoBtn.textContent = "Undo (0)";
        } else {
            undoBtn.disabled = false;
            undoBtn.textContent = `Undo (${history.length})`;
        }
    }
};

/**
 * Load user data from API and merge with local edits
 */
const loadData = async () => {
    spinner.classList.remove("d-none");
    
    try {
        const data = await fetchData(remoteUrl);
        spinner.classList.add("d-none");
        
        if (data && data.data && data.data.length > 0) {
            // Save original data on first load
            saveOriginalData(data.data);
            
            // Use original data as base (preserves avatars)
            const originalData = getOriginalData();
            const baseData = originalData || data.data;
            
            // Apply edit history
            const history = getEditHistory();
            users = baseData.map(user => ({ ...user }));
            
            // Apply each edit in history order
            history.forEach(edit => {
                const userIndex = users.findIndex(u => u.id === edit.userId);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...edit.after };
                }
            });
            
            displayUsers(users);
            updateUndoButton();
        } else {
            showAlert("No users found.");
        }
    } catch (error) {
        spinner.classList.add("d-none");
        showAlert(`Failed to load data: ${error.message}`);
        console.error(error);
    }
};

/**
 * Display user cards in the DOM
 * @param {Array} localUsers - Array of user objects to display
 */
const displayUsers = (localUsers) => {
    usersContainer.innerHTML = "";
    
    localUsers.forEach((user, index) => {
        const card = document.createElement("article");
        card.classList.add("card", "mb-3");
        card.innerHTML = `
            <div class="card-image">
                <img src="${user.avatar_url || ""}" alt="${user.name || ""}" class="card-img-top" />
                <span class="card-title">${user.name || ""}</span>
            </div>
            <div class="card-content">
                <ul class="list-group">
                    <li class="list-group-item"><strong>Name:</strong> ${user.name || ""}</li>
                    <li class="list-group-item"><strong>Age:</strong> ${user.age || ""}</li>
                    <li class="list-group-item"><strong>Email:</strong> ${user.email || ""}</li>
                    <li class="list-group-item"><strong>Gender:</strong> ${user.gender || "other"}</li>
                </ul>
                <button data-bs-target="#exampleModal" data-bs-toggle="modal" class="btn btn-secondary m-2">Edit</button>
            </div>
        `;
        usersContainer.appendChild(card);
    });
    
    attachEditButtons();
};

/**
 * Attach event listeners to all edit buttons
 */
const attachEditButtons = () => {
    const editButtons = document.querySelectorAll(".btn-secondary");
    
    editButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const modalBody = document.querySelector(".modal-body");
            modalBody.innerHTML = "";
            const userData = users[index] || {};

            // Generate form with user data
            const form = formFactory(userData);
            modalBody.appendChild(form);

            // Replace submit button to remove old listeners
            const submitBtn = document.querySelector(".submit-btn");
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

            // Handle form submission
            newSubmitBtn.addEventListener("click", async () => {
                // Get form values
                const name = document.querySelector("#userName").value;
                const age = document.querySelector("#userAge").value;
                const email = document.querySelector("#userEmail").value;
                const avatarUrl = document.querySelector("#userAvatar").value;
                const gender = document.querySelector("#userGender").value;
                
                // ✅ VALIDATE FORM DATA
                if (!name || name.trim() === "") {
                    modalBody.innerHTML = '<div class="alert alert-warning">❌ Name is required!</div>';
                    return;
                }
                
                if (age < 1 || age > 120) {
                    modalBody.innerHTML = '<div class="alert alert-warning">❌ Age must be between 1 and 120!</div>';
                    return;
                }
                
                if (!email || !email.includes("@")) {
                    modalBody.innerHTML = '<div class="alert alert-warning">❌ Please enter a valid email address!</div>';
                    return;
                }
                
                // Save "before" state for undo functionality
                const beforeData = { ...userData };
                
                // Prepare "after" state
                const afterData = {
                    id: userData.id,
                    name: name,
                    age: age,
                    email: email,
                    avatar_url: avatarUrl,
                    gender: gender,
                };

                // Show loading spinner
                modalBody.innerHTML = `
                    <div class="d-flex justify-content-center align-items-center" style="height: 312px;">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                `;

                try {
                    // Send PUT request to API
                    const response = await putData(remoteUrl, afterData);
                    console.log("PUT response:", response);

                    // Add to history for undo functionality
                    addToHistory(userData.id, beforeData, afterData);

                    // Update the card immediately (no page refresh)
                    const card = usersContainer.children[index];
                    card.querySelector(".card-img-top").src = afterData.avatar_url;
                    card.querySelector(".card-img-top").alt = afterData.name;
                    card.querySelector(".card-title").textContent = afterData.name;
                    
                    const listItems = card.querySelectorAll(".list-group-item");
                    listItems[0].innerHTML = `<strong>Name:</strong> ${afterData.name}`;
                    listItems[1].innerHTML = `<strong>Age:</strong> ${afterData.age}`;
                    listItems[2].innerHTML = `<strong>Email:</strong> ${afterData.email}`;
                    listItems[3].innerHTML = `<strong>Gender:</strong> ${afterData.gender}`;

                    // Update users array
                    users[index] = { ...users[index], ...afterData };

                    // Close the modal
                    const modalEl = document.getElementById("exampleModal");
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();
                    
                    // ✅ SHOW SUCCESS MESSAGE
                    showSuccess("✅ User updated successfully!");

                } catch (error) {
                    console.error("Error updating user:", error);
                    modalBody.innerHTML = `<div class="alert alert-danger">❌ Failed to update user: ${error.message}</div>`;
                }
            });
        });
    });
};

/**
 * Undo button - reverts the last edit
 */
document.getElementById("undoBtn")?.addEventListener("click", () => {
    if (confirm("Undo the last edit?")) {
        undoLastEdit();
    }
});

/**
 * Reset all edits - reverts to saved original data
 */
document.getElementById("resetBtn")?.addEventListener("click", () => {
    if (confirm("Reset ALL edits and reload original data?")) {
        localStorage.removeItem("editHistory");
        location.reload();
    }
});

/**
 * Hard reset - clears all localStorage and fetches fresh from API
 */
document.getElementById("hardResetBtn")?.addEventListener("click", () => {
    if (confirm("⚠️ Clear ALL saved data and fetch fresh from API?\n\nThis will:\n- Delete all your edits\n- Restore original avatars\n- Cannot be undone")) {
        localStorage.clear();
        location.reload();
    }
});

// Initialize the application
loadData();