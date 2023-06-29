package avalanche;

import java.io.IOException;

import avalanche.Network.ServiceHttpServer;

/**
 * Hello world!
 *
 */
public class main {
    public static void main(String[] args) throws Exception {
        try {
            ServiceHttpServer server = new ServiceHttpServer(4005);
            server.start();
            server.handleDummyRequest("classify");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
