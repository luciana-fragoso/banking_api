package com.mycompany.onlinebanking.request;

public class RequestError {

    public static final RequestError customerNotFound = new RequestError("customer not found");

    String error;

    private RequestError(String error) {
        this.error = error;
    }
}
