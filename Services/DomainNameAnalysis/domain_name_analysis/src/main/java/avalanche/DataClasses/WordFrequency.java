package avalanche.DataClasses;

public class WordFrequency implements Comparable {
    private String word;
    private int frequency;

    public WordFrequency(String word, int frequency) {
        this.word = word;
        this.frequency = frequency;
    }

    public String getWord() {
        return word;
    }

    public int getFrequency() {
        return frequency;
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
        return "{\"word\":\"" + word + "\"," + "\"frequency\":" + frequency + "}";
    }
}
