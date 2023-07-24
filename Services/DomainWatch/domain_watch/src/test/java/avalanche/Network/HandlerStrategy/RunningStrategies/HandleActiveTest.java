package avalanche.Network.HandlerStrategy.RunningStrategies;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import avalanche.Core.SimilarityChecker;

public class HandleActiveTest {

    @BeforeAll
    public static void setup() {
        SimilarityChecker.init(true, 12);
    }

    @Test
    public void firstLevenshtein() {
        HandleActive hp = new HandleActive();
        String response = hp.getResponse(
                "{\r\n" + //
                        "  \"domain\": \"esser\",\r\n" + //
                        "  \"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1},{\"type\" : \"Soundex\", \"threshold\": 1}]\r\n"
                        + //
                        "}",
                0);
        assertTrue(response.contains("{  \"status\":\"success\",  \"data\":["));
    }

    @Test
    public void firstSoundex() {
        HandleActive hp = new HandleActive();
        String response = hp.getResponse(
                "{\r\n" + //
                        "  \"domain\": \"esser\",\r\n" + //
                        "  \"types\" : [{\"type\" : \"Soundex\", \"threshold\": 1},{\"type\" : \"Levenshtein\", \"threshold\": 1},]\r\n"
                        + //
                        "}",
                0);
        assertTrue(response.contains("{  \"status\":\"success\",  \"data\":["));
    }

    @Test
    public void noMetricShouldReturnError() {
        HandleActive hp = new HandleActive();
        String response = hp.getResponse(
                "{\r\n" + //
                        "  \"domain\": \"esser\",\r\n" + //
                        "  \"types\" : []\r\n"
                        + //
                        "}",
                0);
        assertEquals("{\"status\":\"failure\",\"request-error\":\"At least one distance metric must be listed\"}",
                response);
    }

    @Test
    public void invalidLevenshteinDistanceShouldReturnError() {
        HandleActive hp = new HandleActive();
        String response = hp.getResponse(
                "{\r\n" + //
                        "  \"domain\": \"esser\",\r\n" + //
                        "  \"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 0},{\"type\" : \"Soundex\", \"threshold\": 1}]\r\n"
                        + //
                        "}",
                0);
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0 and less than the length of the search domain\"}",
                response);
    }

    @Test
    public void invalidSoundexDistanceShouldReturnError() {
        HandleActive hp = new HandleActive();
        String response = hp.getResponse(
                "{\r\n" + //
                        "  \"domain\": \"esser\",\r\n" + //
                        "  \"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1},{\"type\" : \"Soundex\", \"threshold\": 0}]\r\n"
                        + //
                        "}",
                0);
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}",
                response);
    }

    @Test
    public void invalidAttributeShouldGiveError() {
        HandleActive hp = new HandleActive();
        String response = hp.getResponse(
                "{\r\n" + //
                        "  \"domain\": \"esser\",\r\n" + //
                        "  \"types\" : [{\"type\" : \"Levenshtein\", \"thres\": 1},{\"type\" : \"Soundex\", \"threshold\": 0}]\r\n"
                        + //
                        "}",
                0);
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"JSONObject[\"threshold\"] not found in metric number 1\"}",
                response);
    }
}
