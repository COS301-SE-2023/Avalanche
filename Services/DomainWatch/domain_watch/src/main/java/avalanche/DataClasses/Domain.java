package avalanche.DataClasses;

public class Domain implements Comparable {
    private String name;
    private String zone;
    private double distance;
    private int metrics;

    public Domain(String name, String zone) {
        this.name = name;// .substring(0, name.length() - zone.length() - 1);
        this.zone = zone;
        this.metrics = 0;
        this.distance = 0;
    }

    public String getName() {
        return name;
    }

    public String getZone() {
        return zone;
    }

    public void setDistance(double distance, String metric) {
        if (metric.equals("Levenshtein")) {
            this.distance += (this.name.length() - distance) / this.name.length();
        } else if (metric.equals("Soundex")) {
            this.distance += distance * 0.25;
        }
        metrics++;
    }

    public double getDistance() {
        // System.out.println(this.distance);
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

    @Override
    public String toString() {
        return name + "." + zone.toLowerCase();
    }

    public String toJSON() {
        return "{\"domainName\":\"" + name + "\",\"zone\":\"" + zone + "\",\"similarity\":"
                + Math.round(getDistance() * 100.0) + "}";
    }

}
