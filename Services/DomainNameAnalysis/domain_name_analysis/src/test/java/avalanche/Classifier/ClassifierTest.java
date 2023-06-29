package avalanche.Classifier;

import java.io.IOException;

import org.junit.jupiter.api.Test;

import avalanche.Classification.Classifier;

public class ClassifierTest {
    @Test
    public void testClassifier() throws IOException {
        String[] domains = { "universalsolar",
                "ineedsolar",
                "lamulaandsons",
                "allsolar-westrand",
                "lilach",
                "babyandmomboutique",
                "sugarbushfarm",
                "karooleatherbags",
                "sumudcoaching",
                "kalaharileatherbags",
                "riafiresa",
                "tsgairconref",
                "jaydigital",
                "pitchplease",
                "thabilejoils",
                "fr8carriers",
                "perscentpf",
                "thembisawinstonkunene",
                "oarabilewedsphumzile",
                "africagreengroup",
                "linkr",
                "aaenterprises",
                "tohaveandtoholdsworth",
                "smittieai", };
        Classifier classifier = new Classifier();
        String[] labels = { "cool", "uncool" };

        System.out.println(classifier.classify(domains, labels, 0.08));
    }
}
