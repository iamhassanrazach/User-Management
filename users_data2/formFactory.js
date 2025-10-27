export const formFactory = (userData = {}) => {
    const form = document.createElement("form");

    // Name
    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = "userName";
    nameLabel.classList.add("form-label");
    nameLabel.textContent = "User's Name";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "userName";
    nameInput.classList.add("form-control");
    nameInput.value = userData.name || "";
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    // Age
    const ageLabel = document.createElement("label");
    ageLabel.htmlFor = "userAge";
    ageLabel.classList.add("form-label", "mt-3");
    ageLabel.textContent = "User's Age";
    const ageInput = document.createElement("input");
    ageInput.type = "number";
    ageInput.id = "userAge";
    ageInput.classList.add("form-control");
    ageInput.value = userData.age || "";
    form.appendChild(ageLabel);
    form.appendChild(ageInput);

    // Email
    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "userEmail";
    emailLabel.classList.add("form-label", "mt-3");
    emailLabel.textContent = "Email";
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "userEmail";
    emailInput.classList.add("form-control");
    emailInput.value = userData.email || "";
    form.appendChild(emailLabel);
    form.appendChild(emailInput);

    // Avatar URL
    const avatarLabel = document.createElement("label");
    avatarLabel.htmlFor = "userAvatar";
    avatarLabel.classList.add("form-label", "mt-3");
    avatarLabel.textContent = "Avatar URL";
    const avatarInput = document.createElement("input");
    avatarInput.type = "text";
    avatarInput.id = "userAvatar";
    avatarInput.classList.add("form-control");
    avatarInput.value = userData.avatar_url || "";
    form.appendChild(avatarLabel);
    form.appendChild(avatarInput);

    // Gender
    const genderLabel = document.createElement("label");
    genderLabel.htmlFor = "userGender";
    genderLabel.classList.add("form-label", "mt-3");
    genderLabel.textContent = "Gender";
    const genderSelect = document.createElement("select");
    genderSelect.id = "userGender";
    genderSelect.classList.add("form-control");

    ["male", "female", "other"].forEach(g => {
        const option = document.createElement("option");
        option.value = g;
        option.textContent = g.charAt(0).toUpperCase() + g.slice(1);
        genderSelect.appendChild(option);
    });

    genderSelect.value = ["male", "female", "other"].includes(userData.gender)
        ? userData.gender
        : "other";

    form.appendChild(genderLabel);
    form.appendChild(genderSelect);

    return form;
};
