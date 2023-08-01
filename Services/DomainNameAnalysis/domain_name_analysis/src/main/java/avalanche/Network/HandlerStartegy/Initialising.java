package avalanche.Network.HandlerStartegy;

import avalanche.Network.ServerState.ServerState;

public class Initialising extends HandlerStrategy {

    @Override
    public String getResponse(String body, long st) {
        System.out.println("Request recived during initialisation");
        return "{\"status\":\"failure\",\"server-error\":\"The server is initialising. Please wait a while\"}";
    }

}
