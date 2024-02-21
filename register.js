document.addEventListener('DOMContentLoaded', function () {
    // İllerin dinamik olarak doldurulması
    fetch('http://localhost:8080/api/city')
        .then(Response => Response.json())
        .then(data => {

            data.forEach(city => {
                const option=document.createElement('option')
                option.value=city.name
                option.textContent=city.cityName

                citySelect.appendChild(option)
            });
            
        })
        .catch(error => console.error('İl Fetch Hatası:', error));
});