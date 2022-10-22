async function logout() {
  const response = await fetch("/api/users/logout", {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  }
}

$("#logout-link").click(logout);
$("#logout-link-mobile").click(logout);
