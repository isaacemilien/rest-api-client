window.addEventListener("load", () => {
  const btn1 = document.querySelector(".search-form");
  const input = document.querySelector("#search");
  const loadingRing = document.querySelector(".lds-dual-ring");
  const contentSection = document.querySelector("#search-results");
  const userAlert = document.querySelector("#alert-content")

  btn1.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchInput = input.value;
    const url = "https://api.vam.ac.uk/v2/objects/search?&q=" + encodeURIComponent(searchInput);

    if (!searchInput) {
      userAlert.classList.remove("hidden");
      userAlert.classList.add("warning")

      userAlert.firstElementChild.textContent = "You cannot leave the search input box empty.";
      return;
    }

    userAlert.classList.add("hidden");
    userAlert.classList.remove("warning")

    try {
      // Clear previous search results
      while (contentSection.firstChild) {
        contentSection.removeChild(contentSection.lastChild);
      }

      loadingRing.classList.remove("hidden");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (Object.keys(data.records).length == 0) {
        userAlert.classList.remove("hidden");
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
      console.error("Fetch error: " + error.message);
    } finally {
      loadingRing.classList.add("hidden");
    }
  })
});
