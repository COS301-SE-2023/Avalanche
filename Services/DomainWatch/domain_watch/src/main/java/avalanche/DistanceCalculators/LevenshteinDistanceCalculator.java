package avalanche.DistanceCalculators;

import java.util.Arrays;
import java.util.HashSet;

import avalanche.Settings.DomainWatchSettings;

public class LevenshteinDistanceCalculator {

    /**
     * Calculates the Levenshtein distance between two strings.
     * <br/>
     * Substitutions, deletions and insertions all invoke a cost of 1.<br/>
     * Certain special substitutions invoke a cost of 0.1. These can be found in the
     * domainWatch.conf file.<br/>
     * Repetitive insertions invoke a cost of 0.1. e.g oo->ooo = 0.1<br/>
     * Insetions of dash (-) invoke a cost of 0.1.<br/>
     * 
     * @param x The first string to compare.
     * @param y The second string to compare.
     * @return The levenshtein distance between the two string taking into account
     *         the special rules described.
     */
    public double calculateModifiedLevenshteinDistance(String x, String y, double limit) {
        x = x.toLowerCase();
        y = y.toLowerCase();

        double[][] dp = new double[x.length() + 1][y.length() + 1];

        for (int i = 0; i <= x.length(); i++) {
            for (int j = 0; j <= y.length(); j++) {

                if (i == 0) {
                    if (j == 0) {
                        dp[i][j] = 0;
                    } else {
                        dp[i][j] = dp[i][j - 1] + 1;
                    }
                } else if (j == 0) {
                    dp[i][j] = dp[i - 1][j] + 1;

                } else {
                    if (i == 1) {
                        if (j == 1) {
                            dp[i][j] = min(dp[i - 1][j - 1]
                                    + costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)),
                                    dp[i - 1][j] + 1,
                                    dp[i][j - 1] + 1);
                        } else {
                            dp[i][j] = min(dp[i - 1][j - 1]
                                    + costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)),
                                    dp[i - 1][j] + 1,
                                    dp[i][j - 1] + insertionCost(y.charAt(j - 1), y.charAt(j - 2)));
                        }
                    } else if (j == 1) {
                        dp[i][j] = min(dp[i - 1][j - 1]
                                + costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)),
                                dp[i - 1][j] + insertionCost(x.charAt(i - 1), x.charAt(i - 2)),
                                dp[i][j - 1] + 1);
                    } else {
                        dp[i][j] = min(dp[i - 1][j - 1]
                                + costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)),
                                dp[i - 1][j] + insertionCost(x.charAt(i - 1), x.charAt(i - 2)),
                                dp[i][j - 1] + insertionCost(y.charAt(j - 1), y.charAt(j - 2)));

                    }
                }

            }
        }

        return dp[x.length()][y.length()];
    }

    /**
     * Returns the cost of an insertion of a specific character given the
     * <br/>
     * Should return 0.1 if the previous character is the same as the current
     * one<br/>
     * Should return 0.1 if current charater is a dash "-" (this may be buggy,
     * please test extra)<br/>
     * Should return 1 in all other cases.
     * 
     * @param currentCharacter  The current character being evaluated
     * @param previousCharacter The previous character that was evaluated (needed to
     *                          check for repitition)
     * @return Return 0.1 if the previous character is the same as the current
     *         one<br/>
     *         Should return 0.1 if current charater is a dash "-"<br/>
     *         Should return 1 in all other cases.
     */
    private double insertionCost(char currentCharacter, char previousCharacter) {
        if (currentCharacter == previousCharacter) {
            return 0.1;
        }
        if (currentCharacter == '-' || previousCharacter == '-') {
            return 0.1;
        }
        return 1;
    }

    /**
     * Calculates the cost of a substitution from one character to another.
     * <br/>
     * Returns 0 if the characters are the same.<br/>
     * Returns 0.1 if the characters are in the list of similar values
     * <ul>
     * <li>If "useInternalSubstitutionCosts" in domainWatch.conf is true then the
     * in-code costs are used
     * </li>
     * <li>If "useInternalSubstitutionCosts" in domainWatch.conf is false then the
     * costs from domainWatch.conf are used
     * </li>
     * </ul>
     * 
     * @param characterFromString1
     * @param characterFromString2
     * @return Returns 0 if the characters are the same.<br/>
     *         Returns 0.1 if the characters are in the list of similar values
     *         <ul>
     *         <li>If "useInternalSubstitutionCosts" in domainWatch.conf is true
     *         then the
     *         in-code costs are used
     *         </li>
     *         <li>If "useInternalSubstitutionCosts" in domainWatch.conf is false
     *         then the
     *         costs from domainWatch.conf are used
     *         </li>
     *         </ul>
     */
    private double costOfSubstitution(char characterFromString1, char characterFromString2) {
        if (characterFromString1 == characterFromString2) {
            return 0;
        }

        DomainWatchSettings dws = DomainWatchSettings.getInstace();
        if (!dws.useInternalSubstitutionCosts) {
            HashSet<String> set = new HashSet<>();
            set.add(characterFromString1 + "");
            set.add(characterFromString2 + "");
            return dws.substitutionCosts.getOrDefault(set, (double) 1);
        }

        if (checkBothWays(characterFromString1, '0', characterFromString2, 'o')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 'i', characterFromString2, '1')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 'l', characterFromString2, '1')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 'l', characterFromString2, 'i')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 'b', characterFromString2, '8')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 'e', characterFromString2, '3')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 'u', characterFromString2, 'v')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, '2', characterFromString2, 'z')) {
            return 0.1;
        }
        if (checkBothWays(characterFromString1, 's', characterFromString2, '5')) {
            return 0.1;
        }

        return 1;
    }

    /**
     * This function determines if two characters can be paired in either order, and
     * returns true if they can be paired in either way, and false otherwise.
     * 
     * @param characterFromString1
     * @param check1
     * @param characterFromString2
     * @param check2
     * @return True if (characterFromString1 is check1 and characterFromString2 is
     *         check2) or (characterFromString2 is check1 and characterFromString1
     *         is check2)
     */
    private boolean checkBothWays(char characterFromString1, char check1, char characterFromString2, char check2) {
        return ((characterFromString1 == check1 && characterFromString2 == check2)
                || (characterFromString1 == check2 && characterFromString2 == check1));
    }

    /**
     * Returns the smallest double of the parameters
     * 
     * @param numbers A variable number of doubles can be passed in
     * @return double: The smallest double from the parameters is returned
     */
    private double min(double... numbers) {
        return Arrays.stream(numbers)
                .min().orElse(Integer.MAX_VALUE);
    }
}