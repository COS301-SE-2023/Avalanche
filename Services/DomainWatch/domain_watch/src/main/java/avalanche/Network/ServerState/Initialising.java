package avalanche.Network.ServerState;

public class Initialising extends ServerState {

    @Override
    public String getResponse(String body, long st) {
        System.out.println("Request recived during initialisation");
        return "{\"status\":\"failure\",\"server-error\":\"The server is initialising. Please wait a while\"}";
    }

}
