document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);


async function loadDashboard() {

    try {

        const orders =
            await apiGet("/order");


        updateDashboard(orders);

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to load dashboard",
            "error"
        );

    }

}



function updateDashboard(orders) {

    const totalOrders =
        orders.length;


    // Processing = Washing + Ironing
    const processingOrders =
        orders.filter(
            order =>
                order.orderStatus === "Washing" ||
                order.orderStatus === "Ironing"
        ).length;


    const readyOrders =
        orders.filter(
            order =>
                order.orderStatus === "Ready"
        ).length;


    const revenue =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(order.totalAmount || 0),
            0
        );


    document.getElementById(
        "totalOrders"
    ).textContent =
        totalOrders;


    document.getElementById(
        "processingOrders"
    ).textContent =
        processingOrders;


    document.getElementById(
        "readyOrders"
    ).textContent =
        readyOrders;


    document.getElementById(
        "revenue"
    ).textContent =
        formatCurrency(revenue);


    displayRecentOrders(orders);

}



function displayRecentOrders(orders) {

    const table =
        document.getElementById(
            "recentOrders"
        );


    if (!table) {
        return;
    }


    if (!orders.length) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty">
                        No orders found.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    const recent =
        [...orders]
            .reverse()
            .slice(0, 5);


    table.innerHTML =
        recent.map(order => `

            <tr>

                <td>
                    #${order.orderId}
                </td>

                <td>
                    ${order.customerId}
                </td>

                <td>
                    ${escapeHTML(
                        order.orderDate
                    )}
                </td>

                <td class="money">
                    ${formatCurrency(
                        order.totalAmount
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        order.paymentStatus
                    )}
                </td>

                <td>
                    <span class="badge status-${String(
                        order.orderStatus
                    ).toLowerCase()}">

                        ${escapeHTML(
                            order.orderStatus
                        )}

                    </span>
                </td>

            </tr>

        `).join("");

}