/**
 * Toggle Items on the dom
 */
const toggler = (event) => {
  if (event.target.classList.contains('triggerModal')) {
    const targetModal = event.srcElement.getAttribute('data-target');
    document.getElementById(`#${targetModal}`).classList.toggle('show-modal');
  }
  if (event.target.classList.contains('close-button')) {
    const modalToClose = event.target.offsetParent.offsetParent.getAttribute('id');
    document.getElementById(modalToClose).classList.toggle('show-modal');
  }
  if (event.target.classList.contains('modal')) {
    event.target.classList.toggle('show-modal');
  }
  if (event.target.parentElement.parentElement.classList.contains('topnav')) {
    event.target.parentElement.parentElement.classList.toggle('responsive');
  }
};

// Add an event listener to the dom to listen for certain types of events
window.addEventListener('click', toggler);
