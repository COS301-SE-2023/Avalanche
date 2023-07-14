package avalanche.Network.HandlerStrategy.RunningStrategies;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
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
        // Enter here
        System.out.println("Working on domain watch passive request");

        // Setup
        SimilarityChecker similarityChecker = new SimilarityChecker();
        String resp = "{\"status\":\"success\",\"data\":{";
        ConcurrentLinkedQueue<Domain> recentlyCreated = new ConcurrentLinkedQueue<>();
        HashMap<String, ConcurrentLinkedQueue<Domain>> notification = new HashMap();

        // Validate Request
        String validation = validateRequest(body);
        if (!validation.equals("")) {
            return validation;
        }
        JSONObject request = new JSONObject(body);

        // Process request
        JSONArray jsonRecentlyCreated = request.getJSONArray("recently-created");
        for (int i = 0; i < jsonRecentlyCreated.length(); i++) {
            recentlyCreated.add(new Domain(jsonRecentlyCreated.getString(i), ""));
        }

        JSONArray watched = request.getJSONArray("watched");

        for (int i = 0; i < watched.length(); i++) {
            String person = watched.getJSONObject(i).getString("person");
            JSONArray domains = watched.getJSONObject(i).getJSONArray("domains");
            ConcurrentLinkedQueue<Domain> toNotify = new ConcurrentLinkedQueue<>();
            for (int j = 0; j < domains.length(); j++) {
                ConcurrentLinkedQueue<Domain> found = doSearch(domains.getString(j),
                        watched.getJSONObject(i).getJSONArray("types"),
                        similarityChecker, recentlyCreated);
                int size = found.size();
                for (int k = 0; k < size; k++) {
                    toNotify.add(found.poll());
                }
            }
            notification.put(person, toNotify);
        }

        // Build rest of response
        resp += "\"alerts\":[";
        int numberOfAlerts = notification.size();
        int numberAdded = 0;
        for (String name : notification.keySet()) {
            resp += "{\"person\":\"" + name + "\",\"domains\":[";
            ConcurrentLinkedQueue<Domain> domainsToNotify = notification.get(name);
            int size = domainsToNotify.size();
            for (int i = 0; i < size; i++) {
                System.out.println();
                resp += "\"" + domainsToNotify.poll().getName() + "\"";
                if (i < size - 1) {
                    resp += ",";
                }
            }
            resp += "]}";
            numberAdded++;
            if (numberAdded < numberOfAlerts) {
                resp += ",";
            }
        }
        if (st == 0) {
            resp += "]}}";
        } else {
            resp += "]},\"searchTime(ms)\":" + (System.currentTimeMillis() - st) + "}";
        }
        return resp;
    }

    public static String validateRequest(String body) {
        String validation = validateJSON(body);
        if (!validation.equals("")) {
            return validation;
        }
        int errorIndex = -1;
        int innerErrorIndex = -1;
        String errorAttribute = "";
        Set<String> allowedMetrics = new HashSet<>();
        allowedMetrics.add("Levenshtein");
        allowedMetrics.add("Soundex");
        try {

            JSONObject jsonObject = new JSONObject(body);

            // Ensure that watched object is supplied
            JSONArray watched = new JSONArray(jsonObject.getJSONArray("watched"));
            if (watched.length() == 0) {
                return "{\"status\":\"failure\",\"request-error\":\"At least one 'watched' object must be provided. A 'watched' object consists of a person and a list of domains\"}";
            }

            // Validate all watched objects
            for (int i = 0; i < watched.length(); i++) {
                errorIndex = i;

                // Validate person in watched object
                errorAttribute = "";
                String person = watched.getJSONObject(i).getString("person");
                errorAttribute = " in person";
                if (person.equals("")) {
                    return "{\"status\":\"failure\",\"request-error\":\"Person in 'watched' object number " + (i + 1)
                            + " cannot be blank\"}";
                }

                // Validate types in watched object
                errorAttribute = "";
                JSONArray types = watched.getJSONObject(i).getJSONArray("types");
                errorAttribute = " in types";
                int numCalcs = (types.length());
                if (numCalcs < 1) {
                    return "{\"status\":\"failure\",\"request-error\":\"At least one distance metric must be listed\"}";
                }
                for (int j = 0; j < numCalcs; j++) {
                    innerErrorIndex = j;
                    String type = types.getJSONObject(j).getString("type");
                    if (!allowedMetrics.contains(type)) {
                        return "{\"status\":\"failure\",\"request-error\":\"Type:" + type + " is not a valid metric"
                                + "\"}";
                    }
                    double threshold = (types.getJSONObject(j).getDouble("threshold"));
                    if (type.equals("Levenshtein") && (threshold < 1)) {
                        return "{\"status\":\"failure\",\"request-error\":\"The threshold for Levenshtein distance must be greater than 0\"}";
                    }
                    if (type.equals("Soundex") && (threshold > 4 || threshold < 1)) {
                        return "{\"status\":\"failure\",\"request-error\":\"The threshold for Soundex distance must be in the range [1,4]\"}";
                    }
                }

                // Validate domains in watched object
                errorAttribute = "";
                JSONArray domains = watched.getJSONObject(i).getJSONArray("domains");
                errorAttribute = " in domains";
                if (domains.length() == 0) {
                    return "{\"status\":\"failure\",\"request-error\":\"Domain list in 'watched' object number "
                            + (i + 1) + " cannot be empty\"}";
                }
                for (int j = 0; j < domains.length(); j++) {
                    String domain = domains.getString(j);
                    if (domain.equals("")) {
                        return "{\"status\":\"failure\",\"request-error\":\"Domain number " + (j + 1)
                                + " in 'watched' object number " + (i + 1) + " cannot be blank\"}";

                    }
                }
            }
            errorIndex = -1;

            // Ensure that recently-created is supplied
            JSONArray recentlyCreated = jsonObject.getJSONArray("recently-created");
            if (recentlyCreated.length() == 0) {
                return "{\"status\":\"failure\",\"request-error\":\"List of recently added domains cannot be empty\"}";
            }

            // No errors found
            return "";
        } catch (JSONException jsonException) {
            // JSON error found
            if (errorIndex != -1) {
                return "{\"status\":\"failure\",\"request-error\":\""
                        + jsonException.getMessage().substring(0, jsonException.getMessage().length() - 1)
                        + "" + errorAttribute + " in 'watched' object number " + (errorIndex + 1) + "\"}";
            }
            return "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }

    }

    public ConcurrentLinkedQueue<Domain> doSearch(String domain, JSONArray types, SimilarityChecker similarityChecker,
            ConcurrentLinkedQueue<Domain> searchSpace) {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        int numCalcs = (types.length());
        for (int j = 0; j < numCalcs; j++) {
            String type = types.getJSONObject(j).getString("type");
            double threshold = (types.getJSONObject(j).getDouble("threshold"));
            switch (type) {
                case "Levenshtein":
                    if (j == 0) {
                        hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                                threshold, searchSpace);
                    } else {
                        hits = similarityChecker.findAllWithinSimliarityThreshold(domain,
                                threshold, hits);
                    }
                    break;
                case "Soundex":
                    if (j == 0) {
                        hits = similarityChecker.findAllSoundsAboveSimliarityThreshold(domain,
                                threshold, searchSpace);
                    } else {
                        hits = similarityChecker.findAllSoundsAboveSimliarityThreshold(domain,
                                threshold, searchSpace);
                    }
                    break;
            }
        }
        return hits;
    }

}
