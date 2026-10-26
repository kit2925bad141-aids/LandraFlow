document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCustomers();


        const form =
            document.getElementById(
                "customerForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                addCustomer
            );

        }

    }
);



async function loadCustomers() {

    const table =
        document.getElementById(
            "customerTable"
        );


    if (!table) {
        return;
    }


    try {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Loading customers...
                </td>
            </tr>
        `;


        const customers =
            await apiGet(
                "/customer"
            );


        console.log(
            "Customers received:",
            customers
        );


        if (
            !Array.isArray(
                customers
            )
        ) {

            throw new Error(
                "Invalid customer response"
            );

        }


        if (
            customers.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No customers found.
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML =
            customers.map(
                customer => `

                <tr>

                    <td>
                        #${customer.customerId}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.phone
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.email
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer.address
                        )}
                    </td>

                </tr>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Customer loading error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="5">

                    <div class="error-box">

                        Unable to load customers.

                        <br>

                        ${escapeHTML(
                            error.message
                        )}

                    </div>

                </td>
            </tr>
        `;


        showToast(
            error.message,
            "error"
        );
    }
}



async function addCustomer(
    event
) {

    event.preventDefault();


    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const phone =
        document
            .getElementById("phone")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const address =
        document
            .getElementById("address")
            .value
            .trim();


    if (!name || !phone) {

        showToast(
            "Name and phone are required",
            "error"
        );

        return;
    }


    try {

        const result =
            await apiPost(
                "/customer",
                {
                    name,
                    phone,
                    email,
                    address
                }
            );


        showToast(
            result.message ||
            "Customer added successfully"
        );


        document
            .getElementById(
                "customerForm"
            )
            .reset();


        await loadCustomers();


    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );
    }
}