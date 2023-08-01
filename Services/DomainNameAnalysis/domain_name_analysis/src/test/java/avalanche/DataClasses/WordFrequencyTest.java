package avalanche.DataClasses;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class WordFrequencyTest {
    @Test
    public void creationAndGetterTest() {
        WordFrequency wf = new WordFrequency("hi", 0, null);
        assertEquals("hi", wf.getWord());
        assertEquals(0, wf.getFrequency());
    }

    @Test
    public void a0shouldBeSmallerThanA1() {
        WordFrequency wf = new WordFrequency("hi", 0, null);
        WordFrequency wf2 = new WordFrequency("hi", 1, null);
        assertEquals(-1, wf.compareTo(wf2));
    }

    @Test
    public void a0shouldBeEqualToA0() {
        WordFrequency wf = new WordFrequency("hi", 0, null);
        WordFrequency wf2 = new WordFrequency("hi", 0, null);
        assertEquals(0, wf.compareTo(wf2));
    }

    @Test
    public void a1shouldBeSmallerThanA0() {
        WordFrequency wf = new WordFrequency("hi", 1, null);
        WordFrequency wf2 = new WordFrequency("hi", 0, null);
        assertEquals(1, wf.compareTo(wf2));
    }
}
