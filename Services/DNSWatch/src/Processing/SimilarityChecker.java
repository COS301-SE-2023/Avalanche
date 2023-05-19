package Processing;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.LinkedBlockingDeque;

import DataClasses.Domain;
import DistanceCalculators.LevensteinDistanceCalculator;

public class SimilarityChecker {
    private HashSet<Domain> allDomains;
    ArrayList<Queue<Domain>> splitDoms;

    public SimilarityChecker() {
        allDomains = new HashSet<>();
        splitDoms = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            splitDoms.add(new LinkedList<>());
        }
        System.out.println("Working Directory = " + System.getProperty("user.dir"));
        int count = 0;
        try {
            Scanner file = new Scanner(new FileReader(".\\Services\\DNSWatch\\data\\Domain Retrieval.csv"));
            // skip headings
            String line = file.nextLine();
            while (file.hasNext()) {
                line = file.nextLine();
                String[] split = line.split(",");
                allDomains.add(new Domain(split[0], split[1]));
                splitDoms.get(count % 50).add(new Domain(split[0], split[1]));
                count++;
            }
            file.close();
        } catch (FileNotFoundException e) {
            try {
                Scanner file = new Scanner(new FileReader(
                        "C:\\Users\\User\\OneDrive\\Documents\\University of Pretoria\\Year 3\\Semester 1\\COS301\\Avalanche\\Avalanche\\Services\\DNSWatch\\data\\Domain Retrieval.csv"));
                // skip headings
                String line = file.nextLine();
                while (file.hasNext()) {
                    line = file.nextLine();
                    String[] split = line.split(",");
                    allDomains.add(new Domain(split[0], split[1]));
                    splitDoms.get(count % 20).add(new Domain(split[0], split[1]));
                    count++;
                }
                file.close();
            } catch (FileNotFoundException ex) {
                ex.printStackTrace();
            }

        }
    }

    public HashSet<Domain> getAllDomains() {
        return allDomains;
    }

    public void loopThroughAllDomains() {
        for (Domain domain : allDomains) {
            String name = domain.getName();
        }
    }

    public LinkedList<Domain> findAllWithinSimliarityThreshold(String search, double threshold) {
        LinkedList<Domain> hits = new LinkedList<>();
        LevensteinDistanceCalculator calc = new LevensteinDistanceCalculator();
        for (Domain domain : allDomains) {
            double value = calc.calculateBasicLevenshteinDistance(search, domain.getName());
            if (value <= threshold) {
                domain.setDistance(value);
                hits.add(domain);
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
