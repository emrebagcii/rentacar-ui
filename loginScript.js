function submitForm(){
    const email = document.getElementById('email').value;
    const password=document.getElementById('password').value;
    console.log('email: '+email);
    console.log('password: '+password);


fetch('http://localhost:8080/user/getToken',{
    method : 'POST',
    body : JSON.stringify({
        email,
        password
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
})
    .then((response)=>{
        if(!response.ok){
            throw new Error('Login isteği başarısız. Durum kodu: ' + response.status);
        }
        return response.json();
    })
    .then((data)=>{
        console.log('Login isteği başarılı: ',data);
        console.log('userId: ' + data.userId)
        localStorage.setItem('jwtToken',data.token);
        localStorage.setItem('userId', data.userId);

        const role=parseJwt(data.token);
        if ("USER"===role) {
            window.location.href="index.html";
        } else if("ADMIN"===role){
            window.location.href="admin.html";
        }
    })
}

function parseJwt(token){
    const base64Url=token.split('.')[1];
    const base64=base64Url.replace('-','+').replace('_','/');
    const decodedData=JSON.parse(atob(base64));

    const userRole=decodedData.authorities[0].authority;
    console.log(userRole);
    return userRole;
}