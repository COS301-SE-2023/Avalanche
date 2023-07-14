package avalanche.Network.HandlerStrategy.RunningStrategies;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Network.HandlerStrategy.Running;

public class HandlePassive extends Running {
    public String getResponse(String body, long st) {
        System.out.println("Working on request");
        SimilarityChecker similarityChecker = new SimilarityChecker();
        String resp = "{  \"status\":\"success\",  \"data\":[";
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        String validation = validateRequest(body);
        if (!validation.equals("")) {
            return validation;
        }
        JSONObject obj = new JSONObject(body);
        String domain = (obj.getString("domain"));

        int numCalcs = (obj.getJSONArray("types").length());

        for (int j = 0; j < numCalcs; j++) {
            String type = obj.getJSONArray("types").getJSONObject(j).getString("type");
            double threshold = (obj.getJSONArray("types").getJSONObject(j).getDouble("threshold"));
            switch (type) {
                case "Levenshtein":
                    if (j == 0) {
                        hits = similarityChecker.threadedFindAllWithinSimliarityThreshold(domain,
                                threshold);
                    } else {
                        hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                                threshold, hits);
                    }
                    break;
                case "Soundex":
                    if (j == 0) {
                        hits = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(domain,
                                threshold);
                    } else {
                        hits = similarityChecker.findAllSoundsAboveSimliarityThreshold(domain,
                                threshold, hits);
                    }
                    break;
            }
        }
        Domain[] hitsArr = new Domain[hits.size()];
        hits.toArray(hitsArr);
        Arrays.sort(hitsArr, Collections.reverseOrder());
        int initSize = hits.size();
        int totalTodo = Math.min(initSize, 500);
        System.out.println("\nFound " + initSize + " matches\nBuilding response\n");
        for (int k = 0; k < totalTodo; k++) {
            resp += "    " + hitsArr[k].toJSON();
            if (k != totalTodo - 1) {
                resp += ",";
            }

        }
        long ttlTime = System.currentTimeMillis() - st;
        resp += "  ],\"searchTime(ms)\":" + ttlTime + "}";

        // System.out.println(resp);
        System.out.println("Done");
        System.gc();
        return resp;
    }

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
