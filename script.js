const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.getElementById('scroll-to-book').addEventListener('click', () => {
    document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-check-circle"></i>' : '<i class="fa-solid fa-trash-can"></i>';
    toast.innerHTML = `${icon} ${message}`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

let cart = [];
const cartBody = document.getElementById('cart-body');
const totalAmountEl = document.getElementById('total-amount');

function updateCartUI() {
    cartBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color:#64748B;">Your cart is empty</td></tr>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td style="text-align: right; font-weight: 500;">₹${item.price.toFixed(2)}</td>
                </tr>
            `;
        });
    }
    
    totalAmountEl.textContent = `₹${total.toFixed(2)}`;
}

document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        
        const exists = cart.find(item => item.name === name);
        if (!exists) {
            cart.push({ name, price });
            updateCartUI();
            showToast(`${name} added to cart!`, 'success');
        } else {
            showToast(`${name} is already in the cart.`, 'error');
        }
    });
});

document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const initialLength = cart.length;
        cart = cart.filter(item => item.name !== name);
        
        if (cart.length < initialLength) {
            updateCartUI();
            showToast(`${name} removed from cart.`, 'error');
        }
    });
});

updateCartUI();

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    if (cart.length === 0) {
        alert("Please add at least one service to your cart before booking.");
        return;
    }

    const fullName = document.getElementById('full-name').value;
    const emailId = document.getElementById('email-id').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const totalAmount = document.getElementById('total-amount').textContent;

    let orderDetails = cart.map(item => item.name).join(', ');

    const templateParams = {
        to_name: fullName,
        user_email: emailId,
        user_phone: phoneNumber,
        order_details: orderDetails,
        total_amount: totalAmount
    };

    document.getElementById('success-msg').style.display = 'block';
    showToast(`Order Confirmed! Total: ${totalAmount}`, 'success');
    document.getElementById('booking-form').reset();
    cart = [];
    updateCartUI();

    setTimeout(() => {
        document.getElementById('success-msg').style.display = 'none';
    }, 5000);
});