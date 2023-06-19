package avalanche.Processing;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.concurrent.ConcurrentLinkedQueue;

import avalanche.DataClasses.Domain;
import avalanche.DistanceCalculators.LevensteinDistanceCalculator;
import avalanche.DistanceCalculators.SoundexCalculator;

public class SimilarityChecker {
    private static HashSet<Domain> allDomains;
    private static ArrayList<Queue<Domain>> splitDoms;
    public static final int THREAD_COUNT = 12;

    public static void init(boolean useMock) {
        String path = "data/Domain Retrieval.csv";
        if (useMock) {
            path = "data/Domain Retrieval mock.csv";
        }
        allDomains = new HashSet<>();
        splitDoms = new ArrayList<>();
        for (int i = 0; i < THREAD_COUNT; i++) {
            splitDoms.add(new LinkedList<Domain>());
        }
        int count = 0;
        try {
            Scanner file = new Scanner(new FileReader(path));
            // skip headings
            String line = file.nextLine();
            while (file.hasNext()) {
                line = file.nextLine();
                String[] split = line.split(",");
                Domain d = new Domain(split[0], split[1]);
                allDomains.add(d);
                splitDoms.get(count % THREAD_COUNT).add(d);
                count++;
            }
            file.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static void resetDistances() {
        for (Domain domain : allDomains) {
            domain.resetDistance();
        }

        for (Queue<Domain> domainQueue : splitDoms) {
            for (Domain domain : domainQueue) {
                domain.resetDistance();
            }
        }
    }

    public SimilarityChecker() {

    }

    public HashSet<Domain> getAllDomains() {
        return allDomains;
    }

    public void loopThroughAllDomains() {
        for (Domain domain : allDomains) {
            domain.resetDistance();
        }
    }

    public ConcurrentLinkedQueue<Domain> findAllWithinSimliarityThreshold(String search, double threshold) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        for (Domain domain : allDomains) {
            double value = calc.calculateBasicLevenshteinDistance(search, domain.getName());
            if (value <= threshold) {
                domain.setDistance(value, "Levenshtein");
                hits.add(domain);
            }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> findAllWithinSimliarityThreshold(String search, double threshold,
            ConcurrentLinkedQueue<Domain> searchSpace) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        for (Domain domain : searchSpace) {
            double value = calc.calculateBasicLevenshteinDistance(search, domain.getName());
            if (value <= threshold) {
                domain.setDistance(value, "Levenshtein");
                hits.add(domain);
            }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> findAllSoundsAboveSimliarityThreshold(String search, double threshold) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        SoundexCalculator calc = new SoundexCalculator();
        // int count = 0;
        // double pct = 0;
        for (Domain domain : allDomains) {
            double value = calc.calculateSoundexDifference(search, domain.getName());
            if (value >= threshold) {
                domain.setDistance(value, "Soundex");
                hits.add(domain);
            }
            // count++;
            // if (count % (allDomains.size() / 100) == 0) {
            // pct += 1;
            // System.out.println(pct + "%");
            // }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> findAllSoundsAboveSimliarityThreshold(String search, double threshold,
            ConcurrentLinkedQueue<Domain> searchSpace) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        SoundexCalculator calc = new SoundexCalculator();
        for (Domain domain : searchSpace) {
            double value = calc.calculateSoundexDifference(search, domain.getName());
            if (value >= threshold) {
                domain.setDistance(value, "Soundex");
                hits.add(domain);
            }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> threadedfindAllSoundsAboveSimliarityThreshold(String search, double threshold,
            int threadNum) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        SoundexThread[] threads = new SoundexThread[threadNum];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new SoundexThread(search, threshold, hits, splitDoms.get(i));
        }
        for (int i = 0; i < threads.length; i++) {
            threads[i].start();
        }

        boolean busy = true;
        while (busy) {
            busy = false;
            for (int i = 0; i < threads.length; i++) {
                if (threads[i].isAlive()) {
                    busy = true;
                    break;
                }
            }
        }
        return hits;
    }

    public ConcurrentLinkedQueue<Domain> threadedFindAllWithinSimliarityThreshold(String search, double threshold,
            int threadNum) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        CalculatorThread[] threads = new CalculatorThread[threadNum];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new CalculatorThread(search, threshold, hits, splitDoms.get(i));
        }
        for (int i = 0; i < threads.length; i++) {
            threads[i].start();
        }

        boolean busy = true;
        while (busy) {
            busy = false;
            for (int i = 0; i < threads.length; i++) {
                if (threads[i].isAlive()) {
                    busy = true;
                    break;
                }
            }
        }
        return hits;
    }
}
