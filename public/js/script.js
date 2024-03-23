const pswdBtn = document.getElementById("password-reveal");
pswdBtn.addEventListener("click", function () {
  const password = document.getElementById("account_password");
  if (password.type === "password") {
    password.type = "text";
    pswdBtn.innerHTML = "Hide Password";
  } else {
    password.type = "password";
    pswdBtn.innerHTML = "Show Password";
  }
});
