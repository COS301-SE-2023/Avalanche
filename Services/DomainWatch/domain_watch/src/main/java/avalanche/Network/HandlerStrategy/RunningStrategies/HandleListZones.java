package avalanche.Network.HandlerStrategy.RunningStrategies;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Core.SimilarityChecker;
import avalanche.DataClasses.Domain;
import avalanche.Network.HandlerStrategy.Running;
import avalanche.Settings.DomainWatchSettings;

public class HandleListZones extends Running {

    @Override
    public String getResponse(String body, long startTime) {
        // Enter
        System.out.println("Working on domain watch list zones");
        String resp = "{  \"status\":\"success\",  \"data\":[";

        // Validate

        // Process
        Set<String> registires = DomainWatchSettings.getInstace().domainFiles.keySet();

        // Build data
        int size = registires.size();
        int i = 0;
        for (String registry : registires) {
            resp += "\"" + registry + "\"";
            if (i < size - 1) {
                resp += ",";
            }
        }

        // Finish Response
        if (startTime == 0) {
            resp += "]}";
        } else {
            resp += "],\"searchTime(ms)\":" + (System.currentTimeMillis() - startTime) + "}";
        }

        // System.out.println(resp);
        System.out.println("Done");
        System.gc();
        return resp;
    }

    public static String validateRequest(String body) {
        return "";
    }

    /*
     * {
     * registryDomains: [
     * { registryName: 'AFRICA_Domains', domains:
     * "Domain,Zone\nmycooldomain,AFRICA"},
     * { registryName: 'ZACR_Domains', domains: "Domain,Zone\nmycooldomain,CO.ZA" },
     * { registryName: 'RYCE_Domains', domains: "Domain,Zone\nmycooldomain,WIEN" },
     * ],
     * }
     */

}
