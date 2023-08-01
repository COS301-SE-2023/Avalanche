package avalanche.Network;

import com.sun.net.httpserver.*;

import avalanche.Core.FrequencyCounter;
import avalanche.Network.HandlerStartegy.Closed;
import avalanche.Network.HandlerStartegy.HandlerStrategy;
import avalanche.Network.HandlerStartegy.Initialising;
import avalanche.Network.ServerState.ServerState;
import avalanche.Utility.DomainTokeniser;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;

public class ServiceHttpServer {

    private HttpServer httpServer;
    private int port;
    private HashMap<String, ServiceHttpHandler> httpHandlers;
    private String state;

    public ServiceHttpServer(int port) throws IOException {
        this.port = port;
        this.state = "closed";
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
        ServiceHttpHandler count = new ServiceHttpHandler(new Closed());
        ServiceHttpHandler classify = new ServiceHttpHandler(new Closed());
        httpHandlers.put("count", count);
        httpHandlers.put("classify", classify);
        httpServer.createContext("/domainNameAnalysis/count", count);
        httpServer.createContext("/domainNameAnalysis/classify", classify);
    }

    public void start() throws IOException {
        if (!this.state.equals("closed")) {
            System.out.println("Server already running");
            return;
        }
        System.out.println("Starting server");
        this.state = "initialising";
        this.httpServer = HttpServer.create(InetSocketAddress.createUnresolved("domain-name-analysis", port), 0);
        this.createContexts();

        httpServer.setExecutor(java.util.concurrent.Executors.newCachedThreadPool()); // creates a default
                                                                                      // executor
        httpServer.start();
        forceAllStrategies(new Initialising());
        long st = System.currentTimeMillis();
        setDefaultStrategies();
        System.out.println("Init time in millis " + (System.currentTimeMillis() - st));
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
        System.out.println("Dummy request sent");
        long st = System.currentTimeMillis();
        String o = getResponse(context,
                "{\"minimumConfidence\":0.1,\"data\":[\"countingpenguins\"," + //
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
                System.currentTimeMillis());
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
