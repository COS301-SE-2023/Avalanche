package avalanche;

import java.io.IOException;

import avalanche.Network.SimpleHttpServer;

public class main {
    public static void main(String[] args) {
        try {
            SimpleHttpServer server = new SimpleHttpServer(4004);
            server.start();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}