package avalanche.DataClasses;

public class Domain implements Comparable {
    private String name;
    private String zone;
    private double distance;
    private double similarity;
    private int metrics;

    /**
     * 
     * @param name
     * @param zone
     * 
     */
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

    /**
     * @return String: returns the name of the domain
     */
    public String getName() {
        return name;
    }

    /**
     * @return String: returns the zone of the domain
     */
    public String getZone() {
        return zone;
    }

    /**
     * This method is used to update the total distance of this domain from some
     * search string.
     * 
     * this.distance holds the total distance accross all metrics.
     * 
     * Different metrics add to the total distance in different ways.
     * 
     * Levenshtein: this metric adds to the distance as follows
     * 1. if the length of this.name is greater than the distance then the total
     * distance is increased by (length-distance)/length
     * 2. if the length of this.name is less than or equal to the distance then the
     * total distance is increased by (distance-length)/distance
     * 
     * Soundex: This metric adds to the distance as follows
     * add 0.25 * distance to the total distance
     * 
     * We then add 1 to the number of metrics so that we can take an average later
     * 
     * @param distance the distance of this.name from a certain string
     * @param metric   the metric that was used to calculate the above distance
     */
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

    /**
     * @return double: the average distance of this.name from a certain string
     *         returns -1 if setDistance() was never called using any metrics
     */
    public double getDistance() {
        if (metrics == 0) {
            return -1;
        }
        return distance / metrics;
    }

    public void resetDistance() {
        this.distance = 0;
        this.metrics = 0;
    }

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

    /**
     * @return String
     */
    @Override
    public String toString() {
        return name + "." + zone.toLowerCase();
    }

    public String toJSON() {
        return "{\"domainName\":\"" + name + "\",\"zone\":\"" + zone + "\",\"similarity\":"
                + Math.round(getDistance() * 100.0) + "}";
    }

}
