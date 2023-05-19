package Processing;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Scanner;

import DataClasses.Domain;
import DistanceCalculators.LevensteinDistanceCalculator;

public class SimilarityChecker {
    private HashSet<Domain> allDomains;

    public SimilarityChecker() {
        allDomains = new HashSet<>();
        System.out.println("Working Directory = " + System.getProperty("user.dir"));
        try {
            Scanner file = new Scanner(new FileReader(".\\Services\\DNSWatch\\data\\Domain Retrieval.csv"));
            // skip headings
            String line = file.nextLine();
            while (file.hasNext()) {
                line = file.nextLine();
                String[] split = line.split(",");
                allDomains.add(new Domain(split[0], split[1]));
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
}
