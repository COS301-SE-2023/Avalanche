package avalanche.Network.ServerState;

import java.util.HashSet;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public abstract class ServerState {
    public abstract String getResponse(String body, long st);

    /*
     * Request structure
     * 
     * {
     * data :
     * [Domain1, Domain2,...]
     * }
     * 
     */
}
