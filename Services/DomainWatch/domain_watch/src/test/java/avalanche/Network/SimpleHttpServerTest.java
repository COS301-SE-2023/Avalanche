package avalanche.Network;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.SocketException;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;

import org.json.JSONException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import avalanche.Network.ServerState.Initialising;
import avalanche.Network.ServerState.Running;

public class SimpleHttpServerTest {

    private static SimpleHttpServer server;

    @BeforeAll
    public static void initServer() throws IOException, InstantiationException {
        server = new SimpleHttpServer(4004, true);
        server.start();
    }

    @Test
    public void dummyRequest() throws IOException, InstantiationException {

        server.handleDummyRequest();
    }

    @Test
    public void postWithValidRequestShouldNotReturnError() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        String jsonInputString = "{\"domain\":\"domain\",\"types\":[{\"type\":\"Soundex\",\"threshold\":3},{\"type\":\"Levenshtein\",\"threshold\":3}]}";
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            System.out.println(response.toString());
            assertTrue(response.toString().contains("\"status\":\"success\""));
        }
        assertEquals(200, con.getResponseCode());
    }

    @Test
    public void postWithNoBodyShouldReturnError() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        String jsonInputString = "";
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        assertEquals(400, con.getResponseCode());
    }

    @Test
    public void postWithInvalidRequestShouldReturn400() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        String jsonInputString = "{\"domain\":\"\",\"types\":[{\"type\":\"Soundex\",\"threshold\":3},{\"type\":\"Levenshtein\",\"threshold\":3}]}";
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        assertEquals(400, con.getResponseCode());
    }

    @Test
    public void postWithInvalidMetricShouldReturn400() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        String jsonInputString = "{\"domain\":\"domain\",\"types\":[{\"type\":\"BestMetric\",\"threshold\":3},{\"type\":\"Levenshtein\",\"threshold\":3}]}";
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        assertEquals(400, con.getResponseCode());
    }

    @Test
    public void closedServerShouldReturn500() throws IOException, InstantiationException {
        server.forceState(new Initialising());
        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        String jsonInputString = "{\"domain\":\"\",\"types\":[{\"type\":\"Soundex\",\"threshold\":3},{\"type\":\"Levenshtein\",\"threshold\":3}]}";
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        int responseCode = con.getResponseCode();
        server.forceState(new Running());
        assertEquals(500, responseCode);
    }

    @Test
    public void optionsShouldNotReturnError() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("OPTIONS");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        String jsonInputString = "";
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            System.out.println(response.toString());
        }
        assertEquals(200, con.getResponseCode());
    }

    @Test
    public void getShouldReturnError405() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        int responseCode = con.getResponseCode();
        System.out.println("GET Response Code :: " + responseCode);
        assertEquals(405, responseCode);

    }

    @Test
    public void putShouldReturnError405() throws IOException, InstantiationException {

        URL url = new URL("http://localhost:4004/domainWatch/list");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("PUT");
        int responseCode = con.getResponseCode();
        System.out.println("PUT Response Code :: " + responseCode);
        assertEquals(405, responseCode);

    }

    @Test
    public void stopServerTest() throws IOException, InstantiationException {

        server.stop();
        server.start();
    }

    @Test
    public void startRunningServerTest() throws IOException, InstantiationException {
        server.start();
    }

}
