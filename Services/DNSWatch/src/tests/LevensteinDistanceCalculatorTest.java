package tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import DistanceCalculators.LevensteinDistanceCalculator;

public class LevensteinDistanceCalculatorTest {

    @Test
    public void sameStringShouldBe0() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(0, cal.calculateBasicLevenshteinDistance("a", "a"));
        assertEquals(0, cal.calculateBasicLevenshteinDistance("abcdefg", "abcdefg"));
        assertEquals(0, cal.calculateBasicLevenshteinDistance("Hello", "Hello"));
        assertEquals(0, cal.calculateBasicLevenshteinDistance("abc.com", "abc.com"));
        assertEquals(0, cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.za"));
        assertEquals(0, cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.za"));
        assertEquals(0, cal.calculateBasicLevenshteinDistance("!@#$%^&*()", "!@#$%^&*()"));

    }

    @Test
    public void stringsMissingLastLetterShouldBe1() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1, cal.calculateBasicLevenshteinDistance("a", ""));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abcdefg", "abcdef"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("Hello", "Hell"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abc.com", "abc.co"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", "mycooldomain.co.z"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", "my.cool.domain.co.z"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("!@#$%^&*()", "!@#$%^&*("));

    }

    @Test
    public void stringsMissingFirstLetterShouldBe1() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(1, cal.calculateBasicLevenshteinDistance("a", ""));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abcdefg", "bcdefg"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("Hello", "ello"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("abc.com", "bc.com"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", "ycooldomain.co.za"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", "y.cool.domain.co.za"));
        assertEquals(1, cal.calculateBasicLevenshteinDistance("!@#$%^&*()", "@#$%^&*()"));

    }

    @Test
    public void comparedToEmptyShouldBeTheLength() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals("a".length(), cal.calculateBasicLevenshteinDistance("a", ""));
        assertEquals("abcdefg".length(), cal.calculateBasicLevenshteinDistance("abcdefg", ""));
        assertEquals("Hello".length(), cal.calculateBasicLevenshteinDistance("Hello", ""));
        assertEquals("abc.com".length(), cal.calculateBasicLevenshteinDistance("abc.com", ""));
        assertEquals("mycooldomain.co.za".length(),
                cal.calculateBasicLevenshteinDistance("mycooldomain.co.za", ""));
        assertEquals("my.cool.domain.co.za".length(),
                cal.calculateBasicLevenshteinDistance("my.cool.domain.co.za", ""));
        assertEquals("!@#$%^&*()".length(), cal.calculateBasicLevenshteinDistance("!@#$%^&*()", ""));

    }

    @Test
    public void bookTobackShouldbe2() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(2, cal.calculateBasicLevenshteinDistance("book", "back"));
    }

    @Test
    public void test1FromOnlineCalulator() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(7, cal.calculateBasicLevenshteinDistance("9H2Vk15J", "De8YokLJ"));
    }

    @Test
    public void test2FromOnlineCalulator() {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        assertEquals(2, cal.calculateBasicLevenshteinDistance("bank.co.za", "bnak.co.za"));
    }

    @Test
    public void chatTests() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(2, calc.calculateBasicLevenshteinDistance("book", "back"));
        assertEquals(7, calc.calculateBasicLevenshteinDistance("9H2Vk15J", "De8YokLJ"));
        assertEquals(0, calc.calculateBasicLevenshteinDistance("", ""));
        assertEquals(3, calc.calculateBasicLevenshteinDistance("kitten", "sitting"));
        assertEquals(2, calc.calculateBasicLevenshteinDistance("open", "opener"));
        assertEquals(3, calc.calculateBasicLevenshteinDistance("Saturday", "Sunday"));
        assertEquals(2, calc.calculateBasicLevenshteinDistance("apple", "maple"));
    }

    @Test
    public void chatDomainTests() {
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        assertEquals(8, calc.calculateBasicLevenshteinDistance("stackoverflow.com", "stackexchange.com"));
        assertEquals(8, calc.calculateBasicLevenshteinDistance("opera.com", "mozilla.org"));
        assertEquals(8, calc.calculateBasicLevenshteinDistance("linkedin.com", "facebook.com"));
        assertEquals(1, calc.calculateBasicLevenshteinDistance("wikipedia.org", "wikimedia.org"));
        assertEquals(6, calc.calculateBasicLevenshteinDistance("amazon.com", "alibaba.com"));
    }

}
