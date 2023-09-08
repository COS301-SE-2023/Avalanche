package avalanche.Core;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.zip.*;

import org.javatuples.Triplet;


public class Classifier {

    private final boolean PRINT_DEBUG = false;

    private static List<String> words = new ArrayList<>();
    private static List<String> classifications = new ArrayList<>();
    private static List<Integer> compressedLengths = new ArrayList<>();

    public static void init() {
        try (BufferedReader br = new BufferedReader(new FileReader("data/wordDict.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 2) {
                    words.add(parts[0].trim());
                    classifications.add(parts[1].trim());
                    compressedLengths.add(compressLength(parts[0].trim()));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Classifier() {
        if (words.isEmpty()) {
            init();
        }
    }

    private static int k = 6;

    public String classify(String toClassify) throws IOException {
        String x1 = toClassify;
        int Cx1 = compressLength(x1);

        // Using a priority queue to store the top k smallest distances
        PriorityQueue<Map.Entry<Integer, Double>> pq = new PriorityQueue<>(
                (a, b) -> {
                    return Double.compare(b.getValue(), a.getValue());
                });

        for (int i = 0; i < words.size(); i++) {

            String x2 = words.get(i);
            int Cx2 = compressedLengths.get(i);
            String x1x2 = x1 + x2;
            String x2x1 = x2 + x1;
            int Cx1x2 = compressLength(x1x2);
            int Cx2x1 = compressLength(x1x2);
            int use = Math.min(Cx1x2, Cx2x1);
            double ncdx1x2 = (double) (use - Math.min(Cx1, Cx2)) / Math.max(Cx1, Cx2);
            pq.offer(new AbstractMap.SimpleEntry<>(i, ncdx1x2));
            if (pq.size() > k) {
                pq.poll();
            }
        }

        List<Map.Entry<String[], Double>> topKClass = new ArrayList<>();
        while (!pq.isEmpty()) {
            Map.Entry<Integer, Double> entry = pq.poll();
            int idx = entry.getKey();
            String[] wordAndClass = { words.get(idx), classifications.get(idx) };
            topKClass.add(new AbstractMap.SimpleEntry<>(wordAndClass, entry.getValue()));
        }

        Collections.reverse(topKClass); // Since the smallest distances will be at the beginning
        if (PRINT_DEBUG) {
            System.out.print("====\n");
            for (java.util.Map.Entry<String[], Double> entry : topKClass) {
                System.out
                        .println("\u001b[35m" + entry.getKey()[0] + ", " + entry.getKey()[1] + ", [" + entry.getValue()
                                + "]\u001b[0m");
            }
            System.out.println("====");
        }
        return mostFrequent(topKClass);

    }

    public static void main(String[] args) throws IOException {
        Classifier c = new Classifier();
        String word = "hike";
        System.out.println("Classify: " + word);
        System.out.println("\u001b[33m" + c.classify(word) + "\u001b[0m\n====\n");
        // String[] spl = word.split(" ");
        // for (String w : spl) {
        // System.out.println("Classify: " + w);
        // System.out.println("\u001b[33m" + c.classify(w) + "\u001b[0m\n==\n");
        // }

    }

    public static int compressLength(String text) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPOutputStream gzipOS = new GZIPOutputStream(baos)) {
            gzipOS.write(text.getBytes());
        }
        return baos.toByteArray().length;
    }

    public static String mostFrequent(List<Map.Entry<String[], Double>> list) {
        Map<String, Integer> counter = new HashMap<>();
        int maxCount = 0;
        String frequentItem = null;

        for (Map.Entry<String[], Double> item : list) {
            String key = item.getKey()[1];
            counter.put(key, counter.getOrDefault(key, 0) + 1);
            // System.out.println(item.getKey()[0] + ", " + item.getKey()[1] + " [" +
            // item.getValue() + "]");
            if (counter.get(key) > maxCount) {
                maxCount = counter.get(key);
                frequentItem = key;
            }
        }
        return frequentItem;
    }

}
