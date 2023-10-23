const form = document.getElementById('registerForm'); 

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/register',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
      if (result.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          title:  'Usted se ha registrado con Éxito!',
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
          title:  'El usuario ya existe, o ha habido un inconveniente.',
          icon: 'error',
          timerProgressBar:true
        }); 
      }
  })
})