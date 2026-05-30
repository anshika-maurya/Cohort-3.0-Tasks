document.querySelectorAll(".wrapper").forEach((wrapper) => {
  const carousel = wrapper.querySelector(
    ".card-section, .chai-masala, .journal-cards"
  );

  const next = wrapper.querySelector(".next");
  const prev = wrapper.querySelector(".prev");

  next.addEventListener("click", () => {
    carousel.scrollLeft += 250;
  });

  prev.addEventListener("click", () => {
    carousel.scrollLeft -= 250;
  });
});