package Processing;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.LinkedBlockingQueue;

import DataClasses.Domain;
import DistanceCalculators.LevensteinDistanceCalculator;

public class CalculatorThread extends Thread {
    private LevensteinDistanceCalculator calc;
    private ConcurrentLinkedQueue<Domain> hits;
    private Queue<Domain> allDomains;
    private String search;
    private double threshold;

    public CalculatorThread(String search, double threshold, ConcurrentLinkedQueue<Domain> hits,
            Queue<Domain> allDomains) {
        calc = new LevensteinDistanceCalculator();
        this.hits = hits;
        this.allDomains = allDomains;
        this.search = search;
        this.threshold = threshold;
    }

    @Override
    public void run() {
        while (!allDomains.isEmpty()) {
            Domain d = allDomains.poll();
            if (d != null) {

                double value = calc.calculateBasicLevenshteinDistance(search, d.getName());
                if (value <= threshold) {
                    d.setDistance(value);
                    hits.add(d);
                }
            }
        }

    }

}
