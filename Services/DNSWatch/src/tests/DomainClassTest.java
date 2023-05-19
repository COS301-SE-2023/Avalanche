package tests;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import DataClasses.Domain;

public class DomainClassTest {
    @Test
    public void testZoneExtraction() {
        Domain d = new Domain("a.b", "b");
        assertEquals("a", d.getName());
        assertEquals("b", d.getZone());

        d = new Domain("meep.africa", "AFRICA");
        assertEquals("meep", d.getName());
        assertEquals("AFRICA", d.getZone());

        d = new Domain("africa.africa", "AFRICA");
        assertEquals("africa", d.getName());
        assertEquals("AFRICA", d.getZone());

        d = new Domain("AFRICA.AFRICA.africa", "AFRICA");
        assertEquals("AFRICA.AFRICA", d.getName());
        assertEquals("AFRICA", d.getZone());
    }
}
