package avalanche;

import java.io.IOException;

import avalanche.Network.SimpleHttpServer;

/**
 * Hello world!
 *
 */
public class App {
    public static void main(String[] args) throws Exception {
        try {
            SimpleHttpServer server = new SimpleHttpServer(4005);
            server.start();
            server.handleDummyRequest();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
