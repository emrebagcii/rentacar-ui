const jwtToken = localStorage.getItem('jwtToken')

function updateTable(){
    fetch('http://localhost:8080/cardetail/inventory',{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            Authorization:'Bearer '+jwtToken
        }
    })
    .then(response => response.json())
    .then(data=>{
        var tableBody=document.getElementById('carInventoryTable');
        tableBody.innerHTML='';
        console.log(data);
        data.forEach(function(inventory){
            var state
            var renting
            var buttonState

            if (inventory.active) {
                state="Aktif"
            } else {
                state="Pasif"
            }

            if (inventory.renting) {
                renting="Kiralamada"
                buttonState="<button type='button' class='btn btn-warning' data-toggle='modal' data-target='#showRentModal' onclick='openShowRentModal(" + inventory.id + ")'>Kiralama Detaylarını Gör</button> "
            } else {
                renting="Garajda"
                buttonState="<button type='button' class='btn btn-warning' data-toggle='modal' data-target='#editCarModal' onclick='openEditCarModal(" + inventory.id + ")'>Kirala</button> "
            }

            var row = "<tr>" +
            "<td>"+inventory.categoryName+"</td>"+
            "<td>"+inventory.brand+"</td>"+
            "<td>"+inventory.model+"</td>"+
            "<td>"+inventory.year+"</td>"+
            "<td>"+inventory.carPlate+"</td>"+
            "<td>"+inventory.color+"</td>"+
            "<td>"+inventory.transmission+"</td>"+
            "<td>"+inventory.fuelType+"</td>"+
            "<td>"+state+"</td>"+
            "<td>"+renting+"</td>"+
            
            "<td>"+ buttonState +
            "<button type='button' class='btn btn-danger' onclick='deleteCategory(" + inventory.id + ")'>Sil</button>" +
            "</td>" +
            "</tr>";
            tableBody.innerHTML += row
        });
    })
}

document.addEventListener('DOMContentLoaded',function(){
    updateTable();
});

function openShowRentModal(carId){
    fetch('http://localhost:8080/rent/getrentbycar/'+carId,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            Authorization:'Bearer '+jwtToken
        }
    })


    .then(response=>response.json())
    .then(rent=>{
        document.getElementById('firstName').value=rent.firstName;
        document.getElementById('lastName').value=rent.lastName;
        document.getElementById('rentCity').value=rent.rentingCity;
        document.getElementById('deliveryCity').value=rent.deliveryCity;
        document.getElementById('carBrand').value=rent.brand;
        document.getElementById('carModel').value=rent.model;
        document.getElementById('carTransmission').value=rent.transmission;
        document.getElementById('carFuel').value=rent.fuelType;
        document.getElementById('carPlate').value=rent.carPlate;
        document.getElementById('carColor').value=rent.color;
        document.getElementById('rentDate').value=formatDate(rent.rentingDate);
        document.getElementById('deliveryDate').value=formatDate(rent.deliveryDate);
        document.getElementById('rentingDay').value=rent.rentingDay;
    })
    .catch((error)=>{
        console.log('Error:',error);
    });
}

function formatDate(inputDate) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(inputDate).toLocaleDateString('tr-TR', options);
}