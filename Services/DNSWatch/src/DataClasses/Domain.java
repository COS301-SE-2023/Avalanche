package DataClasses;

public class Domain {
    private String name;
    private String zone;
    private double distance;

    public Domain(String name, String zone) {
        this.name = name;// .substring(0, name.length() - zone.length() - 1);
        this.zone = zone;
    }

    public String getName() {
        return name;
    }

    public String getZone() {
        return zone;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getDistance() {
        return distance;
    }

}
