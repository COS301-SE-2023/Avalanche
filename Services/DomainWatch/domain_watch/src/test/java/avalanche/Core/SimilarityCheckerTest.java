package avalanche.Core;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Settings.DomainWatchSettings;
import avalanche.Utility.DomainTokeniser;

import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SimilarityCheckerTest {

    @BeforeEach
    public void reset() {
        DomainWatchSettings.getDomainWatchSettings().defaultZone = "ryce";
    }

    @BeforeAll
    public static void setUp() {
        SimilarityChecker.init(false, 12);
    }

    @Test
    public void construction() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        assertNotNull(similarityChecker.getAllDomainsMap());
        assertNotEquals(0, similarityChecker.getAllDomainsMap().size());
    }

    @Test
    public void simpleLoop() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        similarityChecker.loopThroughAllDomains();
    }

    @Test
    public void searchForSimilar() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        zones.add("ryce");
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                4, zones);
        assertNotNull(results);
    }

    @Test
    public void searchForSimilarWithAll() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        DomainWatchSettings.getDomainWatchSettings().defaultZone = "all";
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                4, zones);
        assertNotNull(results);
    }

    @Test
    public void searchForSimilarWithRyce() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        DomainWatchSettings.getDomainWatchSettings().defaultZone = "ryce";
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                4, zones);
        assertNotNull(results);
    }

    // @Test
    // public void searchForSimilarWithAll() throws FileNotFoundException {
    // DomainWatchSettings.getDomainWatchSettings().defaultZone = "*";
    // SimilarityChecker similarityChecker = new SimilarityChecker();
    // ConcurrentLinkedQueue<Domain> results =
    // similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
    // 4);
    // assertNotNull(results);
    // }

    @Test
    public void searchForSimilarWithGivenList() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        hits.add(new Domain("1stnationalbank", "AFRICA"));
        hits.add(new Domain("2ndnationalbank", "AFRICA"));
        hits.add(new Domain("3rdnationalbank", "AFRICA"));
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                6, hits);
        assertNotNull(results);
        assertEquals(3, results.size());

    }

    @Test
    public void searchForSimilarSoundsWithGivenList() throws FileNotFoundException {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        hits.add(new Domain("thirstnationalbank", "AFRICA"));
        hits.add(new Domain("2ndnationalbank", "AFRICA"));
        hits.add(new Domain("3rdnationalbank", "AFRICA"));
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                0, hits);
        assertNotNull(results);
        assertEquals(3, results.size());

    }

    @Test
    public void sameDomainTwiceShouldHaveSameSimilarity() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        zones.add("africa");
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                5, zones);
        SimilarityChecker.resetDistances();
        ConcurrentLinkedQueue<Domain> results2 = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                5, zones);
        assertNotNull(results);
        assertNotNull(results2);
        assertNotEquals(0, results.size());
        assertNotEquals(0, results2.size());
        for (Domain domain : results) {
            for (Domain domain2 : results2) {
                if (domain.equals(domain2)) {
                    assertEquals(domain.getDistance(), domain2.getDistance(), 0);
                    assertEquals(domain.toJSON(), domain2.toJSON());
                }
            }
        }
    }

    @Test
    public void searchForSimilarSoundsWithAll() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        DomainWatchSettings.getDomainWatchSettings().defaultZone = "all";
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                2, zones);
        assertNotNull(results);
    }

    @Test
    public void searchForSimilarSounds() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        DomainWatchSettings.getDomainWatchSettings().defaultZone = "ryce";
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                2, zones);
        assertNotNull(results);
    }

    @Test
    public void searchForSimilarSoundsWithZones() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        Set<String> zones = new HashSet<>();
        zones.add("africa");
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                2, zones);
        assertNotNull(results);
    }

    @Test
    public void concurrentSearchForSimilarSounds() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        Set<String> zones = new HashSet<>();
        zones.add("africa");
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                3, zones);
        assertNotNull(results);

        // System.out.println("INPUT: firstnationalbank\nThreshold:
        // 4\n=======================");
        // for (Domain domain : results) {
        // System.out.println(domain.getName() + " " + domain.getZone() + " (" +
        // domain.getDistance() + ")");
        // }
    }

    @Test
    public void concurrentSearchForSimilar() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        Set<String> zones = new HashSet<>();
        zones.add("africa");
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "selborne",
                3, zones);
        assertNotNull(results);
        assertNotEquals(0, results.size());
    }
}
