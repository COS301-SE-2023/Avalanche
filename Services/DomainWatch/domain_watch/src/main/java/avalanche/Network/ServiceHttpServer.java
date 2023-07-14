package avalanche.Network;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.HashMap;

import com.sun.net.httpserver.*;

import avalanche.Core.SimilarityChecker;
import avalanche.Network.HandlerStrategy.Closed;
import avalanche.Network.HandlerStrategy.HandlerStrategy;
import avalanche.Settings.DomainWatchSettings;
import avalanche.Utility.DomainTokeniser;

public class ServiceHttpServer {

    private HttpServer httpServer;
    private int port;
    private String state;
    private boolean useMock;
    private HashMap<String, ServiceHttpHandler> httpHandlers;

    public ServiceHttpServer(int port, boolean useMock) throws IOException {
        this.port = port;
        this.state = "closed";
        this.useMock = useMock;
        this.httpHandlers = new HashMap<>();
    }

    public void forceAllStrategies(HandlerStrategy strategy) {
        for (ServiceHttpHandler handler : httpHandlers.values()) {
            handler.setStrategy(strategy);
        }
    }

    public void setSpecificStrategy(String handler, HandlerStrategy strategy) {
        httpHandlers.get(handler).setStrategy(strategy);
    }

    public void setDefaultStrategies() {
        for (String endPoint : httpHandlers.keySet()) {
            httpHandlers.get(endPoint).setStrategy(HandlerStrategyClassEnum.get(endPoint));
        }
    }

    private void createContexts() {
        ServiceHttpHandler active = new ServiceHttpHandler(new Closed());
        ServiceHttpHandler passive = new ServiceHttpHandler(new Closed());
        httpHandlers.put("active", active);
        httpHandlers.put("classify", passive);
        httpServer.createContext("/domainWatch/active", active);
        httpServer.createContext("/domainWatch/passive", passive);
    }

    public void start() throws IOException, InstantiationException {
        if (!this.state.equals("closed")) {
            System.out.println("Server already running");
            return;
        }

        System.out.println("Starting server");
        this.state = "initialising";
        this.httpServer = HttpServer.create(new InetSocketAddress(port), 0);
        this.createContexts();
        httpServer.setExecutor(java.util.concurrent.Executors.newCachedThreadPool()); // creates a default executor
        httpServer.start();

        System.out.println("Found " + Runtime.getRuntime().availableProcessors() + " processors");
        long st = System.currentTimeMillis();
        System.out.println("initialising domain list");
        SimilarityChecker.init(useMock, Math.min(DomainWatchSettings.getInstace().maximumThreadsPerSearch,
                Runtime.getRuntime().availableProcessors() - 1));
        System.out.println("Done domain list\n");

        System.out.println("initialising word freq");
        DomainTokeniser.init();
        System.out.println("Done word freq\n");
        setDefaultStrategies();
        System.out.println("Init time in millis " + (System.currentTimeMillis() -
                st));
        System.out.println("Server started\n========================\n");
        this.state = "running";
        System.out.println("\n\nWaiting for next request...\n");

    }

    public void stop() {
        System.out.println("\n\n Stopping server\n");
        httpServer.stop(3);
        this.state = "closed";
        System.out.println("\n\nServer stopped\n");

    }

    public String getResponse(String context, String body, long st) {
        return httpHandlers.get(context).getHandlerStrategy().getResponse(body, st);
    }

    public void handleDummyRequest(String context) throws IOException {
        switch (context) {
            case "active":
                handleDummyRequestActive();
                break;

            default:
                break;
        }

    }

    private void handleDummyRequestActive() {
        System.out.println("Dummy request sent");
        long st = System.currentTimeMillis();
        String o = getResponse("active",
                "{domain: \"selborne\", types: [{type: \"Soundex\", threshold: 3}, {type: \"Levenshtein\", threshold: 2}]}",
                st);
        System.out.println(o);
        System.out.println("time in millis " + (System.currentTimeMillis() - st));
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
