import DistanceCalculators.LevensteinDistanceCalculator;

public class Main {
    public static void main(String[] args) {
        LevensteinDistanceCalculator cal = new LevensteinDistanceCalculator();
        cal.calculateBasicLevenshteinDistance("book", "boookk");
    }
}
