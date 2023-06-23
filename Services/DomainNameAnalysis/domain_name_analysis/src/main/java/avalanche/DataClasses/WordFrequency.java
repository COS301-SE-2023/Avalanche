package avalanche.DataClasses;

import java.util.HashSet;

public class WordFrequency implements Comparable {
    private String word;
    private int frequency;
    private HashSet<String> domains;

    public WordFrequency(String word, int frequency, HashSet<String> domains) {
        this.word = word;
        this.frequency = frequency;
        this.domains = domains;
    }

    public WordFrequency(String word, CountAndList countAndList) {
        this.word = word;
        this.frequency = countAndList.getFrequency();
        this.domains = countAndList.getDomains();
    }

    public String getWord() {
        return word;
    }

    public int getFrequency() {
        return frequency;
    }

    public HashSet<String> getDomains() {
        return domains;
    }

    @Override
    public int compareTo(Object o) {
        WordFrequency d = (WordFrequency) o;
        if (d.frequency > this.frequency) {
            return -1;
        }
        if (d.frequency < this.frequency) {
            return 1;
        }
        return 0;
    }

    public String toJSON() {
        String out = "{\"word\":\"" + word + "\"," + "\"frequency\":" + frequency + ",\"domains\":[";
        int i = 0;
        for (String string : domains) {
            i++;
            out += "\"" + string + "\"";
            if (i != domains.size()) {
                out += ",";
            }
        }
        out += "]}";
        return out;
    }
}
