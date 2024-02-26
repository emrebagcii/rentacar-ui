const jwtToken = localStorage.getItem('jwtToken');

function updateTable(){
    fetch('http://localhost:8080/category/active',{
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            Authorization: 'Bearer ' +jwtToken
        }
    })
        .then(response => response.json())
        .then(data=>{
            var tableBody = document.getElementById('categoryTable');
            tableBody.innerHTML='';

            data.forEach(function(category){
                var row ="<tr>" + 
                "<td>" + category.id + "</td>" +
                    "<td>" + category.categoryName + "</td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-info' data-toggle='modal' data-target='#editModal' onclick='openEditModal(" + category.id + ")'>Edit</button> | " +
                    "<button type='button' class='btn btn-danger' onclick='deleteCategory(" + category.id + ")'>Delete</button>" +
                    "</td>" +
                    "</tr>";
                tableBody.innerHTML += row;
            });
        })
        .catch((error)=>{
            console.error('Error:',error);
        });
}

document.addEventListener('DOMContentLoaded',function(){
    updateTable();

    document.getElementById('addCategoryBtn').addEventListener('click',function() {
        var name = document.getElementById('name').value;

        fetch('http://localhost:8080/category/addCategory',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:'Bearer '+jwtToken
            },
            body:JSON.stringify({categoryName:name}),
        })
            .then(response=>response.json())
            .then(()=>{
                document.getElementById('name').value='';

                updateTable();
            })
            .catch((error)=>{
                console.error('Error:',error)
            });
    });

});

function openEditModal(id){
    fetch('http://localhost:8080/category/'+id,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            Authorization:'Bearer '+jwtToken
        }
    })
        .then(response=>response.json())
        .then(category=>{
            document.getElementById('editCategoryId').value=category.id;
            document.getElementById('editCategoryName').value=category.categoryName;

            $('#editModal').modal('show');
        })
        .catch((error)=>{
            console.log('Error:',error);
        });
   
}

function editCategory(){
    var id=document.getElementById('editCategoryId').value;
    var newName = document.getElementById('editCategoryName').value;

    // Fetch API ile veriyi backend'e gönder
    fetch('http://localhost:8080/category/update/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken
        },
        body: JSON.stringify({ categoryName: newName }),
    })
        .then(response => response.json())
        .then(() => {
            // Modal'ı kapat
            $('#editModal').modal('hide');

            // Tabloyu güncelle
            updateTable();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function deleteCategory(id){
    if(confirm('Seçtiğiniz kategoriyi silmek istediğinize emin misiniz?')){
        fetch('http://localhost:8080/category/delete/'+id,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:'Bearer '+jwtToken
            },
        })
            .then(response=>{
                if(response.ok){
                    updateTable()
                } else {
                    console.error('Error:',response.status)
                }
            })
            .catch((error)=>{
                console.error('Error:',error);
            });
    }
}


