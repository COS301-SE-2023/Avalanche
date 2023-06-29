package avalanche.Network.HandlerStartegy;

import avalanche.Network.ServerState.ServerState;

public class Closed extends HandlerStrategy {

    @Override
    public String getResponse(String body, long st) {
        return "{\"status\":\"failure\",\"server-error\":\"The server is closed\"}";
    }

}
