package com.distributed.spring_api.rmi; // Gardez le même package pour simplifier

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class PaymentServer extends UnicastRemoteObject implements IPaymentServiceRemote {

    protected PaymentServer() throws java.rmi.RemoteException {
        super();
    }

    @Override
    public boolean processPayment(String cardNumber, double amount) throws java.rmi.RemoteException {
        System.out.println("--- 🏦 BANQUE DISTANTE (RMI) ---");
        System.out.println("Demande reçue pour la carte : " + cardNumber);
        System.out.println("Montant à débiter : " + amount + " MAD");

        // Logique métier de la banque
        if (amount < 50000) { // Plafond fictif
            System.out.println("✅ Paiement VALIDÉ.");
            return true;
        } else {
            System.out.println("❌ Paiement REFUSÉ (Solde insuffisant).");
            return false;
        }
    }

    public static void main(String[] args) {
        try {
            // Démarrage du registre RMI sur le port 1099
            Registry registry = LocateRegistry.createRegistry(1099);
            registry.rebind("PaymentService", new PaymentServer());
            System.out.println("🚀 Serveur RMI (Banque) prêt et en écoute sur le port 1099...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}