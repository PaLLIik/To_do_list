const form = document.querySelector("form");

const formData = {
  firstName: "",
  lastName: "",
  email: "",
  queryType: "",
  message: "",
  consent: false,
};

form.addEventListener("change", (event) => {
  const target = event.target;

  if (target.type === "checkbox") {
    formData[target.name] = target.checked;
  } else {
    formData[target.name] = target.value;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateText(formData.firstName)) {
    console.log("Ошибка в имени");
    return;
  }

  if (!validateText(formData.lastName)) {
    console.log("Ошибка в фамилии");
    return;
  }

  if (!validateEmail(formData.email)) {
    return;
  }

  if (formData.queryType === '') {
    console.log("Выберите тип запроса");
    return
  }

  if (!validateText(formData.message)) {
    console.log("Ошибка в сообщении");
    return;
  }

  console.log(formData);
});

function validateText(value) {
  const reg = /^[a-zA-Zа-яА-ЯёЁ0-9\s]+$/;

  if (value.trim() === "") {
    return false;
  }

  if (value.length < 5 || value.length > 30) {
    return false;
  }

  if (!reg.test(value)) {
    return false;
  }

  return true;
}

function validateEmail(value) {
  if (value.trim() === "") {
    return false;
  }

  if (value.length < 5 || value.length > 30) {
    return false;
  }

  return true;
}