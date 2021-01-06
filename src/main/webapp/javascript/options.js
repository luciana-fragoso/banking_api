/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    
    let customerIdentifier = getCustomerIdentifier();
    
    if (isNaN(customerIdentifier) || customerIdentifier === -1) {
        document.getElementById("customerData").append("You need to log in first");
        document.getElementById("customerData").style.visibility = "visible";
        document.getElementById("signOut").innerHTML = "<a class='nav-link' href='login.html'>Login</a>";
        document.getElementById("signOut").style.visibility = "visible";
        
        document.getElementById("mainMenu").style.visibility = "hidden";
        return;
    }

    
    $.getJSON('api/onlinebanking/customer/' + customerIdentifier, function (customer) {

        $("#hello").append("Welcome, " + customer.name);

        var sortCode, accountNumber;
        var aux;
        for (let i = 0; i < customer.accounts.length; i++) {
            const button = document.createElement("button");
            button.innerText = customer.accounts[i].sortCode + " - " + customer.accounts[i].accountNumber;
            button.id = "account" + i;
            button.setAttribute('class', 'btn btn-light btn-block');
            button.setAttribute('index', i);
            button.addEventListener("click", buttonClicked(i));
            $("#accounts").append(button);
        }

        function buttonClicked(index) {
            return function () {
                sortCode = customer.accounts[index].sortCode;
                accountNumber = customer.accounts[index].accountNumber;
                aux = "Sort Code: " + sortCode + " - Acc. Number: " + accountNumber;
                document.getElementById("currentAccount").append(aux);
                document.getElementById("accordion").style.visibility = "visible";
                document.getElementById("currentAccount").style.visibility = "visible";
                document.getElementById("newAccountDiv").style.visibility = "hidden";
                document.getElementById("newAccountInner").style.visibility = "hidden";

            };
        }

        $("#getBalance").click(function () {
            $.ajax({
                type: 'GET',
                url: 'api/onlinebanking/' + sortCode + '/' + accountNumber + '/getBalance',
                dataType: 'json',
                contentType: 'application/json'
            }).then(function (balance) {
                document.getElementById("currentBalance").innerHTML = "";
                document.getElementById("currentBalance").append("Current Balance: " + balance + '.0 \u20AC');
            });
        });


        $("#newLodgement").click(function () {
            document.getElementById("newLodgmenteOK").innerHTML = "\
                    <label for='valueLodgement'>Value</label>\n\
                    <input type='number' step='0.5' class='form-control' placeholder='Enter value for lodgement' id='valueLodgement' name='valueLodgement'>\n\
                    <h6 style='visibility:hidden' id='invalidLodgement' class='text-danger'><small>Invalid value entered</small></h6>\n\
                    <button type='submit' id='newLodgementButton' class='btn btn-secondary btn-block' style='margin-top:3%'>OK</button>";
            document.getElementById("newLodgmenteOK").style.visibility = "true";


            $("#newLodgementButton").click(function () {

                var value = parseFloat($("#valueLodgement").val());
                if (isNaN(value) || value <= 0)
                    document.getElementById("invalidLodgement").style.visibility = "visible";
                else {
                    $.ajax({
                        type: 'GET',
                        url: 'api/onlinebanking/' + sortCode + '/' + accountNumber + '/newLodgement',
                        data: {valueLodgement: parseFloat($("#valueLodgement").val())},
                        dataType: 'json',
                        contentType: 'application/json'
                    }).then(function (transaction) {

                        document.getElementById("newLodgmenteOK").innerHTML = "\
                <h6  class='text-info'>Current Balance:</h6><h6 class='text-muted'>" + transaction.postBalance + ".0 \u20AC</h6>\n\
                <h6 class='text-info'>Date:</h6><h6 class='text-muted'>" + transaction.date + "</h6>\n\
                <h6 class='text-info'>Description:</h6><h6 class='text-muted'>" + transaction.description + "</h6>\n\
                <button type='button' id='confirmLodgment' class='btn btn-secondary btn-block' style='margin-top:3%'>OK</button>";
                        $("#confirmLodgment").click(function () {
                            $("#collapseTwo").collapse("hide");
                            return;
                        });
                    });
                }
            });
        });



        $("#newWithdrawal").click(function () {
            document.getElementById("newWithdrawalOK").innerHTML = "\
            <label for='valueWithdrawal'>Value</label>\n\
            <input type='number' step='0.5' class='form-control' placeholder='Enter value for withdrawal' id='valueWithdrawal' name='valueWithdrawal'>\n\
            <h6 style='visibility:hidden' id='invalidWithdrawal' class='text-danger'><small>Invalid value entered</small></h6>\n\
            <button type='submit' id='newWithdrawalButton' class='btn btn-secondary btn-block' style='margin-top:3%'>OK</button>";
            document.getElementById("newWithdrawalOK").style.visibility = "true";

            $("#newWithdrawalButton").click(function () {
                var value = parseFloat($("#valueWithdrawal").val());
                if (isNaN(value) || value <= 0) {
                    document.getElementById("invalidWithdrawal").innerHTML = "<h6 style='visibility:visible' id='invalidWithdrawal' class='text-danger'><small>Invalid value entered</small></h6>";
                } else {
                    $.ajax({
                        type: 'GET',
                        url: 'api/onlinebanking/' + sortCode + '/' + accountNumber + '/newWithdrawal',
                        data: {valueWithdrawal: parseFloat($("#valueWithdrawal").val())},
                        dataType: 'json',
                        contentType: 'application/json',
                        error: function () {
                            document.getElementById("invalidWithdrawal").innerHTML = "<h6 style='visibility:visible' id='invalidWithdrawal' class='text-danger'><small>Amount greater than the balance</small></h6>";

                            return;
                        }
                    }).then(function (transaction) {

                        document.getElementById("newWithdrawalOK").innerHTML = "\
                <h6  class='text-info'>Current Balance:</h6><h6 class='text-muted'>" + transaction.postBalance + ".0 \u20AC</h6>\n\
                <h6 class='text-info'>Date:</h6><h6 class='text-muted'>" + transaction.date + "</h6>\n\
                <h6 class='text-info'>Description:</h6><h6 class='text-muted'>" + transaction.description + "</h6>\n\
                <button type='button' id='confirmWithdrawal' class='btn btn-secondary btn-block' style='margin-top:3%'>OK</button>";
                        $("#confirmWithdrawal").click(function () {
                            $("#collapseThree").collapse("hide");
                            return;
                        });
                    });
                }
            });
        });



        $("#allAccounts").click(function () {
            $("#collapseOne").collapse("hide");
            $("#collapseTwo").collapse("hide");
            $("#collapseThree").collapse("hide");
            $("#collapseFour").collapse("hide");
            $("#collapseFive").collapse("hide");
            document.getElementById("currentAccount").innerHTML = "";
            document.getElementById("accordion").style.visibility = "hidden";
            document.getElementById("newAccountDiv").style.visibility = "hidden";
            document.getElementById("newAccountInner").style.visibility = "hidden";
            $('#invalidWithdrawal').html('');
            $('#invalidLodgement').html('');
            $('#invalidTransfer').html('');
             $("#invalidSortCode").html('');
            return;
        });



        $("#newTransfer").click(function () {


            document.getElementById("newTransferOK").innerHTML =  
            "<div class='col-sm-6 text-center' style='display:inline-block;'><label for='sourceAccount'>Source Account</label>\n\
            <br><h6  class='text-info' style='display:inline-block; font-size:14px'>Sort Code -&nbsp</h6><h6 class='text-muted' style='display:inline-block; font-size:14px'>" + sortCode + "</h6>\n\
            <br><h6 class='text-info' style='display:inline-block; font-size:14px'>Account Number -&nbsp</h6><h6 class='text-muted' style='display:inline-block;font-size:14px'>" + accountNumber + "</h6></div>";


            $.ajax({
                type: 'GET',
                data: {sortCode, accountNumber},
                url: 'api/onlinebanking/getAllAccounts',
                dataType: 'json',
                contentType: 'application/json'

            }).then(function (accounts) {
                html = "<div class='col-sm-6 text-center ' style='display:inline-block;'><label for='destinAcccount'>Destin Account</label>\n\
                <br><h6  class='text-info' style='display:inline-block; font-size:14px'>Sort Code - Acc. Number&nbsp</h6>\n\
                <select class='form-control' id='destinAcccount'>";
                for (let i = 0; i < accounts.length; i++) {
                    html += "<option value=" + i + " class=w-50>" + accounts[i].sortCode + " - " + accounts[i].accountNumber + "</option>";
                }
                html += "</select></div>";
                $("#newTransferOK").append(html);
                html = "<br><br><label for='valueTransfer'>Value</label>\n\
            <input type='number' step='0.5' class='form-control' placeholder='Enter value for transfer' id='valueTransfer' name='valueTransfer'>\n\
            <h6 style='visibility:hidden' id='invalidTransfer' class='text-danger'><small>Invalid value entered</small></h6>\n\
            <button type='submit' id='newTransferButton' class='btn btn-secondary btn-block' style='margin-top:3%'>OK</button>";
                $("#newTransferOK").append(html);

                $("#newTransferButton").click(function () {

                    var value = parseFloat($("#valueTransfer").val());
                    if (isNaN(value) || value <= 0) {
                        document.getElementById("invalidTransfer").innerHTML = "<h6 style='visibility:visible' id='invalidWithdrawal' class='text-danger'><small>Invalid value entered</small></h6>";
                    } else {
                        var i = $('#sourceAccount').val();

                        var i = $('#destinAcccount').val();

                        $.ajax({
                            type: 'GET',
                            url: 'api/onlinebanking/' + sortCode + '/' + accountNumber + '/newTransfer',
                            data: {destinSortCode: accounts[i].sortCode, destinAccountNumber: accounts[i].accountNumber, value: parseFloat($("#valueTransfer").val())},
                            dataType: 'json',
                            contentType: 'application/json',
                            error: function () {
                                document.getElementById("invalidTransfer").innerHTML = "<h6 style='visibility:visible' id='invalidTransfer' class='text-danger'><small>Amount greater than the balance</small></h6>";
                                return;
                            }
                        }).then(function (transactions) {

                            document.getElementById("newTransferOK").innerHTML = "\
                <div class='col-5' style='display:inline-block'>\n\
                    <h6  class='text-info'>Current Balance:</h6><h6 class='text-muted'>" + transactions[0].postBalance + ".0 \u20AC</h6>\n\
                    <h6 class='text-info'>Date:</h6><h6 class='text-muted'>" + transactions[0].date + "</h6>\n\
                    <h6 class='text-info'>Description:</h6><h6 class='text-muted'>" + transactions[0].description + "</h6>\n\
                </div>\n\
                <div class='col-5' style='display:inline-block'>\n\
                    <h6  class='text-info'>Current Balance:</h6><h6 class='text-muted'>" + transactions[1].postBalance + ".0 \u20AC</h6>\n\
                    <h6 class='text-info'>Date:</h6><h6 class='text-muted'>" + transactions[1].date + "</h6>\n\
                    <h6 class='text-info'>Description:</h6>\n\
                    <h6 class='text-muted'>" + transactions[1].description + "</h6>\n\
                </div>\n\
                <button type='button' id='confirmTransfer' class='btn btn-secondary btn-block' style='margin-top:3%'>OK</button>";
                        
                            document.getElementById("newTransferOK").style.visibility = "visible";
                            $("#confirmTransfer").click(function () {
                                document.getElementById("newTransferOK").innerHTML = "";
                                $("#collapseFour").collapse("hide");
                                return;
                            });
                        });
                    }
                });


            });

        });



        $("#newAccountButtonDiv").click(function () {
            
                      
           document.getElementById("newAccountInner").style.visibility = "visible";
            document.getElementById("newAccountDiv").style.visibility = "visible";
            document.getElementById("accordion").style.visibility = "hidden";
            document.getElementById("currentAccount").innerHTML = "";

            $('#invalidWithdrawal').html('');
            $('#invalidLodgement').html('');
            $('#invalidTransfer').html('');
           
            document.getElementById("newAccountInner").innerHTML = "\
            <div class='row justify-content-center'>\n\
                <h5 class='text-info' style='margin-top:0%; margin-bottom: 2%;'>Adding a New Account</h5>\n\
            </div>\n\
            <label for='newSortCode'>Sort Code</label>\n\
            <input type='number' class='form-control' placeholder='Enter Sort Code' id='newSortCode' name='newSortCode'>\n\
            <h6 class='mb-0'><small>Only numbers</small></h6>\n\
            <h6 style='visibility:hidden' id='invalidSortCode' class='text-danger'><small>This field is mandatory</small></h6>\n\
            <h6 class='text-info' style='float:left;'>\n\
            <br>Account Number will be generated automatically</h6>\n\
            <button type='submit' id='newAccountButton' class='btn btn-secondary btn-block' style='margin-top:8%'>OK</button>";
            
            
            $("#newAccountButton").click(function () {
                var newSortCode = parseInt($("#newSortCode").val());
            
            if (isNaN(newSortCode) || newSortCode <= 0 ){
                document.getElementById("invalidSortCode").style.visibility = "visible";
            } 
           else {
                $.ajax({
                    type: 'GET',
                    url: 'api/onlinebanking/' + customer.email + '/createAccount',
                    data: {sortCode: parseInt($("#newSortCode").val())},
                    dataType: 'json',
                    contentType: 'application/json'
                    
                }).then(function (account) {
                    document.getElementById("newAccountInner").innerHTML = "\
                <h6  class='text-info text-center'>New Account Info</h6>\n\
                 <h6  class='text-info'>Sort Code</h6><h6 class='text-muted'>" + account.sortCode + "</h6>\n\
                 <h6  class='text-info'>Account Number</h6><h6 class='text-muted'>" + account.accountNumber + "</h6>\n\
                 <h6  class='text-info'>Current Balance</h6><h6 class='text-muted'>" + account.currentBalance + ".0 \u20AC</h6>\n\
                 <button type='submit' id='confirmNewAccount' class='btn btn-secondary btn-block' style='margin-top:3 %'>Close</button>";
                    document.getElementById("newAccountInner").style.visibility = "visible";

                    var newButton = document.createElement("button");
                    let accountIndex = customer.accounts.length;

                    customer.accounts.push(account);
                    newButton.innerText = account.sortCode + " - " + account.accountNumber;
                    newButton.id = "account" + accountIndex;
                    newButton.setAttribute('class', 'btn btn-light btn-block');
                    newButton.setAttribute('index', accountIndex);
                    newButton.addEventListener("click", buttonClicked(accountIndex));
                    $("#accounts").append(newButton);


                    
                    $("#confirmNewAccount").click(function () {

                        document.getElementById("newAccountInner").style.visibility = "hidden";
                        document.getElementById("newAccountDiv").style.visibility = "hidden";

                        return;
                    });

                });
           }
        });
  
         
           $("#newSortCode").click(function () {
            document.getElementById("invalidSortCode").style.visibility = "hidden";
        }); 
            
            
        });

        $("#newHistory").click(function () {
            document.getElementById("newHistoryOK").innerHTML = "";
            $.ajax({
                type: 'GET',
                url: 'api/onlinebanking/' + customer.email + '/transactionHistory',
                data: {sortCode, accountNumber},
                dataType: 'json',
                error: function () {
                    document.getElementById("newHistoryOK").innerHTML = "<h6 class='text-info text-center'>The list of transactions is empty</h6>";
                    document.getElementById("newHistoryOK").style.visibility = "visible";
                    return;
                },
                contentType: 'application/json'
            }).then(function (transactions) {
                document.getElementById("newHistoryOK").innerHTML = "<h6 class='text-info text-center'>List of Transactions</h6>";
                var code = "<div class= 'row justify-content-center'><div class='text-left'>";
                for (var i = 0; i < transactions.length; i++) {
                    code += "<br><h6 class='text-info' style='display:inline-block'>" + (i + 1) + " - Transaction </h6>\n\
                   <br><h6 class='text-info' style='display:inline-block'>Description:&nbsp</h6><h6 class='text-muted' style='display:inline-block'>" + transactions[i].description + "</h6>\n\
                   <br><h6 class='text-info' style='display:inline-block'>Date:&nbsp</h6><h6 class='text-muted' style='display:inline-block'>" + transactions[i].date + "</h6>\n\
                   <br><h6 class='text-info' style='display:inline-block'>Value:&nbsp</h6><h6 class='text-muted' style='display:inline-block'>" + transactions[i].value + ".0 \u20AC</h6>\n\
                   <br><h6 class='text-info' style='display:inline-block'>Post Balance:&nbsp</h6><h6 class='text-muted' style='display:inline-block'>" + transactions[i].postBalance + ".0 \u20AC</h6>";
                    code += "<br>---------------------------------------";
                }
                code += "</div></div>";
                $("#newHistoryOK").append(code);


                document.getElementById("newHistoryOK").style.visibility = "visible";
            });
        });
        
        
    });
});

