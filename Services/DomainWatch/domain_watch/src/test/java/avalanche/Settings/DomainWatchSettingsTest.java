package avalanche.Settings;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import mockit.Mock;
import mockit.MockUp;

public class DomainWatchSettingsTest {

    @Test
    public void noConfFileShouldThrowError() throws Exception {
        DomainWatchSettings.configFilePath = "blah.conf";
        assertThrows(Exception.class, () -> {
            DomainWatchSettings.init();
        });
        DomainWatchSettings.configFilePath = "domainWatch.conf";
    }

    // @Test
    // public void noInitShouldError() {
    // new MockUp<System>() {
    // @Mock
    // public void exit(int value) {
    // throw new RuntimeException(String.valueOf(value));
    // }
    // };
    // DomainWatchSettings.configFilePath = "blah.conf";
    // try {
    // DomainWatchSettings domainWatchSettings = DomainWatchSettings.getInstace();
    // } catch (RuntimeException e) {
    // Assertions.assertEquals("1", e.getMessage());
    // }

    // DomainWatchSettings.configFilePath = "domainWatch.conf";
    // }
}
