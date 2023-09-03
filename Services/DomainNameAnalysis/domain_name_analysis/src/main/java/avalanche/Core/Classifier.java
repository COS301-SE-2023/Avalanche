package avalanche.Core;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.zip.*;

import javafx.scene.web.WebHistory.Entry;

public class Classifier {

    private static List<String[]> training_set;

    public Classifier() {
        training_set = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader("data/wordDict.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 2) {
                    training_set.add(new String[] { parts[0].trim(), parts[1].trim() });
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static int k = 5;

    public static String classify(String toClassify) throws IOException {
        String x1 = toClassify;
        int Cx1 = compressLength(x1);

        List<Double> distance_from_x1 = new ArrayList<>();
        for (String[] x2Tuple : training_set) {
            String x2 = x2Tuple[0];
            int Cx2 = compressLength(x2);
            String x1x2 = x2 + "" + x1;
            int Cx1x2 = compressLength(x1x2);

            double ncd = (double) (Cx1x2 - Math.min(Cx1, Cx2)) / Math.max(Cx1, Cx2);
            distance_from_x1.add(ncd);
        }

        List<Map.Entry<String[], Double>> top_k_class = getTopKIndices(distance_from_x1, training_set, k);
        // for (Map.Entry<String, Double> e : top_k_class) {
        // System.out.println("\t" + e.getKey() + " " + e.getValue());
        // }
        System.out.println("===");
        String predict_class = mostFrequent(top_k_class);
        System.out.println("===");
        return predict_class;

    }

    public static void main(String[] args) throws IOException {
        Classifier c = new Classifier();
        String word = "book hiking be healthy";
        System.out.println("Classify: " + word);
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
            System.out.println(item.getKey()[0] + ", " + item.getKey()[1] + " [" + item.getValue() + "]");
            if (counter.get(key) > maxCount) {
                maxCount = counter.get(key);
                frequentItem = key;
            }
        }
        return frequentItem;
    }

    public static List<Map.Entry<String[], Double>> getTopKIndices(List<Double> arr, List<String[]> trainingSet,
            int k) {
        Integer[] indices = new Integer[arr.size()];
        for (int i = 0; i < arr.size(); i++) {
            indices[i] = i;
        }

        Arrays.sort(indices, Comparator.comparing(arr::get));
        List<Map.Entry<String[], Double>> topKClass = new ArrayList<>();

        for (int i = 0; i < k; i++) {
            int idx = indices[i];
            String[] wordAndClass = { trainingSet.get(idx)[0], trainingSet.get(idx)[1] };
            topKClass.add(new AbstractMap.SimpleEntry<>(wordAndClass, arr.get(idx)));
        }

        return topKClass;
    }

}
