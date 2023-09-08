package avalanche.Network;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.sun.net.httpserver.*;

import avalanche.Network.HandlerStartegy.HandlerStrategy;

class ServiceHttpHandler implements HttpHandler {

    private HandlerStrategy handlerStrategy;

    public ServiceHttpHandler(HandlerStrategy handlerStrategy) {
        this.handlerStrategy = handlerStrategy;
    }

    public void setStrategy(HandlerStrategy handlerStrategy) {
        this.handlerStrategy = handlerStrategy;
    }

    public HandlerStrategy getHandlerStrategy() {
        return handlerStrategy;
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
            String response = handlerStrategy.getResponse(body, st);
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
            System.out.println("wrote to Output stream:\n"+response);
            os.close();
            scanner.close();
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