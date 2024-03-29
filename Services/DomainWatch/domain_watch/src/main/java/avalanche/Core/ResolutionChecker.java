package avalanche.Core;

import java.net.InetAddress;
import java.net.UnknownHostException;

import avalanche.DataClasses.Domain;

public class ResolutionChecker {

    public static void checkResolution(Domain[] domainsToCheck, int totalTodo) {

        for (int i = 0; i < totalTodo; i++) {
            if (domainsToCheck[i] != null) {
                domainsToCheck[i].setResolves(isDomainResolvable(domainsToCheck[i].getFullyQualifiedDomainName()));
            }
        }
    }

    public static boolean isDomainResolvable(String domainName) {
        try {
            InetAddress.getByName(domainName);
            return true; // If no exception is thrown, the domain resolves.
        } catch (UnknownHostException e) {
            return false; // If an UnknownHostException is thrown, the domain doesn't resolve.
        }

    }

}
