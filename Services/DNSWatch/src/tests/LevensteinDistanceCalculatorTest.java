package tests;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import DistanceCalculators.LevensteinDistanceCalculator;

public class LevensteinDistanceCalculatorTest {

    @Test
    public void sameStringShouldBe0() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0, cal.calculateBasicLevenshteinDistance("a", "a"), 0);
        assertEquals(0, cal.calculateBasicLevenshteinDistance("abcdefg", "abcdefg"), 0);
        assertEquals(0, cal.calculateBasicLevenshteinDistance("Hello", "Hello"), 0);
        assertEquals(0, cal.calculateBasicLevenshteinDistance("abc.com", "abc.com"), 0);
        assertEquals(0, cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.za"), 0);
        assertEquals(0, cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.za"), 0);
        assertEquals(0, cal.calculateBasicLevenshteinDistance("!@#$%^&*()", "!@#$%^&*()"), 0);

    }

    @Test
    public void stringsMissingLastLetterShouldBe1() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1, cal.calculateBasicLevenshteinDistance("a", ""), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abcdefg", "abcdef"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("Hello", "Hell"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abc.com", "abc.co"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.z"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.z"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("!@#$%^&*()", "!@#$%^&*("), 0);

    }

    @Test
    public void stringsMissingFirstLetterShouldBe1() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1, cal.calculateBasicLevenshteinDistance("a", ""), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abcdefg", "bcdefg"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("Hello", "ello"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abc.com", "bc.com"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", "ycooldomain.co.za"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", "y.cool.domain.co.za"), 0);
        assertEquals(1, cal.calculateBasicLevenshteinDistance("!@#$%^&*()", "@#$%^&*()"), 0);

    }

    @Test
    public void comparedToEmptyShouldBeTheLength() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals("a".length(), cal.calculateBasicLevenshteinDistance("a", ""), 0);
        assertEquals("abcdefg".length(), cal.calculateBasicLevenshteinDistance("abcdefg", ""), 0);
        assertEquals("Hello".length(), cal.calculateBasicLevenshteinDistance("Hello", ""), 0);
        assertEquals("abc.com".length(), cal.calculateBasicLevenshteinDistance("abc.com", ""), 0);
        assertEquals("mycooldomain.co.za".length(),
                cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", ""), 0);
        assertEquals("my.cool.domain.co.za".length(),
                cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", ""), 0);
        assertEquals("!@#$%^&*()".length(), cal.calculateBasicLevenshteinDistance("!@#$%^&*()", ""), 0);

    }

    @Test
    public void bookTobackShouldbe2() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(2.0, cal.calculateBasicLevenshteinDistance("book", "back"), 0);
    }

    @Test
    public void test1FromOnlineCalulator() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(6.1, cal.calculateBasicLevenshteinDistance("9H2Vk15J", "De8YokLJ"), 0);
    }

    @Test
    public void test2FromOnlineCalulator() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(2, cal.calculateBasicLevenshteinDistance("bank.co.za", "bnak.co.za"), 0);
    }

    @Test
    public void repeatedlettersShouldBeClose() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0.1, cal.calculateBasicLevenshteinDistance("lop.com", "loop.com"), 0);
        assertEquals(0.2, cal.calculateBasicLevenshteinDistance("lop.com", "looop.com"), 0);
        assertEquals(0.1, cal.calculateBasicLevenshteinDistance("loop.com", "looop.com"), 0);
        assertEquals(0.2, cal.calculateBasicLevenshteinDistance("book", "boookk"), 0);
        assertEquals(0.1, cal.calculateBasicLevenshteinDistance("google.com", "gooogle.com"), 0);
    }

    @Test
    public void repeatedLettersWithSubstitutions() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1.1, cal.calculateBasicLevenshteinDistance("lop.com", "boop.com"), 0);
        assertEquals(1.2, cal.calculateBasicLevenshteinDistance("lop.com", "blooop.com"), 0.000001);
        assertEquals(2.1, cal.calculateBasicLevenshteinDistance("loop.com", "helooop.com"), 0);
        assertEquals(1.2, cal.calculateBasicLevenshteinDistance("booker", "bloookker"), 0.000001);
        assertEquals(6.1, cal.calculateBasicLevenshteinDistance("googlesearch.com", "gooogle.com"), 0);
        assertEquals(6.2, cal.calculateBasicLevenshteinDistance("googlesearch.com", "goooogle.com"), 0);
        assertEquals(6.3, cal.calculateBasicLevenshteinDistance("googlesearch.com", "gooooggle.com"), 0);
    }

    @Test
    public void chatTests() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(2, calc.calculateBasicLevenshteinDistance("book", "back"), 0);
        assertEquals(0, calc.calculateBasicLevenshteinDistance("", ""), 0);
        assertEquals(3, calc.calculateBasicLevenshteinDistance("kitten", "sitting"), 0);
        assertEquals(2, calc.calculateBasicLevenshteinDistance("open", "opener"), 0);
        assertEquals(3, calc.calculateBasicLevenshteinDistance("Saturday", "Sunday"), 0);
        assertEquals(1.1, calc.calculateBasicLevenshteinDistance("apple", "maple"), 0);
    }

    @Test
    public void chatDomainTests() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(8, calc.calculateBasicLevenshteinDistance("stackoverflow.com", "stackexchange.com"), 0);
        assertEquals(7.1, calc.calculateBasicLevenshteinDistance("opera.com", "mozilla.org"), 0);
        assertEquals(7.1, calc.calculateBasicLevenshteinDistance("linkedin.com", "facebook.com"), 0);
        assertEquals(1, calc.calculateBasicLevenshteinDistance("wikipedia.org", "wikimedia.org"), 0);
        assertEquals(6, calc.calculateBasicLevenshteinDistance("amazon.com", "alibaba.com"), 0);
    }

    @Test
    public void Oto0changeShouldBesmall() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("O", "0"), 0);
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("0", "O"), 0);
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("0pera.com", "Opera.com"), 0);
        assertEquals(3.1, calc.calculateBasicLevenshteinDistance("0pera.biz", "Opera.com"), 0);
    }

    @Test
    public void ito1changeShouldBesmall() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("i", "1"), 0);
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("1", "i"), 0);
        assertEquals(0.2, calc.calculateBasicLevenshteinDistance("hii.biz", "h11.biz"), 0);
        assertEquals(5.2, calc.calculateBasicLevenshteinDistance("hiithere.biz", "h11.biz"), 0);
        assertEquals(5.2, calc.calculateBasicLevenshteinDistance("hii.biz", "thereh11.biz"), 0.000001);
    }

    @Test
    public void lto1changeShouldBesmall() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("i", "1"), 0);
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("1", "i"), 0);
        assertEquals(0.2, calc.calculateBasicLevenshteinDistance("hello.biz", "he11o.biz"), 0);
        assertEquals(5.2, calc.calculateBasicLevenshteinDistance("hellothere.biz", "he11o.biz"), 0);
        assertEquals(5.2, calc.calculateBasicLevenshteinDistance("hello.biz", "therehe11o.biz"), 0.000001);
    }

    @Test
    public void bto8changeShouldBesmall() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("b", "8"), 0);
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("8", "b"), 0);
        assertEquals(0.1, calc.calculateBasicLevenshteinDistance("big", "8ig"), 0);
        // assertEquals(0.3, calc.calculateBasicLevenshteinDistance("bobb", "8088"), 0);
        assertEquals(0.2, calc.calculateBasicLevenshteinDistance("herebobthere", "here8o8there"), 0);
        assertEquals(0.2, calc.calculateBasicLevenshteinDistance("herebobthere", "here8o8there"), 0);
    }

}
