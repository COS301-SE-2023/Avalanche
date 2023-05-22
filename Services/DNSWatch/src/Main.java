
import java.util.LinkedList;
import java.util.concurrent.ConcurrentLinkedQueue;

import DataClasses.Domain;
import DistanceCalculators.SoundexCalculator;
import Processing.SimilarityChecker;

public class Main {
    public static void main(String[] args) {
        SimilarityChecker similarityChecker = new SimilarityChecker();
        LinkedList<Domain> results = similarityChecker.findAllSoundsAboveSimliarityThreshold("hi",
                3);
        System.out.println("INPUT: firstnationalbank\nThreshold: 4\n=======================");
        for (Domain domain : results) {
            System.out.println(domain.getName() + " " + domain.getZone() + "  (" + domain.getDistance() + ")");
        }

    }
}
