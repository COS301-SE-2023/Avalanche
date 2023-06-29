package avalanche.Network.ServerState;

import java.util.HashSet;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;

public abstract class ServerState {
    public abstract String getResponse(String body, long st);

    public static String validateRequest(String body) {
        int errorIndex = -1;
        Set<String> allowedMetrics = new HashSet<>();
        allowedMetrics.add("Levenshtein");
        allowedMetrics.add("Soundex");
        try {
            JSONObject jsonObject = new JSONObject(body);
            String domain = (jsonObject.getString("domain"));
            if (domain.length() < 1) {
                return "{\"status\":\"failure\",\"request-error\":\"The domain name must be longer than 0 characters\"}";
            }
            int numCalcs = (jsonObject.getJSONArray("types").length());
            if (numCalcs < 1) {
                return "{\"status\":\"failure\",\"request-error\":\"At least one distance metric must be listed\"}";
            }
            for (int i = 0; i < numCalcs; i++) {
                errorIndex = i;
                String type = jsonObject.getJSONArray("types").getJSONObject(i).getString("type");
                if (!allowedMetrics.contains(type)) {
                    return "{\"status\":\"failure\",\"request-error\":\"Type:" + type + " is not a valid metric"
                            + "\"}";
                }
                double threshold = (jsonObject.getJSONArray("types").getJSONObject(i).getDouble("threshold"));
                if (type.equals("Levenshtein") && (threshold > domain.length() - 1 || threshold < 1)) {
                    return "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0 and less than the length of the search domain\"}";
                }
                if (type.equals("Soundex") && (threshold > 4 || threshold < 1)) {
                    return "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}";
                }
            }
            return "";
        } catch (JSONException jsonException) {
            if (errorIndex != -1) {
                return "{\"status\":\"failure\",\"request-error\":\""
                        + jsonException.getMessage().substring(0, jsonException.getMessage().length() - 1)
                        + " in metric number "
                        + (errorIndex + 1) + "\"}";
            }
            return "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }

    }
}
