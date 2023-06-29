package avalanche.Network.ServerState;

public class Closed extends ServerState {

    /**
     * Gets a response from the server in the closed state.
     * <br/>
     * Servers in the <i>closed</i> state should return a "status":"failure" and a
     * "server-error":"The server is closed"
     * 
     * @param body      The body of the request that has been sent to the server
     * @param startTime The millisecond at which the request started being processed
     * @return String:
     *         Servers in the <i>closed</i> state should return a "status":"failure"
     *         and a "server-error":"The server is closed"
     */
    @Override
    public String getResponse(String body, long startTime) {
        return "{\"status\":\"failure\",\"server-error\":\"The server is closed\"}";
    }

}
