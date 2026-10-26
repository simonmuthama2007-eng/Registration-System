
"use strict";

// ==========================================
// 1. GET REFERENCES TO HTML ELEMENTS
// ==========================================

const form = document.getElementById("regform");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const genderInput = document.getElementById("gender");
const dobInput = document.getElementById("dob");
const countryInput = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const bioInput = document.getElementById("bio");

const errorElements = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmError"),
    gender: document.getElementById("genderError"),
    dob: document.getElementById("dobError"),
    country: document.getElementById("countryError"),
    phone: document.getElementById("phoneError"),
    bio: document.getElementById("bioError")
};

const successMsg = document.getElementById("successMsg");
const memberList = document.getElementById("memberList");
const memberCounter = document.getElementById("count");
const darkModeButton = document.getElementById("theme");

const fields = {
    name: nameInput,
    email: emailInput,
    password: passwordInput,
    confirmPassword: confirmPasswordInput,
    gender: genderInput,
    dob: dobInput,
    country: countryInput,
    phone: phoneInput,
    bio: bioInput
};

// Select every input, select and textarea in the form.
const allFormControls = form.querySelectorAll(
    "input, select, textarea"
);

// Select every error element.
const allErrorElements = form.querySelectorAll(".error");

// Log references to confirm they were found.
console.log("Form:", form);
console.log("All form controls:", allFormControls);
console.log("Individual fields:", fields);
console.log("Error elements:", allErrorElements);
console.log("Error references:", errorElements);
console.log("Success message:", successMsg);
console.log("Member list:", memberList);
console.log("Member counter:", memberCounter);
console.log("Dark Mode button:", darkModeButton);

// Check for missing HTML elements.
if (
    !form ||
    !successMsg ||
    !memberList ||
    !memberCounter ||
    !darkModeButton ||
    Object.values(fields).some(field => !field) ||
    Object.values(errorElements).some(error => !error)
) {
    throw new Error(
        "Some HTML elements are missing. Check the element IDs."
    );
}

// ==========================================
// 2. VALIDATION HELPER FUNCTIONS
// ==========================================

function showError(fieldName, message) {
    errorElements[fieldName].textContent = message;
    fields[fieldName].classList.add("invalid");
    fields[fieldName].setAttribute("aria-invalid", "true");
}

function clearError(fieldName) {
    errorElements[fieldName].textContent = "";
    fields[fieldName].classList.remove("invalid");
    fields[fieldName].removeAttribute("aria-invalid");
}

function clearAllErrors() {
    Object.keys(fields).forEach(fieldName => {
        clearError(fieldName);
    });
}

function validateField(fieldName) {
    const value = fields[fieldName].value.trim();

    // Clear the previous error before validating again.
    clearError(fieldName);

    switch (fieldName) {
        case "name":
            if (!value) {
                showError("name", "Full name is required.");
            } else if (value.length < 2) {
                showError("name", "Name must contain at least 2 characters.");
            } else if (value.length > 100) {
                showError("name", "Name must not exceed 100 characters.");
            } else {
                return true;
            }
            break;

        case "email": {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value) {
                showError("email", "Email address is required.");
            } else if (!emailPattern.test(value)) {
                showError("email", "Enter a valid email address.");
            } else {
                return true;
            }
            break;
        }

        case "password":
            if (!fields.password.value) {
                showError("password", "Password is required.");
            } else if (fields.password.value.length < 8) {
                showError("password", "Password must be at least 8 characters.");
            } else {
                return true;
            }
            break;

        case "confirmPassword":
            if (!fields.confirmPassword.value) {
                showError("confirmPassword", "Please confirm your password.");
            } else if (
                fields.confirmPassword.value !== fields.password.value
            ) {
                showError("confirmPassword", "Passwords do not match.");
            } else {
                return true;
            }
            break;

        case "gender":
            if (!value) {
                showError("gender", "Please select your gender.");
            } else {
                return true;
            }
            break;

        case "dob": {
            if (!value) {
                showError("dob", "Date of birth is required.");
            } else {
                const birthDate = new Date(value + "T00:00:00");
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (
                    Number.isNaN(birthDate.getTime()) ||
                    birthDate > today
                ) {
                    showError("dob", "Date of birth cannot be in the future.");
                } else {
                    return true;
                }
            }
            break;
        }

        case "country":
            if (!value) {
                showError("country", "Country is required.");
            } else if (value.length < 2) {
                showError("country", "Enter a valid country name.");
            } else {
                return true;
            }
            break;

        case "phone": {
            // Allows international numbers with optional + and separators.
            const phonePattern = /^\+?[0-9\s()-]{7,20}$/;
            const digitCount = value.replace(/\D/g, "").length;

            if (!value) {
                showError("phone", "Phone number is required.");
            } else if (
                !phonePattern.test(value) ||
                digitCount < 7 ||
                digitCount > 15
            ) {
                showError("phone", "Enter a valid phone number.");
            } else {
                return true;
            }
            break;
        }

        case "bio":
            if (!value) {
                showError("bio", "Bio is required.");
            } else if (value.length < 10) {
                showError("bio", "Bio must contain at least 10 characters.");
            } else if (value.length > 500) {
                showError("bio", "Bio must not exceed 500 characters.");
            } else {
                return true;
            }
            break;
    }

    return false;
}

// ==========================================
// 3. CLEAR ERRORS AS USERS FIX FIELDS
// ==========================================

Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];

    const eventName =
        field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventName, () => {
        validateField(fieldName);

        // If the password changes, recheck the confirmation.
        if (
            fieldName === "password" &&
            fields.confirmPassword.value
        ) {
            validateField("confirmPassword");
        }
    });

    // Also validate selects and date inputs after selection.
    if (eventName !== "change") {
        field.addEventListener("change", () => {
            validateField(fieldName);
        });
    }
});

// ==========================================
// 4. UPDATE THE MEMBER COUNTER
// ==========================================

function updateMemberCounter() {
    const members = memberList.querySelectorAll(".member-item");

    memberCounter.textContent = members.length;

    const emptyNote = document.getElementById("emptyNote");

    if (members.length === 0) {
        if (!emptyNote) {
            const note = document.createElement("li");
            note.id = "emptyNote";
            note.className = "empty";
            note.textContent =
                "No members yet. Register someone to begin.";
            memberList.appendChild(note);
        }
    } else if (emptyNote) {
        emptyNote.remove();
    }
}

// ==========================================
// 5. REGISTER A MEMBER
// ==========================================

function registerMember() {
    const member = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        gender: fields.gender.value,
        dob: fields.dob.value,
        country: fields.country.value.trim(),
        phone: fields.phone.value.trim(),
        bio: fields.bio.value.trim()
    };

    // Never display or store the password in the member list.
    const listItem = document.createElement("li");
    listItem.className = "member-item";

    const info = document.createElement("div");
    info.className = "info";

    const memberName = document.createElement("strong");
    memberName.textContent = member.name;

    const memberEmail = document.createElement("span");
    memberEmail.textContent = member.email;

    const memberCountry = document.createElement("span");
    memberCountry.textContent = ` • ${member.country}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
        "aria-label",
        `Remove ${member.name}`
    );

    info.appendChild(memberName);
    info.appendChild(document.createElement("br"));
    info.appendChild(memberEmail);
    info.appendChild(document.createElement("br"));
    info.appendChild(memberCountry);

    listItem.appendChild(info);
    listItem.appendChild(removeButton);

    // Remove the member when the button is clicked.
    removeButton.addEventListener("click", () => {
        const confirmed = window.confirm(
            `Remove ${member.name} from the member list?`
        );

        if (confirmed) {
            listItem.remove();
            updateMemberCounter();
        }
    });

    memberList.appendChild(listItem);
    updateMemberCounter();

    // Show the success message.
    successMsg.textContent =
        `${member.name} has been registered successfully!`;

    successMsg.classList.remove("hidden");
}

// ==========================================
// 6. CAPTURE FORM SUBMISSION
// ==========================================

form.addEventListener("submit", event => {
    event.preventDefault();

    // Validate every field.
    let formIsValid = true;

    Object.keys(fields).forEach(fieldName => {
        const fieldIsValid = validateField(fieldName);

        if (!fieldIsValid) {
            formIsValid = false;
        }
    });

    if (!formIsValid) {
        successMsg.classList.add("hidden");

        // Focus the first invalid field.
        const firstInvalidField = form.querySelector(".invalid");

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;
    }

    // Register the member only if all fields are valid.
    registerMember();

    // Reset the form and clear old validation messages.
    form.reset();
    clearAllErrors();
});

// ==========================================
// 7. DARK MODE TOGGLE
// ==========================================

darkModeButton.addEventListener("click", () => {
    const darkModeIsActive = document.body.classList.toggle("dark");

    darkModeButton.textContent = darkModeIsActive
        ? "Light Mode"
        : "Dark Mode";

    darkModeButton.setAttribute(
        "aria-pressed",
        String(darkModeIsActive)
    );
});

// ==========================================
// 8. INITIALIZE THE PAGE
// ==========================================

updateMemberCounter();

console.log("WebDev registration system is ready!");
