package avalanche.DataClasses;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

public class DomainClassTest {
    @Test
    public void testConstruction() {
        Domain d = new Domain("a", "b");
        assertEquals("a", d.getName());
        assertEquals("b", d.getZone());

        d = new Domain("meep", "AFRICA");
        assertEquals("meep", d.getName());
        assertEquals("AFRICA", d.getZone());

        d = new Domain("africa", "AFRICA");
        assertEquals("africa", d.getName());
        assertEquals("AFRICA", d.getZone());

        d = new Domain("AFRICA.AFRICA", "AFRICA");
        assertEquals("AFRICA.AFRICA", d.getName());
        assertEquals("AFRICA", d.getZone());
    }

    @Test
    public void testToString() {
        Domain d = new Domain("a", "b");
        assertEquals("a.b", d.toString());

        d = new Domain("meep", "AFRICA");
        assertEquals("meep.africa", d.toString());

        d = new Domain("africa", "AFRICA");
        assertEquals("africa.africa", d.toString());

        d = new Domain("AFRICA.AFRICA", "AFRICA");
        assertEquals("AFRICA.AFRICA.africa", d.toString());
    }

    @Test
    public void testCompare()
            throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
        Domain domain1 = new Domain("a", "b");
        Domain domain2 = new Domain("b", "a");

        Field f1 = domain1.getClass().getDeclaredField("distance");
        f1.setAccessible(true);
        f1.set(domain1, 2);
        f1.set(domain2, 2);

        Field f2 = domain1.getClass().getDeclaredField("metrics");
        f2.setAccessible(true);
        f2.set(domain1, 2);
        f2.set(domain2, 2);

        assertEquals(0, domain1.compareTo(domain2));

        f1.set(domain1, 1);

        assertEquals(-1, domain1.compareTo(domain2));

        f1.set(domain1, 3);

        assertEquals(1, domain1.compareTo(domain2));

    }

    @Test
    public void testSimilarity() {
        Domain d = new Domain("slo", "CO.ZA");
        d.setDistance(5, "Levenshtein");
        assertEquals(0.4, d.getDistance(), 0);
    }
}
