package avalanche;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Network.ServiceHttpServer;
import avalanche.Settings.DomainWatchSettings;
import avalanche.Utility.DomainTokeniser;

public class main {
    public static void main(String[] args) {
        try {
            DomainWatchSettings.init();
            ServiceHttpServer server = new ServiceHttpServer(DomainWatchSettings.getInstace().port, false);
            server.start();
            server.handleDummyRequest("active");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (InstantiationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            System.out.println(e.getMessage());

        }

    }
}
