package Processing;

import java.util.LinkedList;

import DataClasses.Domain;
import DistanceCalculators.LevensteinDistanceCalculator;

public class CalculatorThread extends Thread {
    private LevensteinDistanceCalculator calc;
    volatile LinkedList<Domain> hits;

    public CalculatorThread(String search, double threshold, Domain d) {
        calc = new LevensteinDistanceCalculator();
    }

    @Override
    public void run() {

    }

}
