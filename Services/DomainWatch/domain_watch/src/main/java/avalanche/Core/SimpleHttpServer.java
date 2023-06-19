package avalanche.Core;

import com.sun.net.httpserver.*;

import avalanche.DataClasses.Domain;
import avalanche.Processing.SimilarityChecker;
import avalanche.Utility.DomainTokeniser;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONException;
import org.json.JSONObject;

public class SimpleHttpServer {

    public static void main(String[] args) throws IOException {
        long st = System.currentTimeMillis();
        System.out.println("initialising domain list");
        SimilarityChecker.init(false);
        System.out.println("Done domain list\n");

        System.out.println("initialising word freq");
        DomainTokeniser.init();
        System.out.println("Done word freq\n");
        System.out.println("Init time in millis " + (System.currentTimeMillis() -
                st));
        System.out.println("Starting server");
        HttpServer server = HttpServer.create(new InetSocketAddress(4004), 0);
        server.createContext("/domainWatch/list", new PostHandler());
        server.setExecutor(null); // creates a default executor
        System.out.println("Server started\n========================\n");
        server.start();

        // st = System.currentTimeMillis();
        // String o = getResponse(
        // "{\n\"domain\":\"firstnationalbank\",\n\"types\":[{\"type\":\"Levenshtein\",\"threshold\":2}]\n}",
        // st);
        // System.out.println(o);
        // System.out.println("time in millis " + (System.currentTimeMillis() - st));
        System.out.println("\n\nWaiting for next request...\n");

        // st = System.currentTimeMillis();
        // o = getResponse(
        // "{\n\"domain\": \"firstnationalbank\",\n\"types\"
        // :[{\"type\":\"Levenshtein\", \"threshold\": 5}]\n}");
        // System.out.println(o);
        // System.out.println("time in millis " + (System.currentTimeMillis() - st));

        // st = System.currentTimeMillis();
        // o = getResponse(
        // "{\n\"domain\": \"firstnationalbank\",\n\"types\"
        // :[{\"type\":\"Levenshtein\", \"threshold\": 5}]\n}");
        // System.out.println(o);
        // System.out.println("time in millis " + (System.currentTimeMillis() - st));
    }

    static class PostHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange httpExchange) throws IOException {
            System.out.println("received request");
            if ("POST".equals(httpExchange.getRequestMethod())) {
                System.out.println("received post");
                InputStream inputStream = httpExchange.getRequestBody();
                java.util.Scanner scanner = new java.util.Scanner(inputStream).useDelimiter("\\A");
                String body = scanner.hasNext() ? scanner.next() : "";
                System.out.println(body); // Prints the request body

                // Prepare response
                long st = System.currentTimeMillis();
                String response = getResponse(body, st);
                System.out.println("time in millis " + (System.currentTimeMillis() - st));
                if (response.contains("error")) {
                    httpExchange.sendResponseHeaders(400, response.length());
                } else {
                    httpExchange.sendResponseHeaders(200, response.length());
                }

                OutputStream os = httpExchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                scanner.close();
                SimilarityChecker.resetDistances();
                System.gc();
                System.out.println("\n\nWaiting for next request...\n");
            } else if ("OPTIONS".equals(httpExchange.getRequestMethod())) {
                httpExchange.sendResponseHeaders(200, -1);
            } else {
                System.out.println("reject method not allowed: " + httpExchange.getRequestMethod());
                httpExchange.sendResponseHeaders(405, -1);// 405 Method Not Allowed
            }
        }

    }

    public static String validateRequest(JSONObject jsonObject) {
        int errorIndex = -1;
        Set<String> allowedMetrics = new HashSet<>();
        allowedMetrics.add("Levenshtein");
        allowedMetrics.add("Soundex");
        try {
            String domain = (jsonObject.getString("domain"));
            if (domain.length() < 1) {
                return "{\"status\":\"failure\",\"error\":\"The domain name must be longer than 0 characters\"}";
            }
            int numCalcs = (jsonObject.getJSONArray("types").length());
            if (numCalcs < 1) {
                return "{\"status\":\"failure\",\"error\":\"At least one distance metric must be listed\"}";
            }
            for (int i = 0; i < numCalcs; i++) {
                errorIndex = i;
                String type = jsonObject.getJSONArray("types").getJSONObject(i).getString("type");
                if (!allowedMetrics.contains(type)) {
                    return "{\"status\":\"failure\",\"error\":\"Type:" + type + " is not a valid metric" + "\"}";
                }
                double threshold = (jsonObject.getJSONArray("types").getJSONObject(i).getDouble("threshold"));
                if (type.equals("Levenshtein") && (threshold > domain.length() - 1 || threshold < 1)) {
                    return "{\"status\":\"failure\",\"error\":\"The threshold for Levenshtein distance must be greater than 0 and less than the length of the search domain\"}";
                }
                if (type.equals("Soundex") && (threshold > 4 || threshold < 1)) {
                    return "{\"status\":\"failure\",\"error\":\"The threshold for Soundex distance must be in the range [1,4]\"}";
                }
            }
            return "";
        } catch (JSONException jsonException) {
            if (errorIndex != -1) {
                return "{\"status\":\"failure\",\"error\":\""
                        + jsonException.getMessage().substring(0, jsonException.getMessage().length() - 1)
                        + " in metric number "
                        + (errorIndex + 1) + "\"}";
            }
            return "{\"status\":\"failure\",\"error\":\"" + jsonException.getMessage() + "\"}";
        }

    }

    public static String getResponse(String body, long st) throws IOException {
        System.out.println("Working in request");
        SimilarityChecker similarityChecker = new SimilarityChecker();
        String resp = "{  \"status\":\"success\",  \"data\":[";
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        JSONObject obj = new JSONObject(body);
        String validation = validateRequest(obj);
        if (!validation.equals("")) {
            return validation;
        }
        String domain = (obj.getString("domain"));

        int numCalcs = (obj.getJSONArray("types").length());

        for (int j = 0; j < numCalcs; j++) {
            String type = obj.getJSONArray("types").getJSONObject(j).getString("type");
            double threshold = (obj.getJSONArray("types").getJSONObject(j).getDouble("threshold"));
            if (type.equals("Levenshtein")) {
                if (j == 0) {
                    hits = similarityChecker.threadedFindAllWithinSimliarityThreshold(domain,
                            threshold, SimilarityChecker.THREAD_COUNT);
                } else {
                    hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                            threshold, hits);
                }

            } else if (type.equals("Soundex")) {
                if (j == 0) {
                    hits = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(domain,
                            threshold, SimilarityChecker.THREAD_COUNT);
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
        long ttlTime = System.currentTimeMillis() - st;
        resp += "  ],\"searchTime(ms)\":" + ttlTime + "}";

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
