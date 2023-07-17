package avalanche.DistanceCalculators;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import avalanche.Settings.DomainWatchSettings;

public class LevensteinDistanceCalculatorTest {

    @Test
    public void sameStringShouldBe0() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("a", "a", 1000), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("abcdefg", "abcdefg", 1000), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("Hello", "Hello", 1000), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("abc.com", "abc.com", 1000), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.za", 1000), 0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.za", 1000),
                0);
        assertEquals(0, cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "!@#$%^&*()", 1000), 0);

    }

    @Test
    public void stringsMissingLastLetterShouldBe1() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("a", "", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abcdefg", "abcdef", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("Hello", "Hell", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abc.com", "abc.co", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.z", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.z", 1000),
                0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "!@#$%^&*(", 1000), 0);

    }

    @Test
    public void stringsMissingFirstLetterShouldBe1() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("a", "", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abcdefg", "bcdefg", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("Hello", "ello", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("abc.com", "bc.com", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "ycooldomain.co.za", 1000), 0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "y.cool.domain.co.za", 1000),
                0);
        assertEquals(1, cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "@#$%^&*()", 1000), 0);

    }

    @Test
    public void comparedToEmptyShouldBeTheLength() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals("a".length(), cal.calculateModifiedLevenshteinDistance("a", "", 1000), 0);
        assertEquals("abcdefg".length(), cal.calculateModifiedLevenshteinDistance("abcdefg", "", 1000), 0);
        assertEquals("Hello".length(), cal.calculateModifiedLevenshteinDistance("Hello", "", 1000), 0);
        assertEquals("abc.com".length(), cal.calculateModifiedLevenshteinDistance("abc.com", "", 1000), 0);
        assertEquals("mycooldomain.co.za".length(),
                cal.calculateModifiedLevenshteinDistance("mycooldomain.co.za", "", 1000), 0);
        assertEquals("my.cool.domain.co.za".length(),
                cal.calculateModifiedLevenshteinDistance("my.cool.domain.co.za", "", 1000), 0);
        assertEquals("!@#$%^&*()".length(), cal.calculateModifiedLevenshteinDistance("!@#$%^&*()", "", 1000), 0);

    }

    @Test
    public void subEfor3ShouldBeSmall() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("e", "3", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("3", "e", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("hello", "h3llo", 1000), 0);

    }

    @Test
    public void subUforVShouldBeSmall() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("u", "v", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("v", "u", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("love", "loue", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("united", "vnited", 1000), 0);

    }

    @Test
    public void subZfor2ShouldBeSmall() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("z", "2", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("2", "z", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("zulu", "2ulu", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("zebra", "2ebra", 1000), 0);

    }

    @Test
    public void bookTobackShouldbe2() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(2.0, cal.calculateModifiedLevenshteinDistance("book", "back", 1000), 0);
    }

    @Test
    public void test1FromOnlineCalulator() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(6.1, cal.calculateModifiedLevenshteinDistance("9H2Vk15J", "De8YokLJ", 1000), 0);
    }

    @Test
    public void test2FromOnlineCalulator() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(2, cal.calculateModifiedLevenshteinDistance("bank.co.za", "bnak.co.za", 1000), 0);
    }

    @Test
    public void repeatedlettersShouldBeClose() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("lop.com", "loop.com", 1000), 0);
        assertEquals(0.2, cal.calculateModifiedLevenshteinDistance("lop.com", "looop.com", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("loop.com", "looop.com", 1000), 0);
        assertEquals(0.2, cal.calculateModifiedLevenshteinDistance("book", "boookk", 1000), 0);
        assertEquals(0.1, cal.calculateModifiedLevenshteinDistance("google.com", "gooogle.com", 1000), 0);
    }

    @Test
    public void repeatedLettersWithSubstitutions() {
        LevenshteinDistanceCalculator cal = new LevenshteinDistanceCalculator();
        assertEquals(1.1, cal.calculateModifiedLevenshteinDistance("lop.com", "boop.com", 1000), 0);
        assertEquals(1.2, cal.calculateModifiedLevenshteinDistance("lop.com", "blooop.com", 1000), 0.000001);
        assertEquals(2.1, cal.calculateModifiedLevenshteinDistance("loop.com", "helooop.com", 1000), 0);
        assertEquals(1.2, cal.calculateModifiedLevenshteinDistance("booker", "bloookker", 1000), 0.000001);
        assertEquals(6.1, cal.calculateModifiedLevenshteinDistance("googlesearch.com", "gooogle.com", 1000), 0);
        assertEquals(6.2, cal.calculateModifiedLevenshteinDistance("googlesearch.com", "goooogle.com", 1000), 0);
        assertEquals(6.3, cal.calculateModifiedLevenshteinDistance("googlesearch.com", "gooooggle.com", 1000), 0);
    }

    @Test
    public void swappedShouldBeSame() {
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(calc.calculateModifiedLevenshteinDistance("back", "book", 1000),
                calc.calculateModifiedLevenshteinDistance("book", "back", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("sitting", "kitten", 1000),
                calc.calculateModifiedLevenshteinDistance("kitten", "sitting", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("opener", "open", 1000),
                calc.calculateModifiedLevenshteinDistance("open", "opener", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("Sunday", "Saturday", 1000),
                calc.calculateModifiedLevenshteinDistance("Saturday", "Sunday", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("maple", "apple", 1000),
                calc.calculateModifiedLevenshteinDistance("apple", "maple", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("stackexchange.com", "stackoverflow.com", 1000),
                calc.calculateModifiedLevenshteinDistance("stackoverflow.com", "stackexchange.com", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("mozilla.org", "opera.com", 1000),
                calc.calculateModifiedLevenshteinDistance("opera.com", "mozilla.org", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("facebook.com", "linkedin.com", 1000),
                calc.calculateModifiedLevenshteinDistance("linkedin.com", "facebook.com", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("wikimedia.org", "wikipedia.org", 1000),
                calc.calculateModifiedLevenshteinDistance("wikipedia.org", "wikimedia.org", 1000), 0);

        assertEquals(calc.calculateModifiedLevenshteinDistance("alibaba.com", "amazon.com", 1000),
                calc.calculateModifiedLevenshteinDistance("amazon.com", "alibaba.com", 1000), 0);
    }

    @Test
    public void chatTests() {
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(2, calc.calculateModifiedLevenshteinDistance("book", "back", 1000), 0);
        assertEquals(0, calc.calculateModifiedLevenshteinDistance("", "", 1000), 0);
        assertEquals(3, calc.calculateModifiedLevenshteinDistance("kitten", "sitting", 1000), 0);
        assertEquals(2, calc.calculateModifiedLevenshteinDistance("open", "opener", 1000), 0);
        assertEquals(3, calc.calculateModifiedLevenshteinDistance("Saturday", "Sunday", 1000), 0);
        assertEquals(1.1, calc.calculateModifiedLevenshteinDistance("apple", "maple", 1000), 0);
    }

    @Test
    public void chatDomainTests() {
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(8, calc.calculateModifiedLevenshteinDistance("stackoverflow.com", "stackexchange.com", 1000), 0);
        assertEquals(7.1, calc.calculateModifiedLevenshteinDistance("opera.com", "mozilla.org", 1000), 0);
        assertEquals(7.1, calc.calculateModifiedLevenshteinDistance("linkedin.com", "facebook.com", 1000), 0);
        assertEquals(1, calc.calculateModifiedLevenshteinDistance("wikipedia.org", "wikimedia.org", 1000), 0);
        assertEquals(6, calc.calculateModifiedLevenshteinDistance("amazon.com", "alibaba.com", 1000), 0);
    }

    @Test
    public void Oto0changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("O", "0", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0", "O", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0pera.com", "Opera.com", 1000), 0);
        assertEquals(3.1, calc.calculateModifiedLevenshteinDistance("0pera.biz", "Opera.com", 1000), 0);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void Oto0changeShouldBeSmallWithInternal() throws NoSuchFieldException, SecurityException {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;

        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("O", "0", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0", "O", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("0pera.com", "Opera.com", 1000), 0);
        assertEquals(3.1, calc.calculateModifiedLevenshteinDistance("0pera.biz", "Opera.com", 1000), 0);

        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void ito1changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("i", "1", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "i", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "h11.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hiithere.biz", "h11.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "thereh11.biz", 1000), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void ito1changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("i", "1", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "i", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "h11.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hiithere.biz", "h11.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hii.biz", "thereh11.biz", 1000), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void lto1changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("l", "1", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "l", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "he11o.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hellothere.biz", "he11o.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "therehe11o.biz", 1000), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void lto1changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("l", "1", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("1", "l", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "he11o.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hellothere.biz", "he11o.biz", 1000), 0);
        assertEquals(5.2, calc.calculateModifiedLevenshteinDistance("hello.biz", "therehe11o.biz", 1000), 0.000001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void bto8changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("b", "8", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("8", "b", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("big", "8ig", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there", 1000), 0);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void bto8changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("b", "8", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("8", "b", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("big", "8ig", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("herebobthere", "here8o8there", 1000), 0);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void eto3changeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("e", "3", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("3", "e", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hello", "h3llo", 1000), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("herethere", "h3r3th3re", 1000), 0.001);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("meeep", "m333p", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void eto3changeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("e", "3", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("3", "e", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hello", "h3llo", 1000), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("herethere", "h3r3th3re", 1000), 0.001);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("meeep", "m333p", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void utoVChangeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("u", "v", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("v", "u", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hug", "hvg", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("umbrella", "vmbrella", 1000), 0.001);
        assertEquals(0.5, calc.calculateModifiedLevenshteinDistance("valvaluevalve", "ualualveualue", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void utoVChangeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("u", "v", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("v", "u", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("hug", "hvg", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("umbrella", "vmbrella", 1000), 0.001);
        assertEquals(0.5, calc.calculateModifiedLevenshteinDistance("valvaluevalve", "ualualveualue", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void zto2ChangeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("2", "z", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("z", "2", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("zebra", "2ebra", 1000), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("zol2zol", "2olz2ol", 1000), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("zigzagzebra2", "2ig2ag2ebraz", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void zto2ChangeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("2", "z", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("z", "2", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("zebra", "2ebra", 1000), 0);
        assertEquals(0.3, calc.calculateModifiedLevenshteinDistance("zol2zol", "2olz2ol", 1000), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("zigzagzebra2", "2ig2ag2ebraz", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void sto5ChangeShouldBeSmallWithInternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = true;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("s", "5", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("5", "s", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("sing", "5ing", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("5ing5ong", "singsong", 1000), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("sing5ong5times", "5ingsongstime5", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void sto5ChangeShouldBeSmallWithExternal() {
        boolean old = DomainWatchSettings.getInstace().useInternalSubstitutionCosts;
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = false;
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("s", "5", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("5", "s", 1000), 0);
        assertEquals(0.1, calc.calculateModifiedLevenshteinDistance("sing", "5ing", 1000), 0);
        assertEquals(0.2, calc.calculateModifiedLevenshteinDistance("5ing5ong", "singsong", 1000), 0.001);
        assertEquals(0.4, calc.calculateModifiedLevenshteinDistance("sing5ong5times", "5ingsongstime5", 1000), 0.001);
        DomainWatchSettings.getInstace().useInternalSubstitutionCosts = old;
    }

    @Test
    public void selborneToSlo() {
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(5, calc.calculateModifiedLevenshteinDistance("selborne", "slo", 1000), 0);
    }

    @Test
    public void blankToblank() {
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        assertEquals(0, calc.calculateModifiedLevenshteinDistance("", "", 1000), 0);
    }

}
