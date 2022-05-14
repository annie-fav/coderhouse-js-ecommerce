// Welcome to the user .*

const buttonUsuario = document.getElementById("button-usuario");
buttonUsuario.addEventListener("click", function () {
  swal("Write your name here:", {
    content: "input"
  }).then((value) => {
    swal(`Welcome ${value}!`);
    pWelcome.innerHTML = "Welcome " + value + "!";
  });
});

//=============================================================================================================

// Change the background color .*
const buttonBackground = document.getElementById("button-background-color");

const colors = ["white", "black", "rgb(173, 139, 173)"];
let getRandomNumber = () => Math.floor(Math.random() * 3);
console.log(getRandomNumber());

buttonBackground.addEventListener("click", function () {
  const randomNum = getRandomNumber();
  document.body.style.backgroundColor = colors[randomNum];
});

// ============================================================================================================

// // Fetch

document.addEventListener("DOMContentLoaded", async () => {
  // Loads product list from the the server a.k.a ./products.json / ARRAY_PRODUCTOS
  await fetchData();
  // Checks local storage if the user has a CARRITO in the localstorage
  if (localStorage.getItem("CARRITO")) {
    const LS_CARRITO = JSON.parse(localStorage.getItem("CARRITO"))

    LS_CARRITO.forEach(carrito_item => {
      CARRITO.push(carrito_item)
      const product_ = ARRAY_PRODUCTOS.find(p => p.id === carrito_item.id)
      updateCarritoItem(product_, carrito_item)
    })
  }
})

const fetchData = async () => {
  try {
    const res = await fetch("./products.json");
    const data = await res.json(); // save the data
    console.log("Data recieved correctly!")

    data.forEach(item => {
      const product = new Producto(item.id, item.name, item.price, item.img_url, item.amount)
      ARRAY_PRODUCTOS.push(product)
    })

    // Create cards for the products in the Dom . *
    ARRAY_PRODUCTOS.forEach((product) => {
      // creates html component that uses product to provide data .*
      const card_elem = createProductCard(product);
      // adds card into the product container .*
      const card_container = document.getElementById("cards_container");
      card_container.appendChild(card_elem);
    });
  } catch (error) {
    console.log(error);
  }
}


//=============================================================================
// Create structures and functions to the program  .*

// Product .*
class Producto {
  constructor(id, name, price, img_url, amount) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img_url = img_url;
    this.amount = amount;
  }
}

function updateCarritoItem(product, item) {
  const msg =
    product.name + " - $" + product.price + " / Amount: " + item.amount;

  const cart_item_ = document.getElementById("cart-item-" + product.id);
  if (cart_item_) {
    const text_component = cart_item_.getElementsByClassName("text")[0];
    text_component.innerHTML = msg;
  } else {
    const cart_item_component = create_carrito_item(product, item, msg);
    const ul_carrito = document.getElementById("ul_carrito");
    ul_carrito.appendChild(cart_item_component);
  }
}

function update_total_component() {
  let total = 0;
  CARRITO.forEach((carrito_item) => {
    const product = ARRAY_PRODUCTOS.find((x) => x.id === carrito_item.id);
    total += product.price * carrito_item.amount;
  });

  const total_container = document.getElementById("total_container");
  total_container.innerHTML = "Total: $" + total;
}

function createProductCard(product) {
  // create elements for the card .*
  const card_div = document.createElement("div");
  card_div.product_id = product.id;
  const card_img_container = document.createElement("div");
  const card_img = document.createElement("img");
  const card_h3 = document.createElement("h3");
  const card_price = document.createElement("h2");
  const card_button = document.createElement("button");

  // add css classes to the dom obj .*
  card_div.classList.add("card");
  card_img_container.classList.add("card-img-container");
  card_img.classList.add("card-img");
  card_button.classList.add("add-cart");

  // add data to the elements .*
  card_img.src = product.img_url;
  card_h3.innerHTML = product.name;
  card_price.innerHTML = product.price;
  card_button.innerHTML = "Add to Cart";

  // creates button handler
  card_button.onclick = function (e) {
    // 1. save the new producto in the localstorage and CARRITO array
    const index_ = CARRITO.findIndex((x) => x.id === product.id);
    const exists = index_ !== -1;

    const item = exists ? CARRITO[index_] : { id: product.id, amount: 0 };

    item.amount++;

    if (exists) {
      CARRITO[index_] = item;
    } else {
      CARRITO.push(item);
    }

    localStorage.setItem('CARRITO', JSON.stringify(CARRITO));

    console.log("CARRITO updated started -------------");
    console.log(CARRITO);
    console.log("CARRITO updated ended -------------");

    // 2. Creates carrito item html component
    updateCarritoItem(product, item);

    // 3.Updates total price component basedon the localstorage and CARRITO cache
    update_total_component();

    // 4. show message to the user
    Toastify({
      text: `${product.name} has been added correctly`,
      duration: 3000,
      style: {
        background: "linear-gradient(to right, pink, purple)",
      },
    }).showToast();
  };

  card_img_container.appendChild(card_img);
  card_div.appendChild(card_img_container);
  card_div.appendChild(card_h3);
  card_div.appendChild(card_price);
  card_div.appendChild(card_button);

  return card_div;
}

function create_carrito_item(product, item, msg) {
  const li = document.createElement("li");
  li.id = "cart-item-" + product.id;
  li.classList.add = "li_item";
  li.style.marginBottom = "6px";

  const p = document.createElement("p");
  p.className = "text";
  p.innerHTML = msg;
  li.appendChild(p);
  // Button delete item . *
  const button_delete = document.createElement("button");
  button_delete.id = "button_delete";
  button_delete.style.display = "inline-flex";
  button_delete.style.marginLeft = "14px";
  button_delete.style.padding = "2px";
  button_delete.style.width = "18px";
  button_delete.style.height = "20px";
  button_delete.textContent = "x";

  // Button Delete Function
  button_delete.onclick = function (e) {
    li.remove();
    const index_ = CARRITO.findIndex((x) => x.id === product.id);
    CARRITO.splice(index_, 1);
    localStorage.setItem("CARRITO", CARRITO);
    update_total_component()
    Toastify({
      text: `${product.name} has been removed correctly`,
      duration: 3000,
      style: {
        background: "linear-gradient(to right, pink, purple)",
      },
    }).showToast();
  };

  li.appendChild(button_delete);
  return li;
};

function createSubmitForm() {
  const p_name = document.createElement("p");
  p_name.textContent = "First and Second Name: ";
  p_name.style.marginLeft = "80px";
  p_name.style.marginTop = "80px";
  const input_name = document.createElement("input");
  input_name.style.marginLeft = "80px";
  const p_dni = document.createElement("p");
  p_dni.textContent = "DNI: ";
  p_dni.style.marginLeft = "80px";
  const input_dni = document.createElement("input");
  input_dni.style.marginLeft = "80px";
  const p_nameCard = document.createElement("p");
  p_nameCard.style.marginLeft = "80px";
  p_nameCard.textContent = "Name Card: ";
  const input_nameCard = document.createElement("input");
  input_nameCard.style.marginLeft = "80px";
  const p_numberCard = document.createElement("p");
  p_numberCard.style.marginLeft = "80px";
  p_numberCard.textContent = "Insert the Number Card: ";
  const input_numberCard = document.createElement("input");
  input_numberCard.style.marginLeft = "80px";
  const button_submit = document.createElement("button");
  button_submit.id = "button_submit";
  button_submit.textContent = "Submit";
  button_submit.style.border = "4px, solid";
  button_submit.style.borderColor = "purple";
  button_submit.style.color = "purple";
  button_submit.style.width = "120px";
  button_submit.style.height = "30px";
  button_submit.style.marginLeft = "99px";
  button_submit.style.marginTop = "44px";

  //Function button submit
  button_submit.onclick = function () {
    swal({
      title: "Congratulations!",
      text: "You did your shop succesfully!",
      icon: "success",
      button: "Ok"
    });
  };

  // Button cancel
  const button_cancel = document.createElement("button");
  button_cancel.id = "button_price_total";
  button_cancel.textContent = "Cancel";
  button_cancel.style.border = "4px, solid";
  button_cancel.style.borderColor = "purple";
  button_cancel.style.color = "purple";
  button_cancel.style.width = "120px";
  button_cancel.style.height = "30px";
  button_cancel.style.marginLeft = "99px";
  button_cancel.style.marginTop = "14px";

  //Function button cancel
  button_cancel.onclick = function () {
    const submit_div = document.getElementById("submit_div");
    submit_div.innerHTML = " ";
  };

  submit_div.appendChild(p_name);
  submit_div.appendChild(input_name);
  submit_div.appendChild(p_dni);
  submit_div.appendChild(input_dni);
  submit_div.appendChild(p_nameCard);
  submit_div.appendChild(input_nameCard);
  submit_div.appendChild(p_numberCard);
  submit_div.appendChild(input_numberCard);
  submit_div.appendChild(button_submit);
  submit_div.appendChild(button_cancel);

  return submit_div
}
// =====================================================================================

// Init program .*

// Variables with the state of the app .*
const CARRITO = [];
const ARRAY_PRODUCTOS = []; // [Product]

// ==========================================================================================

// Create a button to clean everything in the shop .*
const button_clean = document.createElement("button");
button_clean.id = "button_price_total";
button_clean.textContent = "Clean";
button_clean.style.border = "4px, solid";
button_clean.style.borderColor = "purple";
button_clean.style.color = "purple";
button_clean.style.width = "120px";
button_clean.style.height = "30px";
button_clean.style.marginLeft = "99px";
button_clean.style.marginTop = "14px";
container_button_price_total.appendChild(button_clean);

// Function button clean .*
button_clean.onclick = function () {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover the shopping cart!",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then((willDelete) => {
    if (willDelete) {
      swal("Poof! Yours cart items has been deleted!", {
        icon: "success"
      });
      const ul_item = document.getElementById("ul_carrito");
      ul_item.innerHTML = " ";
      CARRITO.splice(0, CARRITO.length);
      localStorage.clear();

      console.log("CARRITO cleaned started ---");
      console.log(CARRITO);
      console.log("CARRITO cleaned ended ---");

      update_total_component()
    } else {
      swal("Your items are safe!");
    }
  });
};

// Create a button to clean everything in the shop .*
const button_submit_carrito = document.createElement("button");
button_submit_carrito.id = "button_submit_carrito";
button_submit_carrito.textContent = "Submit";
button_submit_carrito.style.border = "4px, solid";
button_submit_carrito.style.borderColor = "purple";
button_submit_carrito.style.color = "purple";
button_submit_carrito.style.width = "120px";
button_submit_carrito.style.height = "30px";
button_submit_carrito.style.marginLeft = "99px";
button_submit_carrito.style.marginTop = "14px";
container_button_price_total.appendChild(button_submit_carrito);

// Function button submit carrito.*
const submit_div = document.createElement("div");
submit_div.id = "submit_div";

button_submit_carrito.onclick = function () {
  if (CARRITO.length) {
    const submit_div = createSubmitForm()
    container_button_price_total.appendChild(submit_div);
  } else {
    swal("Ups!", "looks like you do not have any item to purchase!", "warning");
  }
};

// ========================================================================================

// Library .*

Toastify({
  text: "CoderHouse!",
  duration: 1000
}).showToast();

//

Toastify({
  text: "Welcome!",
  duration: 3000
}).showToast();

//====================================
