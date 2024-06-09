document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 20000 },
            { id: 2, name: 'Arabica Blend', img: '2.jpg', price: 25000 },
            { id: 3, name: 'Primo Passo', img: '3.jpg', price: 30000 },
            { id: 4, name: 'Aceh Gayo', img: '4.jpg', price: 35000 },
            { id: 5, name: 'Sumatra Madheling', img: '5.jpg', price: 40000 },
        ],

    }));
    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,

        add(newItem) {
            //cek barang yang sama
            const cartItem = this.items.find((item) => item.id === newItem.id);

            //jika blm ada

            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // cek barang ada
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang suadah ada
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },

        remove(id) {
            // ambil item
            const cartItem = this.items.find((item) => item.id === id);

            //item lebih dari 1
            if (cartItem.quantity > 1) {
                this.items = this.items.map((item) => {
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;

            }
        },
    });
});

// form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');
form.addEventListener('keyup', function(){
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        }else{
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika checkout
checkoutButton.addEventListener('click', function(e){
e.preventDefault();

const formData = new FormData(form);
const data = new URLSearchParams(formData);
const objData = Object.fromEntries(data);
const message = formatMessage(objData);
window.open('http://wa.me/6282219508488?text='+ encodeURIComponent(message));
});

// format wa
const formatMessage = (obj) =>{
    return `*Data Customer*
    Nama: ${obj.nama}
    Email: ${obj.email}
    No Hp: ${obj.phone}
\n*Data Pesanan*
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} * ${rupiah(item.total)}) \n` )}

TOTAL BELANJA: ${rupiah(obj.total)} 

TERIMA KASIH.
`;
}


// konversi rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

