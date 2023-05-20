package DistanceCalculators;

import java.util.Arrays;

public class LevensteinDistanceCalculator {
    public double calculateBasicLevenshteinDistance(String x, String y) {
        x = x.toLowerCase();
        y = y.toLowerCase();
        double[][] dp = new double[x.length() + 1][y.length() + 1];

        for (int i = 0; i <= x.length(); i++) {
            for (int j = 0; j <= y.length(); j++) {
                if (i == 0) {
                    if (j == 0) {
                        dp[i][j] = 0;
                    } else {
                        if (j > 0) {
                            dp[i][j] = dp[i][j - 1] + 1;
                        } else {
                            dp[i][j] = dp[i][j - 1] + insertionCost(y.charAt(j - 2), y.charAt(j - 1));
                        }
                    }
                } else if (j == 0) {
                    if (i == 0) {
                        dp[i][j] = 0;
                    } else {
                        if (i > 0) {
                            dp[i][j] = dp[i - 1][j] + 1;
                        } else {
                            dp[i][j] = dp[i - 1][j] + insertionCost(x.charAt(i - 2), x.charAt(i - 1));
                        }
                    }
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

    private double insertionCost(char a, char b) {
        if (a == b) {
            return 0.1;
        }
        return 1;
    }

    private double costOfSubstitution(char a, char b) {
        if (a == b) {
            return 0;
        }
        if (checkBothWays(a, '0', b, 'o')) {
            return 0.1;
        }
        if (checkBothWays(a, 'i', b, '1')) {
            return 0.1;
        }
        if (checkBothWays(a, 'l', b, '1')) {
            return 0.1;
        }
        if (checkBothWays(a, 'l', b, 'i')) {
            return 0.1;
        }
        if (checkBothWays(a, 'b', b, '8')) {
            return 0.1;
        }
        if (checkBothWays(a, 'e', b, '3')) {
            return 0.1;
        }
        if (checkBothWays(a, 'u', b, 'v')) {
            return 0.1;
        }
        if (checkBothWays(a, '2', b, 'z')) {
            return 0.1;
        }
        if (checkBothWays(a, 's', b, '5')) {
            return 0.1;
        }

        return 1;
    }

    private boolean checkBothWays(char a, char check1, char b, char check2) {
        return ((a == check1 && b == check2) || (a == check2 && b == check1));
    }

    private double min(double... numbers) {
        return Arrays.stream(numbers)
                .min().orElse(Integer.MAX_VALUE);
    }
}