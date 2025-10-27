export const formFactory = () => {
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

  // Age
  const ageLabel = document.createElement("label");
  ageLabel.htmlFor = "userAge";
  ageLabel.classList.add("form-label");
  ageLabel.textContent = "User's Age";

  const ageInput = document.createElement("input");
  ageInput.type = "number";
  ageInput.id = "userAge";
  ageInput.classList.add("form-control");

  // Image
  const imageLabel = document.createElement("label");
  imageLabel.htmlFor = "userImage";
  imageLabel.classList.add("form-label");
  imageLabel.textContent = "User's Image";

  const imageInput = document.createElement("input");
  imageInput.type = "text";
  imageInput.id = "userImage";
  imageInput.classList.add("form-control");

  // Gender
  const genderLabel = document.createElement("label");
  genderLabel.htmlFor = "userGender";
  genderLabel.classList.add("form-label");
  genderLabel.textContent = "User's Gender";

  const genderInput = document.createElement("input");
  genderInput.type = "text";
  genderInput.id = "userGender";
  genderInput.classList.add("form-control");

  form.append(
    nameLabel,
    nameInput,
    ageLabel,
    ageInput,
    imageLabel,
    imageInput,
    genderLabel,
    genderInput
  );

  return form;
};
