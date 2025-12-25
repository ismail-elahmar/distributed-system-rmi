package com.distributed.spring_api.rmi;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class GovernmentServer extends UnicastRemoteObject implements IVerificationServiceRemote {

    protected GovernmentServer() throws java.rmi.RemoteException {
        super();
    }

    @Override
    public boolean verifierCitoyen(String cin, String permis) throws java.rmi.RemoteException {
        System.out.println("--- 🚔 SERVICE POLICE NATIONALE (RMI) ---");
        System.out.println("Vérification CIN: " + cin + " / Permis: " + permis);

        // Simulation de la base de données police
        if (cin.startsWith("B")) { // Exemple : Les CIN commençant par 'B' sont Blacklistés
            System.out.println("⛔ CITOYEN BLACKLISTÉ (Incident signalé).");
            return false;
        } else {
            System.out.println("✅ CITOYEN CLEAN. Autorisation accordée.");
            return true;
        }
    }

    public static void main(String[] args) {
        try {
            // Attention : On utilise le PORT 1100 pour ne pas gêner la Banque (1099)
            Registry registry = LocateRegistry.createRegistry(1100);
            registry.rebind("PoliceService", new GovernmentServer());
            System.out.println("🚓 Serveur RMI (Police) prêt sur le port 1100...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}