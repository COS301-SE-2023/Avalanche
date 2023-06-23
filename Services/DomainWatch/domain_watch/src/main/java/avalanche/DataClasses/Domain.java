package avalanche.DataClasses;

public class Domain implements Comparable {
    /**
     * The name of the domain.
     */
    private String name;

    /**
     * The zone the domain is in.
     */
    private String zone;

    /**
     * The total distance from the search string across all metrics.
     */
    private double distance;

    /**
     * The total number of metrics applied.
     */
    private int metrics;

    /**
     * Partially parameterised constructor.
     * <br/>
     * Sets name and zone to parameters.<br/>
     * Sets distance and metrics to 0.<br/>
     * 
     * @param name The name of the domain
     * @param zone The zone the domain is in
     * 
     */
    public Domain(String name, String zone) {
        this.name = name;// .substring(0, name.length() - zone.length() - 1);
        this.zone = zone;
        this.metrics = 0;
        this.distance = 0;
    }

    /**
     * Standard copy constructor.
     * <br/>
     * Replicates all member variables but linked to new memory
     * 
     * 
     * @param domain the domain to be copied
     */
    public Domain(Domain domain) {
        this.name = domain.name;
        this.zone = domain.zone;
        this.metrics = domain.metrics;
        this.distance = domain.distance;
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
     * <br/>
     * this.distance holds the total distance accross all metrics.<br/>
     * <br/>
     * Different metrics add to the total distance in different ways.<br/>
     * <br/>
     * Levenshtein: this metric adds to the distance as follows<br/>
     * 1. if the length of this.name is greater than the distance then the total
     * distance is increased by (length-distance)/length<br/>
     * 2. if the length of this.name is less than or equal to the distance then the
     * total distance is increased by (distance-length)/distance<br/>
     * <br/>
     * Soundex: This metric adds to the distance as follows<br/>
     * add 0.25 * distance to the total distance<br/>
     * <br/>
     * We then add 1 to the number of metrics so that we can take an average
     * later<br/>
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
     * @return double: the average distance of this.name from a certain string.<br/>
     *         Returns -1 if setDistance() was never called using any metrics
     */
    public double getDistance() {
        if (metrics == 0) {
            return -1;
        }
        return distance / metrics;
    }

    /**
     * Sets the distance and metric variables to 0.
     */
    public void resetDistance() {
        this.distance = 0;
        this.metrics = 0;
    }

    /**
     * Compares domains based on their distances from a certain string.
     * 
     * @param o (should be a domain): the domain to be compared against
     * @return int: -1 if the input has a bigger distance than this
     *         1 if the input has a smaller distance than this
     *         0 if both have the same distance
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

    /**
     * Checks if two domains are equal.
     * <br/>
     * Two domains are equal if they have the same name and the same zone
     * 
     * @param d The domain to check equality against
     * @return true if the domains are equal
     *         false if the domains are not equal
     */
    public boolean equals(Domain d) {
        return d.name.equals(this.name) && d.zone.equals(this.zone);
    }

    /**
     * ToString() for domain objects.
     * <br/>
     * Does not print the similarity
     * 
     * @return String: A string representation of the domain in the format
     *         &lt;name&gt;.&lt;zone&gt;
     *         &lt;name&gt; and &lt;zone&gt; should both be lowercase
     */
    @Override
    public String toString() {
        return name + "." + zone.toLowerCase();
    }

    /**
     * ToJSON() for domain objects, includes the similarity.
     * 
     * @return String: A JSON version of all the data in this object in the format
     *         {"domainName":"&lt;name&gt;","zone":"&lt;zone&gt;","similarity":(&lt;floor(distance/metrics)*100)&gt;}
     */
    public String toJSON() {
        return "{\"domainName\":\"" + name + "\",\"zone\":\"" + zone + "\",\"similarity\":"
                + Math.round(getDistance() * 100.0) + "}";
    }

}
