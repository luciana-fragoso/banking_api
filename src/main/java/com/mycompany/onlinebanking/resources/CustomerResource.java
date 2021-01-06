/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.onlinebanking.resources;

import com.google.gson.Gson;
import com.mycompany.onlinebanking.model.Account;
import com.mycompany.onlinebanking.model.Customer;
import com.mycompany.onlinebanking.model.Transaction;
import com.mycompany.onlinebanking.request.LoginRequestData;
import com.mycompany.onlinebanking.request.RequestError;
import com.mycompany.onlinebanking.services.CustomerService;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import javax.servlet.http.HttpServlet;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Luciana
 */
@Path("/onlinebanking")
public class CustomerResource extends HttpServlet {

    public static CustomerService cs = new CustomerService();
    public static Gson gson = new Gson();

    //curl -v -X POST "http://localhost:49000/api/onlinebanking/createCustomer/" -d {"name":"'Freddie Mercury'","address":"'35 Liffey Street South'","email":"'freddie@gmail.com'","credentials":123}
    @POST
    @Path("/createCustomer")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCustomer(String body) throws UnsupportedEncodingException, IOException {
        Customer requestData = gson.fromJson(body, Customer.class);
        Customer c = new Customer(requestData.getName(), requestData.getAddress(), requestData.getEmail(), requestData.getCredentials());
        Customer customer = cs.createCustomer(c);
        if (customer != null) {
            return Response.status(Response.Status.CREATED).entity(gson.toJson(customer)).build();
        } else {
            return Response.status(404).build();
        }
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/customer/5"
    @GET
    @Path("/customer/{identifier}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCustomer(@PathParam("identifier") int identifier) {
        Customer c = cs.getCustomer(identifier);

        if (c != null) {
            return Response.status(Response.Status.OK).entity(gson.toJson(c)).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity(gson.toJson(RequestError.customerNotFound)).build();
        }
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/freddie@gmail.com/createAccount/?sortCode=100"
    @GET
    @Path("{email}/createAccount")
    public Response createAccount(@PathParam("email") String email, @QueryParam("sortCode") int sortCode) {
        Account account = cs.createAccount(email, sortCode);
        if (account == null) {
            return Response.status(404).build();
        } else {
            return Response.status(Response.Status.CREATED).entity(gson.toJson(account)).build();
        }

    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/100/113/newLodgement?valueLodgement=85.0"
    @GET
    @Path("{sortCode}/{accountNumber}/newLodgement")
    @Produces(MediaType.APPLICATION_JSON)
    public Response newLodgement(@PathParam("sortCode") int sortCode, @PathParam("accountNumber") int accountNumber, @QueryParam("valueLodgement") double value) {

        Transaction transaction = cs.newLodgement(sortCode, accountNumber, value);

        return Response.status(Response.Status.CREATED).entity(gson.toJson(transaction)).build();
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/100/113/newWithdrawal?valueWithdrawal=20.0"
    @GET
    @Path("{sortCode}/{accountNumber}/newWithdrawal")
    @Produces(MediaType.APPLICATION_JSON)
    public Response newWithdrawal(@PathParam("sortCode") int sortCode, @PathParam("accountNumber") int accountNumber, @QueryParam("valueWithdrawal") double value) {
        Transaction transaction = cs.newWithdrawal(sortCode, accountNumber, value);
        if (transaction != null) {
            return Response.status(Response.Status.CREATED).entity(gson.toJson(transaction)).build();
        } else {
            return Response.status(404).build();
        }
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/100/113/getBalance"
    @GET
    @Path("{sortCode}/{accountNumber}/getBalance")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBalance(@PathParam("sortCode") int sortCode, @PathParam("accountNumber") int accountNumber) {
        Double currentBalance = cs.getBalance(sortCode, accountNumber);

        return Response.status(Response.Status.CREATED).entity(gson.toJson(currentBalance)).build();
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/100/113/newTransfer/?destinSortCode=100&destinAccountNumber=114&value=30.5"
    @GET
    @Path("{sortCode}/{accountNumber}/newTransfer")
    @Produces(MediaType.APPLICATION_JSON)
    public Response newTransfer(@PathParam("sortCode") int sortCode, @PathParam("accountNumber") int accountNumber, @QueryParam("destinSortCode") int destinSortCode, @QueryParam("destinAccountNumber") int destinAccountNumber, @QueryParam("value") double value) {

        List<Transaction> transaction = cs.newTransfer(sortCode, accountNumber, destinSortCode, destinAccountNumber, value);
        if (transaction != null) {
            return Response.status(Response.Status.CREATED).entity(gson.toJson(transaction)).build();
        } else {
            return Response.status(404).build();
        }
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/freddie@gmail.com/transactionHistory?sortCode=100&accountNumber=113
    @GET
    @Path("{email}/transactionHistory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response transactionHistory(@PathParam("email") String email, @QueryParam("sortCode") int sortCode, @QueryParam("accountNumber") int accountNumber) {

        List<Transaction> transactions = cs.transactionHistory(sortCode, accountNumber);
        if (transactions.isEmpty()) {
            return Response.status(404).build();
        } else {
            return Response.status(Response.Status.CREATED).entity(gson.toJson(transactions)).build();
        }
    }

    // curl -v -X POST "http://localhost:49000/api/onlinebanking/customerLogin" -d {"email":"freddie@gmail.com","credentials":123}
    @POST
    @Path("/customerLogin")
    @Produces(MediaType.APPLICATION_JSON)
    public Response customerLogin(String body) {
        LoginRequestData requestData = gson.fromJson(body, LoginRequestData.class);
        Customer customer = cs.customerLogin(requestData.email, requestData.credentials);

        if (customer != null) {
            return Response.status(Response.Status.OK).entity(gson.toJson(customer)).build();
        } else {
            return Response.status(404).build();
        }
    }

    //curl -vi -X GET -G "http://localhost:49000/api/onlinebanking/getAllAccounts?sortCode=123&accountNumber=136
    @GET
    @Path("/getAllAccounts")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAccounts(@QueryParam("sourceCode") int sourceCode, @QueryParam("accountNumber") int accountNumber) {

        List<Account> accounts = cs.getAllAccounts(sourceCode, accountNumber);

        return Response.status(Response.Status.CREATED).entity(gson.toJson(accounts)).build();
    }
}
