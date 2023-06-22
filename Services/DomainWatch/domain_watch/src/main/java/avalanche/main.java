package avalanche;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashSet;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Network.SimpleHttpServer;
import avalanche.Utility.DomainTokeniser;

public class main {
    public static void main(String[] args) {
        try {
            SimpleHttpServer server = new SimpleHttpServer(4004);
            server.start();
            server.handleDummyRequest();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}
