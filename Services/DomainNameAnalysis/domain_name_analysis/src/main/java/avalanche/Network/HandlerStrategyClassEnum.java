package avalanche.Network;

import avalanche.Network.HandlerStartegy.RunningStrategies.HandleClassify;
import avalanche.Network.HandlerStartegy.RunningStrategies.HandleFrequencyCount;
import avalanche.Network.HandlerStartegy.Closed;
import avalanche.Network.HandlerStartegy.HandlerStrategy;

public enum HandlerStrategyClassEnum {
    COUNT("count", new HandleFrequencyCount()),
    CLASSIFY("classify", new HandleClassify());

    private final HandlerStrategy handlerClass;
    private final String endPoint;

    HandlerStrategyClassEnum(String endPoint, HandlerStrategy handlerClass) {
        this.handlerClass = handlerClass;
        this.endPoint = endPoint;
    }

    public static HandlerStrategy get(String jsonType) {
        for (HandlerStrategyClassEnum mapping : values())
            if (mapping.getEndPointName().equals(jsonType))
                return mapping.handlerClass;
        return new Closed();
    }

    public HandlerStrategy getFooClass() {
        return handlerClass;
    }

    public String getEndPointName() {
        return endPoint;
    }
}
