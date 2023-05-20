
import java.util.concurrent.ConcurrentLinkedQueue;

import DataClasses.Domain;
import DistanceCalculators.SoundexCalculator;
import Processing.SimilarityChecker;

public class Main {
    public static void main(String[] args) {
        SoundexCalculator calc = new SoundexCalculator();
        double sim = calc.calculateSoundexDifference("read", "read");
        System.out.println(sim);

    }
}
