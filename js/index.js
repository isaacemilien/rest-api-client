window.addEventListener("load", () => {
  const btn1 = document.querySelector(".search-form");
  const input = document.querySelector("#search");
  const loadingRing = document.querySelector(".lds-dual-ring");
  const contentSection = document.querySelector("#search-results");
  const userAlert = document.querySelector("#alert-content")

  function toggleVisibility(element, isVisible) {
    element.classList.toggle("hidden", !isVisible);
  }

  function displaySearchResults(data) {

    console.log(data);
    
    // Check results exist 
    if (Object.keys(data.records).length == 0) {
      toggleVisibility(userAlert, true);
      userAlert.classList.remove("warning")
      userAlert.classList.add("notification")
      userAlert.firstElementChild.textContent = "Oops! We couldn't find any results matching your search query.";
      return;
    }

    // Create and populate content cards
    for (let record of data.records) {
      const contentCard = document.createElement('div');
      const figureCaption = document.createElement('figcaption');
      const title = document.createElement('div');
      const date = document.createElement('div');
      const img = document.createElement('img');

      contentCard.classList.add("content-card");
      title.textContent = record._primaryTitle;
      date.textContent = record._primaryDate;
      img.setAttribute("src", record._images._iiif_image_base_url ? record._images._iiif_image_base_url + "/full/full/0/default.jpg" : "images/image-placeholder.svg");
      img.setAttribute("alt", record._images._iiif_image_base_url ? "Artwork image" : "Placeholder image");

      figureCaption.appendChild(title);
      figureCaption.appendChild(date);
      contentCard.appendChild(img);
      contentCard.appendChild(figureCaption);
      contentSection.appendChild(contentCard);
    }
  }

  function clearResults() {
    while (contentSection.firstChild) {
      contentSection.removeChild(contentSection.lastChild);
    }
  }

  btn1.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const searchInput = input.value;
    
    // Check input contains text
    if (!searchInput) {
      toggleVisibility(userAlert, true);
      userAlert.classList.add("warning")

      userAlert.firstElementChild.textContent = "You cannot leave the search input box empty.";
      return;
    }

    const url = `https://api.vam.ac.uk/v2/objects/search?&q=${encodeURIComponent(searchInput)}`;

    toggleVisibility(userAlert, false);

    // Attempt API call
    try {
      clearResults();
      toggleVisibility(loadingRing, true);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      displaySearchResults(data);

    } catch (error) {
      if (error instanceof TypeError) {
        userAlert.firstElementChild.textContent = "Network error, please check your internet connection and try again.";
      } else {
        userAlert.firstElementChild.textContent = error.message;
      }

      userAlert.classList.add("warning")
      toggleVisibility(userAlert, true);

    } finally {
      toggleVisibility(loadingRing, false);
    }
  })
});
