
import java.util.concurrent.ConcurrentLinkedQueue;

import DataClasses.Domain;
import Processing.SimilarityChecker;

public class Main {
    public static void main(String[] args) {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        ConcurrentLinkedQueue<Domain> results = similarityChecker.threadedFindAllWithinSimliarityThreshold(
                "firstnationalbank",
                4, 50);
        System.out.println("INPUT: firstnationalbank\nThreshold: 7\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }
    }
}
