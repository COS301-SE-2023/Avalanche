package avalanche.Network.HandlerStartegy.RunningStrategies;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Classification.Classifier;
import avalanche.Core.FrequencyCounter;
import avalanche.DataClasses.WordFrequency;
import avalanche.Network.HandlerStartegy.Running;

public class HandleClassify extends Running {
    public String getResponse(String body, long st) {
        // Enter here
        System.out.println("Working on request");

        // Start building response
        String resp = "{\"status\":\"success\",  \"data\":";

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
        double minimumConfidence = obj.getDouble("minimumConfidence");
        String[] labels = new String[0];
        try {
            JSONArray jsonLabels = obj.getJSONArray("labels");
            labels = new String[jsonLabels.length()];
            for (int i = 0; i < strings.length; i++) {
                labels[i] = jsonLabels.getString(i);
            }
        } catch (JSONException jsonException) {

        }
        String classified = "";
        // Do processing here
        Classifier classifier = new Classifier();
        System.out.println("min c " + minimumConfidence);
        try {
            classified = classifier.classify(strings, labels, minimumConfidence);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Build rest of response here
        if (classified.equals("")) {
            return "{\"status\":\"failure\",\"server-error\":\""
                    + "No response received from the classifier. There may be an issue with the I/O"
                    + "\"}";
        }
        resp += classified;

        long ttlTime = System.currentTimeMillis() - st;
        resp += ",\"searchTime(ms)\":" + ttlTime + "}";
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
            int minimumConfidence = jsonObject.getInt("minimumConfidence");
        } catch (JSONException jsonException) {
            error = "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }
        return error;

    }

}
