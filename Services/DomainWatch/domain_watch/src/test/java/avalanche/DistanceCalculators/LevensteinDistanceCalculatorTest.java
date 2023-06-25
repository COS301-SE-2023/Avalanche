package avalanche.DistanceCalculators;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import avalanche.Settings.DomainWatchSettings;

public class LevensteinDistanceCalculatorTest {

    @Test
    public void sameStringShouldBe0() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("a", "a"), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("abcdefg", "abcdefg"), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("Hello", "Hello"), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("abc.com", "abc.com"), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.za"), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.za"), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "!@#$%^&*()"), 0);

    }

    @Test
    public void stringsMissingLastLetterShouldBe1() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("a", ""), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abcdefg", "abcdef"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("Hello", "Hell"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abc.com", "abc.co"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.z"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.z"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "!@#$%^&*("), 0);

    }

    @Test
    public void stringsMissingFirstLetterShouldBe1() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("a", ""), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abcdefg", "bcdefg"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("Hello", "ello"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abc.com", "bc.com"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "ycooldomain.co.za"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "y.cool.domain.co.za"), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "@#$%^&*()"), 0);

    }

    @Test
    public void comparedToEmptyShouldBeTheLength() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals("a".length(), cal.calculateModifiedLevenshteinDistance("a", ""), 0);
        assertEquals("abcdefg".length(), cal.calculateModifiedLevenshteinDistance("abcdefg", ""), 0);
        assertEquals("Hello".length(), cal.calculateModifiedLevenshteinDistance("Hello", ""), 0);
        assertEquals("abc.com".length(), cal.calculateModifiedLevenshteinDistance("abc.com", ""), 0);
        assertEquals("mycooldomain.co.za".length(),
                cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", ""), 0);
        assertEquals("my.cool.domain.co.za".length(),
                cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", ""), 0);
        assertEquals("!@#$%^&*()".length(), cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", ""), 0);

    }

    @Test
    public void subEfor3ShouldBeSmall() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("e", "3"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("3", "e"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("hello", "h3llo"), 0);

    }

    @Test
    public void subUforVShouldBeSmall() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("u", "v"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("v", "u"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("love", "loue"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("united", "vnited"), 0);

    }

    @Test
    public void subZfor2ShouldBeSmall() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("z", "2"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("2", "z"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("zulu", "2ulu"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("zebra", "2ebra"), 0);

    }

    @Test
    public void bookTobackShouldbe2() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(2.0, cal.calculateModifiedLevenshteinDistance("book", "back"), 0);
    }

    @Test
    public void test1FromOnlineCalulator() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(6.1, cal.calculateModifiedLevenshteinDistance("9H2Vk15J", "De8YokLJ"), 0);
    }

    @Test
    public void test2FromOnlineCalulator() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(2, cal.calculateModifiedLevenshteinDistance("bank.co.za", "bnak.co.za"), 0);
    }

    @Test
    public void repeatedlettersShouldBeClose() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("lop.com", "loop.com"), 0);
        assertEquals(0.2, cal.calculateModifiedLevenshteinDistance("lop.com", "looop.com"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("loop.com", "looop.com"), 0);
        assertEquals(0.2, cal.calculateModifiedLevenshteinDistance("book", "boookk"), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("google.com", "gooogle.com"), 0);
    }

    @Test
    public void repeatedLettersWithSubstitutions() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1.1, cal.calculateModifiedLevenshteinDistance("lop.com", "boop.com"), 0);
        assertEquals(1.2, cal.calculateModifiedLevenshteinDistance("lop.com", "blooop.com"), 0.000001);
        assertEquals(2.1, cal.calculateModifiedLevenshteinDistance("loop.com", "helooop.com"), 0);
        assertEquals(1.2, cal.calculateModifiedLevenshteinDistance("booker", "bloookker"), 0.000001);
        assertEquals(6.1, cal.calculateModifiedLevenshteinDistance("googlesearch.com", "gooogle.com"), 0);
        assertEquals(6.2, cal.calculateModifiedLevenshteinDistance("googlesearch.com", "goooogle.com"), 0);
        assertEquals(6.3, cal.calculateModifiedLevenshteinDistance("googlesearch.com", "gooooggle.com"), 0);
    }

    @Test
    public void swappedShouldBeSame() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(calc.calculateModifiedLevenshteinDistance("back", "book"),
                calc.calculateModifiedLevenshteinDistance("book", "back"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("sitting", "kitten"),
                calc.calculateModifiedLevenshteinDistance("kitten", "sitting"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("opener", "open"),
                calc.calculateModifiedLevenshteinDistance("open", "opener"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("Sunday", "Saturday"),
                calc.calculateModifiedLevenshteinDistance("Saturday", "Sunday"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("maple", "apple"),
                calc.calculateModifiedLevenshteinDistance("apple", "maple"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("stackexchange.com", "stackoverflow.com"),
                calc.calculateModifiedLevenshteinDistance("stackoverflow.com", "stackexchange.com"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("mozilla.org", "opera.com"),
                calc.calculateModifiedLevenshteinDistance("opera.com", "mozilla.org"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("facebook.com", "linkedin.com"),
                calc.calculateModifiedLevenshteinDistance("linkedin.com", "facebook.com"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("wikimedia.org", "wikipedia.org"),
                calc.calculateModifiedLevenshteinDistance("wikipedia.org", "wikimedia.org"), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("alibaba.com", "amazon.com"),
                calc.calculateModifiedLevenshteinDistance("amazon.com", "alibaba.com"), 0);
    }

    @Test
    public void chatTests() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(2, calc.calculateModifiedLevenshteinDistance("book", "back"), 0);
        assertEquals(0, calc.calculateModifiedLevenshteinDistance("", ""), 0);
        assertEquals(3, calc.calculateModifiedLevenshteinDistance("kitten", "sitting"), 0);
        assertEquals(2, calc.calculateModifiedLevenshteinDistance("open", "opener"), 0);
        assertEquals(3, calc.calculateModifiedLevenshteinDistance("Saturday", "Sunday"), 0);
        assertEquals(1.1, calc.calculateModifiedLevenshteinDistance("apple", "maple"), 0);
    }

    @Test
    public void chatDomainTests() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(8, calc.calculateModifiedLevenshteinDistance("stackoverflow.com", "stackexchange.com"), 0);
        assertEquals(7.1, calc.calculateModifiedLevenshteinDistance("opera.com", "mozilla.org"), 0);
        assertEquals(7.1, calc.calculateModifiedLevenshteinDistance("linkedin.com", "facebook.com"), 0);
        assertEquals(1, calc.calculateModifiedLevenshteinDistance("wikipedia.org", "wikimedia.org"), 0);
        assertEquals(6, calc.calculateModifiedLevenshteinDistance("amazon.com", "alibaba.com"), 0);
    }

    @Test
    public void Oto0changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("O", "0"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0", "O"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0pera.com", "Opera.com"), 0);
        assertEquals(3.1, calc.calculateModifiedLevenshteinDistance("0pera.biz", "Opera.com"), 0);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void Oto0changeShouldBeSmallWithInternal() throws NoSuchFieldException, SecurityException {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;

        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("O", "0"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0", "O"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0pera.com", "Opera.com"), 0);
        assertEquals(3.1, calc.calculateModifiedLevenshteinDistance("0pera.biz", "Opera.com"), 0);

        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void ito1changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("i", "1"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "i"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "h11.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hiithere.biz", "h11.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "thereh11.biz"), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void ito1changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("i", "1"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "i"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "h11.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hiithere.biz", "h11.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "thereh11.biz"), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void lto1changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("l", "1"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "l"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "he11o.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hellothere.biz", "he11o.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "therehe11o.biz"), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void lto1changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("l", "1"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "l"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "he11o.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hellothere.biz", "he11o.biz"), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "therehe11o.biz"), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void bto8changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("b", "8"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("8", "b"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("big", "8ig"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there"), 0);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void bto8changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("b", "8"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("8", "b"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("big", "8ig"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there"), 0);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void eto3changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("e", "3"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("3", "e"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hello", "h3llo"), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("herethere", "h3r3th3re"), 0.001);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("meeep", "m333p"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void eto3changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("e", "3"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("3", "e"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hello", "h3llo"), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("herethere", "h3r3th3re"), 0.001);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("meeep", "m333p"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void utoVChangeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("u", "v"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("v", "u"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hug", "hvg"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("umbrella", "vmbrella"), 0.001);
        assertEquals(0.5, calc.calculateModifiedLevenshteinDistance("valvaluevalve", "ualualveualue"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void utoVChangeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("u", "v"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("v", "u"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hug", "hvg"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("umbrella", "vmbrella"), 0.001);
        assertEquals(0.5, calc.calculateModifiedLevenshteinDistance("valvaluevalve", "ualualveualue"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void zto2ChangeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("2", "z"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("z", "2"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("zebra", "2ebra"), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("zol2zol", "2olz2ol"), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("zigzagzebra2", "2ig2ag2ebraz"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void zto2ChangeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("2", "z"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("z", "2"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("zebra", "2ebra"), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("zol2zol", "2olz2ol"), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("zigzagzebra2", "2ig2ag2ebraz"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void sto5ChangeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("s", "5"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("5", "s"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("sing", "5ing"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("5ing5ong", "singsong"), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("sing5ong5times", "5ingsongstime5"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void sto5ChangeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("s", "5"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("5", "s"), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("sing", "5ing"), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("5ing5ong", "singsong"), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("sing5ong5times", "5ingsongstime5"), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void selborneToSlo() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(5, calc.calculateModifiedLevenshteinDistance("selborne", "slo"), 0);
    }

}
