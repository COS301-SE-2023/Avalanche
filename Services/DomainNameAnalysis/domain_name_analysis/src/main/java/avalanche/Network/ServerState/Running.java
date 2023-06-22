package avalanche.Network.ServerState;

import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Core.FrequencyCounter;
import avalanche.DataClasses.WordFrequency;

public class Running extends ServerState {

    public String getResponse(String body, long st) {
        // Enter here
        System.out.println("Working on request");

        // Start building response
        String resp = "{\"status\":\"success\",  \"data\":[";

        // Parse request to JSON
        JSONObject obj = null;
        try {

            obj = new JSONObject(body);
        } catch (JSONException jsonException) {
            return "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage().toString()
                    + "\"}";
        }

        // Validate request
        String validation = validateRequest(obj);
        if (!validation.equals("")) {
            return validation;
        }

        // Get details from request here
        JSONArray data = obj.getJSONArray("data");
        String[] strings = new String[data.length()];
        for (int i = 0; i < strings.length; i++) {
            strings[i] = data.getString(i);
        }

        // Do processing here
        FrequencyCounter frequencyCounter = new FrequencyCounter();
        WordFrequency[] allWordFrequencies = new WordFrequency[0];
        try {
            allWordFrequencies = frequencyCounter.getOrderedFrequency(strings);
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Build rest of response here
        if (allWordFrequencies.length == 0) {
            return "{\"status\":\"failure\",\"server-error\":\""
                    + "0 words were found after processing, this may be due to an error with the tokeniser" + "\"}";
        }
        for (int i = 0; i < allWordFrequencies.length; i++) {
            resp += "    " + allWordFrequencies[i].toJSON();
            if (i != allWordFrequencies.length - 1) {
                resp += ",";
            }
        }

        long ttlTime = System.currentTimeMillis() - st;
        resp += "  ],\"searchTime(ms)\":" + ttlTime + "}";

        System.out.println("Done");
        return resp;
    }

    /*
     * Request structure
     * 
     * {
     * data :
     * [Domain1, Domain2,...]
     * }
     * 
     * 
     * Response structure
     * 
     * { data:
     * [
     * {"Word":"popularWord","Occurences":40},
     * {"Word":"anotherWord","Occurences":30},
     * ...
     * ]
     * }
     */
}
