package avalanche.Utility;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.FileNotFoundException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Queue;

import org.junit.jupiter.api.Test;

public class DomainTokeniserTest {

    @Test
    public void noFileFoundShouldThrow()
            throws NoSuchFieldException, SecurityException, IllegalArgumentException,
            IllegalAccessException {
        Field pathField = DomainTokeniser.class.getDeclaredField("DICTIONARY_PATH");
        pathField.setAccessible(true);

        pathField.set(null, "This/should/fail");
        assertThrows(FileNotFoundException.class, () -> {
            DomainTokeniser.init();
        });
        pathField.set(null, "data/wordsByFreq.txt");

    }

    @Test
    public void dictionaryMade() throws FileNotFoundException {
        System.out.println("Working Directory = " + System.getProperty("user.dir"));
        DomainTokeniser.init();
        assertNotNull(DomainTokeniser.getDictionary());
    }

    @Test
    public void dictionaryLengthCorrect() throws FileNotFoundException {

        DomainTokeniser.init();
        assertEquals(125549, DomainTokeniser.getDictionary().size());
    }

    @Test
    public void correctWordcost() throws FileNotFoundException {

        DomainTokeniser.init();
        assertEquals(0, DomainTokeniser.getDictionary().get("the"), 0.00001);
        assertEquals(8.137860786, DomainTokeniser.getDictionary().get("of"), 0.00001);
        assertEquals(12.89820418, DomainTokeniser.getDictionary().get("in"), 0.00001);
        assertEquals(16.27572157, DomainTokeniser.getDictionary().get("a"), 0.00001);
        assertEquals(137.8381991, DomainTokeniser.getDictionary().get("pebbliest"), 0.00001);
    }

    @Test
    public void oneWordTest() throws FileNotFoundException {

        DomainTokeniser.init();
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi", domainTokeniser.inferSpaces("hi"));
        assertEquals("hello", domainTokeniser.inferSpaces("hello"));
        assertEquals("What", domainTokeniser.inferSpaces("What"));
        assertEquals("Cool", domainTokeniser.inferSpaces("Cool"));
        assertEquals("grapefruit", domainTokeniser.inferSpaces("grapefruit"));
    }

    @Test
    public void twoWordTest() throws FileNotFoundException {
        DomainTokeniser.init();
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there", domainTokeniser.inferSpaces("hithere"));
        assertEquals("hello you", domainTokeniser.inferSpaces("helloyou"));
        assertEquals("cool guy", domainTokeniser.inferSpaces("coolguy"));
        assertEquals("grapefruit great", domainTokeniser.inferSpaces("grapefruitgreat"));
    }

    @Test
    public void threeWordTest() throws FileNotFoundException {
        DomainTokeniser.init();
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there dude", domainTokeniser.inferSpaces("hitheredude"));
        assertEquals("hello you guy", domainTokeniser.inferSpaces("helloyouguy"));
        assertEquals("cool guy cool", domainTokeniser.inferSpaces("coolguycool"));
        assertEquals("grapefruit great galaxy", domainTokeniser.inferSpaces("grapefruitgreatgalaxy"));
    }

    @Test
    public void fourWordTest() throws FileNotFoundException {
        DomainTokeniser.init();
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there dude man", domainTokeniser.inferSpaces("hitheredudeman"));
        assertEquals("hello you guy awesome", domainTokeniser.inferSpaces("helloyouguyawesome"));
        assertEquals("cool guy cool guy", domainTokeniser.inferSpaces("coolguycoolguy"));

        assertEquals("grapefruit great galaxy wow", domainTokeniser.inferSpaces("grapefruitgreatgalaxywow"));

    }

    @Test
    public void fiveWordTest() throws FileNotFoundException {
        DomainTokeniser.init();
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        assertEquals("hi there dude man sir", domainTokeniser.inferSpaces("hitheredudemansir"));
        assertEquals("hello you guy awesome blanket", domainTokeniser.inferSpaces("helloyouguyawesomeblanket"));
        assertEquals("cool guy cool guy cool", domainTokeniser.inferSpaces("coolguycoolguycool"));
    }

    @Test
    public void tokeniseTest() throws FileNotFoundException {
        DomainTokeniser.init();
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