package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class ClosedTest {
    @Test
    public void getResponseBodyShouldReturnError() {
        ServerState state = new Closed();
        assertEquals("{\"status\":\"failure\",\"server-error\":\"The server is closed\"}",
                state.getResponse("anything", 0));
    }
}
