package avalanche.Network;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import avalanche.Network.HandlerStrategy.Closed;
import avalanche.Network.HandlerStrategy.HandlerStrategy;

public class HandlerStrategyClassEnumTest {

    @Test
    public void getWithInvalidEndpointShouldReturnClosed() {
        HandlerStrategy handlerStrategy = HandlerStrategyClassEnum.get("doesNotExist");
        assertEquals(Closed.class, handlerStrategy.getClass());
    }
}
