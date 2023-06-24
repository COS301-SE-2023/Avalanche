package avalanche.Network;

import com.sun.net.httpserver.*;

import avalanche.Core.SimilarityChecker;
import avalanche.Network.ServerState.Closed;
import avalanche.Network.ServerState.Initialising;
import avalanche.Network.ServerState.Running;
import avalanche.Network.ServerState.ServerState;
import avalanche.Settings.DomainWatchSettings;
import avalanche.Utility.DomainTokeniser;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class SimpleHttpServer {

    private HttpServer httpServer;
    private int port;
    private ServerState state;

    public SimpleHttpServer(int port) throws IOException {
        this.port = port;
        this.httpServer = HttpServer.create(new InetSocketAddress(port), 0);
        httpServer.createContext("/domainWatch/list", new PostHandler(this));
        httpServer.setExecutor(java.util.concurrent.Executors.newCachedThreadPool()); // creates a default executor
        this.state = new Closed();
    }

    public void start() throws IOException, InstantiationException {
        System.out.println("Starting server");
        httpServer.start();
        this.state = new Initialising();
        System.out.println("Found " + Runtime.getRuntime().availableProcessors() + " processors");
        long st = System.currentTimeMillis();
        System.out.println("initialising domain list");
        SimilarityChecker.init(false, Math.min(DomainWatchSettings.getInstace().maximumThreadsPerSearch,
                Runtime.getRuntime().availableProcessors() - 1));
        System.out.println("Done domain list\n");

        System.out.println("initialising word freq");
        DomainTokeniser.init();
        System.out.println("Done word freq\n");
        System.out.println("Init time in millis " + (System.currentTimeMillis() -
                st));
        this.state = new Running();
        System.out.println("Server started\n========================\n");
        System.out.println("\n\nWaiting for next request...\n");

    }

    public void handleDummyRequest() throws IOException {
        System.out.println("Dummy request sent");
        long st = System.currentTimeMillis();
        String o = state.getResponse(
                "{domain: \"selborne\", types: [{type: \"Soundex\", threshold: 3}, {type: \"Levenshtein\", threshold: 2}]}",
                st);
        System.out.println(o);
        System.out.println("time in millis " + (System.currentTimeMillis() - st));
    }

    static class PostHandler implements HttpHandler {

        private SimpleHttpServer server;

        public PostHandler(SimpleHttpServer server) {
            this.server = server;
        }

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
                String response = server.state.getResponse(body, st);
                System.out.println("time in millis " + (System.currentTimeMillis() - st));
                if (response.contains("request-error")) {
                    httpExchange.sendResponseHeaders(400, response.length());
                } else if (response.contains("server-error")) {
                    httpExchange.sendResponseHeaders(500, response.length());
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
