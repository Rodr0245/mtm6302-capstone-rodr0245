// script to hide search icon when input is empty
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');
  const searchIcon = document.querySelector('.searchIcon');

  // Function to toggle search icon based on input state
  function toggleSearchIcon() {
    if (searchInput.value.trim() !== '') {
      // If search input has text, hide the search icon
      searchIcon.style.display = 'none';
    } else {
      // If search input is empty, show the search icon
      searchIcon.style.display = 'inline-block';
    }
  }

  // Initial check on page load
  toggleSearchIcon();

  // Add focus and blur event listeners to search input
  searchInput.addEventListener('focus', function() {
    // Hide the search icon when input is focused
    searchIcon.style.display = 'none';
  });

  searchInput.addEventListener('blur', function() {
    // Checks if input is empty when focus is lost
    if (searchInput.value.trim() === '') {
      // Show the search icon when input is blurred and empty
      searchIcon.style.display = 'inline-block';
    }
    // The search icon remains hidden if there is text in the input
  });
});
