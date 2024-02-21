const jwtToken = localStorage.getItem('jwtToken');

function updateTable(){
    fetch('http://localhost:8080/car',{
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
            var row = "<tr>" +
            "<td>"+car.categoryId+"</td>"+
            "<td>"+car.brand+"</td>"+
            "<td>"+car.model+"</td>"+
            "<td>"+car.color+"</td>"+
            "<td>"+car.year+"</td>"+
            "<td>"+car.transmission+"</td>"+
            "<td>"+car.fuelType+"</td>"+
            "<td>"+car.rentPrice+"</td>"+
            "<td>"+car.availableCar+"</td>"+
            "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#editModal' onclick='openEditModal(" + car.id + ")'>Edit</button> | " +
                    "<button type='button' class='btn btn-danger' onclick='deleteCategory(" + car.id + ")'>Delete</button>" +
                    "</td>" +
                    "</tr>";
            tableBody.innerHTML += row;
        });
    })
 
}

document.addEventListener('DOMContentLoaded',function(){
    updateTable();
    categoryDropdownList();
});

//form submit

function addCar(){
    const carCategory = document.getElementById('carCategory').value;
    const carBrand = document.getElementById('carBrand').value;
    const carModel = document.getElementById('carModel').value;
    const carColor = document.getElementById('carColor').value;
    const carYear = document.getElementById('carYear').value;
    const carTransmission = document.getElementById('carTransmission').value;
    const carFuel = document.getElementById('carFuel').value;
    const carPrice = document.getElementById('carPrice').value;
    const carData = {
        categoryId:carCategory,
        brand:carBrand,
        model:carModel,
        color:carColor,
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
    fetch('http://localhost:8080/category',{
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



