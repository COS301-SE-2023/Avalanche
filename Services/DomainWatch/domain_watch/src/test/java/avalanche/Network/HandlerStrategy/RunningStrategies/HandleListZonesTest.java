package avalanche.Network.HandlerStrategy.RunningStrategies;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class HandleListZonesTest {
    @Test
    public void shouldReturnAll() {
        HandleListZones hz = new HandleListZones();
        String res = hz.getResponse("", 0);
        assertEquals(true, res.contains("africa"));
        assertEquals(true, res.contains("ryce"));
    }
}
