package avalanche.DataClasses;

public class Domain implements Comparable {
    private String name;
    private String zone;
    private double distance;
    private double similarity;
    private int metrics;

    public Domain(String name, String zone) {
        this.name = name;// .substring(0, name.length() - zone.length() - 1);
        this.zone = zone;
        this.metrics = 0;
        this.distance = 0;
        this.similarity = 0;
    }

    public Domain(Domain domain) {
        this.name = domain.name;
        this.zone = domain.zone;
        this.metrics = domain.metrics;
        this.distance = domain.distance;
        this.similarity = domain.similarity;
    }

    public String getName() {
        return name;
    }

    public String getZone() {
        return zone;
    }

    public void setDistance(double distance, String metric) {
        if (metric.equals("Levenshtein")) {
            if (this.name.length() > distance) {
                this.distance += (this.name.length() - distance) / this.name.length();
            } else {
                this.distance += (distance - this.name.length()) / distance;
            }

        } else if (metric.equals("Soundex")) {
            this.distance += distance * 0.25;
        }
        metrics++;
    }

    public double getDistance() {
        return distance / metrics;
    }

    public void resetDistance() {
        this.distance = 0;
        this.metrics = 0;
    }

    /**
     * This function is used to compare domains based on their distance values
     *
     * @param Object o: This receives another object of type domain to be compared
     *               against the current one
     * @return -1 if the distance of the one parsed in is greater than the current
     *         one
     *         0 if the distaces are equal
     *         1 if the distance of the one parsed in is less than the current one
     *         as an integer
     */
    @Override
    public int compareTo(Object o) {
        Domain d = (Domain) o;
        if (d.getDistance() > this.getDistance()) {
            return -1;
        }
        if (d.getDistance() < this.getDistance()) {
            return 1;
        }
        return 0;
    }

    public boolean equals(Domain d) {
        return d.name.equals(this.name) && d.zone.equals(this.zone);
    }

    @Override
    public String toString() {
        return name + "." + zone.toLowerCase();
    }

    public String toJSON() {
        return "{\"domainName\":\"" + name + "\",\"zone\":\"" + zone + "\",\"similarity\":"
                + Math.round(getDistance() * 100.0) + "}";
    }

}
