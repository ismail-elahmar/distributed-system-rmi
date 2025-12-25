package com.distributed.spring_api.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

// Cette interface doit être EXACTEMENT la même côté Spring Boot et côté Serveur RMI
public interface IPaymentServiceRemote extends Remote {
    // Méthode distante : retourne VRAI si le paiement est accepté
    boolean processPayment(String cardNumber, double amount) throws RemoteException;
}