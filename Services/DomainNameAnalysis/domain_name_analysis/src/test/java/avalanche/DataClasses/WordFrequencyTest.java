package avalanche.DataClasses;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class WordFrequencyTest {
    @Test
    public void creationAndGetterTest() {
        WordFrequency wf = new WordFrequency("hi", 0);
        assertEquals("hi", wf.getWord());
        assertEquals(0, wf.getFrequency());
    }

    @Test
    public void a0shouldBeSmallerThanA1() {
        WordFrequency wf = new WordFrequency("hi", 0);
        WordFrequency wf2 = new WordFrequency("hi", 1);
        assertEquals(-1, wf.compareTo(wf2));
    }

    @Test
    public void a0shouldBeEqualToA0() {
        WordFrequency wf = new WordFrequency("hi", 0);
        WordFrequency wf2 = new WordFrequency("hi", 0);
        assertEquals(0, wf.compareTo(wf2));
    }

    @Test
    public void a1shouldBeSmallerThanA0() {
        WordFrequency wf = new WordFrequency("hi", 1);
        WordFrequency wf2 = new WordFrequency("hi", 0);
        assertEquals(1, wf.compareTo(wf2));
    }
}
