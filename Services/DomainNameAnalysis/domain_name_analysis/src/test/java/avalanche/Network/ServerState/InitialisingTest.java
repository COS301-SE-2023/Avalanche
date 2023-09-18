package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import avalanche.Network.HandlerStartegy.HandlerStrategy;
import avalanche.Network.HandlerStartegy.Initialising;

public class InitialisingTest {
    @Test
    public void getResponseBodyShouldReturnError() {
        HandlerStrategy state = new Initialising();
        assertEquals("{\"status\":\"failure\",\"server-error\":\"The server is initialising. Please wait a while\"}",
                state.getResponse("anything", 0));
    }
}
