const API_BASE = "http://localhost:8080/LaundraFlow";


async function apiGet(endpoint) {

    const response =
        await fetch(API_BASE + endpoint);

    if (!response.ok) {

        throw new Error(
            "Request failed: " + response.status
        );

    }

    return await response.json();
}



async function apiPost(endpoint, data) {

    const response =
        await fetch(
            API_BASE + endpoint,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body:
                    new URLSearchParams(data)
            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        throw new Error(
            result.error ||
            "Request failed"
        );

    }


    return result;
}



function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");


    if (!toast) {

        alert(message);

        return;
    }


    toast.textContent = message;

    toast.className =
        "toast " + type;


    setTimeout(() => {

        toast.className =
            "toast";

    }, 3000);

}



function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0)
            .toFixed(2);

}



function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}