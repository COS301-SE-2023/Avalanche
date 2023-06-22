package avalanche.Network.ServerState;

import java.util.HashSet;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public abstract class ServerState {
    public abstract String getResponse(String body, long st);

    public static String validateRequest(JSONObject jsonObject) {
        String error = "";
        try {
            JSONArray data = jsonObject.getJSONArray("data");
            if (data.length() < 1) {
                error = "{\"status\":\"failure\",\"request-error\":\"" + "Please supply at least 1 string in 'data' "
                        + "\"}";
            }
            int minimunAppearances = jsonObject.getInt("minimumAppearances");
        } catch (JSONException jsonException) {
            error = "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }
        return error;

    }

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
