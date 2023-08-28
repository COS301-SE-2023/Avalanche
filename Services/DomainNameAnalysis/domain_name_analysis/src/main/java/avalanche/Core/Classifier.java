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
        try (BufferedReader br = new BufferedReader(new FileReader("data/training_data.txt"))) {
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

    private static int k = 3;

    public static String classify(String toClassify) throws IOException {
        String x1 = toClassify;
        int Cx1 = compressLength(x1);

        List<Double> distance_from_x1 = new ArrayList<>();
        for (String[] x2Tuple : training_set) {
            String x2 = x2Tuple[0];
            int Cx2 = compressLength(x2);
            String x1x2 = x1 + " " + x2;
            int Cx1x2 = compressLength(x1x2);

            double ncd = (double) (Cx1x2 - Math.min(Cx1, Cx2)) / Math.max(Cx1, Cx2);
            distance_from_x1.add(ncd);
        }

        List<Map.Entry<String, Double>> top_k_class = getTopKIndices(distance_from_x1, training_set, k);
        // for (Map.Entry<String, Double> e : top_k_class) {
        // System.out.println("\t" + e.getKey() + " " + e.getValue());
        // }
        String predict_class = mostFrequent(top_k_class);
        return predict_class;

    }

    public static void main(String[] args) throws IOException {
        classify("healthTips");

    }

    public static int compressLength(String text) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPOutputStream gzipOS = new GZIPOutputStream(baos)) {
            gzipOS.write(text.getBytes());
        }
        return baos.toByteArray().length;
    }

    public static String mostFrequent(List<Map.Entry<String, Double>> list) {
        Map<String, Integer> counter = new HashMap<>();
        int maxCount = 0;
        String frequentItem = null;

        for (Map.Entry<String, Double> item : list) {
            String key = item.getKey();
            counter.put(key, counter.getOrDefault(key, 0) + 1);

            if (counter.get(key) > maxCount) {
                maxCount = counter.get(key);
                frequentItem = key;
            }
        }
        return frequentItem;
    }

    public static List<Map.Entry<String, Double>> getTopKIndices(List<Double> arr, List<String[]> trainingSet, int k) {
        Integer[] indices = new Integer[arr.size()];
        for (int i = 0; i < arr.size(); i++) {
            indices[i] = i;
        }

        Arrays.sort(indices, Comparator.comparing(arr::get));
        List<Map.Entry<String, Double>> topKClass = new ArrayList<>();

        for (int i = 0; i < k; i++) {
            int idx = indices[i];
            topKClass.add(new AbstractMap.SimpleEntry<>(trainingSet.get(idx)[1], arr.get(idx)));
        }

        return topKClass;
    }

}
