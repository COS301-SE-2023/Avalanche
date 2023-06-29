package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import avalanche.Network.HandlerStartegy.Closed;
import avalanche.Network.HandlerStartegy.HandlerStrategy;

public class ClosedTest {
    @Test
    public void getResponseBodyShouldReturnError() {
        HandlerStrategy state = new Closed();
        assertEquals("{\"status\":\"failure\",\"server-error\":\"The server is closed\"}",
                state.getResponse("anything", 0));
    }
}
