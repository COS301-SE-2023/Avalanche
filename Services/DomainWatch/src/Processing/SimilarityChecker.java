package Processing;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

import DataClasses.Domain;
import DistanceCalculators.LevensteinDistanceCalculator;
import DistanceCalculators.SoundexCalculator;

public class SimilarityChecker {
    private static HashSet<Domain> allDomains;
    private static ArrayList<Queue<Domain>> splitDoms;

    public static void init() {
        allDomains = new HashSet<>();
        splitDoms = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            splitDoms.add(new LinkedList<>());
        }
        int count = 0;
        try {
            Scanner file = new Scanner(new FileReader("..\\data\\Domain Retrieval.csv"));
            // skip headings
            String line = file.nextLine();
            while (file.hasNext()) {
                line = file.nextLine();
                String[] split = line.split(",");
                Domain d = new Domain(split[0], split[1]);
                allDomains.add(d);
                splitDoms.get(count % 50).add(d);
                count++;
            }
            file.close();
        } catch (FileNotFoundException e) {
            try {
                Scanner file = new Scanner(new FileReader(
                        "C:\\Users\\gteuw\\Desktop\\UNI\\Year3\\COS301\\Avalanche\\Avalanche\\Services\\DomainWatch\\data\\Domain Retrieval.csv"));
                // skip headings
                String line = file.nextLine();
                while (file.hasNext()) {
                    line = file.nextLine();
                    String[] split = line.split(",");
                    allDomains.add(new Domain(split[0], split[1]));
                    splitDoms.get(count % 20).add(new Domain(split[0], split[1]));
                    count++;
                    // System.out.println(count);
                }
                file.close();
            } catch (FileNotFoundException ex) {
                ex.printStackTrace();
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
            String name = domain.getName();
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
        int count = 0;
        double pct = 0;
        for (Domain domain : allDomains) {
            double value = calc.calculateSoundexDifference(search, domain.getName());
            if (value >= threshold) {
                domain.setDistance(value, "Soundex");
                hits.add(domain);
            }
            count++;
            if (count % (allDomains.size() / 100) == 0) {
                pct += 1;
                System.out.println(pct + "%");
            }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> findAllSoundsAboveSimliarityThreshold(String search, double threshold,
            ConcurrentLinkedQueue<Domain> searchSpace) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        SoundexCalculator calc = new SoundexCalculator();
        int count = 0;
        double pct = 0;
        for (Domain domain : searchSpace) {
            double value = calc.calculateSoundexDifference(search, domain.getName());
            if (value >= threshold) {
                domain.setDistance(value, "Soundex");
                hits.add(domain);
            }
            count++;
            if (count % (allDomains.size() / 100) == 0) {
                pct += 1;
                System.out.println(pct + "%");
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
