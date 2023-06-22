package avalanche.Network;

import com.sun.net.httpserver.*;

import avalanche.Network.ServerState.Closed;
import avalanche.Network.ServerState.Initialising;
import avalanche.Network.ServerState.Running;
import avalanche.Network.ServerState.ServerState;
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
        httpServer.createContext("/domainNameAnalysis/list", new PostHandler(this));
        httpServer.setExecutor(java.util.concurrent.Executors.newCachedThreadPool()); // creates a default executor
        this.state = new Closed();
    }

    public void start() throws IOException {
        System.out.println("Starting server");
        httpServer.start();
        this.state = new Initialising();

        long st = System.currentTimeMillis();

        System.out.println("Init time in millis " + (System.currentTimeMillis() -
                st));
        this.state = new Running();
        System.out.println("Server started\n========================\n");
        System.out.println("\n\nWaiting for next request...\n");

    }

    public void handleDummyRequest() throws IOException {
        System.out.println("Dummy request sent");
        long st = System.currentTimeMillis();
        String o = state.getResponse("{\"data\":[\"countingpenguins\"," + //
                "\"tasteitalian\"," + //
                "\"welmail\"," + //
                "\"propertyswipe\"," + //
                "\"calfconcepts\"," + //
                "\"ogrady\"," + //
                "\"thebagnag\"," + //
                "\"pretmetafrikaans\"," + //
                "\"bioboxcatlitter\"," + //
                "\"mostertshoek\"," + //
                "\"manicmodelsearch\"," + //
                "\"hosiprconsulting\"," + //
                "\"asphimed\"," + //
                "\"bitcoinchase\"," + //
                "\"jrj\"," + //
                "\"i-do-scanning\"," + //
                "\"germiston-locksmiths\"," + //
                "\"elpar\"," + //
                "\"stskinlocator\"," + //
                "\"amazingcleaningservice\"," + //
                "\"chatham\"," + //
                "\"turboking\"," + //
                "\"randjfinancialgroup\"," + //
                "\"mlonziandcompany\"," + //
                "\"heatherpretorius\"," + //
                "\"ocularprosthetics\"," + //
                "\"careerrecruit\"," + //
                "\"emergencyelectricalelectricianservicescompanyinrandvaal\"," + //
                "\"escapecampingvillages\"," + //
                "\"gotamail\"," + //
                "\"fraseralexandr\"," + //
                "\"suuqa\"," + //
                "\"alterations\"," + //
                "\"teldirectory\"," + //
                "\"womb-2-tomb\"," + //
                "\"faceprimer\"," + //
                "\"kptravel\"," + //
                "\"skyshuttle\"," + //
                "\"archiframe\"," + //
                "\"monetlisa\"," + //
                "\"izingapackaging\"," + //
                "\"kairostv\"," + //
                "\"precysbc\"," + //
                "\"dc-power-supply\"," + //
                "\"birdpark\"," + //
                "\"damac\"," + //
                "\"kgomozadrivingschool\"," + //
                "\"kgomozadrivingschool\"," + //
                "\"appliancesrepairexpert\"," + //
                "\"rupehcq\"," + //
                "\"mybabyvac\"," + //
                "\"voice123\"," + //
                "\"mod\"," + //
                "\"vodacom4\"," + //
                "\"saspros\"," + //
                "\"dstvinstallationsinakasia\"," + //
                "\"governorheading\"," + //
                "\"dieremaatjies\"," + //
                "\"thegenuflectedgroup\"," + //
                "\"bstsecurity\"," + //
                "\"minizoo\"," + //
                "\"phetogoschoolofbeauty\"," + //
                "\"omegawash\"," + //
                "\"cartelsweets\"," + //
                "\"churcharise\"," + //
                "\"bizintelligence\"," + //
                "\"khamane-hs\"," + //
                "\"petro-industrial\"," + //
                "\"nxumaloattorneys\"," + //
                "\"acaps\"," + //
                "\"agro-landfarmsa\"," + //
                "\"mnbeautyspa\"," + //
                "\"psixproperties\"," + //
                "\"jaysutrading\"," + //
                "\"montalk\"," + //
                "\"alientube\"," + //
                "\"bantingbuddy\"," + //
                "\"guerillagroup\"," + //
                "\"jkacarpediemkarate\"," + //
                "\"mrnlabs\"," + //
                "\"dumehlezi\"," + //
                "\"hiddencradle\"," + //
                "\"concepttechnologies\"," + //
                "\"skynettsupermarket\"," + //
                "\"stonesstudio\"," + //
                "\"commercialnationalautoglass\"," + //
                "\"gwmgauteng\"," + //
                "\"donovancupido\"," + //
                "\"healthbud\"," + //
                "\"antcs\"," + //
                "\"jhbrealestate\"," + //
                "\"castingdirector\"," + //
                "\"villagevacationclub\"," + //
                "\"crafttabledesigns\"," + //
                "\"hip-bone\"," + //
                "\"hubbs\"," + //
                "\"signaturegolf\"," + //
                "\"whitecoral\"," + //
                "\"blaqcentric\"," + //
                "\"natalielootsphotography\"," + //
                "\"mangwayane\"," + //
                "\"roombook365\"," + //
                "\"cairdholdings\"," + //
                "\"widmerandco\"," + //
                "\"sagen\"," + //
                "\"jameshammerton\"," + //
                "\"dandylife\"," + //
                "\"aquagoldbeverages\"," + //
                "\"merchantmusiek\"," + //
                "\"edalliance\"," + //
                "\"leadersfoundation\"," + //
                "\"stonemeccalodge\"," + //
                "\"ldw\"," + //
                "\"numeriauditors\"," + //
                "\"newdoorsa\"," + //
                "\"alibabaherbsandspices\"," + //
                "\"axelwood\"," + //
                "\"rightplace\"," + //
                "\"thebikeshopza\"," + //
                "\"martalain\"," + //
                "\"lunapacateringservices\"," + //
                "\"newleafdesignstudio\"," + //
                "\"sabharwal\"," + //
                "\"dicudcq\"," + //
                "\"leandrabergh\"," + //
                "\"glassprotect\"," + //
                "\"constitute\"," + //
                "\"bygracedesign\"," + //
                "\"orderbooks\"," + //
                "\"prohibitionliquors\"," + //
                "\"humanrx\"," + //
                "\"32quarterdeck\"," + //
                "\"nqobaneprimary\"," + //
                "\"saltmassage\"," + //
                "\"maikhuleafrica\"," + //
                "\"capeyogaassist\"," + //
                "\"eb-lourdon\"]}",
                st);
        // String o = state.getResponse("{data:[\"hi\",\"hithere\",\"bye\"]}", st);
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
