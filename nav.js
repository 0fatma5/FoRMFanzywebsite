// Select all navigation links
const navLinks = document.querySelectorAll('.nav-link');

// Function to remove active class from all links
function removeActiveClass() {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
}

// Function to set the active link based on scroll position
function setActiveLink() {
    let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
            removeActiveClass();
            link.classList.add('active');
        }
    });
}

// Set specific link as active based on current page
function setDefaultActiveLink() {
    const currentPage = window.location.pathname;
    removeActiveClass(); // Ensure no other link is active

    navLinks.forEach(link => {
        // Add active class only if the link href matches the current page
        if (currentPage.includes("home.html") && link.getAttribute('href') === 'home.html') {
            link.classList.add('active');
        } else if (currentPage.includes("drawing.html") && link.getAttribute('href') === 'drawing.html') {
            link.classList.add('active');
        }
    });
}

// Initialize default active link
setDefaultActiveLink();

// Add scroll event listener
window.addEventListener('scroll', setActiveLink);
