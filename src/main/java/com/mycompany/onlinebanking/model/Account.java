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
public class Account {

    private static int aux = 1;

    private int sortCode;
    private int accountNumber;
    private double currentBalance;
    private List<Transaction> transaction;

    public Account(int sortCode) {
        if (sortCode == 100) {
            this.sortCode = sortCode++;
        } else {
            this.sortCode = sortCode;
        }
        this.accountNumber = sortCode + (aux);
        this.currentBalance = 0.0;
        this.transaction = new ArrayList();
        aux++;
    }

    public int getSortCode() {
        return sortCode;
    }

    public void setSortCode(int sortCode) {
        this.sortCode = sortCode;
    }

    public int getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(int accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(double currentBalance) {
        this.currentBalance = currentBalance;
    }

    public List<Transaction> getTransactions() {
        return transaction;
    }

    public void addTransaction(Transaction transaction) {
        setCurrentBalance(transaction.getPostBalance());
        this.transaction.add(transaction);
    }

}
