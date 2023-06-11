package avalanche;

import com.sun.net.httpserver.*;

import avalanche.DataClasses.Domain;
import avalanche.Processing.SimilarityChecker;
import avalanche.Utility.DomainTokeniser;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONObject;

public class SimpleHttpServer {

    public static void main(String[] args) throws Exception {
        long st = System.currentTimeMillis();
        System.out.println("initialising domain list");
        SimilarityChecker.init(false);
        System.out.println("Done domain list\n");

        System.out.println("initialising word freq");
        DomainTokeniser.init();
        System.out.println("Done word freq\n");
        System.out.println("Init time in millis " + (System.currentTimeMillis() - st));
        System.out.println("Starting server");
        HttpServer server = HttpServer.create(new InetSocketAddress(4001), 0);
        server.createContext("/domainWatch/list", new PostHandler());
        server.setExecutor(null); // creates a default executor
        System.out.println("Server started\n========================\n");
        server.start();

        st = System.currentTimeMillis();
        String o = getResponse(
                "{\n\"domain\": \"firstnationalbank\",\n\"types\" :[{\"type\":\"Levenshtein\", \"threshold\":5},{\"type\":\"Soundex\",\"threshold\":3}]\n}");
        System.out.println(o);
        System.out.println("time in millis " + (System.currentTimeMillis() - st));

        st = System.currentTimeMillis();
        o = getResponse(
                "{\n\"domain\": \"firstnationalbank\",\n\"types\" :[{\"type\":\"Levenshtein\", \"threshold\": 5}]\n}");
        System.out.println(o);
        System.out.println("time in millis " + (System.currentTimeMillis() - st));

        st = System.currentTimeMillis();
        o = getResponse(
                "{\n\"domain\": \"firstnationalbank\",\n\"types\" :[{\"type\":\"Levenshtein\", \"threshold\": 5}]\n}");
        System.out.println(o);
        System.out.println("time in millis " + (System.currentTimeMillis() - st));
    }

    static class PostHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange httpExchange) throws IOException {
            if ("POST".equals(httpExchange.getRequestMethod())) {
                System.out.println("received");
                InputStream inputStream = httpExchange.getRequestBody();
                java.util.Scanner scanner = new java.util.Scanner(inputStream).useDelimiter("\\A");
                String body = scanner.hasNext() ? scanner.next() : "";
                System.out.println(body); // Prints the request body

                // Prepare response
                long st = System.currentTimeMillis();
                String response = getResponse(body);
                System.out.println("time in millis " + (System.currentTimeMillis() - st));
                httpExchange.sendResponseHeaders(200, response.length());
                OutputStream os = httpExchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                scanner.close();
                SimilarityChecker.resetDistances();
                System.gc();
            } else {
                httpExchange.sendResponseHeaders(405, -1);// 405 Method Not Allowed
            }
        }

    }

    public static String getResponse(String body) {
        System.out.println("Working in request");
        SimilarityChecker similarityChecker = new SimilarityChecker();
        String resp = "{  \"status\":\"success\",  \"data\":[";
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        JSONObject obj = new JSONObject(body);
        String domain = (obj.getString("domain"));
        int numCalcs = (obj.getJSONArray("types").length());
        for (int j = 0; j < numCalcs; j++) {
            String type = obj.getJSONArray("types").getJSONObject(j).getString("type");
            double threshold = (obj.getJSONArray("types").getJSONObject(j).getDouble("threshold"));
            if (type.equals("Levenshtein")) {
                if (j == 0) {
                    hits = similarityChecker.threadedFindAllWithinSimliarityThreshold(domain,
                            threshold, 50);
                } else {
                    hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                            threshold, hits);
                }

            } else if (type.equals("Soundex")) {
                if (j == 0) {
                    hits = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(domain,
                            threshold, 50);
                } else {
                    hits = similarityChecker.findAllSoundsAboveSimliarityThreshold(domain,
                            threshold, hits);
                }

            }
        }
        int initSize = hits.size();
        for (int k = 0; k < initSize; k++) {
            resp += "    " + hits.poll().toJSON();
            if (k != initSize - 1) {
                resp += ",";
            }
        }
        resp += "  ]}";
        // System.out.println(resp);
        System.out.println("Done");
        System.gc();
        return resp;
    }

    /*
     * {
     * "status":"success",
     * "data":[
     * {"domainName":"meepmopmipmap","zone":"CO.ZA","similarity":3.666},
     * {"domainName":"meepmopmipmap","zone":"CO.ZA","similarity":3.666},
     * ]
     * }
     */
}
