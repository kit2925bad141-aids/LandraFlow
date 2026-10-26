document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "trackingForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                searchOrder
            );

        }


        const updateForm =
            document.getElementById(
                "statusForm"
            );


        if (updateForm) {

            updateForm.addEventListener(
                "submit",
                updateStatus
            );

        }

    }
);



async function searchOrder(event) {

    event.preventDefault();


    const orderId =
        document.getElementById(
            "trackingOrderId"
        ).value.trim();


    if (!orderId) {

        showToast(
            "Enter an Order ID",
            "error"
        );

        return;
    }


    try {

        const order =
            await apiGet(
                `/tracking?orderId=${encodeURIComponent(orderId)}`
            );


        displayTracking(order);


    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}



function displayTracking(order) {

    const result =
        document.getElementById(
            "trackingResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <div class="tracking-card">

            <h2>
                📦 Order #${order.orderId}
            </h2>

            <div class="tracking-status">

                <span class="badge status-${String(
                    order.status
                ).toLowerCase()}">

                    ${escapeHTML(
                        order.status
                    )}

                </span>

            </div>


            <div class="tracking-info">

                <p>

                    <strong>
                        Payment
                    </strong>

                    <br>

                    ${escapeHTML(
                        order.paymentStatus
                    )}

                </p>


                <p>

                    <strong>
                        Total
                    </strong>

                    <br>

                    ${formatCurrency(
                        order.totalAmount
                    )}

                </p>

            </div>

        </div>

    `;


    const statusSelect =
        document.getElementById(
            "status"
        );


    if (statusSelect) {

        statusSelect.value =
            order.status;

    }

}



async function updateStatus(event) {

    event.preventDefault();


    const orderId =
        document.getElementById(
            "trackingOrderId"
        ).value.trim();


    const status =
        document.getElementById(
            "status"
        ).value;


    if (!orderId) {

        showToast(
            "Enter an Order ID first",
            "error"
        );

        return;
    }


    try {

        const result =
            await apiPost(
                "/tracking",
                {
                    orderId,
                    status
                }
            );


        showToast(
            result.message ||
            "Status updated successfully"
        );


        await loadTrackingOrder(
            orderId
        );


    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}



async function loadTrackingOrder(
    orderId
) {

    try {

        const order =
            await apiGet(
                `/tracking?orderId=${encodeURIComponent(orderId)}`
            );


        displayTracking(order);

    } catch (error) {

        console.error(error);

    }

}