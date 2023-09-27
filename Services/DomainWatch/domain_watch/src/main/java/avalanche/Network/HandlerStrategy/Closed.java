package avalanche.Network.HandlerStrategy;

public class Closed extends HandlerStrategy {

    @Override
    public String getResponse(String body, long st) {
        return "{\"status\":\"failure\",\"server-error\":\"The server is closed\"}";
    }

}
