package avalanche.DataClasses;

import java.util.HashSet;

public class CountAndList {
    private int frequency;
    private HashSet<String> domains;

    public CountAndList() {
        this.frequency = 0;
        this.domains = new HashSet<>();
    }

    public void incrementCount() {
        frequency++;
    }

    public void addDomain(String domain) {
        domains.add(domain);
    }

    public int getFrequency() {
        return frequency;
    }

    public HashSet<String> getDomains() {
        return domains;
    }
}
