/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.onlinebanking.model;

import java.util.Date;

/**
 *
 * @author Luciana
 */
public class Transaction {

    private char type;
    private double value;
    private Date date;
    private String description;
    private double postBalance;

    public Transaction(char type, double value, String description, double postBalance) {
        this.type = type;
        this.value = value;
        this.date = new Date();
        this.description = description;
        this.postBalance = postBalance;
    }

    public char getType() {
        return type;
    }

    public void setType(char type) {
        this.type = type;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPostBalance() {
        return postBalance;
    }

    public void setPostBalance(double postBalance) {
        this.postBalance = postBalance;
    }

}
