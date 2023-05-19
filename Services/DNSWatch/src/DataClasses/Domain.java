package DataClasses;

public class Domain {
    private String name;
    private String zone;

    public Domain(String name, String zone) {
        this.name = name.substring(0, name.length() - zone.length() - 1);
        this.zone = zone;
    }

    public String getName() {
        return name;
    }

    public String getZone() {
        return zone;
    }

}
