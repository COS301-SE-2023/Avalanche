package avalanche.Network.HandlerStrategy;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public abstract class Running extends HandlerStrategy {

    public static String validateJSON(String body) {
        String error = "";
        try {
            JSONObject tryCreate = new JSONObject(body);
        } catch (JSONException jsonException) {
            error = "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }
        return error;

    }

}
