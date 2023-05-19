package tests;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Scanner;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
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
                7);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 7\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }

    @Test
    public void concurrentSearchForSimilar() throws FileNotFoundException {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "happypuppies",
                1, 50);
        assertNotNull(results);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }
}
