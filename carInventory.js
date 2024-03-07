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
                buttonState="<button type='button' class='btn btn-warning' data-toggle='modal' data-target='#createRentModal' onclick='openCreateRentModal(" + inventory.carId + ")'>Kirala</button> "
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
    rentCityDropdownList();
    deliveryCityDropdownList();
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
        document.getElementById('endRentBtn').onclick=function(){endRenting(rent.id)};
    })
    .catch((error)=>{
        console.log('Error:',error);
    });
}

function formatDate(inputDate) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(inputDate).toLocaleDateString('tr-TR', options);
}


function openCreateRentModal(carId){
    document.getElementById('carId').value=carId;
}

function createRent(){
    const carId=document.getElementById('carId').value;
    const userId=1;
    const driverLicenceType=document.getElementById('driverLicence').value;
    const driverLicenceNo=document.getElementById('driverLicenceNumber').value;
    const rentCityId=document.getElementById('createRentCity').value;
    const deliveryCityId=document.getElementById('createDeliveryCity').value;
    const rentingDate=document.getElementById('createRentDate').value;
    const deliveryDate=document.getElementById('createDeliveryDate').value;
    const rentData={
        carId:carId,
        userId:userId,
        driverLicenceType:driverLicenceType,
        driverLicenceNo:driverLicenceNo,
        rentCityId:rentCityId,
        deliveryCityId:deliveryCityId,
        rentingDate:rentingDate,
        deliveryDate:deliveryDate
    };

    console.log(rentData);

}


function endRenting(rentId){
    if(confirm('Kiralama sonladırılacak. Devam etmek istiyor musunuz?')){
        fetch('http://localhost:8080/rent/endrent/'+rentId,{
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                Authorization:'Bearer '+jwtToken
            }
        })
        .then(response=>{
            if (response.ok) {
                $('#showCarModal').modal('hide');
                updateTable();
            }else{
                console.error('Error:',response.status)
            }
        })
        .catch((error)=>{
            console.error('Error: ',error)
        });
    }
}


function rentCityDropdownList(){
    fetch('http://localhost:8080/api/city',{
        method:'GET',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        }   
    })
    .then(response=>response.json())
    .then(data=>{
        var cityDropdown=document.getElementById('createRentCity');

        cityDropdown.innerHTML=''
        data.forEach(city=>{
            var option = document.createElement('option');
            option.value=city.id;
            option.text=city.cityName;
            cityDropdown.add(option);
        });
    })
    .catch(error=>{
        console.error('Error',error);
    });
}

var selectedRentCityId;

function onRentCityChange(){
    var dropdown=document.getElementById('createRentCity');
    selectedRentCityId=dropdown.value;
    districtDropdownList(selectedRentCityId);
}

function deliveryCityDropdownList(){
    fetch('http://localhost:8080/api/city',{
        method:'GET',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        }   
    })
    .then(response=>response.json())
    .then(data=>{
        var cityDropdown=document.getElementById('createDeliveryCity');

        cityDropdown.innerHTML=''
        data.forEach(city=>{
            var option = document.createElement('option');
            option.value=city.id;
            option.text=city.cityName;
            cityDropdown.add(option);
        });
    })
    .catch(error=>{
        console.error('Error',error);
    });
}

var selectedDeliveryCityId;

function onDeliveryCityChange(){
    var dropdown=document.getElementById('createDeliveryCity');
    selectedDeliveryCityId=dropdown.value;
    districtDropdownList(selectedDeliveryCityId);
}
