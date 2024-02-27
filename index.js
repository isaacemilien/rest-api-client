window.addEventListener("load", () => {
  const btn1 = document.querySelector(".search-form");
  const input = document.querySelector("#search");

  btn1.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log(input.value);

    const search = input.value;

    // construct url
    const url = "https://api.vam.ac.uk/v2/objects/search?q=" + encodeURIComponent(search);

    var xhr = new XMLHttpRequest();


    xhr.addEventListener("load", () => {
      if (xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);

        const contentSection = document.querySelector("#search-results");


        for (record of data.records) {

          console.log(record);

          // console.log(item.data[0].title);
          // console.log(item.data[0].description);
          // console.log(item.links[0].href);

          const img = document.createElement('img');
          img.setAttribute("src", record._images._primary_thumbnail);


          contentSection.appendChild(img);
        }
      } else {
        console.log(xhr.status)
      }
    });

    xhr.open("GET", url, true);
    xhr.send();
  })
});
