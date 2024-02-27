function cityDropdownList(){
    fetch('http://localhost:8080/api/city',{
        method:'GET',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        }   
    })
    .then(response=>response.json())
    .then(data=>{
        var cityDropdown=document.getElementById('city');

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

var selectedCityId;

function onCityChange(){
    var dropdown=document.getElementById('city');
    selectedCityId=dropdown.value;
    districtDropdownList(selectedCityId);
}

function districtDropdownList(cityId){
    fetch('http://localhost:8080/api/district/'+cityId,{
        method:'GET',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        var districtDropdown=document.getElementById('district');

        

        data.forEach(district=>{
            var option = document.createElement('option');
            option.value=district.id;
            option.text=district.districtName;
            districtDropdown.add(option);
        });
    })
    .catch(error=>{
        console.error('Error',error);
    })
}

document.addEventListener('DOMContentLoaded',function(){
    cityDropdownList();
});


function addUser(){
    const email=document.getElementById('email').value;
    const firstName=document.getElementById('firstName').value;
    const lastName=document.getElementById('lastName').value;
    const nationalityNumber=document.getElementById('nationalityNumber').value;
    const birthDate=document.getElementById('birthDate').value;
    const password=document.getElementById('password').value;
    const city=document.getElementById('city').value;
    const district=document.getElementById('district').value;
    const addressLine=document.getElementById('addressLine').value;
    const userData={
        email:email,
        firstName:firstName,
        lastName:lastName,
        nationalityNumber:nationalityNumber,
        birthDate:birthDate,
        password:password,
        cityId:city,
        districtId:district,
        addressLine:addressLine,
        roles:"USER"
    };

    console.log(userData);

    fetch('http://localhost:8080/user/addUser',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
        })
        .catch(error=>{
            console.error('Error: ',error);
        });

        resetAddUserForm();

}

function resetAddUserForm(){
    const email=document.getElementById('email').value="";
    const firstName=document.getElementById('firstName').value="";
    const lastName=document.getElementById('lastName').value="";
    const nationalityNumber=document.getElementById('nationalityNumber').value="";
    const birthDate=document.getElementById('birthDate').value="";
    const password=document.getElementById('password').value="";
    const city=document.getElementById('city').value=selectedCityId;
    const district=document.getElementById('district').value="";
    const adressLine=document.getElementById('addressLine').value="";
}