package avalanche.Network.HandlerStrategy.RunningStrategies;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import avalanche.Network.HandlerStrategy.RunningStrategies.HandlePassive;

public class HandlePassiveTest {

        @Test
        public void emptyRequestShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse("", 0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"A JSONObject text must begin with '{' at 0 [character 1 line 1]\"}",
                                response);
        }

        @Test
        public void requestWithoutWatchedShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse("{}", 0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"JSONObject[\"watched\"] not found.\"}",
                                response);
        }

        @Test
        public void requestWithEmptyWatchedShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse("{\"watched\":[]}", 0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"At least one 'watched' object must be provided. A 'watched' object consists of a person and a list of domains\"}",
                                response);
        }

        @Test
        public void requestWithoutPersonShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse("{\"watched\":[{\"blah\":\"blah\"}]}", 0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"JSONObject[\"person\"] not found in 'watched' object number 1\"}",
                                response);
        }

        @Test
        public void requestWithBlankPersonShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse("{\"watched\":[{\"person\":\"\",\"domains\":[]}]}", 0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"Person in 'watched' object number 1 cannot be blank\"}",
                                response);
        }

        @Test
        public void requestWithEmptyDomainsShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1}],\"domains\":[]}]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"Domain list in 'watched' object number 1 cannot be empty\"}",
                                response);
        }

        @Test
        public void requestWithoutDomainsShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1}]}]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"JSONObject[\"domains\"] not found in 'watched' object number 1\"}",
                                response);
        }

        @Test
        public void requestWithoutRecentlyCreatedShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1}],\"domains\":[\"myDomain\"]}]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"JSONObject[\"recently-created\"] not found.\"}",
                                response);
        }

        @Test
        public void requestWithEmptyRecentlyCreatedShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1}],\"domains\":[\"myDomain\"]}],\"recently-created\":[]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"List of recently added domains cannot be empty\"}",
                                response);
        }

        @Test
        public void invalidMetricShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"BLAH\", \"threshold\": 1}],\"domains\":[\"myDomain\"]}],\"recently-created\":[\"nyDomain\"]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"Type:BLAH is not a valid metric\"}",
                                response);
        }

        @Test
        public void noMetricsShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [],\"domains\":[\"myDomain\"]}],\"recently-created\":[\"nyDomain\"]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"At least one distance metric must be listed\"}",
                                response);
        }

        @Test
        public void invalidLevenshteinDistanceShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 0}],\"domains\":[\"myDomain\"]}],\"recently-created\":[\"nyDomain\"]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0\"}",
                                response);
        }

        @Test
        public void invalidSoundexDistanceShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Soundex\", \"threshold\": 0}],\"domains\":[\"myDomain\"]}],\"recently-created\":[\"nyDomain\"]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}",
                                response);
        }

        @Test
        public void blankDomainShouldReturnError() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1}],\"domains\":[\"\"]}],\"recently-created\":[\"nyDomain\"]}",
                                0);
                assertEquals(
                                "{\"status\":\"failure\",\"request-error\":\"Domain number 1 in 'watched' object number 1 cannot be blank\"}",
                                response);
        }

        @Test
        public void validRequestShouldNotReturnError1() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{\"watched\":[{\"person\":\"p1\",\"types\" : [{\"type\" : \"Levenshtein\", \"threshold\": 1}],\"domains\":[\"myDomain\"]}],\"recently-created\":[\"nyDomain\"]}",
                                0);
                assertEquals(
                                "{\"status\":\"success\",\"data\":{\"alerts\":[{\"person\":\"p1\",\"domains\":[\"nyDomain\"]}]}}",
                                response);
        }

        @Test
        public void validRequestShouldNotReturnError2() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{" + //
                                                "" + //
                                                "\"watched\": [{" + //
                                                "\"person\": \"p1\"," + //
                                                "\"types\": [{" + //
                                                "\"type\": \"Levenshtein\"," + //
                                                "\"threshold\": 1" + //
                                                "}]," + //
                                                "\"domains\": [\"myDomain\"]" + //
                                                "}, {" + //
                                                "\"person\": \"p2\"," + //
                                                "\"types\": [{" + //
                                                "\"type\": \"Levenshtein\"," + //
                                                "\"threshold\": 1" + //
                                                "}]," + //
                                                "\"domains\": [\"byDomain\"]" + //
                                                "}]," + //
                                                "\"recently-created\": [\"nyDomain\"]" + //
                                                "}",
                                0);
                assertEquals(
                                "{\"status\":\"success\",\"data\":{\"alerts\":[{\"person\":\"p1\",\"domains\":[\"nyDomain\"]},{\"person\":\"p2\",\"domains\":[\"nyDomain\"]}]}}",
                                response);
        }

        @Test
        public void validRequestShouldNotReturnError3() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{" + //
                                                "" + //
                                                "\"watched\": [{" + //
                                                "\"person\": \"p1\"," + //
                                                "\"types\": [{" + //
                                                "\"type\": \"Levenshtein\"," + //
                                                "\"threshold\": 1" + //
                                                "}]," + //
                                                "\"domains\": [\"myDomain\",\"hugs\"]" + //
                                                "}, {" + //
                                                "\"person\": \"p2\"," + //
                                                "\"types\": [{" + //
                                                "\"type\": \"Levenshtein\"," + //
                                                "\"threshold\": 1" + //
                                                "}]," + //
                                                "\"domains\": [\"byDomain\"]" + //
                                                "}]," + //
                                                "\"recently-created\": [\"nyDomain\",\"bugs\"]" + //
                                                "}",
                                System.currentTimeMillis());
                assertTrue(
                                response.contains(
                                                "{\"status\":\"success\",\"data\":{\"alerts\":[{\"person\":\"p1\",\"domains\":[\"nyDomain\",\"bugs\"]},{\"person\":\"p2\",\"domains\":[\"nyDomain\"]"));
        }

        @Test
        public void validRequestShouldNotReturnError4() {
                HandlePassive hp = new HandlePassive();
                String response = hp.getResponse(
                                "{" + //
                                                "" + //
                                                "\"watched\": [{" + //
                                                "\"person\": \"p1\"," + //
                                                "\"types\": [{" + //
                                                "\"type\": \"Levenshtein\"," + //
                                                "\"threshold\": 1" + //
                                                "},{\"type\":\"Soundex\",\"threshold\":1}]," + //
                                                "\"domains\": [\"myDomain\",\"hugs\"]" + //
                                                "}, {" + //
                                                "\"person\": \"p2\"," + //
                                                "\"types\": [{\"type\":\"Soundex\",\"threshold\":1},{" + //
                                                "\"type\": \"Levenshtein\"," + //
                                                "\"threshold\": 1" + //
                                                "}]," + //
                                                "\"domains\": [\"byDomain\"]" + //
                                                "}]," + //
                                                "\"recently-created\": [\"nyDomain\",\"bugs\"]" + //
                                                "}",
                                System.currentTimeMillis());
                assertTrue(
                                response.contains(
                                                "{\"status\":\"success\",\"data\":{\"alerts\":[{\"person\":\"p1\",\"domains\":[\"nyDomain\",\"bugs\"]},{\"person\":\"p2\",\"domains\":[\"nyDomain\"]"));
        }
}
