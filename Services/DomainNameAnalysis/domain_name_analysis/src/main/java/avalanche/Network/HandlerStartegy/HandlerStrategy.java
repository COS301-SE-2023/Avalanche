package avalanche.Network.HandlerStartegy;

public abstract class HandlerStrategy {
    public abstract String getResponse(String body, long startTime);

}