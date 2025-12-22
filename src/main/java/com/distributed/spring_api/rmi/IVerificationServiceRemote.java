package com.distributed.spring_api.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IVerificationServiceRemote extends Remote {
    // Vérifie si un citoyen est autorisé à louer (Pas de casier, permis valide)
    boolean verifierCitoyen(String cin, String permis) throws RemoteException;
}