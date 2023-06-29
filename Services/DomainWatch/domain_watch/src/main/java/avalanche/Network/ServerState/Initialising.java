package avalanche.Network.ServerState;

public class Initialising extends ServerState {

    /**
     * Gets a response from the server in the initialising state.
     * <br/>
     * Servers in the <i>initialising</i> state should return a "status":"failure"
     * and a "server-error":"The server is initialising. Please wait a while"
     * 
     * @param body      The body of the request that has been sent to the server
     * @param startTime The millisecond at which the request started being processed
     * @return String:
     *         Servers in the <i>initialising</i> state should return a
     *         "status":"failure"
     *         and a "server-error":"The server is initialising. Please wait a
     *         while"
     */
    @Override
    public String getResponse(String body, long startTime) {
        System.out.println("Request recived during initialisation");
        return "{\"status\":\"failure\",\"server-error\":\"The server is initialising. Please wait a while\"}";
    }

}
