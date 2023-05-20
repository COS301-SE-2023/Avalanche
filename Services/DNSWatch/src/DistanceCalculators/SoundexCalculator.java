package DistanceCalculators;

import org.apache.commons.codec.EncoderException;
import org.apache.commons.codec.language.Soundex;

import Utility.DomainTokeniser;

public class SoundexCalculator {
    public double calculateSoundexDifference(String x, String y) {
        DomainTokeniser domainTokeniser = new DomainTokeniser();
        String xSpaced = domainTokeniser.inferSpaces(x);
        String ySpaced = domainTokeniser.inferSpaces(y);
        String[] splitX = xSpaced.split(" ");
        String[] splitY = ySpaced.split(" ");

        double[] diffs = new double[(int) Math.max(splitX.length, splitY.length)];
        for (int i = 0; i < diffs.length; i++) {
            if (i < splitX.length && i < splitY.length) {
                diffs[i] = getDifferenceBetweenTokens(splitX[i], splitY[i]);
            } else {
                diffs[i] = 0;
            }

        }

        double total = 0;
        for (double d : diffs) {
            total += d;
        }
        return total / diffs.length;
    }

    public double getDifferenceBetweenTokens(String x, String y) {
        Soundex s = new Soundex();
        String xEncoded = encode(x);
        String yEncoded = encode(y);

        try {
            return s.difference(x, y) * 1.0;
        } catch (EncoderException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return 0.0;
        // return difference(xEncoded, yEncoded) * 1.0;
    }

    private double difference(String x, String y) {
        double diff = 0;
        for (int i = 0; i < x.length(); i++) {
            if (x.charAt(i) == y.charAt(i)) {
                diff += 1.0;
            }
        }
        return diff;
    }

    public String encode(String s) {
        char[] x = s.toUpperCase().toCharArray();
        char firstLetter = x[0];

        // convert letters to numeric code
        for (int i = 0; i < x.length; i++) {
            switch (x[i]) {

                case 'B':
                case 'F':
                case 'P':
                case 'V':
                    x[i] = '1';
                    break;

                case 'C':
                case 'G':
                case 'J':
                case 'K':
                case 'Q':
                case 'S':
                case 'X':
                case 'Z':
                    x[i] = '2';
                    break;

                case 'D':
                case 'T':
                    x[i] = '3';
                    break;

                case 'L':
                    x[i] = '4';
                    break;

                case 'M':
                case 'N':
                    x[i] = '5';
                    break;

                case 'R':
                    x[i] = '6';
                    break;

                default:
                    x[i] = '0';
                    break;
            }
        }

        // remove duplicates
        String output = "" + firstLetter;
        for (int i = 1; i < x.length; i++)
            if (x[i] != x[i - 1] && x[i] != '0')
                output += x[i];

        // pad with 0's or truncate
        output = output + "0000";
        return output.substring(0, 4);
    }

}
