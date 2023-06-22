package avalanche.Core;

import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;

import avalanche.DataClasses.WordFrequency;
import avalanche.Utility.DomainTokeniser;

public class FrequencyCounter {

    public WordFrequency[] getOrderedFrequency(String[] allStrings) throws FileNotFoundException {
        HashSet<String> disallowedWords = new HashSet<>();
        disallowedWords.add("the");
        disallowedWords.add("an");
        disallowedWords.add("and");
        disallowedWords.add("in");
        disallowedWords.add("as");
        disallowedWords.add("cq");
        disallowedWords.add("ed");
        disallowedWords.add("to");
        disallowedWords.add("pre");
        disallowedWords.add("le");
        disallowedWords.add("qo");
        disallowedWords.add("at");
        disallowedWords.add("cud");
        disallowedWords.add("bc");
        disallowedWords.add("by");
        HashMap<String, Integer> wordFrequencies = new HashMap<>();
        DomainTokeniser.init();
        DomainTokeniser tokeniser = new DomainTokeniser();
        for (String string : allStrings) {
            String withSpaces = tokeniser.inferSpaces(string);
            String[] words = withSpaces.split(" ");
            for (String word : words) {
                if (word.length() > 1 && !disallowedWords.contains(word)) {
                    int frequency = wordFrequencies.getOrDefault(word, 0);
                    frequency++;
                    wordFrequencies.put(word, frequency);
                }

            }
        }

        WordFrequency[] allWordFrequencies = new WordFrequency[wordFrequencies.size()];
        int i = 0;
        for (String word : wordFrequencies.keySet()) {
            allWordFrequencies[i] = new WordFrequency(word, wordFrequencies.get(word));
            i++;
        }
        Arrays.sort(allWordFrequencies, Collections.reverseOrder());
        return allWordFrequencies;
    }
}
