package avalanche.Network.HandlerStrategy.RunningStrategies;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Scanner;

import org.junit.jupiter.api.Test;
import avalanche.Network.HandlerStrategy.RunningStrategies.HandlePassive;

public class HandleLoadDomainsTest {

        @Test
        public void requestWithInvalidObjectShouldError() throws FileNotFoundException {
                HandleLoadDomains h = new HandleLoadDomains();

                String request = "iiyi";

                String response = h.getResponse(request, 0);

                assertEquals("{\"status\":\"failure\",\"request-error\":\"A JSONObject text must begin with '{' at 1 [character 2 line 1]\"}",
                                response);

        }

        @Test
        public void requestWithNoDomainsShouldReturnError() throws FileNotFoundException {
                HandleLoadDomains h = new HandleLoadDomains();
                Scanner file = new Scanner(new FileReader("testRequests/loadDomainsTestNoDomains.txt"));

                String request = "";
                while (file.hasNext()) {
                        request += file.nextLine();
                }
                String response = h.getResponse(request, 0);

                assertEquals("{\"status\":\"failure\",\"request-error\":\"JSONObject[\"domains\"] not founddomains in object number 1\"}",
                                response);

        }

        @Test
        public void requestWithNoRegistryDomainsShouldReturnError() throws FileNotFoundException {
                HandleLoadDomains h = new HandleLoadDomains();
                Scanner file = new Scanner(new FileReader("testRequests/loadDomainsTestNoRegistryDomains.txt"));

                String request = "";
                while (file.hasNext()) {
                        request += file.nextLine();
                }
                String response = h.getResponse(request, 0);

                assertEquals("{\"status\":\"failure\",\"request-error\":\"JSONObject[\"registryDomains\"] not found.\"}",
                                response);

        }

        @Test
        public void validRequestShouldNotReturnError4() throws FileNotFoundException {
                HandleLoadDomains h = new HandleLoadDomains();
                Scanner file = new Scanner(new FileReader("testRequests/loadDomainsTestSuccess.txt"));

                String request = "";
                while (file.hasNext()) {
                        request += file.nextLine();
                }
                String response = h.getResponse(request,
                                System.currentTimeMillis());

                assertTrue(response.contains("  \"status\":\"success\",  \"data\":[],\"searchTime(ms)\""));

        }
}
