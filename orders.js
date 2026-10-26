let itemCounter = 0;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", async function () {

    await loadCustomers();

    addOrderItem();


    const addButton = document.getElementById("addItem");

    if (addButton) {
        addButton.addEventListener("click", addOrderItem);
    }


    const orderForm = document.getElementById("orderForm");

    if (orderForm) {
        orderForm.addEventListener("submit", createOrder);
    }

});


// ======================================================
// LOAD CUSTOMERS
// ======================================================

async function loadCustomers() {

    const customerSelect =
        document.getElementById("customerId");


    if (!customerSelect) {
        return;
    }


    try {

        const response = await fetch(
            "http://localhost:8080/LaundraFlow/customer"
        );


        if (!response.ok) {

            throw new Error(
                "Customer API error: " + response.status
            );

        }


        const customers = await response.json();


        console.log("Customers:", customers);


        customerSelect.innerHTML = `
            <option value="">
                Select Customer
            </option>
        `;


        customers.forEach(function (customer) {

            const option =
                document.createElement("option");


            option.value =
                customer.customerId;


            option.textContent =
                customer.name +
                " - " +
                customer.phone;


            customerSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Customer loading error:",
            error
        );


        showToast(
            "Unable to load customers",
            "error"
        );

    }
}


// ======================================================
// ADD ORDER ITEM
// ======================================================

function addOrderItem() {

    const container =
        document.getElementById("orderItems");


    if (!container) {
        return;
    }


    const row =
        document.createElement("div");


    row.className = "order-item";


    row.innerHTML = `

        <div class="form-group">

            <label>Garment Name</label>

            <input
                type="text"
                class="garment-name"
                placeholder="Example: Shirt"
                required
            >

        </div>


        <div class="form-group">

            <label>Service</label>

            <select
                class="service-type"
                required
            >

                <option value="">
                    Select Service
                </option>

                <option value="Washing">
                    Washing - ₹50
                </option>

                <option value="Ironing">
                    Ironing - ₹25
                </option>

                <option value="Dry Cleaning">
                    Dry Cleaning - ₹120
                </option>

            </select>

        </div>


        <div class="form-group">

            <label>Quantity</label>

            <input
                type="number"
                class="quantity"
                min="1"
                value="1"
                required
            >

        </div>


        <div class="form-group">

            <label>Action</label>

            <button
                type="button"
                class="btn danger remove-item"
            >
                Remove
            </button>

        </div>

    `;


    container.appendChild(row);


    // Remove button
    const removeButton =
        row.querySelector(".remove-item");


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

            calculateTotal();

        }
    );


    // Service change
    row.querySelector(".service-type")
        .addEventListener(
            "change",
            calculateTotal
        );


    // Quantity change
    row.querySelector(".quantity")
        .addEventListener(
            "input",
            calculateTotal
        );


    calculateTotal();
}


// ======================================================
// GET SERVICE PRICE
// ======================================================

function getPrice(serviceType) {

    if (serviceType === "Washing") {
        return 50;
    }


    if (serviceType === "Ironing") {
        return 25;
    }


    if (serviceType === "Dry Cleaning") {
        return 120;
    }


    return 0;
}


// ======================================================
// CALCULATE TOTAL
// ======================================================

function calculateTotal() {

    const rows =
        document.querySelectorAll(".order-item");


    let total = 50; // Delivery charge


    rows.forEach(function (row) {

        const service =
            row.querySelector(".service-type").value;


        const quantity =
            Number(
                row.querySelector(".quantity").value
            ) || 0;


        const price =
            getPrice(service);


        total += price * quantity;

    });


    const totalElement =
        document.getElementById("orderTotal");


    if (totalElement) {

        totalElement.textContent =
            "₹" + total.toFixed(2);

    }
}


// ======================================================
// CREATE ORDER
// ======================================================

async function createOrder(event) {

    event.preventDefault();


    console.log("CREATE ORDER STARTED");


    // --------------------------------------------------
    // Customer
    // --------------------------------------------------

    const customerId =
        document.getElementById("customerId").value;


    if (!customerId) {

        showToast(
            "Please select a customer",
            "error"
        );

        return;
    }


    // --------------------------------------------------
    // Order rows
    // --------------------------------------------------

    const rows =
        document.querySelectorAll(".order-item");


    if (rows.length === 0) {

        showToast(
            "Please add at least one item",
            "error"
        );

        return;
    }


    // ==================================================
    // IMPORTANT
    //
    // Send as application/x-www-form-urlencoded
    // because Java uses request.getParameter()
    // ==================================================

    const formData =
        new URLSearchParams();


    // Customer
    formData.append(
        "customerId",
        customerId
    );


    // Number of items
    formData.append(
        "itemCount",
        rows.length
    );


    let total = 50;


    // ==================================================
    // READ EVERY ITEM
    // ==================================================

    for (
        let i = 0;
        i < rows.length;
        i++
    ) {

        const row = rows[i];


        // ----------------------------------------------
        // Garment
        // ----------------------------------------------

        const clothType =
            row.querySelector(
                ".garment-name"
            ).value.trim();


        // ----------------------------------------------
        // Service
        // ----------------------------------------------

        const serviceType =
            row.querySelector(
                ".service-type"
            ).value;


        // ----------------------------------------------
        // Quantity
        // ----------------------------------------------

        const quantity =
            Number(
                row.querySelector(
                    ".quantity"
                ).value
            );


        console.log(
            "ITEM",
            i,
            clothType,
            serviceType,
            quantity
        );


        // ----------------------------------------------
        // Validation
        // ----------------------------------------------

        if (!clothType) {

            showToast(
                "Enter garment name for item " +
                (i + 1),
                "error"
            );

            return;
        }


        if (!serviceType) {

            showToast(
                "Select service for item " +
                (i + 1),
                "error"
            );

            return;
        }


        if (!quantity || quantity <= 0) {

            showToast(
                "Enter valid quantity for item " +
                (i + 1),
                "error"
            );

            return;
        }


        // ----------------------------------------------
        // Price
        // ----------------------------------------------

        const unitPrice =
            getPrice(serviceType);


        const subtotal =
            unitPrice * quantity;


        total += subtotal;


        // ==================================================
        // THESE NAMES MUST EXACTLY MATCH OrderServlet.java
        // ==================================================

        formData.append(
            "clothType" + i,
            clothType
        );


        formData.append(
            "serviceType" + i,
            serviceType
        );


        formData.append(
            "quantity" + i,
            quantity
        );


        formData.append(
            "unitPrice" + i,
            unitPrice
        );


        formData.append(
            "subtotal" + i,
            subtotal
        );

    }


    // Browser total
    formData.append(
        "totalAmount",
        total.toFixed(2)
    );


    // ==================================================
    // DEBUG
    // ==================================================

    console.log(
        "DATA BEING SENT:"
    );


    for (const [key, value] of formData.entries()) {

        console.log(
            key + " = " + value
        );

    }


    // ==================================================
    // SEND TO JAVA SERVLET
    // ==================================================

    try {

        const response =
            await fetch(
                "http://localhost:8080/LaundraFlow/order",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8"
                    },

                    body: formData

                }
            );


        // ------------------------------------------------
        // Read response
        // ------------------------------------------------

        const text =
            await response.text();


        console.log(
            "SERVER RESPONSE:",
            text
        );


        let result;


        try {

            result =
                JSON.parse(text);

        } catch (error) {

            throw new Error(
                "Server returned invalid response: " +
                text
            );

        }


        // ------------------------------------------------
        // Server error
        // ------------------------------------------------

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Order creation failed"
            );

        }


        // ------------------------------------------------
        // Success
        // ------------------------------------------------

        showToast(
            "Order #" +
            result.orderId +
            " created successfully",
            "success"
        );


        console.log(
            "ORDER CREATED:",
            result
        );


        // ------------------------------------------------
        // Reset form
        // ------------------------------------------------

        document
            .getElementById("orderForm")
            .reset();


        document
            .getElementById("orderItems")
            .innerHTML = "";


        // Add fresh item
        addOrderItem();


        calculateTotal();


    } catch (error) {

        console.error(
            "CREATE ORDER ERROR:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }
}