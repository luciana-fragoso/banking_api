/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.onlinebanking.services;

import com.mycompany.onlinebanking.model.Account;
import com.mycompany.onlinebanking.model.Customer;
import com.mycompany.onlinebanking.model.Transaction;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Luciana
 */
public class CustomerService {

    public static List<Customer> customers = new ArrayList();

    
    //public static List<Account> accounts = new ArrayList();

    public CustomerService() {

        Customer c1 = new Customer("Brian May", "45 Dalcassian", "brian@gmail.com", 123);
        Customer c2 = new Customer("Roger Taylor", "40 Connaught Street", "roger@gmail.com", 123);
        Customer c3 = new Customer("John Deacon", "2 Santry Avenue", "john@gmail.com", 123);
        Customer c4 = new Customer("Paul McCartney", "5 Melville Cove", "paul@gmail.com", 123);

        c1.setIdentifier(1);
        c2.setIdentifier(2);
        c3.setIdentifier(3);
        c4.setIdentifier(4);
        customers.add(c1);
        customers.add(c2);
        customers.add(c3);
        customers.add(c4);

        c1.addAccount(new Account(101));
        c2.addAccount(new Account(102));
        c2.addAccount(new Account(102));
        c3.addAccount(new Account(103));
        c3.addAccount(new Account(103));
        c3.addAccount(new Account(103));
        c4.addAccount(new Account(104));

    }

    public Customer createCustomer(Customer c) {
        c.setIdentifier(customers.size() + 1);
        for (Customer auxCustomer : customers) {
            if (auxCustomer.getEmail().equalsIgnoreCase(c.getEmail())) {
                return null;
            }
        }
        customers.add(c);
        return c;
    }

    public Account createAccount(String email, int sortCode) {
        for (Customer c : customers) {
            if (c.getEmail().equalsIgnoreCase(email)) {
                c.addAccount(new Account(sortCode));
                return c.getAccounts().get(c.getAccounts().size() - 1);

            }
        }
        return null;
    }

    public Transaction newLodgement(int sortCode, int accountNumber, double value) {
        for (Customer c : customers) {
            int size = c.getAccounts().size();
            for (int i = 0; i < size; i++) {
                Account a = c.getAccounts().get(i);
                if (a.getSortCode() == sortCode && a.getAccountNumber() == accountNumber) {
                    double newBalance = a.getCurrentBalance() + value;
                    Transaction t = new Transaction('L', value, "New Lodgement", newBalance);
                    a.setCurrentBalance(newBalance);
                    a.addTransaction(t);
                    return t;

                }

            }

        }

        return null;
    }

    public Transaction newWithdrawal(int sortCode, int accountNumber, double value) {
        for (Customer c : customers) {
            int size = c.getAccounts().size();
            for (int i = 0; i < size; i++) {
                Account a = c.getAccounts().get(i);
                if (a.getSortCode() == sortCode && a.getAccountNumber() == accountNumber) {
                    if (a.getCurrentBalance() >= value) {
                        double newBalance = a.getCurrentBalance() - value;
                        Transaction t = new Transaction('W', value, "New Withdrawal", newBalance);
                        a.setCurrentBalance(newBalance);
                        a.addTransaction(t);
                        return t;
                    }
                }

            }

        }

        return null;
    }

    public Double getBalance(int sortCode, int accountNumber) {
        for (Customer c : customers) {
            int size = c.getAccounts().size();
            for (int i = 0; i < size; i++) {
                Account a = c.getAccounts().get(i);
                if (a.getSortCode() == sortCode && a.getAccountNumber() == accountNumber) {
                    return a.getCurrentBalance();

                }

            }

        }

        return null;
    }

    public List<Transaction> newTransfer(int sortCode, int accountNumber, int destinSortCode, int destinAccountNumber, double value) {

        List<Transaction> transactions = new ArrayList<>();

        for (Customer c1 : customers) {
            int size1 = c1.getAccounts().size();
            for (int i = 0; i < size1; i++) {
                Account a1 = c1.getAccounts().get(i);
                if (a1.getSortCode() == sortCode && a1.getAccountNumber() == accountNumber) {
                    for (Customer c2 : customers) {
                        int size2 = c2.getAccounts().size();
                        for (int j = 0; j < size2; j++) {
                            Account a2 = c2.getAccounts().get(j);

                            if (a2.getSortCode() == destinSortCode && a2.getAccountNumber() == destinAccountNumber) {

                                if (a1.getCurrentBalance() >= value) {
                                    double newBalance = a1.getCurrentBalance() - value;
                                    Transaction t1 = new Transaction('T', value, "Transfer OUT", newBalance);
                                    a1.addTransaction(t1);

                                    transactions.add(t1);

                                    newBalance = a2.getCurrentBalance() + value;
                                    Transaction t2 = new Transaction('T', value, "Transfer IN", newBalance);
                                    a2.addTransaction(t2);
                                    transactions.add(t2);

                                    return transactions;
                                }
                            }

                        }
                    }
                }
            }
        }

        return null;

    }

    public List<Transaction> transactionHistory(int sortCode, int accountNumber) {
        for (Customer c : customers) {
            int size = c.getAccounts().size();
            for (int i = 0; i < size; i++) {
                Account a = c.getAccounts().get(i);
                if (a.getSortCode() == sortCode && a.getAccountNumber() == accountNumber) {
                    return a.getTransactions();
                }
            }
        }

        return null;
    }

    public Customer customerLogin(String email, int credentials) {

        for (Customer c : customers) {
            if ((c.getEmail().equalsIgnoreCase(email)) && (c.getCredentials() == credentials)) {
                return c;
            }
        }

        return null;
    }

    public List<Customer> getList() {
        return customers;
    }

    public Customer getCustomer(int identifier) {
        for (Customer c : customers) {
            if (c.getIdentifier() == identifier) {
                return c;
            }
        }

        return null;
    }

    public List<Account> getAllAccounts(int s, int a) {
        List<Account> allAccounts = new ArrayList<>();
        int j = 0;
        for (Customer c : getList()) {

            for (int i = 0; i < c.getAccounts().size(); i++) {
                if (c.getAccounts().get(i).getSortCode() != s && c.getAccounts().get(i).getAccountNumber() != a) {
                    allAccounts.add(j, c.getAccounts().get(i));
                    j++;

                }
            }  
        }
         return allAccounts;
    }
    
}
