package avalanche.Network.HandlerStartegy.RunningStrategies;

import java.io.FileNotFoundException;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Core.FrequencyCounter;
import avalanche.DataClasses.WordFrequency;
import avalanche.Network.HandlerStartegy.Running;

public class HandleFrequencyCount extends Running {
    public String getResponse(String body, long st) {
        // Enter here
        System.out.println("Working on request");

        // Start building response
        String resp = "{\"status\":\"success\",  \"data\":[";

        // Validate request
        String validation = validateRequest(body);
        if (!validation.equals("")) {
            return validation;
        }
        JSONObject obj = new JSONObject(body);

        // Get details from request here
        JSONArray data = obj.getJSONArray("data");
        String[] strings = new String[data.length()];
        for (int i = 0; i < strings.length; i++) {
            strings[i] = data.getString(i);
        }
        int minimunAppearances = obj.getInt("minimumAppearances");

        // Do processing here
        FrequencyCounter frequencyCounter = new FrequencyCounter();
        ArrayList<WordFrequency> allWordFrequencies = new ArrayList<>();
        try {
            allWordFrequencies = frequencyCounter.getOrderedFrequency(strings, minimunAppearances);
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Build rest of response here
        if (allWordFrequencies.size() == 0) {
            return "{\"status\":\"failure\",\"server-error\":\""
                    + "0 words were found after processing. You may have set minimumAppearances too low. Otherwise this may be due to an error with the tokeniser"
                    + "\"}";
        }
        for (int i = 0; i < allWordFrequencies.size(); i++) {
            resp += "    " + allWordFrequencies.get(i).toJSON();
            if (i != allWordFrequencies.size() - 1) {
                resp += ",";
            }
        }

        long ttlTime = System.currentTimeMillis() - st;
        resp += "  ],\"searchTime(ms)\":" + ttlTime + "}";
        System.out.println("\n\n==================== RESPONSE ====================\n");
        System.out.println(resp);
        System.out.println("Done");
        return resp;
    }

    public static String validateRequest(String body) {
        String error = validateJSON(body);
        if (!error.equals("")) {
            return error;
        }
        JSONObject jsonObject = new JSONObject(body);
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

}
