package avalanche.Network;

import avalanche.Network.HandlerStrategy.Closed;
import avalanche.Network.HandlerStrategy.HandlerStrategy;
import avalanche.Network.HandlerStrategy.RunningStrategies.HandleActive;
import avalanche.Network.HandlerStrategy.RunningStrategies.HandlePassive;

public enum HandlerStrategyClassEnum {
    COUNT("active", new HandleActive()),
    CLASSIFY("passive", new HandlePassive());

    private final HandlerStrategy handlerClass;
    private final String endPoint;

    HandlerStrategyClassEnum(String endPoint, HandlerStrategy handlerClass) {
        this.handlerClass = handlerClass;
        this.endPoint = endPoint;
    }

    public static HandlerStrategy get(String endPoint) {
        for (HandlerStrategyClassEnum mapping : values())
            if (mapping.getEndPointName().equals(endPoint))
                return mapping.handlerClass;
        return new Closed();
    }

    public HandlerStrategy getHandlerClass() {
        return handlerClass;
    }

    public String getEndPointName() {
        return endPoint;
    }
}
