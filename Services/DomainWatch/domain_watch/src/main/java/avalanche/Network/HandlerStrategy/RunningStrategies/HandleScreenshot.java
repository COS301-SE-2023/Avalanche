package avalanche.Network.HandlerStrategy.RunningStrategies;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Core.ScreenshotTaker;
import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Network.HandlerStrategy.Running;

public class HandleScreenshot extends Running {
    public String getResponse(String body, long st) {
        // Enter here
        System.out.println("Working on domain watch screenshot request");

        // Setup
        SimilarityChecker similarityChecker = new SimilarityChecker();
        String resp = "{\"status\":\"success\",\"data\":{";
        ConcurrentLinkedQueue<Domain> recentlyCreated = new ConcurrentLinkedQueue<>();
        HashMap<String, ConcurrentLinkedQueue<Domain>> notification = new HashMap<>();

        // Validate Request
        String validation = validateRequest(body);
        if (!validation.equals("")) {
            return validation;
        }
        JSONObject request = new JSONObject(body);

        // Process request
        String domainName = request.getString("domainName");

        resp += "\"pickee\":\"" + ScreenshotTaker.takeScreenshot(domainName) + "\"";

        if (st == 0) {
            resp += "}}";
        } else {
            resp += "},\"searchTime(ms)\":" + (System.currentTimeMillis() - st) + "}";
        }
        return resp;
    }

    public static String validateRequest(String body) {
        String validation = validateJSON(body);
        if (!validation.equals("")) {
            return validation;
        }
        try {

            JSONObject jsonObject = new JSONObject(body);

            // Ensure that domainName is supplied
            String domainName = jsonObject.getString("domainName");

            // No errors found
            return "";
        } catch (JSONException jsonException) {

            return "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }

    }

}
