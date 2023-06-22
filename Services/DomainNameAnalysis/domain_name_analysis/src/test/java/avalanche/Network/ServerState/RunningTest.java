package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class RunningTest {
    @Test
    public void runningShouldNotReturnAServerError() {
        ServerState state = new Running();
        assertFalse((state.getResponse("anything", 0)).contains("server-error"));
    }

    @Test
    public void invalidJSONShouldReturnRequestError() {
        ServerState state = new Running();
        assertTrue((state.getResponse("anything", 0)).contains("request-error"));
    }
}
