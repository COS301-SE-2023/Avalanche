package tests;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.junit.Test;

import DataClasses.Domain;
import Processing.SimilarityChecker;

public class SimilarityCheckerTest {
    @Test
    public void construction() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        assertNotNull(similarityChecker.getAllDomains());
        assertNotEquals(0, similarityChecker.getAllDomains().size());
    }

    @Test
    public void simpleLoop() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        similarityChecker.loopThroughAllDomains();
    }

    @Test
    public void searchForSimilar() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        LinkedList<Domain> results = similarityChecker.findAllWithinSimliarityThreshold("firstnationalbank",
                4);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }

    @Test
    public void searchForSimilarSounds() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        LinkedList<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold("hi",
                3);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }

    @Test
    public void concurrentSearchForSimilar() throws FileNotFoundException {
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
