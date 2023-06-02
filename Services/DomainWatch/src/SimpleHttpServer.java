import com.sun.net.httpserver.*;
import com.sun.org.apache.xalan.internal.xsltc.cmdline.getopt.GetOpt;

import DataClasses.Domain;
import Processing.SimilarityChecker;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.LinkedList;

import org.json.JSONObject;

public class SimpleHttpServer {

    public static void main(String[] args) throws Exception {
        // HttpServer server = HttpServer.create(new InetSocketAddress(3004), 0);
        // server.createContext("/domainWatch/list", new PostHandler());
        // server.setExecutor(null); // creates a default executor
        // System.out.println("started");
        // server.start();

        // String o = getResponse(
        // "{\n\"domain\": \"firstnationalbank\",\n\"types\" : [{\"type\"
        // :\"Levenshtein\", \"threshold\": 5},{\"type\" :
        // \"Soundex\",\"threshold\":3}]\n}");
        // System.out.println(o);

        String o = getResponse(
                "{\n\"domain\": \"firstnationalbank\",\n\"types\" : [{\"type\":\"Levenshtein\", \"threshold\": 5}]\n}");
        System.out.println(o);
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
                String response = getResponse(body);
                httpExchange.sendResponseHeaders(200, response.length());
                OutputStream os = httpExchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                httpExchange.sendResponseHeaders(405, -1);// 405 Method Not Allowed
            }
        }

    }

    public static String getResponse(String body) {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        int i = body.indexOf("\"domain\"", 0);
        String resp = "{\n  \"status\":\"success\"\n  \"data\":[\n";
        LinkedList<Domain> hits = new LinkedList<>();
        JSONObject obj = new JSONObject(body);
        String domain = (obj.getString("domain"));
        int numCalcs = (obj.getJSONArray("types").length());
        for (int j = 0; j < numCalcs; j++) {
            String type = obj.getJSONArray("types").getJSONObject(j).getString("type");
            double threshold = (obj.getJSONArray("types").getJSONObject(j).getDouble("threshold"));
            if (type.equals("Levenshtein")) {
                if (j == 0) {
                    hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                            threshold);
                } else {
                    hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                            threshold, hits);
                }

            } else if (type.equals("Soundex")) {
                if (j == 0) {
                    hits = similarityChecker.findAllSoundsAboveSimliarityThreshold(domain,
                            threshold);
                } else {
                    hits = similarityChecker.findAllSoundsAboveSimliarityThreshold(domain,
                            threshold, hits);
                }

            }
        }

        for (int k = 0; k < hits.size(); k++) {
            resp += "    " + hits.get(k).toJSON();
            if (k != hits.size() - 1) {
                resp += ",\n";
            }
        }
        resp += "\n  ]\n}";
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
