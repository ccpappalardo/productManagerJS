const socket = io();

const table = document.getElementById('table');

function createChild(product) {
  const html = `
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>$${product.price}</td>
                <td>${product.code}</td>
              `
 
  const nuevoElemento = document.createElement('tr');
  nuevoElemento.id = product.id;

  nuevoElemento.innerHTML = html;
  table.appendChild(nuevoElemento);
}

function deleteChild(productId) {
  const child = document.getElementById(productId);

  if (!child) {
    return;
  }
  table.removeChild(child);
}

function actualizarProductosEnVista(products) {
  const table = document.getElementById('table');
  table.innerHTML = "";
  Array.from(products).forEach((product) => createChild(product));
}

socket.on('connect', () => {
  console.log('Conectado al servidor socket');
});

socket.on("nuevoProducto", (product) => {
  createChild(product);
});

socket.on("eliminarProducto", (productId) => {
  deleteChild(productId);
});
 
socket.on("cargarProductos", (products) => {
  actualizarProductosEnVista(products);
});

socket.on("actualizarProduct", (product) => {
  deleteChild(product.id);
  createChild(product);
});
