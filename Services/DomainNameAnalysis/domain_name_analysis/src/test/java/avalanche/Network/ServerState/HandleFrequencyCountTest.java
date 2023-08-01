package avalanche.Network.ServerState;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import avalanche.Network.HandlerStartegy.HandlerStrategy;
import avalanche.Network.HandlerStartegy.RunningStrategies.HandleFrequencyCount;

public class HandleFrequencyCountTest {
    @Test
    public void runningShouldNotReturnAServerError() {
        HandlerStrategy state = new HandleFrequencyCount();
        assertFalse((state.getResponse("anything", 0)).contains("server-error"));
    }

    @Test
    public void invalidJSONShouldReturnRequestError() {
        HandlerStrategy state = new HandleFrequencyCount();
        assertTrue((state.getResponse("anything", 0)).contains("request-error"));
        assertTrue((state.getResponse("{anything}", 0)).contains("request-error"));
        assertTrue((state.getResponse("{anything:}", 0)).contains("request-error"));
        assertTrue((state.getResponse("{\"anything\":}", 0)).contains("request-error"));
    }

    @Test
    public void validJSONWithoutValidFieldsShouldReturnRequestError() {

        HandlerStrategy state = new HandleFrequencyCount();

        assertTrue((state.getResponse("{\"hello\":\"there\"}", 0)).contains("request-error"));
    }

}
