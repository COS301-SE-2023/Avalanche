package tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Test;

import Utility.DomainTokeniser;

public class DomainTokeniserTest {
    @Test
    public void dictionaryMade() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertNotNull(domainTokeniser.getDictionary());
    }

    @Test
    public void dictionaryLengthCorrect() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals(125549, domainTokeniser.getDictionary().size());
    }

    @Test
    public void correctWordcost() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals(0, domainTokeniser.getDictionary().get("the"), 0.00001);
        assertEquals(8.137860786, domainTokeniser.getDictionary().get("of"), 0.00001);
        assertEquals(12.89820418, domainTokeniser.getDictionary().get("in"), 0.00001);
        assertEquals(16.27572157, domainTokeniser.getDictionary().get("a"), 0.00001);
        assertEquals(137.8381991, domainTokeniser.getDictionary().get("pebbliest"), 0.00001);
    }

    @Test
    public void oneWordTest() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi", domainTokeniser.inferSpaces("hi"));
        assertEquals("hello", domainTokeniser.inferSpaces("hello"));
        assertEquals("What", domainTokeniser.inferSpaces("What"));
        assertEquals("Cool", domainTokeniser.inferSpaces("Cool"));
        assertEquals("grapefruit", domainTokeniser.inferSpaces("grapefruit"));
    }

    @Test
    public void twoWordTest() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there", domainTokeniser.inferSpaces("hithere"));
        assertEquals("hello you", domainTokeniser.inferSpaces("helloyou"));
        assertEquals("cool guy", domainTokeniser.inferSpaces("coolguy"));
        assertEquals("grape fruit great", domainTokeniser.inferSpaces("grapefruitgreat"));
    }

    @Test
    public void threeWordTest() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there dude", domainTokeniser.inferSpaces("hitheredude"));
        assertEquals("hello you guy", domainTokeniser.inferSpaces("helloyouguy"));
        assertEquals("cool guy cool", domainTokeniser.inferSpaces("coolguycool"));
        assertEquals("grapefruit great galaxy", domainTokeniser.inferSpaces("grapefruitgreatgalaxy"));
    }

    @Test
    public void fourWordTest() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there dude man", domainTokeniser.inferSpaces("hitheredudeman"));
        assertEquals("hello you guy awesome", domainTokeniser.inferSpaces("helloyouguyawesome"));
        assertEquals("cool guy cool guy", domainTokeniser.inferSpaces("coolguycoolguy"));

        assertEquals("grapefruit great galaxy wow", domainTokeniser.inferSpaces("grapefruitgreatgalaxywow"));

    }

    @Test
    public void fiveWordTest() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there dude man sir", domainTokeniser.inferSpaces("hitheredudemansir"));
        assertEquals("hello you guy awesome blanket", domainTokeniser.inferSpaces("helloyouguyawesomeblanket"));
        assertEquals("cool guy cool guy cool", domainTokeniser.inferSpaces("coolguycoolguycool"));
    }

    @Test
    public void tokeniseTest() {
        DomainTokeniser domainTokeniser = new DomainTokeniser();

        assertEquals("thumb green apple active assignment weekly metaphor",
                domainTokeniser.inferSpaces("thumbgreenappleactiveassignmentweeklymetaphor"));

        assertEquals("my cool domain",
                domainTokeniser.inferSpaces("mycooldomain"));

        assertEquals(
                "there is masses of text information of people comments which is parsed from html but there are no delimited characters in them for example thumb green apple active assignment weekly metaphor apparently there are thumb green apple etc in the string i also have a large dictionary to query whether the word is reasonable so what is the fastest way of extraction thanks a lot",
                domainTokeniser.inferSpaces(
                        "thereismassesoftextinformationofpeoplecommentswhichisparsedfromhtmlbuttherearenodelimitedcharactersinthemforexamplethumbgreenappleactiveassignmentweeklymetaphorapparentlytherearethumbgreenappleetcinthestringialsohavealargedictionarytoquerywhetherthewordisreasonablesowhatisthefastestwayofextractionthanksalot"));

        assertEquals(
                "it was a dark and stormy night the rain fell in torrents except at occasional intervals when it was checked by a violent gust of wind which swept up the streets for it is in london that our scene lies rattling along the housetops and fiercely agitating the scanty flame of the lamps that struggled against the darkness",
                domainTokeniser.inferSpaces(
                        "itwasadarkandstormynighttherainfellintorrentsexceptatoccasionalintervalswhenitwascheckedbyaviolentgustofwindwhichsweptupthestreetsforitisinlondonthatoursceneliesrattlingalongthehousetopsandfiercelyagitatingthescantyflameofthelampsthatstruggledagainstthedarkness"));
    }
}
