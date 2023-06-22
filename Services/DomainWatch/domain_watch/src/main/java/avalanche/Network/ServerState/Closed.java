package avalanche.Network.ServerState;

public class Closed extends ServerState {

    @Override
    public String getResponse(String body, long st) {
        return "{\"status\":\"failure\",\"server-error\":\"The server is closed\"}";
    }

}
