package avalanche.Core;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Utility.DomainTokeniser;

import java.io.FileNotFoundException;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SimilarityCheckerTest {
    @Test
    public void construction() throws FileNotFoundException {
        SimilarityChecker.init(true, 12);
        SimilarityChecker similarityChecker = new SimilarityChecker();
        assertNotNull(similarityChecker.getAllDomains());
        assertNotEquals(0, similarityChecker.getAllDomains().size());
    }

    @Test
    public void simpleLoop() throws FileNotFoundException {
        SimilarityChecker.init(true, 12);
        SimilarityChecker similarityChecker = new SimilarityChecker();
        similarityChecker.loopThroughAllDomains();
    }

    @Test
    public void searchForSimilar() throws FileNotFoundException {
        SimilarityChecker.init(true, 12);
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                4);
        assertNotNull(results);
    }

    @Test
    public void searchForSimilarWithGivenList() throws FileNotFoundException, InstantiationException {
        DomainTokeniser.init();
        SimilarityChecker.init(true, 12);
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
        SimilarityChecker.init(true, 12);
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
        SimilarityChecker.init(true, 12);
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                5);
        SimilarityChecker.resetDistances();
        ConcurrentLinkedQueue<Domain> results2 = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                5);
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
    public void searchForSimilarSounds() throws FileNotFoundException, InstantiationException {
        SimilarityChecker.init(true, 12);
        DomainTokeniser.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                2);
        assertNotNull(results);
    }

    @Test
    public void concurrentSearchForSimilarSounds() throws FileNotFoundException, InstantiationException {
        SimilarityChecker.init(true, 12);
        DomainTokeniser.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                3);
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
        SimilarityChecker.init(true, 12);
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "selborne",
                5);
        assertNotNull(results);
    }
}
