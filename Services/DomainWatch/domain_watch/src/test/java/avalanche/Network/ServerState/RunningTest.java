package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.FileNotFoundException;

import org.json.JSONException;
import org.junit.jupiter.api.Test;

import avalanche.Utility.DomainTokeniser;

public class RunningTest {
    @Test
    public void runningStateShouldReturnErrorWhenNoJSONObjectPassedIn() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"A JSONObject text must begin with '{' at 1 [character 2 line 1]\"}",
                state.getResponse("anything without braces", 0));
    }

    @Test
    public void runningStateShouldNotReturnServerErrorWithValidJSONObject() {
        ServerState state = new Running();
        assertFalse(state.getResponse("{}", 0).contains("server-error"));

    }

    @Test
    public void runningStateShouldReturnRequestErrorWithMissingDomain() {
        ServerState state = new Running();
        assertEquals("{\"status\":\"failure\",\"request-error\":\"JSONObject[\"domain\"] not found.\"}",
                state.getResponse("{}", 0));

    }

    @Test
    public void runningStateShouldReturnRequestErrorWithEmptyDomain() {
        ServerState state = new Running();
        assertEquals("{\"status\":\"failure\",\"request-error\":\"The domain name must be longer than 0 characters\"}",
                state.getResponse("{\"domain\":\"\"}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithMissingTypes() {
        ServerState state = new Running();
        assertEquals("{\"status\":\"failure\",\"request-error\":\"JSONObject[\"types\"] not found.\"}",
                state.getResponse("{\"domain\":\"d\"}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithNoMetrics() {
        ServerState state = new Running();
        assertEquals("{\"status\":\"failure\",\"request-error\":\"At least one distance metric must be listed\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithUnspecifiedMetricType() {
        ServerState state = new Running();
        assertEquals("{\"status\":\"failure\",\"request-error\":\"JSONObject[\"type\"] not found in metric number 1\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithNonExistentMetric() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"Type:Oops is not a valid metric\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"Oops\"}]}", 0));
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"Type:BestMetric is not a valid metric\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"BestMetric\"}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithUnspecifiedMetricThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"JSONObject[\"threshold\"] not found in metric number 1\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"Levenshtein\"}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithNegativeLevenshteinThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0 and less than the length of the search domain\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"Levenshtein\",\"threshold\":-1}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithNegativeSoundexThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"Soundex\",\"threshold\":-1}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithTooLargeLevenshteinThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0 and less than the length of the search domain\"}",
                state.getResponse("{\"domain\":\"domain\",\"types\":[{\"type\":\"Levenshtein\",\"threshold\":6}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithTooSmallLevenshteinThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0 and less than the length of the search domain\"}",
                state.getResponse("{\"domain\":\"domain\",\"types\":[{\"type\":\"Levenshtein\",\"threshold\":0}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithTooSmallSoundexThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"Soundex\",\"threshold\":0}]}", 0));
    }

    @Test
    public void runningStateShouldReturnRequestErrorWithTooLargeSoundexThreshold() {
        ServerState state = new Running();
        assertEquals(
                "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}",
                state.getResponse("{\"domain\":\"d\",\"types\":[{\"type\":\"Soundex\",\"threshold\":4.1}]}", 0));
    }

    @Test
    public void runningStateShouldReturnSuccessWithValidRequestLevenshteinFirst() {
        ServerState state = new Running();
        assertTrue(
                state.getResponse(
                        "{\"domain\":\"domain\",\"types\":[{\"type\":\"Levenshtein\",\"threshold\":3},{\"type\":\"Soundex\",\"threshold\":3}]}",
                        0)
                        .contains("\"status\":\"success\""));
    }

    @Test
    public void runningStateShouldReturnSuccessWithValidRequestSoundexFirst() {
        ServerState state = new Running();
        assertTrue(
                state.getResponse(
                        "{\"domain\":\"domain\",\"types\":[{\"type\":\"Soundex\",\"threshold\":3},{\"type\":\"Levenshtein\",\"threshold\":3}]}",
                        0)
                        .contains("\"status\":\"success\""));
    }

}
