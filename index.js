window.addEventListener("load", () => {
  const btn1 = document.querySelector(".search-form");
  const input = document.querySelector("#search");
  const loadingRing = document.querySelector(".lds-dual-ring");

  btn1.addEventListener("submit", async (event) => {
    event.preventDefault();
    loadingRing.classList.remove("hidden");

    const search = input.value;
    const url = "https://api.vam.ac.uk/v2/objects/search?q=" + encodeURIComponent(search);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const data = await response.json(); 

      const contentSection = document.querySelector("#search-results");

      // Clear previous search results
      while (contentSection.firstChild) {
        contentSection.removeChild(contentSection.lastChild);
      }

      // Iterate through records and create elements
      for (let record of data.records) {
        console.log(record);

        const title = document.createElement('h2');
        const date = document.createElement('h3');
        const img = document.createElement('img');

        title.textContent = record._primaryTitle;
        date.textContent = record._primaryDate;
        img.setAttribute("src", record._images._iiif_image_base_url + "/full/full/0/default.jpg");

        contentSection.appendChild(title);
        contentSection.appendChild(date);
        contentSection.appendChild(img);
      }
    } catch (error) {
      console.error("Fetch error: " + error.message);
    } finally {
      loadingRing.classList.add("hidden");
    }
  })
});
