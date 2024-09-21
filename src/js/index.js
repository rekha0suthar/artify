import { createApi } from 'unsplash-js';

// Select the gallery and menu items
const gallery = document.querySelector('.gallery');
const modernArt = document.querySelector('.modern-art');
const classicArt = document.querySelector('.classic-art');
const sculptureArt = document.querySelector('.sculpture-art');
const techArt = document.querySelector('.tech-art');
const faviorateArt = document.querySelector('.faviorate-art');
// Select all menu items
const menuItems = document.querySelectorAll('.header-menu p');

// select model items
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const imageDetails = document.getElementById('imageDetails');
const closeBtn = document.querySelector('.close');

// Unsplash API initialization
const unsplash = createApi({
  accessKey: '_O4cPqkGUax5bYDTvvebqi70Vip8AxxWEl4EsgWVAIo',
});

// Function to fetch and display images
const getImages = (typeOfArt) => {
  unsplash.search
    .getPhotos({
      query: typeOfArt,
      page: 1,
      perPage: 25,
      orientation: 'portrait',
    })
    .then((result) => {
      if (result.type === 'success') {
        const photos = result.response.results;
        const getUrls = photos.map((photo) => {
          return `
          <div class="photo-container" data-image='${escapeHtml(
            JSON.stringify(photo)
          )}'>
            <img class="image" src="${photo.urls.small}" alt="art image" />
            <i class="fa-regular fa-heart heart-icon"></i>         
          </div>
          `;
        });
        gallery.innerHTML = getUrls.join('');

        // After rendering the gallery, attach the like functionality
        likedImages();

        openImagePopup(); // Call this function after rendering images
      }
    });
};

// Function to escape HTML special characters
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Attach "like" functionality to heart icons
const likedImages = () => {
  const heartIcons = document.querySelectorAll('.heart-icon'); // Select heart icons after rendering
  heartIcons.forEach((heartIcon) => {
    heartIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      const photoContainer = event.target.closest('.photo-container');
      const imageData = JSON.parse(photoContainer.getAttribute('data-image'));

      // Toggle the liked class on click
      heartIcon.classList.toggle('liked');

      // Store or remove image data in localStorage
      if (heartIcon.classList.contains('liked')) {
        addToLocalStorage(imageData);
      } else {
        removeFromLocalStorage(imageData.id);
      }
    });
  });
};

// Method to mark image faviorate
const getFaviorateImages = () => {
  const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
  const faviorateImages = likedImages.map((photo) => {
    return `
    <div class="photo-container" data-image='${escapeHtml(
      JSON.stringify(photo)
    )}'>
      <img src="${photo.urls.small}" alt="art image" />
      <i class="fa-regular fa-heart heart-icon liked"></i>         
    </div>
    `;
  });
  gallery.innerHTML = faviorateImages.join('');
};

// Function to add image data to local storage
const addToLocalStorage = (imageData) => {
  const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
  likedImages.push(imageData);
  localStorage.setItem('likedImages', JSON.stringify(likedImages));
};

// Function to remove image data from local storage
const removeFromLocalStorage = (imageId) => {
  let likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
  likedImages = likedImages.filter((image) => image.id !== imageId);
  localStorage.setItem('likedImages', JSON.stringify(likedImages));
};

// Set default active class on Modern Art
modernArt.classList.add('active');

// Function to handle the menu click and active class switching
menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    // Remove 'active' class from all menu items
    menuItems.forEach((menuItem) => menuItem.classList.remove('active'));

    // Add 'active' class to the clicked menu item
    item.classList.add('active');
  });
});

// Function to display the modal with the clicked image and its details
const showImageDetails = (imageData) => {
  console.log(imageData);
  modalImage.src = imageData.urls.full; // or any other size you prefer
  imageDetails.innerHTML = `
    <h2>${imageData.description || 'No description available'}</h2>
    <p><strong>Photographer:</strong> ${imageData.user.name}</p>
    <p><i class="fa-solid fa-thumbs-up"></i> ${imageData.likes}</p>
  `;
  modal.style.display = 'block'; // Show the modal
};

// Close the modal when the close button is clicked
closeBtn.onclick = () => {
  modal.style.display = 'none';
};

// Close the modal when clicking outside of the modal content
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Attach click event to each image in the gallery
const openImagePopup = () => {
  const photoContainers = document.querySelectorAll('.photo-container'); // Select all photo containers
  photoContainers.forEach((container) => {
    container.addEventListener('click', (event) => {
      const imageData = JSON.parse(container.getAttribute('data-image')); // Get the image data
      showImageDetails(imageData); // Show the details in the modal
    });
  });
};

// Method to fetch images whenever the page loads
getImages('Modern Art');

// Add event listeners for the menu items
modernArt.addEventListener('click', () => getImages('Modern Art'));
classicArt.addEventListener('click', () => getImages('Classic Art'));
sculptureArt.addEventListener('click', () => getImages('Sculpture Art'));
techArt.addEventListener('click', () => getImages('Tech Art'));
faviorateArt.addEventListener('click', () => getFaviorateImages());
