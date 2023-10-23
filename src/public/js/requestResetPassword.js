const form = document.getElementById('requestResetPasswordForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/requestResetPassword',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                title:  'Se le ha enviado un correo electrónico para que recupere su contraseña',
                icon: 'success',
                timerProgressBar:true
              })
            setTimeout(()=>window.location.replace('/login'),3000);
          }
          else {
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                title:  'No se ha podido enviar el correo electrónico para que recupere contraseña!',
                icon: 'error',
                timerProgressBar:true
              }); 
          }
    })
})