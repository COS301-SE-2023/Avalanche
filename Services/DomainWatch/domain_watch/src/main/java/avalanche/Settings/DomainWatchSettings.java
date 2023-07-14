package avalanche.Settings;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONObject;

public class DomainWatchSettings {

    private static DomainWatchSettings domainWatchSettings;
    public HashMap<HashSet<String>, Double> substitutionCosts;
    public int maximumThreadsPerSearch;
    public boolean useInternalSubstitutionCosts;
    public HashMap<String, String> domainFiles;
    public String defaultZone;

    private DomainWatchSettings() {
        useInternalSubstitutionCosts = false;
        substitutionCosts = new HashMap<>();
        domainFiles = new HashMap<>();
        maximumThreadsPerSearch = Runtime.getRuntime().availableProcessors() - 1;
        try {
            Scanner file = new Scanner(new FileReader("domainWatch.conf"));
            String conf = "";
            while (file.hasNext()) {
                conf += file.nextLine();
            }
            file.close();
            JSONObject obj = new JSONObject(conf);
            maximumThreadsPerSearch = obj.getInt("maximumThreadsPerSearch");
            JSONArray subs = obj.getJSONArray("substitutionCosts");
            for (int i = 0; i < subs.length(); i++) {
                JSONObject sub = subs.getJSONObject(i);
                HashSet<String> set = new HashSet();
                set.add(sub.getString("firstString"));
                set.add(sub.getString("secondString"));
                substitutionCosts.put(set,
                        sub.getDouble("cost"));

            }
            useInternalSubstitutionCosts = obj.getBoolean("useInternalSubstitutionCosts");
            JSONArray domainFileArray = obj.getJSONArray("domainFiles");
            for (int i = 0; i < domainFileArray.length(); i++) {
                domainFiles.put(domainFileArray.getJSONObject(i).getString("zone"),
                        domainFileArray.getJSONObject(i).getString("path"));
            }
            defaultZone = obj.getString("defaultZone");
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    public static DomainWatchSettings getInstace() {
        if (domainWatchSettings == null) {
            domainWatchSettings = new DomainWatchSettings();
            return domainWatchSettings;
        }
        return domainWatchSettings;
    }
}
