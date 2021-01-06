$(function () {
    $("#signupButton").click(function () {

        var name = $("#name").val();
        var address = $("#address").val();
        var email = $("#email").val();
        var credentials = $("#credentials").val();



        if (name === "" || email === "" || address === "" || credentials === "") {
            document.getElementById("warning").innerHTML = "\n\
                <h6 class='text-danger text-center' style='visibility:visible;' id='invalidSignUp'>\n\
                All fields are mandatory</h6>";
        } else {
            var customer = "{name:'" + name + "',address:'" + address + "',email:'" + email + "',credentials:'" + credentials + "'}";
            $.ajax({
                type: "POST",
                url: "api/onlinebanking/createCustomer",
                data: customer,
                dataType: "json",
                contentType: "application/json",
                error: function () {
                    document.getElementById("warning").innerHTML = "\n\
                <h6 class='text-danger text-center' style='visibility:visible;' id='invalidSignUp'>\n\
                Email already registered in the system</h6>";
                }
            }).then(function (customer) {
                setCustomerIdentifier(customer.identifier);
                window.location.href = "index.html";
            });

        }

        $("#name").click(function () {
            document.getElementById("warning").innerHTML = "";
        });
        $("#address").click(function () {
            document.getElementById("warning").innerHTML = "";
        });
        $("#email").click(function () {
            document.getElementById("warning").innerHTML = "";
        });
        $("#credentials").click(function () {
            document.getElementById("warning").innerHTML = "";
        });

    });
});
