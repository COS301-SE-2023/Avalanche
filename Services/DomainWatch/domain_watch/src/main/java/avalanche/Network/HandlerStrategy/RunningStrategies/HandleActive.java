package avalanche.Network.HandlerStrategy.RunningStrategies;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Core.ResolutionChecker;
import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Network.HandlerStrategy.Running;

public class HandleActive extends Running {
    public String getResponse(String body, long st) {
        System.out.println("Working on domain watch active request");
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
        Set<String> zones = new HashSet<>();
        try {
            JSONArray registries = obj.getJSONArray("registries");
            for (int i = 0; i < registries.length(); i++) {
                zones.add(registries.getString(i));
            }
        } catch (JSONException jsonException) {

        }

        for (int j = 0; j < numCalcs; j++) {
            String type = obj.getJSONArray("types").getJSONObject(j).getString("type");
            double threshold = (obj.getJSONArray("types").getJSONObject(j).getDouble("threshold"));
            switch (type) {
                case "Levenshtein":
                    if (j == 0) {
                        hits = similarityChecker.threadedFindAllWithinSimliarityThreshold(domain,
                                threshold, zones);
                    } else {
                        hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                                threshold, hits);
                    }
                    break;
                case "Soundex":
                    if (j == 0) {
                        hits = similarityChecker.threadedfindAllSoundsAboveSimliarityThreshold(domain,
                                threshold, zones);
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
        // Check for resolution only if

        int initSize = hits.size();
        int totalTodo = Math.min(initSize, 200);
        try {
            String resolve = obj.getString("resolve");
            if (resolve.equalsIgnoreCase("true")) {
                ResolutionChecker.checkResolution(hitsArr, totalTodo);
            }
        } catch (JSONException jsonException) {
            System.out.println("do not have to resolve");
        }
        System.out.println("\nFound " + initSize + " matches\nBuilding response\n");
        for (int k = 0; k < totalTodo; k++) {
            resp += "    " + hitsArr[k].toJSON();
            if (k != totalTodo - 1) {
                resp += ",";
            }

        }
        if (st == 0) {
            resp += "]}";
        } else {
            resp += "],\"searchTime(ms)\":" + (System.currentTimeMillis() - st) + "}";
        }

        // System.out.println(resp);
        System.out.println("Done");
        System.gc();
        return resp;
    }

    public static String validateRequest(String body) {
        String validation = validateJSON(body);
        if (!validation.equals("")) {
            return validation;
        }
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
