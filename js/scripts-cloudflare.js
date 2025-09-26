/*!
 * Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Activate SimpleLightbox plugin for portfolio items
  new SimpleLightbox({
    elements: "#portfolio a.portfolio-box",
  });

  // Contact form submission handler for Cloudflare Pages Functions
  const contactForm = document.getElementById("contactForm");
  const submitButton = document.getElementById("submitButton");
  const successMessage = document.getElementById("submitSuccessMessage");
  const errorMessage = document.getElementById("submitErrorMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Disable submit button during submission
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";

      // Hide any previous messages
      successMessage.classList.add("d-none");
      errorMessage.classList.add("d-none");

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      try {
        // Send data to Cloudflare Pages Function
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Show success message
          successMessage.classList.remove("d-none");
          contactForm.reset();
        } else {
          throw new Error(result.error || "Error en el servidor");
        }
      } catch (error) {
        // Show error message
        console.error("Error:", error);
        errorMessage.classList.remove("d-none");

        // Update error message with specific error if available
        const errorDiv = errorMessage.querySelector(".text-center");
        if (error.message && error.message !== "Error en el servidor") {
          errorDiv.textContent = error.message;
        } else {
          errorDiv.textContent =
            "Error al enviar el mensaje. Por favor, intenta nuevamente.";
        }
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = "Enviar Mensaje";
      }
    });
  }
});
