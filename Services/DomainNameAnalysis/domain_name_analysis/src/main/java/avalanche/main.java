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
            // double n = 1;
            // double ttl = 0;
            // for (int i = 0; i < n; i++) {
            // JSONObject j = new JSONObject(server.handleDummyRequest("classify"));
            // System.out.println(j.getInt("searchTime(ms)"));
            // ttl += j.getInt("searchTime(ms)");
            // }
            // System.out.println("AVERAGE = " + (ttl / n));

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
