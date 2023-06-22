package avalanche.Core;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;

import avalanche.DataClasses.WordFrequency;
import avalanche.Utility.DomainTokeniser;

public class FrequencyCounter {

    public ArrayList<WordFrequency> getOrderedFrequency(String[] allStrings, int minimunAppearances)
            throws FileNotFoundException {
        HashSet<String> disallowedWords = new HashSet<>();
        disallowedWords.add("the");
        disallowedWords.add("and");
        disallowedWords.add("all");
        disallowedWords.add("are");
        disallowedWords.add("for");
        disallowedWords.add("pre");
        disallowedWords.add("cud");
        disallowedWords.add("gri");
        HashMap<String, Integer> wordFrequencies = new HashMap<>();
        DomainTokeniser.init();
        DomainTokeniser tokeniser = new DomainTokeniser();
        for (String string : allStrings) {
            String withSpaces = tokeniser.inferSpaces(string);
            String[] words = withSpaces.split(" ");
            for (String word : words) {
                if ((word.length() > 2 || word.equals("dr")) && !disallowedWords.contains(word)) {
                    int frequency = wordFrequencies.getOrDefault(word, 0);
                    frequency++;
                    wordFrequencies.put(word, frequency);
                }

            }
        }

        ArrayList<WordFrequency> allWordFrequencies = new ArrayList<>();
        for (String word : wordFrequencies.keySet()) {
            if (wordFrequencies.get(word) >= minimunAppearances) {
                allWordFrequencies.add(new WordFrequency(word, wordFrequencies.get(word)));
            }

        }
        allWordFrequencies.sort(Collections.reverseOrder());
        return allWordFrequencies;
    }
}
