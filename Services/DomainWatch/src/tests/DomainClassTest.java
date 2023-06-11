package tests;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import DataClasses.Domain;

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
}
