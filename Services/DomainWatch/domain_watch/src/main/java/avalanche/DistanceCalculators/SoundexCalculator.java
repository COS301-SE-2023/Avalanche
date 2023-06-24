package avalanche.DistanceCalculators;

import java.io.FileNotFoundException;

import avalanche.Utility.DomainTokeniser;

public class SoundexCalculator {

    /**
     * Calculates the soundex difference between two strings that are not
     * necessarily split into English words.
     * <br/>
     * 
     * 
     * @param x The first string to compare
     * @param y The second string to compare
     * @return returns a double in the range [0,4], with 0 being the least similar
     *         and 4 being the most similar.
     */
    public double calculateSoundexDifference(String x, String y) {
        String xSpaced = x;
        String ySpaced = y;
        DomainTokeniser domainTokeniser;
        try {
            domainTokeniser = new DomainTokeniser();
            xSpaced = domainTokeniser.inferSpaces(x);
            ySpaced = domainTokeniser.inferSpaces(y);
        } catch (FileNotFoundException e) {
            System.out.println("Domain tokeniser could not find dictionary file");
            e.printStackTrace();
        } catch (InstantiationException e) {
            System.out.println("Domain tokeniser could not be initialised because the dictionary count is wrong");
            e.printStackTrace();
        }

        if (xSpaced == null || ySpaced == null) {
            return 0;
        }
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

    /**
     * Calculates the soundex distance between two English words.
     * <br/>
     * This method encodes the two words and then calculates the difference between
     * the two encodings
     * 
     * @param x The first word to compare
     * @param y The second word to compare
     * @return double: Returns either 1.0, 2.0, 3.0, 4.0 depending on the soundex
     *         distance between the two words.
     */
    public double getDifferenceBetweenTokens(String x, String y) {
        // Soundex s = new Soundex();
        String xEncoded = encode(x);
        String yEncoded = encode(y);

        return difference(xEncoded, yEncoded) * 1.0;
    }

    /**
     * This is the method responsible for calculating the soundex distance between
     * two word <b>encodings</b>.
     * <br/>
     * This is where the distance is actually calculated.<br/>
     * Note: these inputs should be of the form LDDD, where L is a capital letter
     * and D is a decimal digit.
     * e.g (R165)
     * 
     * @param x The first encoded string to compare.
     * @param y The second encoded string to compare.
     * @return double: Returns the number of characters that are the same in the two
     *         encodings. Results should only be 1.0,2.0,3.0 or 4.0.
     */
    private double difference(String x, String y) {
        double diff = 0;
        for (int i = 0; i < x.length(); i++) {
            if (x.charAt(i) == y.charAt(i)) {
                diff += 1.0;
            }
        }
        return diff;
    }

    /**
     * Transforms a string to a soundex encoding.
     * <br/>
     * The encoding is of the form LDDD, where L is a capital letter and D is a
     * decimal digit. e.g (R165) <br/>
     * You can use this <a href=
     * "https://www.ics.uci.edu/~dan/genealogy/Miller/javascrp/soundex.htm">Soundex
     * encoder</a> to test certain encodings
     * 
     * @param s The string to be encoded.
     * @return String: A string of the form LDDD, where L is a capital letter and D
     *         is a decimal digit should be returned. e.g (R165)
     */
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
