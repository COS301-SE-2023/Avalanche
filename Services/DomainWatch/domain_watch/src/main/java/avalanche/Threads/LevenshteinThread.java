package avalanche.Threads;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import avalanche.DataClasses.Domain;
import avalanche.DistanceCalculators.LevenshteinDistanceCalculator;

public class LevenshteinThread extends Thread {
    private LevenshteinDistanceCalculator calc;
    private ConcurrentLinkedQueue<Domain> hits;
    private Queue<Domain> allDomains;
    private String search;
    private double threshold;

    public LevenshteinThread(String search, double threshold, ConcurrentLinkedQueue<Domain> hits,
            Queue<Domain> allDomains) {
        calc = new LevenshteinDistanceCalculator();
        this.allDomains = new LinkedList<>();
        for (Domain domain : allDomains) {
            this.allDomains.add(domain);
        }
        this.hits = hits;
        this.search = search;
        this.threshold = threshold;
    }

    @Override
    public void run() {
        while (!this.allDomains.isEmpty()) {
            Domain d = allDomains.poll();
            if (d != null) {

                double value = calc.calculateModifiedLevenshteinDistance(search, d.getName(), threshold);
                if (value <= threshold) {
                    Domain hit = new Domain(d);
                    hit.setDistance(value, "Levenshtein");
                    hits.add(hit);
                }
            }
        }

    }

}
