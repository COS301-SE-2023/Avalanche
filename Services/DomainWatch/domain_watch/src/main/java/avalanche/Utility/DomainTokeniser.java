package avalanche.Utility;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.ConcurrentHashMap;

public class DomainTokeniser {
    private static boolean hasBeenInitialised = false;
    private static HashMap<String, Double> dictionary;
    private static ConcurrentHashMap<String, String> wordsDone;
    private static int maxword;
    private static String DICTIONARY_PATH = "data/wordsByFreq.txt";

    public static void init() throws FileNotFoundException, InstantiationException {
        buildDictionary();
        wordsDone = new ConcurrentHashMap<>();
        hasBeenInitialised = true;
    }

    public DomainTokeniser() throws FileNotFoundException, InstantiationException {
        if (!hasBeenInitialised) {
            init();
        }
    }

    public static HashMap<String, Double> getDictionary() {
        return dictionary;
    }

    private static void buildDictionary() throws FileNotFoundException, InstantiationException {
        dictionary = new HashMap<>();
        int count = 0;
        maxword = 0;
        int length = 0;
        Scanner file;
        file = new Scanner(new FileReader(DICTIONARY_PATH));
        // read total number of words for calculation in this loop
        length = Integer.parseInt(file.nextLine());

        while (file.hasNext()) {
            String line = file.nextLine();
            dictionary.put(line, Math.log(count + 1) * Math.log(length));
            if (line.length() > maxword) {
                maxword = line.length();
            }
            count++;
        }
        file.close();

        if (count != length) {
            System.out.println("Word count error in dictionary: counted " + (count) + " but expected " + length);
            throw new InstantiationException(
                    "Word count error in dictionary: counted " + (count) + " but expected " + length);
        }
    }

    class BestMatchResult {
        double cost;
        int length;

        BestMatchResult(double cost, int length) {
            this.cost = cost;
            this.length = length;
        }
    }

    private BestMatchResult bestMatch(int i, String s, ArrayList<Double> cost) {
        List<Double> reversedSublist = new ArrayList<>();
        for (int j = i - 1; j >= Math.max(0, i - maxword); j--) {
            reversedSublist.add(cost.get(j));
        }

        double minCost = Integer.MAX_VALUE;
        int matchLength = 0;

        for (int k = 0; k < reversedSublist.size(); k++) {
            double currentCost = reversedSublist.get(k)
                    + dictionary.getOrDefault(s.substring(i - k - 1, i), 99999.9);

            if (currentCost < minCost) {
                minCost = currentCost;
                matchLength = k + 1;
            }
        }

        return new BestMatchResult(minCost, matchLength);
    }

    public synchronized String inferSpaces(String s) {
        if (s == null) {
            return null;
        }
        if (wordsDone.containsKey(s)) {
            return wordsDone.get(s);
        }
        ArrayList<Double> cost = new ArrayList<>();
        cost.add(0.0);

        for (int i = 1; i <= s.length(); i++) {
            BestMatchResult result = bestMatch(i, s, cost);
            cost.add(result.cost);
        }

        // Backtrack to recover the minimal-cost string
        List<String> out = new ArrayList<>();
        int i = s.length();
        while (i > 0) {
            BestMatchResult result = bestMatch(i, s, cost);
            // assert result.cost == cost.get(i);
            out.add(s.substring(i - result.length, i));
            i -= result.length;
        }

        Collections.reverse(out);
        String done = String.join(" ", out);
        wordsDone.put(s, done);
        return done;
    }
}
