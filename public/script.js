document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const dropdown = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
  
    dropdown.addEventListener('click', () => {
      dropdownContent.classList.toggle('show'); // Toggle 'show' class
    });
  
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
      if (!event.target.matches('.dropbtn')) {
        if (dropdownContent.classList.contains('show')) {
          dropdownContent.classList.remove('show');
        }
      }
    });


    mobileMenuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
    });


    document.addEventListener("DOMContentLoaded", () => {
      const menuToggle = document.getElementById("menu-toggle");
      const navLinks = document.getElementById("nav-links");
  
      menuToggle.addEventListener("click", () => {
          navLinks.classList.toggle("open"); // Toggle 'open' class to show/hide the menu
      });
  });
  
});
