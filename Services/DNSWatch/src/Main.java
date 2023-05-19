import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import DataClasses.Domain;
import DistanceCalculators.LevensteinDistanceCalculator;
import Processing.SimilarityChecker;

public class Main {
    public static void main(String[] args) {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                7, 20);
        System.out.println("INPUT: firstnationalbank\nThreshold: 7\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }
}
