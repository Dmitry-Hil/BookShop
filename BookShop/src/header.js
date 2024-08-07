const burgerMenu = document.querySelector ('.header-icons__burger')
if (burgerMenu) {
  const navMenu = document.querySelector ('.nav');
  burgerMenu.addEventListener("click", function (e) {
    navMenu.classList.toggle('_active');

  })
}