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

    public static String configFilePath = "domainWatch.conf";

    public static DomainWatchSettings getDomainWatchSettings() {
        return domainWatchSettings;
    }

    private DomainWatchSettings() throws Exception {
        useInternalSubstitutionCosts = false;
        substitutionCosts = new HashMap<>();
        domainFiles = new HashMap<>();
        maximumThreadsPerSearch = Runtime.getRuntime().availableProcessors() - 1;
        try {
            Scanner file = new Scanner(new FileReader(configFilePath));
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
            throw new Exception("\n======" + //
                    "\n" + //
                    "NO CONFIG FILE FOUND (domainWatch.conf)\n" + //
                    "I'm going to die now\n" + //
                    "Why was it deleted?\n" + //
                    "Seriously, why?\n" + //
                    "Did you think you were clever?\n" + //
                    "Did you rename it?\n" + //
                    "Do you hate me?\n" + //
                    "Do you hate yourself?\n" + //
                    "I die for real now...\n" + //
                    "Goodbye cruel world!\n" + //
                    "======\n" + //
                    "");
        }

    }

    public static void init() throws Exception {
        domainWatchSettings = new DomainWatchSettings();
    }

    public static DomainWatchSettings getInstace() {
        if (domainWatchSettings == null) {
            System.out.println("Settings were not initialised, trying my best");
            try {
                DomainWatchSettings.init();
            } catch (Exception e) {
                System.out.println(("\n======" + //
                        "\n" + //
                        "NO CONFIG FILE FOUND (domainWatch.conf)\n" + //
                        "I'm going to die now\n" + //
                        "Why was it deleted?\n" + //
                        "Seriously, why?\n" + //
                        "Did you think you were clever?\n" + //
                        "Did you rename it?\n" + //
                        "Do you hate me?\n" + //
                        "Do you hate yourself?\n" + //
                        "I die for real now...\n" + //
                        "Goodbye cruel world!\n" + //
                        "======\n" + //
                        ""));
                System.exit(1);
            }
        }
        return domainWatchSettings;
    }
}
