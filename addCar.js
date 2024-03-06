const jwtToken = localStorage.getItem('jwtToken');

function updateTable(){
    fetch('http://localhost:8080/car/getCarList',{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            Authorization: 'Bearer '+jwtToken
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var tableBody = document.getElementById('carTableBody');
        
        tableBody.innerHTML='';

        data.forEach(function(car){
            var carState

            if (car.active) {
                carState="Aktif"
            } else {
                carState="Pasif"
            }
    
            var row = "<tr>" +
            "<td>"+car.categoryName+"</td>"+
            "<td>"+car.brand+"</td>"+
            "<td>"+car.model+"</td>"+
            "<td>"+car.year+"</td>"+
            "<td>"+car.transmission+"</td>"+
            "<td>"+car.fuelType+"</td>"+
            "<td>"+car.rentPrice+"</td>"+
            "<td>"+car.availableCar+"</td>"+
            "<td>"+carState+"</td>"+
            "<td> <button type='button' class='btn btn-warning' data-toggle='modal' data-target='#editCarModal' onclick='openEditCarModal(" + car.id + ")'>Düzenle</button>  " +
            "<button type='button' class='btn btn-success' data-toggle='modal' data-target='#addCarDetailModal' onclick='openCarDetailModal(" + car.id + ")'>Envantere Araç Ekle</button>  " +
            "<button type='button' class='btn btn-danger' onclick='deleteCategory(" + car.id + ")'>Sil</button>" +
            "</td>" +
            "</tr>";
            tableBody.innerHTML += row;
        });
    })
 
}

document.addEventListener('DOMContentLoaded',function(){
    updateTable();
    categoryDropdownList();
    editCategoryDropdownList()
});

//form submit

function addCar(){
    const carCategory = document.getElementById('carCategory').value;
    const carBrand = document.getElementById('carBrand').value;
    const carModel = document.getElementById('carModel').value;
    const carYear = document.getElementById('carYear').value;
    const carTransmission = document.getElementById('carTransmission').value;
    const carFuel = document.getElementById('carFuel').value;
    const carPrice = document.getElementById('carPrice').value;
    const carData = {
        categoryId:carCategory,
        brand:carBrand,
        model:carModel,
        year:carYear,
        transmission:carTransmission,
        fuelType:carFuel,
        rentPrice:carPrice
    };

    fetch('http://localhost:8080/car/addCar',{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            Authorization: 'Bearer '+jwtToken
        },
        body: JSON.stringify(carData)
    })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
        })
        .catch(error=>{
            console.error('Error: ',error);
        });
        
        
        resetAddCarForm(); //modal formunu sıfırla
        $('#addCarModal').modal('hide'); //modalı kapat
}

function categoryDropdownList(){
    fetch('http://localhost:8080/category/active',{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            Authorization: 'Bearer '+jwtToken
        }
    })
    .then(response=>response.json())
    .then(data=>{
        var dropdown=document.getElementById('carCategory');
        data.forEach(category=>{
            var option=document.createElement('option');
            option.value=category.id;
            option.text=category.categoryName;
            dropdown.add(option);
        });
    })
    .catch(error=>{
        console.error('Error',error);
    });
}

var selectedCategoryId;

function onCategoryChange(){
    var dropdown = document.getElementById('carCategory');
    selectedCategoryId=dropdown.value;
    console.log("Selected Category ID: ",selectedCategoryId);
}



function resetAddCarForm(){
    document.getElementById('carCategory').value=selectedCategoryId;
    document.getElementById('carBrand').value="";
    document.getElementById('carModel').value="";
    document.getElementById('carYear').value="";
    document.getElementById('carTransmission').value="";
    document.getElementById('carFuel').value="";
    document.getElementById('carPrice').value="";
}

function resetAddCarDetailForm(){
    document.getElementById('carKilometer').value=selectedCategoryId;
    document.getElementById('carPlate').value="";
}


function openEditCarModal(id){
    fetch('http://localhost:8080/car/'+id,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            Authorization:'Bearer '+jwtToken
        }
    })
        .then(response=>response.json())
        .then(car=>{
            document.getElementById('editCarId').value=car.id;
            document.getElementById('carCategory').value=car.categoryName;
            document.getElementById('editCarBrand').value=car.brand;
            document.getElementById('editCarModel').value=car.model;
            document.getElementById('editCarYear').value=car.year
            document.getElementById('editCarTransmission').value=car.transmission;
            document.getElementById('editCarFuel').value=car.fuelType;
            document.getElementById('editCarPrice').value=car.rentPrice;
        })
        .catch((error)=>{
            console.log('Error:',error);
        });
}

function updateCar(){
    const id = document.getElementById('editCarId').value;
    const carCategory = document.getElementById('editCarCategory').value;
    const carBrand = document.getElementById('editCarBrand').value;
    const carModel = document.getElementById('editCarModel').value;
    const carYear = document.getElementById('editCarYear').value;
    const carTransmission = document.getElementById('editCarTransmission').value;
    const carFuel = document.getElementById('editCarFuel').value;
    const carPrice = document.getElementById('editCarPrice').value;
    const carData = {
        categoryId:carCategory,
        brand:carBrand,
        model:carModel,
        year:carYear,
        transmission:carTransmission,
        fuelType:carFuel,
        rentPrice:carPrice
    };

    fetch('http://localhost:8080/car/update'+id,{
        method:'PUT',
        headers:{
            'Content-type':'application/json',
            Authorization:'Bearer '+jwtToken
        },
        body: JSON.stringify(carData)
    })
        .then(response=>response.json())
        .then(()=>{
            $('#editCarModal').modal('hide');
            updateTable();
        })
        .catch((error)=>{
            console.error('Error:',error);
        });
}

function editCategoryDropdownList(){
    fetch('http://localhost:8080/category/active',{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            Authorization: 'Bearer '+jwtToken
        }
    })
    .then(response=>response.json())
    .then(data=>{
        var dropdown=document.getElementById('editCarCategory');
        data.forEach(category=>{
            var option=document.createElement('option');
            option.value=category.id;
            option.text=category.categoryName;
            dropdown.add(option);
        });
    })
    .catch(error=>{
        console.error('Error',error);
    });
}

var selectedEditCategoryId;

function onEditCategoryChange(){
    var dropdown = document.getElementById('editCarCategory');
    selectedEditCategoryId=dropdown.value;
    console.log("Selected Category ID: ",selectedEditCategoryId);
}



function openCarDetailModal(id){
    fetch('http://localhost:8080/car/'+id,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            Authorization:'Bearer '+jwtToken
        }
    })
        .then(response=>response.json())
        .then(car=>{

            document.getElementById('addCarId').value=car.id;

            $('#addCarDetailModal').modal('show');
        })
        .catch((error)=>{
            console.log('Error:',error);
        });
}


function addCarDetail(){
    const carId=document.getElementById('addCarId').value;
    const carKilometer = document.getElementById('carKilometer').value;
    const carPlate = document.getElementById('carPlate').value;
    const carDetailData={
        carId:carId,
        kilometer:carKilometer,
        carPlate:carPlate
    };

    fetch('http://localhost:8080/cardetail/addcardetail',{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            Authorization: 'Bearer '+jwtToken
        },
        body:JSON.stringify(carDetailData)
    })
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
        })
        .catch(error=>{
            console.error('Error: ',error)
        });

        resetAddCarDetailForm();
            $('#addCarDetailModal').modal('hide')

}


