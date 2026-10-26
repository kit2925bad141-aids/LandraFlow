document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "billingForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                loadBilling
            );

        }

    }
);



async function loadBilling(
    event
) {

    event.preventDefault();


    const orderId =
        document
            .getElementById(
                "billingOrderId"
            )
            .value
            .trim();


    if (!orderId) {

        showToast(
            "Enter an Order ID",
            "error"
        );

        return;
    }


    try {

        const bill =
            await apiGet(
                `/billing?orderId=${encodeURIComponent(orderId)}`
            );


        console.log(
            "BILL:",
            bill
        );


        displayBilling(
            bill
        );


    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }
}



function displayBilling(
    bill
) {

    const result =
        document.getElementById(
            "billingResult"
        );


    result.innerHTML = `

        <div class="invoice">

            <div class="invoice-header">

                <div>

                    <p class="eyebrow">
                        LAUNDRAFLOW
                    </p>

                    <h2>
                        🧾 Invoice
                    </h2>

                </div>


                <div>

                    <strong>
                        Order #${bill.orderId}
                    </strong>

                    <br>

                    Payment:
                    ${escapeHTML(
                        bill.paymentStatus
                    )}

                </div>

            </div>


            <div class="invoice-row">

                <span>
                    🫧 Washing
                </span>

                <strong>
                    ${formatCurrency(
                        bill.washing
                    )}
                </strong>

            </div>


            <div class="invoice-row">

                <span>
                    👔 Ironing
                </span>

                <strong>
                    ${formatCurrency(
                        bill.ironing
                    )}
                </strong>

            </div>


            <div class="invoice-row">

                <span>
                    ✨ Dry Cleaning
                </span>

                <strong>
                    ${formatCurrency(
                        bill.dryCleaning
                    )}
                </strong>

            </div>


            <div class="invoice-row">

                <span>
                    🚚 Delivery
                </span>

                <strong>
                    ${formatCurrency(
                        bill.delivery
                    )}
                </strong>

            </div>


            <div class="invoice-row total">

                <strong>
                    Total Payable
                </strong>

                <strong>
                    ${formatCurrency(
                        bill.totalPayable
                    )}
                </strong>

            </div>


            <br>


            <div class="form-group">

                <label>
                    Payment Status
                </label>

                <select id="paymentStatus">

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Paid">
                        Paid
                    </option>

                    <option value="Failed">
                        Failed
                    </option>

                </select>

            </div>


            <br>


            <button
                id="updatePayment"
                class="btn gold">

                ✓ Update Payment

            </button>

        </div>

    `;


    document.getElementById(
        "paymentStatus"
    ).value =
        bill.paymentStatus;


    document
        .getElementById(
            "updatePayment"
        )
        .addEventListener(
            "click",
            () =>
                updatePayment(
                    bill.orderId
                )
        );
}



async function updatePayment(
    orderId
) {

    const paymentStatus =
        document
            .getElementById(
                "paymentStatus"
            )
            .value;


    try {

        const result =
            await apiPost(
                "/billing",
                {
                    orderId,
                    paymentStatus
                }
            );


        showToast(
            result.message ||
            "Payment updated successfully"
        );


        const fakeEvent =
            {
                preventDefault: () => {}
            };


        document
            .getElementById(
                "billingOrderId"
            )
            .value =
                orderId;


        await loadBilling(
            fakeEvent
        );


    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );
    }
}