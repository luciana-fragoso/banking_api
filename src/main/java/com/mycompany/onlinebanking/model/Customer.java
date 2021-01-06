/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.onlinebanking.model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Luciana
 */
public class Customer {

    private static final int defaultSortCode = 100;

    private int identifier;
    private String name;
    private String address;
    private String email;
    private int credentials;
    private final List<Account> accounts;

    public Customer(String name,String address,String email,int credentials) {
        this.name = name;
        this.address = address;
        this.email = email;
        this.credentials = credentials;
        accounts = new ArrayList();
        this.accounts.add(0, new Account(defaultSortCode));

    }

    public int getIdentifier() {
        return identifier;
    }

    public void setIdentifier(int identifier) {
        this.identifier = identifier;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getCredentials() {
        return credentials;
    }

    public void setCredentials(int credentials) {
        this.credentials = credentials;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void addAccount(Account account) {
        this.accounts.add(account);
    }

}
