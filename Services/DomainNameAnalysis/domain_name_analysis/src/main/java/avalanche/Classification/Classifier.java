package avalanche.Classification;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import avalanche.Utility.DomainTokeniser;

public class Classifier {

    public Classifier() {

    }

    public String classify(String[] strings, String[] labels, double minimumConfidence) throws IOException {
        DomainTokeniser tokeniser = new DomainTokeniser();
        String classifierInput = "";
        for (int i = 0; i < strings.length; i++) {
            classifierInput += tokeniser.inferSpaces(strings[i]);
            if (i != strings.length - 1) {
                classifierInput += ",";
            }
        }

        String inputLabels = "";
        if (labels.length < 1) {
            inputLabels = "Technology,Education,Healthcare,Entertainment,Travel or Hospitality,Finance,Food or Beverage,Real Estate,Automotive,Sports or Fitness,Marketing or Advertising,Fashion or Beauty,Art or Culture,News or Media,Social networking,Business or professional services";
        } else {
            for (int i = 0; i < labels.length; i++) {
                inputLabels += labels[i];
                if (i != labels.length - 1) {
                    inputLabels += ",";
                }
            }
        }

        ProcessBuilder processBuilder = new ProcessBuilder("python",
                resolvePythonScriptPath("src/main/python/avalanche/classify.py"),
                classifierInput, inputLabels, minimumConfidence + "");
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        String results = readProcessOutput(process.getInputStream());
        System.out.println(results);
        return results;
    }

    private String resolvePythonScriptPath(String path) {
        File file = new File(path);
        return file.getAbsolutePath();
    }

    public String readProcessOutput(InputStream inputStream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        StringBuilder builder = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            builder.append(line);
            builder.append(System.getProperty("line.separator"));
        }
        String result = builder.toString();
        return result;
    }
}