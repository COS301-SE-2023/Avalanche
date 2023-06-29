package avalanche.DistanceCalculators;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.io.FileNotFoundException;
import java.lang.reflect.Field;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import avalanche.Utility.DomainTokeniser;

public class SoundexCalculatorTest {

    @AfterEach
    public void fixDictionaryPath()
            throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
        Field pathField = DomainTokeniser.class.getDeclaredField("DICTIONARY_PATH");
        pathField.setAccessible(true);
        pathField.set(null, "data/wordsByFreq.txt");
    }

    @Test
    public void sameWordShouldBe4() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(4, calc.calculateSoundexDifference("read", "read"), 0);
        assertEquals(4, calc.calculateSoundexDifference("bank", "bank"), 0);
        assertEquals(4, calc.calculateSoundexDifference("google", "google"), 0);
        assertEquals(4, calc.calculateSoundexDifference("sweet", "sweet"), 0);
    }

    @Test
    public void homophonesShouldBe4() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(4, calc.calculateSoundexDifference("read", "reed"), 0);

    }

    @Test
    public void similarWordsShouldBe3() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3, calc.calculateSoundexDifference("first", "thirst"), 0);
        assertEquals(3, calc.calculateSoundexDifference("mead", "reed"), 0);
        assertEquals(3, calc.calculateSoundexDifference("feat", "neat"), 0);
        assertEquals(3, calc.calculateSoundexDifference("beater", "feature"), 0);
        assertEquals(3, calc.calculateSoundexDifference("there", "hair"), 0);
    }

    @Test
    public void similarPhrasesShouldBeHigh() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3.667, calc.calculateSoundexDifference("firstnationalbank", "thirstnationalbank"), 0.001);
        assertEquals(1, calc.calculateSoundexDifference("first", "thirstnationalbank"), 0);
        assertEquals(3.667, calc.calculateSoundexDifference("mycooldomain", "mikecooldomain"), 0.001);

    }

    @Test
    public void nonExitstentWords() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();

        assertEquals(0.5, calc.calculateSoundexDifference("hi", "itsepic"), 0.001);
        assertEquals(1.5, calc.calculateSoundexDifference("hi", "sowtv"), 0.001);

    }

    @Test
    public void chatDomainTests() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3, calc.calculateSoundexDifference("stackoverflow.com", "stackexchange.com"), 0);
        assertEquals(0, calc.calculateSoundexDifference("opera.com", "mozilla.org"), 0);
        assertEquals(0, calc.calculateSoundexDifference("linkedin.com", "facebook.com"), 0);
        assertEquals(3, calc.calculateSoundexDifference("wikipedia.org", "wikimedia.org"), 0);
        assertEquals(1, calc.calculateSoundexDifference("amazon.com", "alibaba.com"), 0);
    }

    @Test
    public void eitherStringNullShouldReturn0() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(0, calc.calculateSoundexDifference(null, "stackexchange.com"), 0);
        assertEquals(0, calc.calculateSoundexDifference("opera.com", null), 0);
        assertEquals(0, calc.calculateSoundexDifference(null, null), 0);
    }

    @Test
    public void testWithNoTokeniserDictionaryShouldAllTreatedAsOneWord()
            throws FileNotFoundException, InstantiationException, InterruptedException, IllegalArgumentException,
            IllegalAccessException, NoSuchFieldException, SecurityException {
        Field field = DomainTokeniser.class.getDeclaredField("hasBeenInitialised");
        field.setAccessible(true);
        field.set(null, false);
        Field pathField = DomainTokeniser.class.getDeclaredField("DICTIONARY_PATH");
        pathField.setAccessible(true);
        pathField.set(null, "This/should/fail");
        Thread.sleep(1000);
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3, calc.calculateSoundexDifference("stackoverflow", "stackexchange"), 0);
        assertEquals(1, calc.calculateSoundexDifference("opera", "mozilla"), 0);
        assertEquals(0, calc.calculateSoundexDifference("linkedin", "facebook"), 0);
        assertEquals(3, calc.calculateSoundexDifference("wikipedia", "wikimedia"), 0);
        assertEquals(1, calc.calculateSoundexDifference("amazon", "alibaba"), 0);

        pathField.set(null, "data/wordsByFreq.txt");
    }

    @Test
    public void testWithErroneousTokeniserDictionaryShouldAllTreatedAsOneWord()
            throws FileNotFoundException, InstantiationException, InterruptedException, IllegalArgumentException,
            IllegalAccessException, NoSuchFieldException, SecurityException {
        Field field = DomainTokeniser.class.getDeclaredField("hasBeenInitialised");
        field.setAccessible(true);
        field.set(null, false);
        Field pathField = DomainTokeniser.class.getDeclaredField("DICTIONARY_PATH");
        pathField.setAccessible(true);
        pathField.set(null, "data/wordsByFreqWrongCount.txt");
        Thread.sleep(1000);
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3, calc.calculateSoundexDifference("stackoverflow", "stackexchange"), 0);
        assertEquals(1, calc.calculateSoundexDifference("opera", "mozilla"), 0);
        assertEquals(0, calc.calculateSoundexDifference("linkedin", "facebook"), 0);
        assertEquals(3, calc.calculateSoundexDifference("wikipedia", "wikimedia"), 0);
        assertEquals(1, calc.calculateSoundexDifference("amazon", "alibaba"), 0);

        pathField.set(null, "data/wordsByFreq.txt");
    }

    @Test
    public void selborneToSlo() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(2, calc.calculateSoundexDifference("selborne", "slo"), 0);
    }
}
