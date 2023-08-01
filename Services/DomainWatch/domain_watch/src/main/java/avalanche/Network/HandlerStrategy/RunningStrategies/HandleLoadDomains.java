package avalanche.Network.HandlerStrategy.RunningStrategies;

import java.io.FileWriter;
import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import avalanche.Network.HandlerStrategy.Running;
import avalanche.Settings.DomainWatchSettings;

public class HandleLoadDomains extends Running {

    @Override
    public String getResponse(String body, long startTime) {
        // Enter
        System.out.println("Working on domain watch load domains");
        String resp = "{  \"status\":\"success\",  \"data\":[";

        // Validate
        String validation = validateRequest(body);
        if (!validation.equals("")) {
            return validation;
        }

        // Process
        JSONObject obj = new JSONObject(body);
        JSONArray registryDomains = obj.getJSONArray("registryDomains");
        for (int i = 0; i < registryDomains.length(); i++) {
            String registryName = registryDomains.getJSONObject(i).getString("registryName");
            String domains = registryDomains.getJSONObject(i).getString("domains");
            try {
                String path = "data/" + registryName + "_mock.csv";
                FileWriter writer = new FileWriter(path, false);
                DomainWatchSettings settings = DomainWatchSettings.getInstace();
                settings.addDomainFile(registryName, path);
                writer.write(domains);
                writer.close();
            } catch (IOException e) {
                e.printStackTrace();
                return "{\"status\":\"failure\",\"request-error\":\"" + e.getMessage() + "\"}";

            }
        }
        DomainWatchSettings.getInstace().saveSettings();
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
        String validation = validateJSON(body);
        if (!validation.equals("")) {
            return validation;
        }
        int errorIndex = -1;
        String errorAttribute = "";
        try {
            JSONObject jsonObject = new JSONObject(body);
            JSONArray registryDomains = jsonObject.getJSONArray("registryDomains");
            if (registryDomains.length() == 0) {
                return "{\"status\":\"failure\",\"request-error\":\"Registry domains list should not be empty. What must I do with this?\"}";
            }
            for (int i = 0; i < registryDomains.length(); i++) {
                errorIndex = i + 1;
                errorAttribute = "registryName";
                String registryName = registryDomains.getJSONObject(i).getString("registryName");
                if (registryName.equals("")) {
                    return "{\"status\":\"failure\",\"request-error\":\"Registry name cannot be blank. Please be better.\"}";
                }
                errorAttribute = "domains";
                String domains = registryDomains.getJSONObject(i).getString("domains");
                errorAttribute = "";
            }
        } catch (JSONException jsonException) {

            // JSON error found
            if (errorIndex != -1) {
                return "{\"status\":\"failure\",\"request-error\":\""
                        + jsonException.getMessage().substring(0, jsonException.getMessage().length() - 1)
                        + "" + errorAttribute + " in object number " + (errorIndex) + "\"}";
            }
            return "{\"status\":\"failure\",\"request-error\":\"" + jsonException.getMessage() + "\"}";
        }
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
