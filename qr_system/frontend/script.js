document.getElementById("qrForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const carNumber = document.getElementById("car_number").value;
  
    fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ car_number: carNumber }),
    })
      .then(res => res.json())
      .then(data => {
        const img = `<img src="http://localhost:5000/get-qr/${carNumber}" width="200"/>`;
        const url = `<p><a href="${data.url}" target="_blank">${data.url}</a></p>`;
        document.getElementById("result").innerHTML = img + url;
      });
  });
  