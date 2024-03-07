window.addEventListener("load", () => {
  const btn1 = document.querySelector(".search-form");
  const input = document.querySelector("#search");
  const loadingRing = document.querySelector(".lds-dual-ring");
  const contentSection = document.querySelector("#search-results");
  const userAlert = document.querySelector("#alert-content")

  function toggleVisibility(element, isVisible) {
    element.classList.toggle("hidden", !isVisible);
  }

  btn1.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchInput = input.value;
    const url = `https://api.vam.ac.uk/v2/objects/search?&q=${encodeURIComponent(searchInput)}`;

    if (!searchInput) {
      toggleVisibility(userAlert, true);
      userAlert.classList.add("warning")

      userAlert.firstElementChild.textContent = "You cannot leave the search input box empty.";
      return;
    }

    toggleVisibility(userAlert, false);
    userAlert.classList.remove("warning")

    try {
      // Clear previous search results
      while (contentSection.firstChild) {
        contentSection.removeChild(contentSection.lastChild);
      }

      toggleVisibility(loadingRing, true);


      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();

      if (Object.keys(data.records).length == 0) {
        toggleVisibility(userAlert, true);
        userAlert.classList.add("notification")
        userAlert.firstElementChild.textContent = "Oops! We couldn't find any results matching your search query.";
      }

      // Iterate through records and create elements
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

        figureCaption.appendChild(title);
        figureCaption.appendChild(date);
        contentCard.appendChild(img);
        contentCard.appendChild(figureCaption);
        contentSection.appendChild(contentCard);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        userAlert.firstElementChild.textContent = "Network error, please check your internet connection and try again.";
      } else {
        userAlert.firstElementChild.textContent = error.message;
      }
      userAlert.classList.add("warning")
      userAlert.classList.remove("hidden");
    } finally {
      toggleVisibility(loadingRing, false);
    }
  })
});
