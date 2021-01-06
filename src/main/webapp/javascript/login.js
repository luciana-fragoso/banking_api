
$(function () {
    $("#loginButton").click(function () {
        $.ajax({
            type: 'POST',
            url: 'api/onlinebanking/customerLogin',
            data: JSON.stringify({
                email: $("#email").val(),
                credentials: parseInt($("#credentials").val())
            }),
            dataType: 'json',
            contentType: 'application/json',
            error: function () {
                document.getElementById("invalid").style.visibility = "visible";
            }
        }).then(function (customer) {
            setCustomerIdentifier(customer.identifier);
            window.location.href = 'options.html';
        });
    });
});

