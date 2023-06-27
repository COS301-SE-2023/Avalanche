package avalanche.Network.ServerState;

import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONObject;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;

public class Running extends ServerState {

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
}
