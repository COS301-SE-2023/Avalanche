package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class InitialisingTest {
    @Test
    public void getResponseBodyShouldReturnError() {
        ServerState state = new Initialising();
        assertEquals("{\"status\":\"failure\",\"server-error\":\"The server is initialising. Please wait a while\"}",
                state.getResponse("anything", 0));
    }
}
