package DistanceCalculators;

import java.util.Arrays;

public class LevensteinDistanceCalculator {
    public double calculateBasicLevenshteinDistance(String x, String y) {
        double[][] dp = new double[x.length() + 1][y.length() + 1];

        for (int i = 0; i <= x.length(); i++) {
            for (int j = 0; j <= y.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = min(dp[i - 1][j - 1]
                            + costOfSubstitution(x.charAt(i - 1), y.charAt(j - 1)),
                            dp[i - 1][j] + 1,
                            dp[i][j - 1] + 1);
                }
            }
        }

        return dp[x.length()][y.length()];
    }

    private double costOfSubstitution(char a, char b) {
        if (a == b) {
            return 0;
        }
        if (checkBothWays(a, '0', b, 'O')) {
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