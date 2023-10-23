const form = document.getElementById('restartPasswordForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/restartPassword',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                title:  'Se ha modificado su contraseña con Éxito',
                icon: 'success',
                timerProgressBar:true
              })
            setTimeout(()=>window.location.replace('/login'),3000);
        }else{

            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                title:  'No se ha podido modificar su contraseña',
                icon: 'error',
                timerProgressBar:true
              })

        }

    })
})