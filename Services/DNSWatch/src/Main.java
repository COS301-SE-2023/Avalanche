import DistanceCalculators.LevensteinDistanceCalculator;

public class Main {
    public static void main(String[] args) {
        LevensteinDistanceCalculator l = new LevensteinDistanceCalculator();
        System.out.println(l.calculateBasicLevenshteinDistance("hi", "ho"));
    }
}
