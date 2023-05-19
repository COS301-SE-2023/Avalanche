package Processing;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.LinkedList;
import java.util.Scanner;

import DataClasses.Domain;

public class SimilarityChecker {
    private LinkedList<Domain> allDomains;

    public SimilarityChecker() {
        try {
            Scanner file = new Scanner(new FileReader("../../data/Domain Retrieval.csv"));
            // skip headings
            String line = file.nextLine();
            while (file.hasNext()) {
                line = file.nextLine();
                String[] split = line.split(",");
                allDomains.add(new Domain(split[0], split[1]));
            }
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public LinkedList<Domain> getAllDomains() {
        return allDomains;
    }
}
