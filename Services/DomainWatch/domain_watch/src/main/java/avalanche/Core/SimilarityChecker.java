package avalanche.Core;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.concurrent.ConcurrentLinkedQueue;

import avalanche.DataClasses.Domain;
import avalanche.DistanceCalculators.LevenshteinDistanceCalculator;
import avalanche.DistanceCalculators.SoundexCalculator;
import avalanche.Settings.DomainWatchSettings;
import avalanche.Threads.LevenshteinThread;
import avalanche.Threads.SoundexThread;

public class SimilarityChecker {
    private static HashMap<String, HashSet<Domain>> allDomainsMap;
    private static HashMap<String, ArrayList<Queue<Domain>>> splitDoms;
    private static int threadCount;

    public static void init(boolean useMock, int threadCount) {
        SimilarityChecker.threadCount = threadCount;
        HashMap<String, String> domainFiles = DomainWatchSettings.getInstace().domainFiles;
        // String path = "data/Domain Retrieval.csv";
        // if (useMock) {
        // path = "data/Domain Retrieval mock.csv";
        // }
        splitDoms = new HashMap<>();
        allDomainsMap = new HashMap<>();
        for (String zone : domainFiles.keySet()) {
            splitDoms.put(zone, new ArrayList<>());
            for (int j = 0; j < threadCount; j++) {
                splitDoms.get(zone).add(new LinkedList<Domain>());
            }
        }

        for (String zone : domainFiles.keySet()) {
            int count = 0;
            HashSet<Domain> zoneDomains = new HashSet<>();
            try {
                Scanner file = new Scanner(new FileReader(domainFiles.get(zone)));
                // skip headings
                String line = file.nextLine();
                while (file.hasNext()) {
                    line = file.nextLine();
                    String[] split = line.split(",");
                    if (split.length != 2) {
                        System.out.println("Invalid domain on line " + count + " of " + domainFiles.get(zone));
                    } else {
                        Domain d = new Domain(split[0], split[1]);
                        zoneDomains.add(d);
                        splitDoms.get(zone).get(count % threadCount).add(d);
                    }
                    count++;
                }
                file.close();
                allDomainsMap.put(zone, zoneDomains);
                System.out.println("Loaded " + zone + " domains");
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            System.out.println("============================\n\n\n\n\n\n\n\n\n");
        }

    }

    public static void resetDistances() {
        for (HashSet<Domain> zoneDomains : allDomainsMap.values()) {
            for (Domain domain : zoneDomains) {
                domain.resetDistance();
            }
        }

        for (ArrayList<Queue<Domain>> list : splitDoms.values()) {
            for (Queue<Domain> queue : list) {
                for (Domain domain : queue) {
                    domain.resetDistance();
                }
            }
        }
    }

    public SimilarityChecker() {

    }

    public static HashMap<String, HashSet<Domain>> getAllDomainsMap() {
        return allDomainsMap;
    }

    public void loopThroughAllDomains() {
        for (HashSet<Domain> zoneDomains : allDomainsMap.values()) {
            for (Domain domain : zoneDomains) {
                domain.resetDistance();
            }
        }
    }

    private void addIfBelowLevenshteinThreshold(LevenshteinDistanceCalculator calc, double threshold, String search,
            Domain domain, ConcurrentLinkedQueue<Domain> hits) {
        double value = calc.calculateModifiedLevenshteinDistance(search, domain.getName(), threshold);
        if (value <= threshold) {
            domain.setDistance(value, "Levenshtein");
            hits.add(domain);
        }
    }

    private void addIfAboveSoundexThreshold(SoundexCalculator calc, double threshold, String search,
            Domain domain, ConcurrentLinkedQueue<Domain> hits) {
        double value = calc.calculateSoundexDifference(search, domain.getName());
        if (value >= threshold) {
            domain.setDistance(value, "Soundex");
            hits.add(domain);
        }
    }

    public ConcurrentLinkedQueue<Domain> findAllWithinSimliarityThreshold(String search, double threshold) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        if (DomainWatchSettings.getInstace().defaultZone.equals("all")) {
            for (HashSet<Domain> zoneDomains : allDomainsMap.values()) {
                for (Domain domain : zoneDomains) {
                    addIfBelowLevenshteinThreshold(calc, threshold, search, domain, hits);
                }
            }
        } else {
            for (Domain domain : allDomainsMap.get(DomainWatchSettings.getInstace().defaultZone)) {
                addIfBelowLevenshteinThreshold(calc, threshold, search, domain, hits);
            }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> findAllWithinSimliarityThreshold(String search, double threshold,
            ConcurrentLinkedQueue<Domain> searchSpace) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        LevenshteinDistanceCalculator calc = new LevenshteinDistanceCalculator();
        for (Domain domain : searchSpace) {
            double value = calc.calculateModifiedLevenshteinDistance(search, domain.getName(), threshold);
            if (value <= threshold) {
                domain.setDistance(value, "Levenshtein");
                hits.add(domain);
            }
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> findAllSoundsAboveSimliarityThreshold(String search, double threshold)
            throws FileNotFoundException {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        SoundexCalculator calc = new SoundexCalculator();
        if (DomainWatchSettings.getInstace().defaultZone.equals("all")) {
            for (HashSet<Domain> zoneDomains : allDomainsMap.values()) {
                for (Domain domain : zoneDomains) {
                    addIfAboveSoundexThreshold(calc, threshold, search, domain, hits);
                }
            }
        } else {
            for (Domain domain : allDomainsMap.get(DomainWatchSettings.getInstace().defaultZone)) {
                addIfAboveSoundexThreshold(calc, threshold, search, domain, hits);
            }
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

    public ConcurrentLinkedQueue<Domain> threadedfindAllSoundsAboveSimliarityThreshold(String search,
            double threshold) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        SoundexThread[] threads = new SoundexThread[threadCount];
        if (DomainWatchSettings.getInstace().getInstace().defaultZone.equals("all")) {
            for (ArrayList<Queue<Domain>> zoneDomainList : splitDoms.values()) {
                for (int i = 0; i < threads.length; i++) {
                    threads[i] = new SoundexThread(search, threshold, hits,
                            zoneDomainList.get(i));
                }
                for (int i = 0; i < threads.length; i++) {
                    threads[i].start();
                }
                spinThreads(0, threads);
                for (int i = 0; i < threads.length; i++) {
                    try {
                        threads[i].join();
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();

                    }
                }
                spinThreads(0, threads);
            }
        } else {
            for (int i = 0; i < threads.length; i++) {
                threads[i] = new SoundexThread(search, threshold, hits,
                        splitDoms.get(DomainWatchSettings.getInstace().defaultZone).get(i));
            }
            for (int i = 0; i < threads.length; i++) {
                threads[i].start();
            }
            spinThreads(0, threads);
            for (int i = 0; i < threads.length; i++) {
                try {
                    threads[i].join();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();

                }
            }
            spinThreads(0, threads);
        }

        return hits;
    }

    public ConcurrentLinkedQueue<Domain> threadedFindAllWithinSimliarityThreshold(String search, double threshold) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        LevenshteinThread[] threads = new LevenshteinThread[threadCount];
        if (DomainWatchSettings.getInstace().defaultZone.equals("all")) {
            for (ArrayList<Queue<Domain>> zoneDomains : splitDoms.values()) {
                for (int i = 0; i < threads.length; i++) {
                    threads[i] = new LevenshteinThread(search, threshold, hits, zoneDomains.get(i));
                }
                for (int i = 0; i < threads.length; i++) {
                    threads[i].start();
                }

                spinThreads(0, threads);
                for (int i = 0; i < threads.length; i++) {
                    try {
                        threads[i].join();
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                spinThreads(0, threads);
            }
        } else {
            for (int i = 0; i < threads.length; i++) {
                threads[i] = new LevenshteinThread(search, threshold, hits,
                        splitDoms.get(DomainWatchSettings.getInstace().defaultZone).get(i));
            }
            for (int i = 0; i < threads.length; i++) {
                threads[i].start();
            }

            spinThreads(0, threads);
            for (int i = 0; i < threads.length; i++) {
                try {
                    threads[i].join();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            spinThreads(0, threads);
        }

        return hits;
    }

    private void spinThreads(int position, Thread[] threads) {
        final String[] loading = { "-", "\\", "|", "/" };
        int loaderNum = position % loading.length;
        for (int i = 0; i < threads.length; i++) {
            System.out.print("\u001b[1000D");
            System.out.print("\u001b[1A");
        }
        for (int i = 0; i < threads.length; i++) {
            System.out.println(
                    "Thread " + i + "-\t" + threads[i].getState().toString() + "[" + loading[loaderNum] + "]");
        }
    }

    // private void spinThreadsTimed(int milliseconds, int position, Thread[]
    // threads) {
    // if (System.currentTimeMillis() % 500 == 0) {
    // spinThreads(position, threads);
    // }
    // }
}
