package avalanche.DistanceCalculators;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.io.FileNotFoundException;

import org.junit.jupiter.api.Test;

import avalanche.Utility.DomainTokeniser;

public class SoundexCalculatorTest {

    @Test
    public void sameWordShouldBe4() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(4, calc.calculateSoundexDifference("read", "read"), 0);
        assertEquals(4, calc.calculateSoundexDifference("bank", "bank"), 0);
        assertEquals(4, calc.calculateSoundexDifference("google", "google"), 0);
        assertEquals(4, calc.calculateSoundexDifference("sweet", "sweet"), 0);
    }

    @Test
    public void homophonesShouldBe4() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(4, calc.calculateSoundexDifference("read", "reed"), 0);

    }

    @Test
    public void similarWordsShouldBe3() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3, calc.calculateSoundexDifference("first", "thirst"), 0);
        assertEquals(3, calc.calculateSoundexDifference("mead", "reed"), 0);
        assertEquals(3, calc.calculateSoundexDifference("feat", "neat"), 0);
        assertEquals(3, calc.calculateSoundexDifference("beater", "feature"), 0);
        assertEquals(3, calc.calculateSoundexDifference("there", "hair"), 0);
    }

    @Test
    public void similarPhrasesShouldBeHigh() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3.667, calc.calculateSoundexDifference("firstnationalbank", "thirstnationalbank"), 0.001);
        assertEquals(1, calc.calculateSoundexDifference("first", "thirstnationalbank"), 0);
        assertEquals(3.667, calc.calculateSoundexDifference("mycooldomain", "mikecooldomain"), 0.001);

    }

    @Test
    public void nonExitstentWords() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();

        assertEquals(0.5, calc.calculateSoundexDifference("hi", "itsepic"), 0.001);
        assertEquals(1.5, calc.calculateSoundexDifference("hi", "sowtv"), 0.001);

    }

    @Test
    public void chatDomainTests() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(3, calc.calculateSoundexDifference("stackoverflow.com", "stackexchange.com"), 0);
        assertEquals(0, calc.calculateSoundexDifference("opera.com", "mozilla.org"), 0);
        assertEquals(0, calc.calculateSoundexDifference("linkedin.com", "facebook.com"), 0);
        assertEquals(3, calc.calculateSoundexDifference("wikipedia.org", "wikimedia.org"), 0);
        assertEquals(1, calc.calculateSoundexDifference("amazon.com", "alibaba.com"), 0);
    }

    @Test
    public void selborneToSlo() throws FileNotFoundException {
        DomainTokeniser.init();
        SoundexCalculator calc = new SoundexCalculator();
        assertEquals(2, calc.calculateSoundexDifference("selborne", "slo"), 0);
    }
}
