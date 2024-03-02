window.addEventListener("load", () => {
  const btn1 = document.querySelector(".search-form");
  const input = document.querySelector("#search");
  const loadingRing = document.querySelector(".lds-dual-ring");

  btn1.addEventListener("submit", (event) => {
    event.preventDefault();

    const search = input.value;
    // construct url
    const url = "https://api.vam.ac.uk/v2/objects/search?q=" + encodeURIComponent(search);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
      loadingRing.classList.add("hidden");

      if (xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);

        const contentSection = document.querySelector("#search-results");

        while (contentSection.firstChild) {
          contentSection.removeChild(contentSection.lastChild);
        }

        for (record of data.records) {

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
      } else {
        console.log(xhr.status)
      }
    });

    xhr.open("GET", url, true);
    xhr.send();

    loadingRing.classList.remove("hidden");
  })
});
