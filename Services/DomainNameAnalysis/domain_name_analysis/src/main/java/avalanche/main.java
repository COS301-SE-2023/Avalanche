package avalanche;

import java.io.IOException;

import org.json.JSONObject;

import avalanche.Network.ServiceHttpServer;

/**
 * Hello world!
 *
 */
public class main {
    public static void main(String[] args) throws Exception {
        try {
            ServiceHttpServer server = new ServiceHttpServer(4101);
            server.start();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
