const jwtToken = localStorage.getItem('jwtToken');

function updateTable(){
    fetch('http://localhost:8080/user/active',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            Authorization:'Bearer '+jwtToken
        }
    })
        .then(response=>response.json())
        .then(data=>{
            var tableBody=document.getElementById('userTableBody');
            tableBody.innerHTML=''

            function formatDate(inputDate) {
                const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
                return new Date(inputDate).toLocaleDateString('tr-TR', options);
            }

            data.forEach(function(user){
                var formattedBirthDate = formatDate(user.birthDate);
                var status;
                if (user.active) {
                    status="Aktif"
                } else {
                    status="Pasif"
                }

                var row = "<tr>" +
                "<td>"+user.id+"</td>"+
                "<td>"+user.roles+"</td>"+
                "<td>"+user.firstName+"</td>"+
                "<td>"+user.lastName+"</td>"+
                "<td>"+user.nationalityNumber+"</td>"+
                "<td>"+formattedBirthDate+"</td>"+
                "<td>"+user.email+"</td>"+
                "<td>"+user.city+"</td>"+
                "<td>"+user.district+"</td>"+
                "<td>"+user.addressLine+"</td>"+
                "<td>"+status+"</td>"+ 
                "<td> <button type='button' class='btn btn-danger' onclick='deleteUser(" + user.id + ")'>Delete</button>" +
                "</td>" +
                "</tr>";
                tableBody.innerHTML += row;
            });
            });
        
}

document.addEventListener('DOMContentLoaded',function(){
    updateTable();
})

function deleteUser(id){
    if(confirm('Kullanıcıyı pasif yapmak istediğinize emin misiniz?')){
        fetch('http://localhost:8080/user/delete/'+id,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:'Bearer '+jwtToken
            },
        })
            .then(response=>{
                if(response.ok){
                    updateTable()
                } else{
                    console.error('Error:',response.status)
                }
            })
            .catch((error)=>{
                console.error('Error: ',error);
            });
    }
}