document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");

  if (!header) {
    console.log("No header found");
    return;
  }

  console.log("adding eventlistener")

  window.addEventListener("scroll", () => {
    const y_position = window.scrollY;

    if (y_position > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  });
})