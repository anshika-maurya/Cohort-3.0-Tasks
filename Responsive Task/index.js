const carousel = document.querySelector(".card-section");

document.querySelector(".next").onclick = () => {
  carousel.scrollLeft += 250;
};

document.querySelector(".prev").onclick = () => {
  carousel.scrollLeft -= 250;
};