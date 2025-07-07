document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const errorMsg = document.getElementById("errorMsg");
  const adminBtn = document.getElementById("adminLoginBtn");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      const passcode = prompt("Enter admin passcode:");
      if (passcode === "admin123") {
        window.location.href = "admin.html";
      } else {
        alert("Incorrect passcode.");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      try {
        const res = await fetch(`http://localhost:5000/users?email=${email}`);
        const users = await res.json();
        const user = users.find(u => u.password === password);

        if (user) {
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          window.location.href = "flights.html";
        } else {
          if (errorMsg) errorMsg.textContent = "Wrong credentials. Please try again.";
        }
      } catch {
        if (errorMsg) errorMsg.textContent = "Server error. Try again later.";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async e => {
      e.preventDefault();
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value.trim();

      if (name.length < 3) {
        alert("Name must be at least 3 characters long.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/users?email=${email}`);
        const existing = await res.json();

        if (existing.length > 0) {
          alert("Email already exists");
          return;
        }

        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        alert("Registration successful");
        window.location.href = "index.html";
      } catch {
        alert("Something went wrong. Please try again.");
      }
    });
  }
});
