package avalanche.Core;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.zip.*;

import org.javatuples.Triplet;

import javafx.scene.web.WebHistory.Entry;

public class Classifier {

    private static List<Triplet<String, String, Integer>> training_set = null;

    public static void init() {
        training_set = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader("data/wordDict.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 2) {
                    training_set.add(new Triplet<>(parts[0].trim(), parts[1].trim(),
                            compressLength(parts[0].trim())));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Classifier() {
        if (training_set == null) {
            init();
        }
    }

    private static int k = 6;

    public static String classify(String toClassify) throws IOException {
        String x1 = toClassify;
        int Cx1 = compressLength(x1);

        // Using a priority queue to store the top k smallest distances
        PriorityQueue<Map.Entry<Integer, Double>> pq = new PriorityQueue<>(
                (a, b) -> Double.compare(b.getValue(), a.getValue()));

        for (int i = 0; i < training_set.size(); i++) {
            Triplet<String, String, Integer> x2Tuple = training_set.get(i);
            String x2 = x2Tuple.getValue0();
            int Cx2 = x2Tuple.getValue2();
            String x1x2 = x1 + x2;
            int Cx1x2 = compressLength(x1x2);

            double ncdx1x2 = (double) (Cx1x2 - Math.min(Cx1, Cx2)) / Math.max(Cx1, Cx2);
            pq.offer(new AbstractMap.SimpleEntry<>(i, ncdx1x2));
            if (pq.size() > k) {
                pq.poll();
            }
        }

        List<Map.Entry<String[], Double>> topKClass = new ArrayList<>();
        while (!pq.isEmpty()) {
            Map.Entry<Integer, Double> entry = pq.poll();
            int idx = entry.getKey();
            String[] wordAndClass = { training_set.get(idx).getValue0(), training_set.get(idx).getValue1() };
            topKClass.add(new AbstractMap.SimpleEntry<>(wordAndClass, entry.getValue()));
        }

        Collections.reverse(topKClass); // Since the smallest distances will be at the beginning
        return mostFrequent(topKClass);

    }

    public static void main(String[] args) throws IOException {
        Classifier c = new Classifier();
        String word = "hike";
        System.out.println("Classify: " + word + "\u001b[35m");
        System.out.println("\u001b[33m" + c.classify(word) + "\u001b[0m\n==\n");
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
