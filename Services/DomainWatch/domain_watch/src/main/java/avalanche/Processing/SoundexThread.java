package avalanche.Processing;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import avalanche.DataClasses.Domain;
import avalanche.DistanceCalculators.SoundexCalculator;

public class SoundexThread extends Thread {
    private SoundexCalculator calc;
    private ConcurrentLinkedQueue<Domain> hits;
    private Queue<Domain> allDomains;
    private String search;
    private double threshold;

    public SoundexThread(String search, double threshold, ConcurrentLinkedQueue<Domain> hits,
            Queue<Domain> allDomains) {
        calc = new SoundexCalculator();
        this.hits = hits;
        this.allDomains = new LinkedList<>();
        for (Domain domain : allDomains) {
            this.allDomains.add(domain);
        }
        this.search = search;
        this.threshold = threshold;
    }

    @Override
    public void run() {
        while (!allDomains.isEmpty()) {
            Domain d = allDomains.poll();
            if (d != null) {

                double value = calc.calculateSoundexDifference(search, d.getName());
                if (value >= threshold) {
                    d.setDistance(value, "Soundex");
                    hits.add(d);
                }
            }
        }

    }

}
