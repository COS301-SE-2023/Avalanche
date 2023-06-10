package avalanche.Processing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import avalanche.DataClasses.Domain;
import avalanche.Processing.SimilarityChecker;
import avalanche.Utility.DomainTokeniser;

import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SimilarityCheckerTest {
    @Test
    public void construction() throws FileNotFoundException {
        SimilarityChecker.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        assertNotNull(similarityChecker.getAllDomains());
        assertNotEquals(0, similarityChecker.getAllDomains().size());
    }

    @Test
    public void simpleLoop() throws FileNotFoundException {
        SimilarityChecker.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        similarityChecker.loopThroughAllDomains();
    }

    @Test
    public void searchForSimilar() throws FileNotFoundException {
        SimilarityChecker.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                4);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }

    @Test
    public void sameDomainTwiceShouldHaveSameSimilarity() throws FileNotFoundException {
        SimilarityChecker.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                5, 50);
        SimilarityChecker.resetDistances();
        ConcurrentLinkedQueue<Domain> results2 = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                5, 50);
        assertNotNull(results);
        assertNotNull(results2);
        assertNotEquals(0, results.size());
        assertNotEquals(0, results2.size());
        for (Domain domain : results) {
            for (Domain domain2 : results2) {
                if (domain.equals(domain2)) {
                    assertEquals(domain.getDistance(), domain2.getDistance(), 0);
                    System.out.println(domain.toJSON() + "\t" + domain2.toJSON());
                }
            }
        }
    }

    @Test
    public void searchForSimilarSounds() throws FileNotFoundException {
        SimilarityChecker.init();
        DomainTokeniser.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold("absabank",
                3);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }

    @Test
    public void concurrentSearchForSimilarSounds() throws FileNotFoundException {
        SimilarityChecker.init();
        DomainTokeniser.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(
                "firstnationalbank",
                3, 50);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }

    @Test
    public void concurrentSearchForSimilar() throws FileNotFoundException {
        SimilarityChecker.init();
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                4, 50);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }
}
